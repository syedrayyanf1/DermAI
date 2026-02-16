"use client";

import { useEffect, useState } from "react";
import StatsCards from "@/components/StatsCards";
import SeverityChart from "@/components/SeverityChart";
import InflammationChart from "@/components/InflammationChart";
import LesionChart from "@/components/LesionChart";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { DailyEntry } from "@/lib/types";
import Link from "next/link";

export default function DashboardPage() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
  const [afterUrl, setAfterUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/entries?limit=90");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEntries(data.entries || []);

      // Fetch signed URLs for before/after
      if (data.entries && data.entries.length >= 2) {
        const sorted = [...data.entries].sort(
          (a: DailyEntry, b: DailyEntry) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        const first = sorted[0];
        const last = sorted[sorted.length - 1];

        if (first.image_url) {
          const r1 = await fetch(
            `/api/signed-url?path=${encodeURIComponent(first.image_url)}`
          );
          const d1 = await r1.json();
          if (d1.url) setBeforeUrl(d1.url);
        }
        if (last.image_url) {
          const r2 = await fetch(
            `/api/signed-url?path=${encodeURIComponent(last.image_url)}`
          );
          const d2 = await r2.json();
          if (d2.url) setAfterUrl(d2.url);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={fetchEntries}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">📸</div>
        <h2 className="text-xl font-bold mb-2">No entries yet</h2>
        <p className="text-gray-500 mb-6">
          Start tracking your skin by uploading your first photo.
        </p>
        <Link
          href="/upload"
          className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
        >
          Upload First Photo →
        </Link>
      </div>
    );
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">📊 Dashboard</h1>
          <p className="text-sm text-gray-500">
            {entries.length} entries tracked
          </p>
        </div>
        <Link
          href="/upload"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          + New Entry
        </Link>
      </div>

      <StatsCards entries={entries} />

      <div className="grid lg:grid-cols-2 gap-6">
        <SeverityChart entries={sorted} />
        <InflammationChart entries={sorted} />
      </div>

      <LesionChart entries={sorted} />

      <div className="grid lg:grid-cols-2 gap-6">
        <BeforeAfterSlider
          beforeUrl={beforeUrl}
          afterUrl={afterUrl}
          beforeDate={sorted[0]?.date || "—"}
          afterDate={sorted[sorted.length - 1]?.date || "—"}
        />

        {/* Recent entries table */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">
            🗓️ Recent Entries
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {[...entries]
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .slice(0, 15)
              .map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm"
                >
                  <span className="text-gray-500 font-mono text-xs">
                    {entry.date}
                  </span>
                  <div className="flex items-center gap-3">
                    <span>
                      Score:{" "}
                      <strong
                        className={
                          entry.overall_severity_score <= 3
                            ? "text-green-600"
                            : entry.overall_severity_score <= 6
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {entry.overall_severity_score}/10
                      </strong>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        entry.confidence_score >= 0.7
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : entry.confidence_score >= 0.4
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {Math.round(entry.confidence_score * 100)}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
