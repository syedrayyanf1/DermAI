import { z } from "zod";
import type { GeminiAnalysis } from "./types";

export const geminiAnalysisSchema = z.object({
  whiteheads: z.number().int().min(0).max(100),
  blackheads: z.number().int().min(0).max(100),
  papules: z.number().int().min(0).max(100),
  pustules: z.number().int().min(0).max(100),
  nodules_or_cysts: z.number().int().min(0).max(50),
  inflammation_level: z.number().int().min(1).max(10),
  oiliness_level: z.number().int().min(1).max(10),
  dryness_level: z.number().int().min(1).max(10),
  hyperpigmentation_level: z.number().int().min(1).max(10),
  scarring_visible: z.boolean(),
  overall_severity_score: z.number().int().min(1).max(10),
  confidence_score: z.number().min(0).max(1),
});

export function validateGeminiResponse(data: unknown): GeminiAnalysis | null {
  try {
    return geminiAnalysisSchema.parse(data);
  } catch {
    return null;
  }
}

export const lifestyleSchema = z.object({
  sleep_hours: z.number().min(0).max(24).nullable(),
  stress_level: z.number().int().min(1).max(10).nullable(),
  water_intake_liters: z.number().min(0).max(20).nullable(),
  exercise_done: z.boolean(),
  dairy_consumed: z.boolean(),
  sugar_level: z.number().int().min(1).max(5).nullable(),
  routine_notes: z.string().max(2000),
});

export const entryUpdateSchema = z.object({
  entryId: z.string().uuid(),
  lifestyle: lifestyleSchema,
});
