import { throttle } from "lodash";
import { DetectedObject } from "@tensorflow-models/coco-ssd";

// Reuse one Audio instance so it doesn't re-fetch or overlap on every trigger
let alarmAudio: HTMLAudioElement | null = null;

const playAudio = throttle(() => {
  if (typeof window === "undefined") return;

  if (!alarmAudio) {
    alarmAudio = new Audio("/musicnation782-critical-alert-sound-618931.mp3");
  }

  alarmAudio.currentTime = 0;
  alarmAudio.play().catch((err) => {
    // Prevents unhandled promise rejection if browser blocks autoplay
    console.warn("Audio alert blocked:", err);
  });
}, 2000);

export const renderPredictions = (
  predictions: DetectedObject[],
  ctx: CanvasRenderingContext2D,
): void => {
  if (!ctx) return;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const font = "600 14px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";

  predictions?.forEach((prediction) => {
    const [x, y, width, height] = prediction.bbox;
    const isPerson = prediction.class === "person";
    const color = isPerson ? "#EF4444" : "#06B6D4"; // Modern red & cyan

    // Bounding box
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);

    // Subtle red tint only when a person is detected
    if (isPerson) {
      ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
      ctx.fillRect(x, y, width, height);
    }

    // Label text with confidence score (e.g., "person 94%")
    const label = `${prediction.class} ${Math.round(prediction.score * 100)}%`;
    const textWidth = ctx.measureText(label).width;
    const textHeight = 14;
    const padding = 6;

    // Keep label inside canvas if object is near the top edge
    const labelY =
      y - (textHeight + padding) < 0 ? y : y - (textHeight + padding);

    // Label background
    ctx.fillStyle = color;
    ctx.fillRect(x, labelY, textWidth + padding * 2, textHeight + padding);

    // Label text
    ctx.fillStyle = isPerson ? "#FFFFFF" : "#000000";
    ctx.fillText(label, x + padding, labelY + padding / 2);

    if (isPerson) {
      playAudio();
    }
  });
};
