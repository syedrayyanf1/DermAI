import type { DailyEntry, ChartDataPoint } from "@/lib/types";

export function totalLesions(entry: DailyEntry): number {
  return (
    entry.whiteheads +
    entry.blackheads +
    entry.papules +
    entry.pustules +
    entry.nodules_or_cysts
  );
}

export function rollingAverage(values: number[], window: number): number[] {
  return values.map((_, i, arr) => {
    const start = Math.max(0, i - window + 1);
    const slice = arr.slice(start, i + 1);
    return Math.round((slice.reduce((a, b) => a + b, 0) / slice.length) * 10) / 10;
  });
}

export function buildChartData(
  entries: DailyEntry[],
  key: keyof DailyEntry
): ChartDataPoint[] {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const values = sorted.map((e) => Number(e[key]) || 0);
  const avg7 = rollingAverage(values, 7);

  return sorted.map((entry, i) => ({
    date: entry.date,
    value: values[i],
    avg7: avg7[i],
  }));
}

export function buildLesionChartData(entries: DailyEntry[]): ChartDataPoint[] {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const totals = sorted.map((e) => totalLesions(e));
  const avg7 = rollingAverage(totals, 7);

  return sorted.map((entry, i) => ({
    date: entry.date,
    value: totals[i],
    avg7: avg7[i],
  }));
}

export function averageOfLast(
  entries: DailyEntry[],
  n: number,
  key: keyof DailyEntry
): number {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const slice = sorted.slice(0, n);
  if (slice.length === 0) return 0;
  const sum = slice.reduce((acc, e) => acc + (Number(e[key]) || 0), 0);
  return Math.round((sum / slice.length) * 10) / 10;
}
