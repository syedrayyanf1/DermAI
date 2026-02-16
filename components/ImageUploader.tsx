"use client";

import { useState, useCallback } from "react";
import { compressImage } from "@/utils/imageUtils";

interface ImageUploaderProps {
  onImageReady: (file: File, preview: string) => void;
}

export default function ImageUploader({ onImageReady }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be under 10MB before compression.");
        return;
      }

      try {
        const compressed = await compressImage(file);
        if (compressed.size > 2 * 1024 * 1024) {
          setError("Image too large even after compression. Use a smaller photo.");
          return;
        }

        const url = URL.createObjectURL(compressed);
        setPreview(url);
        onImageReady(compressed, url);
      } catch {
        setError("Failed to process image.");
      }
    },
    [onImageReady]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
            : "border-gray-300 dark:border-gray-700 hover:border-indigo-400"
        }`}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="max-h-64 mx-auto rounded-xl object-contain"
          />
        ) : (
          <>
            <div className="text-4xl mb-3">📸</div>
            <p className="text-sm text-gray-500 mb-1">
              Drop your facial photo here or click to browse
            </p>
            <p className="text-xs text-gray-400">
              JPEG or PNG • Max 2MB after compression
            </p>
          </>
        )}
        <input
          id="file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processFile(file);
          }}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
      {preview && (
        <button
          onClick={() => {
            setPreview(null);
            setError(null);
          }}
          className="text-sm text-gray-500 hover:text-red-500 mt-2 transition-colors"
        >
          Remove photo
        </button>
      )}
    </div>
  );
}
