import { useState, useCallback, useRef, useEffect } from "react";
import { useDAWStore } from "@/store/daw.store";
import { resumeAudio } from "@/audio/audioEngine";
import { triggerDrum, type DrumType } from "@/audio/drumSynth";
import { cn } from "@/lib/cn";

interface PadConfig {
  type: DrumType;
  label: string;
  color: string;
  keyBinding?: string;
}

const PADS: PadConfig[] = [
  { type: "kick", label: "KICK", color: "#3b82f6", keyBinding: "Q" },
  { type: "hat", label: "HAT", color: "#22c55e", keyBinding: "W" },
  { type: "clap", label: "CLAP", color: "#f97316", keyBinding: "E" },
  { type: "bass", label: "BASS", color: "#ef4444", keyBinding: "A" },
  { type: "perc", label: "PERC", color: "#a855f7", keyBinding: "S" },
  { type: "tom", label: "TOM", color: "#06b6d4", keyBinding: "D" },
  { type: "crash", label: "CRASH", color: "#eab308", keyBinding: "Z" },
  { type: "hatOpen", label: "HAT+", color: "#10b981", keyBinding: "X" },
];

export function InstrumentGrid() {
  const [activePads, setActivePads] = useState<Set<DrumType>>(new Set());
  const drumVolumes = useDAWStore((s) => s.drumVolumes);
  const drumMutes = useDAWStore((s) => s.drumMutes);
  const setDrumVolume = useDAWStore((s) => s.setDrumVolume);
  const setDrumMute = useDAWStore((s) => s.setDrumMute);
  const padRefs = useRef<Map<DrumType, HTMLButtonElement>>(new Map());

  const handlePadDown = useCallback((type: DrumType) => {
    resumeAudio();
    triggerDrum(type);
    setActivePads((prev) => new Set(prev).add(type));
    
    // Visual feedback duration
    setTimeout(() => {
      setActivePads((prev) => {
        const next = new Set(prev);
        next.delete(type);
        return next;
      });
    }, 150);
  }, []);

  // Keyboard bindings
  useEffect(() => {
    const keyMap: Record<string, DrumType> = {};
    PADS.forEach((pad) => {
      if (pad.keyBinding) {
        keyMap[pad.keyBinding.toLowerCase()] = pad.type;
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const type = keyMap[e.key.toLowerCase()];
      if (type) {
        handlePadDown(type);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePadDown]);

  return (
    <div className="w-[380px] px-4 py-3 rounded-2xl bg-black/50 backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-black/60">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-white/40 font-medium tracking-widest uppercase">Instrument Pads</span>
        <span className="text-[9px] text-white/25 font-mono">Tap to trigger</span>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {PADS.map((pad) => {
          const isActive = activePads.has(pad.type);
          const isMuted = drumMutes[pad.type];
          const volume = drumVolumes[pad.type];
          
          return (
            <div key={pad.type} className="flex flex-col gap-1">
              <button
                ref={(el) => { if (el) padRefs.current.set(pad.type, el); }}
                onPointerDown={() => handlePadDown(pad.type)}
                tabIndex={0}
                className={cn(
                  "relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-75",
                  "border border-white/[0.08] shadow-lg",
                  isActive 
                    ? "scale-95 brightness-150" 
                    : "hover:bg-white/[0.05] active:scale-95",
                  isMuted && "opacity-40"
                )}
                style={{
                  backgroundColor: isActive 
                    ? pad.color 
                    : `${pad.color}20`,
                  boxShadow: isActive 
                    ? `0 0 20px ${pad.color}80, inset 0 0 10px ${pad.color}40`
                    : `0 0 10px ${pad.color}20`,
                }}
                aria-label={`Trigger ${pad.label}`}
              >
                <span className="text-[10px] font-bold text-white/90">{pad.label}</span>
                {pad.keyBinding && (
                  <span className="text-[8px] text-white/30 font-mono mt-0.5">{pad.keyBinding}</span>
                )}
              </button>
              
              {/* Volume/Mute controls */}
              <div className="flex items-center gap-1 px-0.5">
                <button
                  onClick={() => setDrumMute(pad.type, !isMuted)}
                  className={cn(
                    "w-3 h-3 rounded-full flex items-center justify-center text-[6px] transition-colors",
                    isMuted ? "bg-red-500/80 text-white" : "bg-white/10 text-white/30 hover:bg-white/20"
                  )}
                  aria-label={`Mute ${pad.label}`}
                >
                  M
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setDrumVolume(pad.type, parseFloat(e.target.value))}
                  className="flex-1 h-1 appearance-none bg-white/10 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/60"
                  aria-label={`${pad.label} volume`}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Keyboard hint */}
      <div className="mt-3 text-center">
        <span className="text-[8px] text-white/20 font-mono">
          Keys: Q W E A S D Z X
        </span>
      </div>
    </div>
  );
}
