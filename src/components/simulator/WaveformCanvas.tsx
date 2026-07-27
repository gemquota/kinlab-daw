import { useRef, useEffect, useCallback } from "react";
import {
  sampleWaveform,
  type WaveformConfig,
  type WaveformSample,
} from "@/math/waveform/waveform.engine";

const DERIVATIVE_COLORS = [
  "#3b82f6", // Position — blue
  "#22c55e", // Velocity — green
  "#f97316", // Acceleration — orange
  "#ef4444", // Jerk — red
  "#a855f7", // Snap — purple
];

const COMPONENT_COLORS = [
  "#06b6d4", "#eab308", "#ec4899", "#14b8a6", "#6366f1", "#f43f5e",
  "#84cc16", "#f59e0b", "#8b5cf6", "#0ea5e9",
];

interface WaveformCanvasProps {
  config: WaveformConfig;
  currentTime: number;
  timeRange: number;
  showDerivatives: boolean;
  showComponents: boolean;
  isPlaying: boolean;
  speed: number;
  onTimeUpdate?: (t: number) => void;
}

export function WaveformCanvas({
  config,
  currentTime,
  timeRange,
  showDerivatives,
  showComponents,
  isPlaying,
  speed,
  onTimeUpdate,
}: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const samplesRef = useRef<WaveformSample[]>([]);

  // Compute samples
  const computeSamples = useCallback(() => {
    const tStart = Math.max(0, currentTime - timeRange / 2);
    const tEnd = currentTime + timeRange / 2;
    samplesRef.current = sampleWaveform(config, tStart, tEnd, 600);
  }, [config, currentTime, timeRange]);

  // Draw
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
    const samples = samplesRef.current;
    if (samples.length === 0) return;

    // Clear
    ctx.fillStyle = "var(--surface-secondary, #1e293b)";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(100,116,139,0.15)";
    ctx.lineWidth = 1;
    const gridSpacingX = W / 10;
    const gridSpacingY = H / 6;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSpacingX, 0);
      ctx.lineTo(i * gridSpacingX, H);
      ctx.stroke();
    }
    for (let i = 0; i <= 6; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * gridSpacingY);
      ctx.lineTo(W, i * gridSpacingY);
      ctx.stroke();
    }

    // Axis labels
    ctx.fillStyle = "rgba(148,163,184,0.6)";
    ctx.font = "10px 'JetBrains Mono', monospace";
    const tStart = samples[0]?.t ?? 0;
    const tEnd = samples[samples.length - 1]?.t ?? 10;
    ctx.fillText(`${tStart.toFixed(1)}s`, 4, H - 4);
    ctx.fillText(`${tEnd.toFixed(1)}s`, W - 30, H - 4);
    ctx.fillText("0", 4, H / 2 - 4);

    // Auto-scale
    let maxVal = 0;
    for (const s of samples) {
      const v = Math.abs(s.value);
      if (v > maxVal) maxVal = v;
      if (showDerivatives) {
        for (let d = 1; d < s.derivatives.length; d++) {
          const dv = Math.abs(s.derivatives[d]!);
          if (dv > maxVal) maxVal = dv;
        }
      }
    }
    maxVal = Math.max(maxVal, 0.5) * 1.2;

    function tToX(t: number): number {
      return ((t - tStart) / (tEnd - tStart)) * W;
    }
    function vToY(v: number): number {
      return H / 2 - (v / maxVal) * (H / 2 - 20);
    }

    // Draw components (if enabled)
    if (showComponents) {
      for (let ci = 0; ci < samples[0]!.components.length; ci++) {
        const color = COMPONENT_COLORS[ci % COMPONENT_COLORS.length]!;
        ctx.strokeStyle = color + "40";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < samples.length; i++) {
          const x = tToX(samples[i]!.t);
          const y = vToY(samples[i]!.components[ci] ?? 0);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    // Draw derivatives (if enabled)
    if (showDerivatives) {
      for (let d = 1; d <= 4; d++) {
        const color = DERIVATIVE_COLORS[d] ?? "#94a3b8";
        ctx.strokeStyle = color + "80";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for (let i = 0; i < samples.length; i++) {
          const x = tToX(samples[i]!.t);
          const y = vToY(samples[i]!.derivatives[d] ?? 0);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw main waveform
    ctx.strokeStyle = DERIVATIVE_COLORS[0]!;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = DERIVATIVE_COLORS[0]!;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    for (let i = 0; i < samples.length; i++) {
      const x = tToX(samples[i]!.t);
      const y = vToY(samples[i]!.value);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Current time cursor
    if (currentTime >= tStart && currentTime <= tEnd) {
      const cx = tToX(currentTime);
      ctx.strokeStyle = "#f1f5f9";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Cursor value dot
      const result = sampleWaveform(config, currentTime, currentTime + 0.001, 1);
      if (result.length > 0) {
        const cy = vToY(result[0]!.value);
        ctx.fillStyle = DERIVATIVE_COLORS[0]!;
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }, [config, currentTime, timeRange, showDerivatives, showComponents]);

  // Animation loop
  useEffect(() => {
    computeSamples();
    draw();

    if (!isPlaying) return;

    lastTimeRef.current = performance.now();

    function animate(now: number) {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      onTimeUpdate?.(currentTime + delta * speed);
      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, speed, currentTime, computeSamples, draw, onTimeUpdate]);

  // Redraw on config change
  useEffect(() => {
    computeSamples();
    draw();
  }, [computeSamples, draw]);

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => draw());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-lg cursor-crosshair"
      style={{ minHeight: 200 }}
    />
  );
}
