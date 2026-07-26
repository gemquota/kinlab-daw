import { useDAWStore } from "@/store/daw.store";
import {
  Play, Pause, Square, Repeat, Circle, Minus, Plus,
  SkipBack, Metronome,
} from "lucide-react";
import { cn } from "@/lib/cn";

export function TransportBar() {
  const {
    playing, setPlaying, recording, setRecording,
    currentTime, setCurrentTime,
    bpm, setBpm,
    loopEnabled, setLoopEnabled,
    loopStart, loopEnd,
  } = useDAWStore();

  const beatsPerLoop = Math.round((loopEnd - loopStart) * (bpm / 60));
  const barLength = 60 / bpm * 4; // 4/4 time

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-surface-primary border-b border-border-subtle shrink-0">
      {/* Transport controls */}
      <div className="flex items-center gap-1">
        <TransportBtn
          onClick={() => setCurrentTime(loopStart)}
          title="Return to start"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </TransportBtn>

        <TransportBtn
          onClick={() => setPlaying(!playing)}
          active={playing}
          accent
          title={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </TransportBtn>

        <TransportBtn
          onClick={() => { setPlaying(false); setCurrentTime(loopStart); }}
          title="Stop"
        >
          <Square className="w-3.5 h-3.5" />
        </TransportBtn>

        <TransportBtn
          onClick={() => setRecording(!recording)}
          active={recording}
          danger={recording}
          title={recording ? "Stop recording" : "Record"}
        >
          <Circle className={cn("w-3.5 h-3.5", recording && "fill-current")} />
        </TransportBtn>

        <TransportBtn
          onClick={() => setLoopEnabled(!loopEnabled)}
          active={loopEnabled}
          title={loopEnabled ? "Disable loop" : "Enable loop"}
        >
          <Repeat className="w-3.5 h-3.5" />
        </TransportBtn>
      </div>

      {/* Time display */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border-subtle font-mono text-xs">
        <span className="text-text-tertiary">t</span>
        <span className="text-text-primary w-16 text-right">{currentTime.toFixed(2)}s</span>
      </div>

      {/* BPM */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-secondary border border-border-subtle">
        <Metronome className="w-3 h-3 text-text-tertiary" />
        <button
          onClick={() => setBpm(bpm - 5)}
          className="p-0.5 rounded hover:bg-surface-tertiary text-text-tertiary hover:text-text-primary"
        >
          <Minus className="w-3 h-3" />
        </button>
        <input
          type="number"
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value) || 120)}
          className="w-10 text-center bg-transparent text-text-primary font-mono text-xs focus:outline-none"
        />
        <button
          onClick={() => setBpm(bpm + 5)}
          className="p-0.5 rounded hover:bg-surface-tertiary text-text-tertiary hover:text-text-primary"
        >
          <Plus className="w-3 h-3" />
        </button>
        <span className="text-text-tertiary text-[10px]">BPM</span>
      </div>

      {/* Loop info */}
      {loopEnabled && (
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-text-tertiary">
          <Repeat className="w-3 h-3" />
          <span>{loopStart.toFixed(1)}–{loopEnd.toFixed(1)}s</span>
          <span className="text-text-secondary">{beatsPerLoop} beats</span>
        </div>
      )}

      <div className="flex-1" />

      {/* Quick info */}
      <div className="hidden md:flex items-center gap-3 text-[10px] text-text-tertiary">
        <span>Bar: {barLength.toFixed(2)}s</span>
        <span>Loop: {loopEnd - loopStart}s</span>
      </div>
    </div>
  );
}

function TransportBtn({
  children,
  onClick,
  active,
  accent,
  danger,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  accent?: boolean;
  danger?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "p-2 rounded-lg transition-colors",
        danger
          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
          : accent && active
            ? "bg-derivative-velocity-500/20 text-derivative-velocity-500"
            : active
              ? "bg-surface-tertiary text-text-primary"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary",
      )}
    >
      {children}
    </button>
  );
}
