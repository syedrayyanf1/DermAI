"use client";

import { useState } from "react";

interface BeforeAfterSliderProps {
  beforeUrl: string | null;
  afterUrl: string | null;
  beforeDate: string;
  afterDate: string;
}

export default function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeDate,
  afterDate,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-gray-500 mb-4">
        ↔️ Before / After
      </h3>
      <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        {/* Before side */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {beforeUrl ? (
            <img src={beforeUrl} alt="Before" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">📸</div>
              <div className="text-xs">First photo</div>
              <div className="text-xs font-medium">{beforeDate}</div>
            </div>
          )}
        </div>

        {/* After side */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        >
          {afterUrl ? (
            <img src={afterUrl} alt="After" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">📸</div>
              <div className="text-xs">Latest photo</div>
              <div className="text-xs font-medium">{afterDate}</div>
            </div>
          )}
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-xs font-bold text-gray-600">
            ↔
          </div>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="w-full mt-3 accent-indigo-600"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{beforeDate}</span>
        <span>{afterDate}</span>
      </div>
    </div>
  );
}
