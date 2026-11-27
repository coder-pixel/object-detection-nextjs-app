import { throttle } from "lodash";
import { DetectedObject } from "@tensorflow-models/coco-ssd";

let alarmAudio: HTMLAudioElement | null = null;

const playAudio = throttle(() => {
  if (typeof window === "undefined") return;

  if (!alarmAudio) {
    alarmAudio = new Audio("/musicnation782-critical-alert-sound-618931.mp3");
  }

  // Only restart if it's not already playing so it sounds smooth
  if (alarmAudio.paused) {
    alarmAudio.currentTime = 0;
    alarmAudio.play().catch((err) => {
      console.warn("Audio alert blocked:", err);
    });
  }
}, 2000);

export const stopAudio = (): void => {
  playAudio.cancel(); // Cancels any queued throttled call
  if (alarmAudio && !alarmAudio.paused) {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
  }
};

export const renderPredictions = (
  predictions: DetectedObject[],
  ctx: CanvasRenderingContext2D,
): void => {
  if (!ctx) return;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const font = "600 14px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";

  let personDetected = false;

  predictions?.forEach((prediction) => {
    const [x, y, width, height] = prediction.bbox;
    const isPerson = prediction.class === "person";
    if (isPerson) personDetected = true;

    const color = isPerson ? "#EF4444" : "#06B6D4";

    // Bounding box
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);

    if (isPerson) {
      ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
      ctx.fillRect(x, y, width, height);
    }

    // Label text with confidence score
    const label = `${prediction.class} ${Math.round(prediction.score * 100)}%`;
    const textWidth = ctx.measureText(label).width;
    const textHeight = 14;
    const padding = 6;
    const labelY =
      y - (textHeight + padding) < 0 ? y : y - (textHeight + padding);

    ctx.fillStyle = color;
    ctx.fillRect(x, labelY, textWidth + padding * 2, textHeight + padding);

    ctx.fillStyle = isPerson ? "#FFFFFF" : "#000000";
    ctx.fillText(label, x + padding, labelY + padding / 2);
  });

  // Trigger or immediately stop alarm based on the full frame
  if (personDetected) {
    playAudio();
  } else {
    stopAudio();
  }
};
