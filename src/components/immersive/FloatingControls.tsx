import { useCallback } from "react";
import { useDAWStore, type SidePanel } from "@/store/daw.store";
import { resumeAudio } from "@/audio/audioEngine";
import { cn } from "@/lib/cn";
import type { DrumType } from "@/audio/drumSynth";

const DRUM_CHANNELS: { type: DrumType; label: string; color: string }[] = [

/**
 * Floating transport controls overlay.
 * Renders play/pause, BPM stepper, step indicators, and pattern selector.
 */
  { type: "kick", label: "KICK", color: "#3b82f6" },
  { type: "hat", label: "HAT", color: "#22c55e" },
  { type: "clap", label: "CLAP", color: "#f97316" },
  { type: "bass", label: "BASS", color: "#ef4444" },
  { type: "perc", label: "PERC", color: "#a855f7" },
  { type: "tom", label: "TOM", color: "#06b6d4" },
  { type: "crash", label: "CRASH", color: "#eab308" },
];

export function FloatingControls() {
  const sidePanel = useDAWStore((s) => s.sidePanel);

  return (
    <div className="flex flex-col items-center gap-3 pointer-events-auto">
      {/* Side panel content — above transport */}
      {sidePanel === "mixer" && <MixerPanel />}
      {sidePanel === "effects" && <EffectsPanel />}

      <TransportPill />
      <div className="flex gap-2">
        <PanelToggle id="mixer" label="MIX" />
        <PatternPill />
        <PanelToggle id="effects" label="FX" />
      </div>
    </div>
  );
}

/* ── Panel Toggle ── */
function PanelToggle({ id, label }: { id: SidePanel; label: string }) {
  const active = useDAWStore((s) => s.sidePanel);
  const setSidePanel = useDAWStore((s) => s.setSidePanel);

  return (
    <button
      onClick={() => setSidePanel(active === id ? null : id)}
      className={cn(
        "px-3 py-1 rounded-xl text-[10px] font-medium tracking-wider transition-all duration-300",
        active === id
          ? "bg-white/12 text-white/80 border border-white/[0.1]"
          : "bg-black/20 text-white/30 border border-white/[0.04] hover:text-white/50",
      )}
    >
      {label}
    </button>
  );
}

