import { useState, useEffect, useCallback } from "react";
import { useDAWStore } from "@/store/daw.store";
import { useAudioSync } from "@/hooks/useAudioSync";
import { ImmersiveCanvas, VisualModeSelector } from "@/components/immersive/ImmersiveCanvas";
import { FloatingControls } from "@/components/immersive/FloatingControls";

/**
 * Main Waveform page — fullscreen canvas with audio visualization.
 * Renders the immersive audio canvas with floating transport controls.
 */
export function Waveform() {
  const [showOverlay, setShowOverlay] = useState(true);

  // Task 1.1.1 & 1.1.2: Use selectors to prevent unnecessary re-renders
  const playing = useDAWStore((s) => s.playing);
  const setPlaying = useDAWStore((s) => s.setPlaying);

  useAudioSync();

  // Hide overlay hint after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowOverlay(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Task 4.3: Keyboard shortcuts with proper callback
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === " ") {
      e.preventDefault();
      setPlaying(!playing);
    }
  }, [playing, setPlaying]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const { canvasRef, visualMode, setVisualMode } = ImmersiveCanvas();

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Task 4.1.1 & 4.1.2: Accessible canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        aria-label="Audio waveform visualization"
        role="img"
      />

      {/* Top bar — visual mode selector + brand */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/30 backdrop-blur-xl border border-white/[0.06]">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/80 to-blue-500/80 flex items-center justify-center text-white text-[10px] font-bold">
              ∿
            </div>
            <span className="text-white/70 text-xs font-semibold tracking-wide">VOID</span>
          </div>
          <VisualModeSelector mode={visualMode} onChange={setVisualMode} />
        </div>
      </div>

      {/* Center: floating controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <FloatingControls />
      </div>

      {/* Initial overlay hint */}
      {showOverlay && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none animate-fade-in">
          <div className="text-center space-y-3 animate-scale-in">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 backdrop-blur-xl border border-white/[0.1] flex items-center justify-center text-3xl shadow-2xl shadow-purple-500/20">
              ∿
            </div>
            <div className="text-white/60 text-sm font-medium">Click anywhere to begin</div>
            <div className="text-white/25 text-[10px]">Space to play · Click patterns to cycle</div>
          </div>
        </div>
      )}
    </div>
  );
}
