"use client";

import { useState } from "react";
import ObjectDetection from "../Components/ObjectDetection"

export default function Home() {
  const [showObjectDetection, setShowObjectDetection] = useState(false);

  const _toggleObjectDetection = () => {
    setShowObjectDetection(prev => !prev);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="gradient-title font-extrabold text-3xl md:text-6xl lg:text-8xl tracking-tighter md:px-6 text-center">
        Thief Detection Alarm
      </h1>

      <button
        type="button"
        onClick={_toggleObjectDetection}
        className={`group inline-flex items-center gap-2.5 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${showObjectDetection
          ? "bg-rose-600 hover:bg-rose-500 focus:ring-rose-500 shadow-rose-500/20"
          : "bg-emerald-600 hover:bg-emerald-500 focus:ring-emerald-500 shadow-emerald-500/20"
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


      <div className="relative mx-auto mt-6 w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/90 shadow-2xl shadow-black/50 ring-1 ring-white/10">
        {/* Top Status Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 py-2.5 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${showObjectDetection ? "animate-pulse bg-emerald-400" : "bg-slate-600"
                }`}
            />
            <span>{showObjectDetection ? "LIVE FEED • AI ACTIVE" : "CAMERA STANDBY"}</span>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
            COCO-SSD
          </span>
        </div>

        {/* Camera Feed / Standby Boundary */}
        <div className="relative aspect-video w-full bg-slate-950">
          {showObjectDetection ? (
            <ObjectDetection />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              {/* Subtle Corner Reticles */}
              <div className="pointer-events-none absolute inset-4 border border-dashed border-slate-800/80 rounded-xl" />

              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-slate-400 ring-1 ring-slate-800">
                <svg
                  className="h-6 w-6"
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

              <p className="text-sm font-medium text-slate-300">Camera feed is paused</p>
              <p className="mt-1 max-w-xs text-xs text-slate-500">
                Click <span className="text-slate-300 font-medium">Start Detection</span> above to activate live object tracking.
              </p>
            </div>
          )}
        </div>
      </div>

    </main>
  );
}