import { useRef, useEffect, useCallback } from "react";
import {
  renderFrame,
  extractAudioData,
  resetVisuals,
  type VisualState,
} from "@/visual/visualEngine";
import { getMasterAnalyser } from "@/audio/audioEngine";
import {
  initGestureAudio,
  getInteractionState,
} from "@/audio/interactionManager";
import {
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
} from "@/audio/gestureEngine";
import { type VisualMode, type VisualParams } from "@/visual/visualParams";

export function ImmersiveCanvas({ params, visualMode }: { params: VisualParams; visualMode: VisualMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<VisualState>({
    width: 0, height: 0, time: 0,
    beat: 0, bass: 0, mid: 0, treble: 0, rms: 0,
    mouseX: 0, mouseY: 0, mouseDown: false, hueShift: 0,
    interactionIntensity: 0, interactionX: 0.5, interactionY: 0.5, interactionHolding: false,
  });
  const rafRef = useRef<number>(0);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const draw = useCallback(() => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) { rafRef.current = requestAnimationFrame(draw); return; }
      const ctx = canvas.getContext("2d");
      if (!ctx) { rafRef.current = requestAnimationFrame(draw); return; }

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stateRef.current.width = rect.width;
      stateRef.current.height = rect.height;

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

      const t = state.time;
      if (state.rms < 0.01) {
        state.bass = 0.1 + Math.sin(t * 0.8) * 0.08;
        state.mid = 0.08 + Math.sin(t * 1.2 + 1) * 0.06;
        state.treble = 0.05 + Math.sin(t * 1.8 + 2) * 0.04;
        state.rms = 0.08 + Math.sin(t * 0.5) * 0.04;
        state.beat = Math.sin(t * 2.4) > 0.7 ? 0.15 : 0;
      }

      const iState = getInteractionState();
      state.interactionIntensity = iState.intensity;
      state.interactionX = iState.normX;
      state.interactionY = iState.normY;
      state.interactionHolding = iState.holding;

      state.hueShift = (state.hueShift + 0.1 + state.rms * 0.5) % 360;

      renderFrame(ctx, visualMode, state, paramsRef.current);
    } catch {
      // Keep rAF loop alive
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [visualMode]);

  useEffect(() => {
    initGestureAudio();
  }, []);

  useEffect(() => {
    stateRef.current.time = 0;
    resetVisuals();
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function onTouchStartHandler(e: TouchEvent) {
      e.preventDefault();
      handleTouchStart(e);
    }
    function onTouchMoveHandler(e: TouchEvent) {
      e.preventDefault();
      handleTouchMove(e);
    }
    function onTouchEndHandler(e: TouchEvent) {
      handleTouchEnd(e);
    }

    function onMouseDownHandler(e: MouseEvent) {
      stateRef.current.mouseDown = true;
      stateRef.current.mouseX = e.clientX;
      stateRef.current.mouseY = e.clientY;
      handleMouseDown(e.clientX, e.clientY);
    }
    function onMouseMoveHandler(e: MouseEvent) {
      stateRef.current.mouseX = e.clientX;
      stateRef.current.mouseY = e.clientY;
      if (stateRef.current.mouseDown) {
        handleMouseMove(e.clientX, e.clientY);
      }
    }
    function onMouseUpHandler(e: MouseEvent) {
      stateRef.current.mouseDown = false;
      handleMouseUp(e.clientX, e.clientY);
    }

    canvas.addEventListener("touchstart", onTouchStartHandler, { passive: false });
    canvas.addEventListener("touchmove", onTouchMoveHandler, { passive: false });
    canvas.addEventListener("touchend", onTouchEndHandler);
    canvas.addEventListener("mousedown", onMouseDownHandler);
    canvas.addEventListener("mousemove", onMouseMoveHandler);
    canvas.addEventListener("mouseup", onMouseUpHandler);
    canvas.addEventListener("mouseleave", onMouseUpHandler);

    return () => {
      canvas.removeEventListener("touchstart", onTouchStartHandler);
      canvas.removeEventListener("touchmove", onTouchMoveHandler);
      canvas.removeEventListener("touchend", onTouchEndHandler);
      canvas.removeEventListener("mousedown", onMouseDownHandler);
      canvas.removeEventListener("mousemove", onMouseMoveHandler);
      canvas.removeEventListener("mouseup", onMouseUpHandler);
      canvas.removeEventListener("mouseleave", onMouseUpHandler);
    };
  }, []);

  return { canvasRef };
}
