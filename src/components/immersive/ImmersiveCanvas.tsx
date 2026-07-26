import { useRef, useEffect, useCallback, useState } from "react";
import {
  renderFrame,
  extractAudioData,
  resetVisuals,
  type VisualState,
} from "@/visual/visualEngine";
import { getMasterAnalyser } from "@/audio/audioEngine";
import { type VisualMode, type VisualParams, VISUAL_MODES } from "@/visual/visualParams";

export function ImmersiveCanvas({ params }: { params: VisualParams }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<VisualState>({
    width: 0, height: 0, time: 0,
    beat: 0, bass: 0, mid: 0, treble: 0, rms: 0,
    mouseX: 0, mouseY: 0, mouseDown: false, hueShift: 0,
  });
  const rafRef = useRef<number>(0);
  const [visualMode, setVisualMode] = useState<VisualMode>("nebula");
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      stateRef.current.width = rect.width;
      stateRef.current.height = rect.height;
    }

    const state = stateRef.current;
    state.time += 0.016;

    const analyser = getMasterAnalyser();
    if (analyser) {
      const audio = extractAudioData(analyser);
      state.bass = state.bass * 0.85 + audio.bass * 0.15;
      state.mid = state.mid * 0.85 + audio.mid * 0.15;
      state.treble = state.treble * 0.85 + audio.treble * 0.15;
      state.rms = state.rms * 0.8 + audio.rms * 0.2;
      state.beat = state.beat * 0.7 + audio.beat * 0.3;
    }

    state.hueShift = (state.hueShift + 0.1 + state.rms * 0.5) % 360;

    renderFrame(ctx, visualMode, state, paramsRef.current);

    rafRef.current = requestAnimationFrame(draw);
  }, [visualMode]);

  useEffect(() => {
    stateRef.current.time = 0;
    resetVisuals();
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    function onMove(e: MouseEvent | Touch) {
      const rect = canvas!.getBoundingClientRect();
      stateRef.current.mouseX = e.clientX - rect.left;
      stateRef.current.mouseY = e.clientY - rect.top;
    }
    function onTouchMove(e: TouchEvent) { e.preventDefault(); onMove(e.touches[0]!); }
    function onDown() { stateRef.current.mouseDown = true; }
    function onUp() { stateRef.current.mouseDown = false; }
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("mouseleave", onUp);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchstart", onDown);
    canvas.addEventListener("touchend", onUp);
    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("mouseleave", onUp);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchstart", onDown);
      canvas.removeEventListener("touchend", onUp);
    };
  }, []);

  return { canvasRef, visualMode, setVisualMode };
}

export function VisualModeSelector({
  mode, onChange,
}: {
  mode: VisualMode; onChange: (m: VisualMode) => void;
}) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/[0.06] overflow-x-auto">
      {VISUAL_MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`
            px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-300 whitespace-nowrap shrink-0
            ${mode === m.id
              ? "bg-white/10 text-white shadow-lg shadow-white/5"
              : "text-white/30 hover:text-white/60 hover:bg-white/[0.03]"
            }
          `}
          title={m.desc}
        >
          <span className="mr-0.5">{m.icon}</span>
          <span className="hidden sm:inline">{m.name}</span>
        </button>
      ))}
    </div>
  );
}
