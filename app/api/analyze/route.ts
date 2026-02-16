import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { analyzeImageWithGemini } from "@/lib/gemini";
import { lifestyleSchema } from "@/lib/validators";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const lifestyleRaw = formData.get("lifestyle") as string | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Validate image size
    if (imageFile.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 2MB" }, { status: 400 });
    }

    // Validate lifestyle data
    let lifestyle;
    try {
      lifestyle = lifestyleSchema.parse(JSON.parse(lifestyleRaw || "{}"));
    } catch {
      return NextResponse.json({ error: "Invalid lifestyle data" }, { status: 400 });
    }

    // Upload image to Supabase Storage
    const today = new Date().toISOString().split("T")[0];
    const fileName = `${user.id}/${today}-${Date.now()}.jpg`;
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("skin-images")
      .upload(fileName, buffer, {
        contentType: imageFile.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    // Convert image to base64 for Gemini
    const base64 = buffer.toString("base64");
    const mimeType = imageFile.type || "image/jpeg";

    // Analyze with Gemini
    let analysis;
    try {
      analysis = await analyzeImageWithGemini(base64, mimeType);
    } catch (error) {
      console.error("Gemini error:", error);
    }

    // Fallback defaults if Gemini fails
    const safeAnalysis = analysis || {
      whiteheads: 0,
      blackheads: 0,
      papules: 0,
      pustules: 0,
      nodules_or_cysts: 0,
      inflammation_level: 1,
      oiliness_level: 1,
      dryness_level: 1,
      hyperpigmentation_level: 1,
      scarring_visible: false,
      overall_severity_score: 1,
      confidence_score: 0,
    };

    // Save to database
    const { data: entry, error: dbError } = await supabase
      .from("daily_entries")
      .upsert(
        {
          user_id: user.id,
          date: today,
          image_url: fileName,
          ...safeAnalysis,
          ...lifestyle,
        },
        { onConflict: "user_id,date" }
      )
      .select()
      .single();

    if (dbError) {
      console.error("DB error:", dbError);
      return NextResponse.json(
        { error: "Failed to save entry" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      entry,
      aiAvailable: !!analysis,
    });
  } catch (error) {
    console.error("Analyze route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
