"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "@/utils/render-predictions";

let detectInterval; // made as a global variable for easier cleanup later on

const ObjectDetection = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [isLoading, setIsLoading] = useState({
    loading: true,
  });

  const _manageLoading = (key, value) => {
    setIsLoading((prev) => ({ ...prev, [key]: value }));
  };

  // using this function notation instead of arrow function as we need function hoisted above so that it can be referred and called earlier also
  async function _runCoco() {
    _manageLoading("loading", true); // Set loading state to true when model loading starts
    const net = await cocoSSDLoad();
    _manageLoading("loading", false); // Set loading state to false when model loading completes

    // eslint-disable-next-line react-hooks/globals
    detectInterval = setInterval(() => {
      _runObjectDetection(net); // will build this next
    }, 100);
  }

  async function _runObjectDetection(net) {
    if (
      canvasRef.current &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      // find detected objects
      const detectedObjects = await net.detect(
        webcamRef.current.video,
        undefined,
        0.6,
      );

      // console.log(detectedObjects);

      const context = canvasRef.current.getContext("2d");
      renderPredictions(detectedObjects, context);
    }
  }

  const _showMyVideo = () => {
    if (
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const myVideoWidth = webcamRef.current.video.videoWidth;
      const myVideoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = myVideoWidth;
      webcamRef.current.video.height = myVideoHeight;
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    _runCoco();
    _showMyVideo();
  }, []);

  return (
    <div className="mt-8">
      {isLoading?.loading ? (
        <div className="gradient-text">Loading AI Model...</div>
      ) : (
        <div className="relative flex justify-center items-center gradient p-1.5 rounded-md">
          {/* Webcam */}
          <Webcam
            ref={webcamRef}
            className="rounded-md w-full lg:h-[720px]"
            muted
          />

          {/* canvas */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-99999 w-full lg:h-[720px]"
          />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
