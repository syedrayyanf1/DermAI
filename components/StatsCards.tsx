import type { DailyEntry } from "@/lib/types";
import { totalLesions, averageOfLast } from "@/utils/calculations";

interface StatsCardsProps {
  entries: DailyEntry[];
}

export default function StatsCards({ entries }: StatsCardsProps) {
  if (entries.length === 0) return null;

  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const latest = sorted[0];
  const avg7 = averageOfLast(entries, 7, "overall_severity_score");
  const avg30 = averageOfLast(entries, 30, "overall_severity_score");
  const latestLesions = totalLesions(latest);

  const stats = [
    {
      label: "Today's Score",
      value: latest.overall_severity_score,
      suffix: "/10",
      color: latest.overall_severity_score <= 3 ? "text-green-600" : latest.overall_severity_score <= 6 ? "text-yellow-600" : "text-red-600",
    },
    { label: "7-Day Avg", value: avg7, suffix: "", color: "text-indigo-600" },
    { label: "30-Day Avg", value: avg30, suffix: "", color: "text-indigo-600" },
    { label: "Active Lesions", value: latestLesions, suffix: "", color: "text-orange-600" },
    { label: "Inflammation", value: latest.inflammation_level, suffix: "/10", color: "text-red-500" },
    { label: "Confidence", value: Math.round(latest.confidence_score * 100), suffix: "%", color: "text-cyan-600" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4"
        >
          <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
          <p className={`text-2xl font-bold ${stat.color}`}>
            {stat.value}
            <span className="text-sm font-normal text-gray-400">
              {stat.suffix}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}
