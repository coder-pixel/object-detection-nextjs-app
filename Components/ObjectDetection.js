"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "@/utils/render-predictions";

const ObjectDetection = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let detectInterval;
    let isMounted = true;

    async function runCoco() {
      setIsLoading(true);
      const net = await cocoSSDLoad();
      if (!isMounted) return;
      setIsLoading(false);

      detectInterval = setInterval(() => {
        runObjectDetection(net);
      }, 100);
    }

    async function runObjectDetection(net) {
      if (
        canvasRef.current &&
        webcamRef.current !== null &&
        webcamRef.current.video?.readyState === 4
      ) {
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const detectedObjects = await net.detect(
          webcamRef.current.video,
          undefined,
          0.6,
        );

        const context = canvasRef.current.getContext("2d");
        renderPredictions(detectedObjects, context);
      }
    }

    runCoco();

    // Cleanup interval when clicking "Stop Detection"
    return () => {
      isMounted = false;
      if (detectInterval) clearInterval(detectInterval);
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      {isLoading ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-slate-300">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />
          <p className="text-sm font-medium tracking-wide">
            Loading AI Model...
          </p>
        </div>
      ) : (
        <div className="relative h-full w-full">
          {/* Webcam */}
          <Webcam ref={webcamRef} className="h-full w-full object-fill" muted />

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