/* ── Mixer Panel ── */
function MixerPanel() {
  const drumVolumes = useDAWStore((s) => s.drumVolumes);
  const drumMutes = useDAWStore((s) => s.drumMutes);
  const setDrumVolume = useDAWStore((s) => s.setDrumVolume);
  const setDrumMute = useDAWStore((s) => s.setDrumMute);
  const masterVolume = useDAWStore((s) => s.masterVolume);
  const setMasterVolume = useDAWStore((s) => s.setMasterVolume);
  return (
    <div className="w-[380px] px-4 py-3 rounded-2xl bg-black/50 backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-black/60">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-white/40 font-medium tracking-widest uppercase">Mixer</span>
        <div className="flex items-center gap-2">
          <label className="text-[9px] text-white/25">MASTER</label>
          <input
            type="range" min={0} max={1} step={0.01} value={masterVolume}
            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
            className="w-14 h-[2px] rounded-full appearance-none bg-white/[0.1]"
          />
          <span className="text-[9px] text-white/40 font-mono w-7 text-right">{(masterVolume * 100).toFixed(0)}</span>
        </div>
      </div>

      {/* Drum channels */}
      <div className="flex gap-2">
        {DRUM_CHANNELS.map(({ type, label, color }) => {
          const vol = drumVolumes[type] ?? 1;
          const muted = drumMutes[type] ?? false;
          return (
            <div key={type} className="flex-1 flex flex-col items-center gap-1">
              {/* Mute button */}
              <button
                onClick={() => setDrumMute(type, !muted)}
                className={cn(
                  "w-full py-0.5 rounded text-[8px] font-bold tracking-wider transition-all",
                  muted
                    ? "bg-red-500/25 text-red-400"
                    : "bg-white/[0.04] text-white/30 hover:text-white/50",
                )}
              >
                {muted ? "M" : label}
              </button>

              {/* Vertical slider (represented as horizontal for small space) */}
              <div className="relative w-full">
                <input
                  type="range" min={0} max={1} step={0.01} value={muted ? 0 : vol}
                  onChange={(e) => setDrumVolume(type, parseFloat(e.target.value))}
                  className="w-full h-[2px] rounded-full appearance-none"
                  style={{
                    background: `linear-gradient(to right, ${color}${muted ? "33" : "aa"} 0%, ${color}${muted ? "33" : "aa"} ${(muted ? 0 : vol) * 100}%, rgba(255,255,255,0.06) ${(muted ? 0 : vol) * 100}%, rgba(255,255,255,0.06) 100%)`,
                  }}
                />
              </div>

              {/* Value */}
              <span className="text-[8px] font-mono text-white/25">{(muted ? 0 : vol * 100).toFixed(0)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Effects Panel ── */
function EffectsPanel() {
  const reverb = useDAWStore((s) => s.reverb);
  const delayMix = useDAWStore((s) => s.delayMix);
  const filterCutoff = useDAWStore((s) => s.filterCutoff);
  const setReverb = useDAWStore((s) => s.setReverb);
  const setDelayMix = useDAWStore((s) => s.setDelayMix);
  const setFilterCutoff = useDAWStore((s) => s.setFilterCutoff);

  return (
    <div className="w-[340px] px-4 py-3 rounded-2xl bg-black/50 backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-black/60">
      <span className="text-[10px] text-white/40 font-medium tracking-widest uppercase block mb-3">Effects</span>

      <div className="space-y-3">
        <FxSlider
          label="REVERB"
          value={reverb}
          onChange={setReverb}
          format={(v) => `${(v * 100).toFixed(0)}%`}
        />
        <FxSlider
          label="DELAY"
          value={delayMix}
          onChange={setDelayMix}
          format={(v) => `${(v * 100).toFixed(0)}%`}
        />
        <FxSlider
          label="FILTER"
          value={filterCutoff}
          min={50}
          max={20000}
          step={1}
          onChange={setFilterCutoff}
          format={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v.toFixed(0)}`}
        />
      </div>
    </div>
  );
}

function FxSlider({
  label, value, min = 0, max = 1, step = 0.01, onChange, format,
}: {
  label: string; value: number; min?: number; max?: number; step?: number;
  onChange: (v: number) => void; format?: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] text-white/30 font-medium tracking-wider">{label}</span>
        <span className="text-[9px] text-white/50 font-mono">{format ? format(value) : value.toFixed(2)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-[2px] rounded-full appearance-none bg-white/[0.08]"
      />
    </div>
  );
}

/* ── Transport ── */
function TransportPill() {
  const playing = useDAWStore((s) => s.playing);
  const setPlaying = useDAWStore((s) => s.setPlaying);
  const currentStep = useDAWStore((s) => s.currentStep);
  const bpm = useDAWStore((s) => s.bpm);
  const setBpm = useDAWStore((s) => s.setBpm);

  const handlePlayPause = useCallback(() => {
    resumeAudio();
    setPlaying(!playing);
  }, [playing, setPlaying]);

  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.06] shadow-2xl shadow-black/50">
      {/* Play/Stop */}
      <button
        onClick={handlePlayPause}
        className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all duration-300",
          playing
            ? "bg-white/15 text-white shadow-lg shadow-white/10"
            : "bg-white/[0.06] text-white/50 hover:bg-white/10 hover:text-white/80",
        )}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? "⏸" : "▶"}
      </button>

      {/* Step dots */}
      <div className="flex gap-[3px]">
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={i}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all duration-75",
              i === currentStep
                ? "bg-white scale-150"
                : playing ? "bg-white/20" : "bg-white/10",
            )}
          />
        ))}
      </div>

      {/* BPM */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setBpm(bpm - 1)}
          aria-label="Decrease BPM"
          className="w-6 h-6 rounded-lg bg-white/[0.04] text-white/30 hover:text-white/60 flex items-center justify-center text-xs"
        >−</button>
        <input
          type="number" value={bpm}
          aria-label="BPM value"
          onChange={(e) => setBpm(parseInt(e.target.value) || 135)}
          className="w-10 text-center bg-transparent text-white/80 font-mono text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={() => setBpm(bpm + 1)}
          aria-label="Increase BPM"
          className="w-6 h-6 rounded-lg bg-white/[0.04] text-white/30 hover:text-white/60 flex items-center justify-center text-xs"
        >+</button>
        <span className="text-[9px] text-white/20 font-mono">BPM</span>
      </div>
    </div>
  );
}

/* ── Pattern Selector ── */
function PatternPill() {
  const activePattern = useDAWStore((s) => s.activePattern);
  const cyclePattern = useDAWStore((s) => s.cyclePattern);

  return (
    <button
      onClick={cyclePattern}
      aria-label="Current pattern"
      className="px-4 py-1 rounded-xl bg-black/20 text-white/40 hover:text-white/70 hover:bg-white/[0.04] border border-white/[0.04] transition-all duration-300 text-[10px] font-medium tracking-wide"
    >
      {activePattern.name} <span className="text-white/15 ml-1">✦</span>
    </button>
  );
}
