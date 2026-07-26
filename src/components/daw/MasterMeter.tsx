import { useRef, useEffect, useCallback } from "react";
import { getMasterAnalyser, getRMSLevel } from "@/audio/audioEngine";
import { useDAWStore } from "@/store/daw.store";

export function MasterMeter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const masterVolume = useDAWStore((s) => s.masterVolume);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, H);

    const analyser = getMasterAnalyser();
    if (!analyser) return;

    const rms = getRMSLevel(analyser);
    const level = rms * masterVolume;

    // Draw level meter
    const barWidth = 3;
    const gap = 1;
    const numBars = Math.floor(W / (barWidth + gap));
    const activeBars = Math.round(level * numBars * 3);

    for (let i = 0; i < numBars; i++) {
      const x = i * (barWidth + gap);
      const ratio = i / numBars;

      let color: string;
      if (ratio < 0.6) {
        color = `rgb(${34 + ratio * 100}, ${197 - ratio * 100}, ${94})`;
      } else if (ratio < 0.85) {
        color = `rgb(${234 + ratio * 20}, ${179 - ratio * 100}, ${8})`;
      } else {
        color = "#ef4444";
      }

      if (i < activeBars) {
        ctx.fillStyle = color;
        const barH = H * 0.6 + (H * 0.4 * Math.sin(Date.now() / 200 + i * 0.3)) * 0.15;
        ctx.fillRect(x, H - barH, barWidth, barH);
      } else {
        ctx.fillStyle = "rgba(30,41,59,0.8)";
        ctx.fillRect(x, H * 0.3, barWidth, H * 0.7);
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, [masterVolume]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-surface-primary">
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded"
        style={{ minHeight: 40 }}
      />
    </div>
  );
}
