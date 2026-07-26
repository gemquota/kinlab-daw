import { useState, useEffect } from "react";
import { useDAWStore } from "@/store/daw.store";
import { useAudioSync } from "@/hooks/useAudioSync";
import { ImmersiveCanvas, VisualModeSelector } from "@/components/immersive/ImmersiveCanvas";
import { FloatingControls } from "@/components/immersive/FloatingControls";
import { PresetBrowser } from "@/components/daw/PresetBrowser";
import { StepSequencerUI } from "@/components/daw/StepSequencerUI";
import { ArpeggioPanel } from "@/components/daw/ArpeggioPanel";
import { ProceduralPanel } from "@/components/daw/ProceduralPanel";
import { cn } from "@/lib/cn";
import { Library, Grid3x3, Waves, Dices, Settings, X } from "lucide-react";

type SidePanel = null | "presets" | "seq" | "arp" | "proc" | "settings";

export function Waveform() {
  const [sidePanel, setSidePanel] = useState<SidePanel>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const daw = useDAWStore();

  useAudioSync();

  // Hide overlay hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowOverlay(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " ") { e.preventDefault(); daw.setPlaying(!daw.playing); }
      if (e.key === "Escape") setSidePanel(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [daw]);

  const { canvasRef, visualMode, setVisualMode } = ImmersiveCanvas();

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Fullscreen canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
      />

      {/* Top bar — visual mode selector + side panel triggers */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 pointer-events-none">
        {/* Left: Brand + visual mode */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/30 backdrop-blur-xl border border-white/[0.06]">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/80 to-blue-500/80 flex items-center justify-center text-white text-[10px] font-bold">
              ∿
            </div>
            <span className="text-white/70 text-xs font-semibold tracking-wide">VOID</span>
          </div>
          <VisualModeSelector mode={visualMode} onChange={setVisualMode} />
        </div>

        {/* Right: panel triggers */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {([
            { id: "presets" as const, icon: <Library className="w-3.5 h-3.5" />, label: "Presets" },
            { id: "seq" as const, icon: <Grid3x3 className="w-3.5 h-3.5" />, label: "Sequencer" },
            { id: "arp" as const, icon: <Waves className="w-3.5 h-3.5" />, label: "Arp" },
            { id: "proc" as const, icon: <Dices className="w-3.5 h-3.5" />, label: "Generate" },
            { id: "settings" as const, icon: <Settings className="w-3.5 h-3.5" />, label: "Settings" },
          ]).map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSidePanel(sidePanel === btn.id ? null : btn.id)}
              className={cn(
                "p-2.5 rounded-xl backdrop-blur-xl border transition-all duration-300",
                sidePanel === btn.id
                  ? "bg-white/10 text-white border-white/[0.1] shadow-lg shadow-black/30"
                  : "bg-black/20 text-white/30 border-white/[0.04] hover:bg-white/[0.06] hover:text-white/60",
              )}
              title={btn.label}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Center: floating controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <FloatingControls />
      </div>

      {/* Side panel overlay */}
      {sidePanel && (
        <div className="absolute top-0 right-0 bottom-0 z-30 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidePanel(null)}
          />

          {/* Panel */}
          <div className="relative ml-auto w-80 h-full bg-black/70 backdrop-blur-2xl border-l border-white/[0.06] shadow-2xl shadow-black/60 overflow-hidden animate-slide-in-right">
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <span className="text-white/60 text-xs font-semibold">
                {sidePanel === "presets" && "Preset Browser"}
                {sidePanel === "seq" && "Step Sequencer"}
                {sidePanel === "arp" && "Arpeggiator"}
                {sidePanel === "proc" && "Procedural Generator"}
                {sidePanel === "settings" && "Settings"}
              </span>
              <button
                onClick={() => setSidePanel(null)}
                className="p-1 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Panel content */}
            <div className="h-[calc(100%-48px)] overflow-hidden">
              {sidePanel === "presets" && <PresetBrowser />}
              {sidePanel === "seq" && <StepSequencerUI />}
              {sidePanel === "arp" && <ArpeggioPanel />}
              {sidePanel === "proc" && <ProceduralPanel />}
              {sidePanel === "settings" && <SettingsPanel />}
            </div>
          </div>
        </div>
      )}

      {/* Initial overlay hint */}
      {showOverlay && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none animate-fade-in">
          <div className="text-center space-y-3 animate-scale-in">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 backdrop-blur-xl border border-white/[0.1] flex items-center justify-center text-3xl shadow-2xl shadow-purple-500/20">
              ∿
            </div>
            <div className="text-white/60 text-sm font-medium">Click anywhere to begin</div>
            <div className="text-white/25 text-[10px]">Move your cursor to interact • Space to play</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Settings Panel ── */

function SettingsPanel() {
  const daw = useDAWStore();

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-3">
        <div className="text-[9px] text-white/30 uppercase tracking-wider font-medium">Master</div>
        <GlassSliderMini label="Master Volume" value={daw.masterVolume}
          onChange={(v) => daw.setMasterVolume(v)}
          format={(v) => `${(v * 100).toFixed(0)}%`} />
        <GlassSliderMini label="Zoom" value={daw.zoom} min={0.25} max={4} step={0.25}
          onChange={(v) => daw.setZoom(v)}
          format={(v) => `${v.toFixed(1)}×`} />
      </div>

      <div className="space-y-3">
        <div className="text-[9px] text-white/30 uppercase tracking-wider font-medium">Tracks</div>
        {daw.tracks.map((t) => (
          <div key={t.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
            <span className="text-[10px] text-white/50 flex-1">{t.name}</span>
            <button
              onClick={() => daw.toggleMute(t.id)}
              className={cn(
                "text-[8px] px-1.5 py-0.5 rounded font-medium transition-all",
                t.muted ? "bg-red-500/20 text-red-300" : "text-white/20 hover:text-white/40",
              )}
            >
              {t.muted ? "M" : "S"}
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="text-[9px] text-white/30 uppercase tracking-wider font-medium">Keyboard Shortcuts</div>
        <div className="space-y-1 text-[10px]">
          {[
            ["Space", "Play / Pause"],
            ["Esc", "Close panel"],
            ["Click", "Attract particles"],
            ["Click + drag", "Strong attraction"],
          ].map(([key, desc]) => (
            <div key={key} className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40 font-mono text-[9px]">{key}</kbd>
              <span className="text-white/25">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GlassSliderMini({
  label, value, min = 0, max = 1, step = 0.01, onChange, format,
}: {
  label: string; value: number; min?: number; max?: number; step?: number;
  onChange: (v: number) => void; format?: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[9px] text-white/25">{label}</span>
        <span className="text-[9px] text-white/40 font-mono">{format ? format(value) : value.toFixed(2)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-[3px] rounded-full appearance-none bg-white/[0.08] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/70 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-white/20 [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  );
}
