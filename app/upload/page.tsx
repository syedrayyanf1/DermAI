"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ImageUploader from "@/components/ImageUploader";
import LifestyleForm from "@/components/LifestyleForm";
import type { LifestyleData } from "@/lib/types";
import { fileToBase64 } from "@/utils/imageUtils";

export default function UploadPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleImageReady = (file: File, previewUrl: string) => {
    setImageFile(file);
    setPreview(previewUrl);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (lifestyle: LifestyleData) => {
    if (!imageFile) {
      setError("Please upload a photo first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("lifestyle", JSON.stringify(lifestyle));

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">📸 New Daily Entry</h1>
        <p className="text-gray-500 text-sm mb-8">
          Upload your facial photo and log today&apos;s routine &amp; lifestyle data.
        </p>

        {result ? (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-2">✅</div>
              <h2 className="text-lg font-bold text-green-700 dark:text-green-400">
                Entry Saved Successfully
              </h2>
              {!result.aiAvailable && (
                <p className="text-sm text-yellow-600 mt-2">
                  ⚠️ AI analysis unavailable — defaults saved. You can re-analyze later.
                </p>
              )}
            </div>

            {result.entry && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                <h3 className="font-semibold mb-4">🔬 Analysis Results</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  {[
                    ["Severity", `${result.entry.overall_severity_score}/10`],
                    ["Inflammation", `${result.entry.inflammation_level}/10`],
                    ["Oiliness", `${result.entry.oiliness_level}/10`],
                    ["Dryness", `${result.entry.dryness_level}/10`],
                    ["Whiteheads", result.entry.whiteheads],
                    ["Blackheads", result.entry.blackheads],
                    ["Papules", result.entry.papules],
                    ["Pustules", result.entry.pustules],
                    ["Nodules", result.entry.nodules_or_cysts],
                    ["Pigmentation", `${result.entry.hyperpigmentation_level}/10`],
                    ["Scarring", result.entry.scarring_visible ? "Yes" : "No"],
                    ["Confidence", `${Math.round(result.entry.confidence_score * 100)}%`],
                  ].map(([label, value]) => (
                    <div
                      key={label as string}
                      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3"
                    >
                      <div className="text-xs text-gray-500">{label}</div>
                      <div className="font-bold">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
              >
                View Dashboard →
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setImageFile(null);
                  setPreview(null);
                }}
                className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                New Entry
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="font-semibold mb-3">📷 Facial Photo</h2>
              <ImageUploader onImageReady={handleImageReady} />
              {preview && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                  <span>✅</span> Photo ready for analysis
                </div>
              )}
              <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-xs text-gray-500 space-y-1">
                <p>📏 Same distance from camera each day</p>
                <p>💡 Consistent, diffused lighting</p>
                <p>🚫 No makeup or filters</p>
                <p>🧼 Clean, dry face</p>
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-3">📝 Lifestyle Log</h2>
              <LifestyleForm onSubmit={handleSubmit} loading={loading} />
              {error && (
                <p className="text-red-500 text-sm mt-3">{error}</p>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
