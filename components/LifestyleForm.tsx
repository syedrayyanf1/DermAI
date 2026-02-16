"use client";

import { useState } from "react";
import type { LifestyleData } from "@/lib/types";

interface LifestyleFormProps {
  onSubmit: (data: LifestyleData) => void;
  loading: boolean;
}

export default function LifestyleForm({ onSubmit, loading }: LifestyleFormProps) {
  const [form, setForm] = useState<LifestyleData>({
    sleep_hours: 7,
    stress_level: 5,
    water_intake_liters: 2,
    exercise_done: false,
    dairy_consumed: false,
    sugar_level: 3,
    routine_notes: "",
  });

  const update = (key: keyof LifestyleData, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Sleep Hours: {form.sleep_hours}h
        </label>
        <input
          type="range"
          min={0}
          max={14}
          step={0.5}
          value={form.sleep_hours ?? 7}
          onChange={(e) => update("sleep_hours", parseFloat(e.target.value))}
          className="w-full accent-indigo-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Stress Level: {form.stress_level}/10
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={form.stress_level ?? 5}
          onChange={(e) => update("stress_level", parseInt(e.target.value))}
          className="w-full accent-indigo-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Water Intake: {form.water_intake_liters}L
        </label>
        <input
          type="range"
          min={0}
          max={6}
          step={0.25}
          value={form.water_intake_liters ?? 2}
          onChange={(e) => update("water_intake_liters", parseFloat(e.target.value))}
          className="w-full accent-indigo-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Sugar Level: {form.sugar_level}/5
        </label>
        <input
          type="range"
          min={1}
          max={5}
          value={form.sugar_level ?? 3}
          onChange={(e) => update("sugar_level", parseInt(e.target.value))}
          className="w-full accent-indigo-600"
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.exercise_done}
            onChange={(e) => update("exercise_done", e.target.checked)}
            className="rounded accent-indigo-600"
          />
          Exercised today
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.dairy_consumed}
            onChange={(e) => update("dairy_consumed", e.target.checked)}
            className="rounded accent-indigo-600"
          />
          Dairy consumed
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Routine Notes</label>
        <textarea
          value={form.routine_notes}
          onChange={(e) => update("routine_notes", e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="Cleanser, actives, moisturizer, sunscreen, new products..."
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <button
        onClick={() => onSubmit(form)}
        disabled={loading}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-colors"
      >
        {loading ? "Uploading & Analyzing..." : "Submit Entry"}
      </button>
    </div>
  );
}
