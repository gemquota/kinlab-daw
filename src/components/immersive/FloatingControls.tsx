import { useDAWStore } from "@/store/daw.store";
import { resumeAudio } from "@/audio/audioEngine";
import { cn } from "@/lib/cn";

export function FloatingControls() {
  return (
    <div className="flex flex-col items-center gap-3 pointer-events-auto">
      <TransportPill />
      <PatternPill />
    </div>
  );
}

/* ── Transport ── */
function TransportPill() {
  const { playing, setPlaying, bpm, setBpm, currentStep, masterVolume, setMasterVolume } = useDAWStore();

  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.06] shadow-2xl shadow-black/50">
      {/* Play/Stop */}
      <button
        onClick={() => { resumeAudio(); setPlaying(!playing); }}
        className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all duration-300",
          playing
            ? "bg-white/15 text-white shadow-lg shadow-white/10"
            : "bg-white/[0.06] text-white/50 hover:bg-white/10 hover:text-white/80",
        )}
      >
        {playing ? "⏸" : "▶"}
      </button>

      {/* Step indicator dots */}
      <div className="flex gap-[3px]">
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={i}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all duration-75",
              i === currentStep
                ? "bg-white scale-150"
                : playing
                  ? "bg-white/20"
                  : "bg-white/10",
            )}
          />
        ))}
      </div>

      {/* BPM */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setBpm(bpm - 1)}
          className="w-6 h-6 rounded-lg bg-white/[0.04] text-white/30 hover:text-white/60 flex items-center justify-center text-xs"
        >−</button>
        <input
          type="number"
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value) || 135)}
          className="w-10 text-center bg-transparent text-white/80 font-mono text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={() => setBpm(bpm + 1)}
          className="w-6 h-6 rounded-lg bg-white/[0.04] text-white/30 hover:text-white/60 flex items-center justify-center text-xs"
        >+</button>
        <span className="text-[9px] text-white/20 font-mono">BPM</span>
      </div>

      {/* Master volume */}
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] text-white/20">VOL</span>
        <input
          type="range" min={0} max={1} step={0.01} value={masterVolume}
          onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
          className="w-16 h-[3px] rounded-full appearance-none bg-white/[0.08] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/70 [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
    </div>
  );
}

/* ── Pattern Selector ── */
function PatternPill() {
  const { activePattern, cyclePattern } = useDAWStore();

  return (
    <button
      onClick={cyclePattern}
      className="px-4 py-1.5 rounded-xl bg-black/30 backdrop-blur-xl border border-white/[0.06] text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-all duration-300 text-[11px] font-medium tracking-wide"
    >
      {activePattern.name} <span className="text-white/20 ml-1">✦</span>
    </button>
  );
}
