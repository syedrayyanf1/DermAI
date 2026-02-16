import { GoogleGenerativeAI } from "@google/generative-ai";
import { validateGeminiResponse } from "./validators";
import type { GeminiAnalysis } from "./types";

const SYSTEM_PROMPT = `You are a dermatological image analysis assistant. Analyze the provided facial image and return ONLY valid JSON. Do not include commentary. Estimate conservatively.

Return JSON in this exact schema:
{
  "whiteheads": <integer>,
  "blackheads": <integer>,
  "papules": <integer>,
  "pustules": <integer>,
  "nodules_or_cysts": <integer>,
  "inflammation_level": <1-10>,
  "oiliness_level": <1-10>,
  "dryness_level": <1-10>,
  "hyperpigmentation_level": <1-10>,
  "scarring_visible": <true/false>,
  "overall_severity_score": <1-10>,
  "confidence_score": <0.0-1.0>
}

Important rules:
- Return ONLY the JSON object, no markdown, no backticks, no explanation.
- All integer fields must be whole numbers.
- confidence_score should reflect how clearly you can analyze the image (0 = cannot analyze, 1 = perfect clarity).
- If the image is not a face or is too blurry, set confidence_score below 0.3 and set all other values to minimum.`;

export async function analyzeImageWithGemini(
  imageBase64: string,
  mimeType: string
): Promise<GeminiAnalysis | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent([
      SYSTEM_PROMPT,
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      },
    ]);

    const response = result.response;
    const text = response.text().trim();

    // Strip markdown code fences if present
    let jsonString = text;
    if (jsonString.startsWith("```")) {
      jsonString = jsonString.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonString);
    const validated = validateGeminiResponse(parsed);

    if (!validated) {
      console.error("Gemini response failed validation:", parsed);
      return null;
    }

    return validated;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return null;
  }
}
