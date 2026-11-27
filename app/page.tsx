"use client";

import { useState } from "react";
import ObjectDetection from "../Components/ObjectDetection";

export default function Home() {
  const [showObjectDetection, setShowObjectDetection] = useState(false);

  const _toggleObjectDetection = () => {
    setShowObjectDetection((prev) => !prev);
  };

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-6 sm:p-8">
      {/* Header */}
      <div className="mb-5 text-center sm:mb-6">
        <h1 className="gradient-title text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Thief Detection Alarm
        </h1>
        <p className="mt-1.5 text-xs text-slate-400 sm:text-sm">
          Real-time AI person &amp; object surveillance
        </p>
      </div>

      {/* Action Button (Full-width on mobile for easy thumb reach) */}
      <button
        type="button"
        onClick={_toggleObjectDetection}
        className={`group inline-flex w-full max-w-xs items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 sm:w-auto sm:py-2.5 ${showObjectDetection
          ? "bg-rose-600 shadow-rose-500/20 hover:bg-rose-500 focus:ring-rose-500"
          : "bg-emerald-600 shadow-emerald-500/20 hover:bg-emerald-500 focus:ring-emerald-500"
          }`}
      >
        <span className="relative flex h-2.5 w-2.5">
          {showObjectDetection && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          )}
          <span
            className={`relative inline-flex h-2.5 w-2.5 rounded-full ${showObjectDetection ? "bg-white" : "bg-emerald-200"
              }`}
          />
        </span>
        {showObjectDetection ? "Stop Detection" : "Start Detection"}
      </button>

      {/* Security Viewfinder Card */}
      <div className="relative mx-auto mt-5 w-full max-w-4xl overflow-hidden rounded-xl border border-slate-800 bg-slate-950/90 shadow-2xl shadow-black/50 ring-1 ring-white/10 sm:mt-6 sm:rounded-2xl">
        {/* Top Status Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-3 py-2 text-[11px] font-medium text-slate-400 sm:px-4 sm:py-2.5 sm:text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${showObjectDetection
                ? "animate-pulse bg-emerald-400"
                : "bg-slate-600"
                }`}
            />
            <span className="truncate">
              {showObjectDetection ? "LIVE • AI ACTIVE" : "STANDBY"}
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 sm:text-[11px]">
            COCO-SSD
          </span>
        </div>

        {/* Camera Feed / Standby Boundary */}
        <div className="relative aspect-4/3 w-full bg-slate-950 sm:aspect-video">
          {showObjectDetection ? (
            <ObjectDetection />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center sm:p-6">
              {/* Subtle Corner Reticles */}
              <div className="pointer-events-none absolute inset-3 rounded-lg border border-dashed border-slate-800/80 sm:inset-4 sm:rounded-xl" />

              <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-400 ring-1 ring-slate-800 sm:mb-3 sm:h-12 sm:w-12">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              </div>

              <p className="text-xs font-medium text-slate-300 sm:text-sm">
                Camera feed is paused
              </p>
              <p className="mt-1 max-w-60 text-[11px] leading-relaxed text-slate-500 sm:max-w-xs sm:text-xs">
                Tap{" "}
                <span className="font-medium text-slate-300">
                  Start Detection
                </span>{" "}
                above to activate live object tracking.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
