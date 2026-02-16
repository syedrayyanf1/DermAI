"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { DailyEntry } from "@/lib/types";

export default function LesionChart({ entries }: { entries: DailyEntry[] }) {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const data = sorted.map((e) => ({
    date: e.date,
    Whiteheads: e.whiteheads,
    Blackheads: e.blackheads,
    Papules: e.papules,
    Pustules: e.pustules,
    Nodules: e.nodules_or_cysts,
  }));

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-gray-500 mb-4">
        🔍 Lesion Breakdown
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: "#111827",
              border: "1px solid #374151",
              borderRadius: "12px",
              color: "#f3f4f6",
              fontSize: 13,
            }}
          />
          <Legend />
          <Bar dataKey="Whiteheads" stackId="a" fill="#e5e7eb" />
          <Bar dataKey="Blackheads" stackId="a" fill="#6b7280" />
          <Bar dataKey="Papules" stackId="a" fill="#ef4444" />
          <Bar dataKey="Pustules" stackId="a" fill="#f59e0b" />
          <Bar dataKey="Nodules" stackId="a" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
