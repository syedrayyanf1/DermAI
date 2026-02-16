export interface GeminiAnalysis {
  whiteheads: number;
  blackheads: number;
  papules: number;
  pustules: number;
  nodules_or_cysts: number;
  inflammation_level: number;
  oiliness_level: number;
  dryness_level: number;
  hyperpigmentation_level: number;
  scarring_visible: boolean;
  overall_severity_score: number;
  confidence_score: number;
}

export interface LifestyleData {
  sleep_hours: number | null;
  stress_level: number | null;
  water_intake_liters: number | null;
  exercise_done: boolean;
  dairy_consumed: boolean;
  sugar_level: number | null;
  routine_notes: string;
}

export interface DailyEntry extends GeminiAnalysis, LifestyleData {
  id: string;
  user_id: string;
  date: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnalyzeResponse {
  success: boolean;
  analysis?: GeminiAnalysis;
  error?: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  avg7?: number;
}
