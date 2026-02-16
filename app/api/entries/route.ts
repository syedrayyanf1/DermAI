import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "90");
    const safeLimit = Math.min(Math.max(limit, 1), 365);

    const { data: entries, error } = await supabase
      .from("daily_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(safeLimit);

    if (error) {
      console.error("Fetch entries error:", error);
      return NextResponse.json(
        { error: "Failed to fetch entries" },
        { status: 500 }
      );
    }

    return NextResponse.json({ entries: entries || [] });
  } catch (error) {
    console.error("Entries route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
