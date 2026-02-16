"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { DailyEntry } from "@/lib/types";
import { buildChartData } from "@/utils/calculations";

export default function InflammationChart({ entries }: { entries: DailyEntry[] }) {
  const data = buildChartData(entries, "inflammation_level");

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-gray-500 mb-4">
        🌡️ Inflammation Level
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
          <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: "#111827",
              border: "1px solid #374151",
              borderRadius: "12px",
              color: "#f3f4f6",
              fontSize: 13,
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#ef4444"
            fill="#ef444422"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="avg7"
            stroke="#f97316"
            fill="transparent"
            strokeWidth={1.5}
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
