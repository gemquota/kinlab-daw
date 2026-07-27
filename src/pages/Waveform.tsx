import { useState, useEffect, useCallback } from "react";
import { useDAWStore } from "@/store/daw.store";
import { useVisualStore } from "@/store/visual.store";
import { useAudioSync } from "@/hooks/useAudioSync";
import { ImmersiveCanvas } from "@/components/immersive/ImmersiveCanvas";
import { FloatingControls } from "@/components/immersive/FloatingControls";
import { type VisualMode } from "@/visual/visualParams";

export function Waveform() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [visualMode, setVisualMode] = useState<VisualMode>("nebula");
  const playing = useDAWStore((s) => s.playing);
  const setPlaying = useDAWStore((s) => s.setPlaying);
  const params = useVisualStore((s) => s.params);

  useAudioSync();

  useEffect(() => {
    const timer = setTimeout(() => setShowOverlay(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === " ") { e.preventDefault(); setPlaying(!playing); }
  }, [playing, setPlaying]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const { canvasRef } = ImmersiveCanvas({ params, visualMode });

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        aria-label="Audio waveform visualization"
        role="img"
      />

      {/* Bottom bar: transport + visual mode tabs + mixer/effects toggles */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <div className="pointer-events-auto flex justify-center pb-3">
          <FloatingControls visualMode={visualMode} onModeChange={setVisualMode} />
        </div>
      </div>

      {/* Overlay hint */}
      {showOverlay && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none animate-fade-in">
          <div className="text-center space-y-3 animate-scale-in">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 backdrop-blur-xl border border-white/[0.1] flex items-center justify-center text-3xl shadow-2xl shadow-purple-500/20">
              ∿
            </div>
            <div className="text-white/60 text-sm font-medium">Click anywhere to begin</div>
            <div className="text-white/25 text-[10px]">Space to play · Bottom bar for controls</div>
          </div>
        </div>
      )}
    </div>
  );
}
