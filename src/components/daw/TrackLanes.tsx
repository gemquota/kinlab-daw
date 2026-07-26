import { useDAWStore, type DAWTrack } from "@/store/daw.store";
import { cn } from "@/lib/cn";
import { Volume2, VolumeX, Headphones, Trash2, Plus, GripVertical } from "lucide-react";

export function TrackLanes() {
  const { tracks, activeTrackId, setActiveTrack, addTrack, removeTrack, toggleMute, toggleSolo, currentTime, loopStart, loopEnd, zoom } = useDAWStore();

  const totalDuration = Math.max(loopEnd + 2, 10);
  const pxPerSecond = 60 * zoom;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle bg-surface-secondary shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-primary">Tracks</span>
          <span className="text-[10px] text-text-tertiary">{tracks.length}</span>
        </div>
        <button
          onClick={() => addTrack()}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add Track
        </button>
      </div>

      {/* Track list + timeline */}
      <div className="flex-1 overflow-auto">
        {/* Timeline ruler */}
        <div className="sticky top-0 z-10 flex border-b border-border-subtle bg-surface-secondary">
          {/* Track header spacer */}
          <div className="w-44 shrink-0 border-r border-border-subtle bg-surface-secondary" />

          {/* Timeline */}
          <div className="flex-1 relative h-6 overflow-hidden">
            <svg width={totalDuration * pxPerSecond} height={24} className="block">
              {/* Time markers */}
              {Array.from({ length: Math.ceil(totalDuration) + 1 }, (_, i) => {
                const x = i * pxPerSecond;
                const isBar = i % 4 === 0;
                return (
                  <g key={i}>
                    <line
                      x1={x} y1={isBar ? 4 : 12}
                      x2={x} y2={24}
                      stroke="rgba(148,163,184,0.2)"
                      strokeWidth={isBar ? 1.5 : 0.5}
                    />
                    {isBar && (
                      <text x={x + 2} y={10} fill="rgba(148,163,184,0.5)" fontSize={9} fontFamily="monospace">
                        {(i / 4).toString()}
                      </text>
                    )}
                  </g>
                );
              })}
              {/* Loop region */}
              <rect
                x={loopStart * pxPerSecond}
                y={0}
                width={(loopEnd - loopStart) * pxPerSecond}
                height={24}
                fill="rgba(59,130,246,0.08)"
                stroke="rgba(59,130,246,0.2)"
                strokeWidth={1}
              />
            </svg>
          </div>
        </div>

        {/* Track rows */}
        {tracks.map((track) => (
          <TrackRow
            key={track.id}
            track={track}
            isActive={track.id === activeTrackId}
            onSelect={() => setActiveTrack(track.id)}
            onToggleMute={() => toggleMute(track.id)}
            onToggleSolo={() => toggleSolo(track.id)}
            onRemove={() => removeTrack(track.id)}
            currentTime={currentTime}
            pxPerSecond={pxPerSecond}
            totalDuration={totalDuration}
            loopStart={loopStart}
            loopEnd={loopEnd}
          />
        ))}
      </div>
    </div>
  );
}

function TrackRow({
  track,
  isActive,
  onSelect,
  onToggleMute,
  onToggleSolo,
  onRemove,
  currentTime,
  pxPerSecond,
  totalDuration,
  loopStart,
  loopEnd,
}: {
  track: DAWTrack;
  isActive: boolean;
  onSelect: () => void;
  onToggleMute: () => void;
  onToggleSolo: () => void;
  onRemove: () => void;
  currentTime: number;
  pxPerSecond: number;
  totalDuration: number;
  loopStart: number;
  loopEnd: number;
}) {
  return (
    <div
      className={cn(
        "flex border-b border-border-subtle transition-colors cursor-pointer",
        isActive
          ? "bg-surface-tertiary"
          : "bg-surface-primary hover:bg-surface-secondary",
      )}
      onClick={onSelect}
    >
      {/* Track header */}
      <div className="w-44 shrink-0 border-r border-border-subtle p-2 flex items-center gap-2">
        <GripVertical className="w-3 h-3 text-text-tertiary shrink-0" />

        <div
          className="w-2.5 h-8 rounded-full shrink-0"
          style={{ backgroundColor: track.color }}
        />

        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-medium text-text-primary truncate">{track.name}</div>
          <div className="text-[9px] text-text-tertiary font-mono">
            {track.frequency.toFixed(0)}Hz · {track.waveformType}
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleMute(); }}
            className={cn(
              "p-1 rounded transition-colors",
              track.muted
                ? "bg-red-500/20 text-red-400"
                : "text-text-tertiary hover:text-text-primary",
            )}
            title={track.muted ? "Unmute" : "Mute"}
          >
            {track.muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSolo(); }}
            className={cn(
              "p-1 rounded transition-colors",
              track.solo
                ? "bg-yellow-500/20 text-yellow-400"
                : "text-text-tertiary hover:text-text-primary",
            )}
            title={track.solo ? "Unsolo" : "Solo"}
          >
            <Headphones className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1 rounded text-text-tertiary hover:text-red-400 transition-colors"
            title="Remove track"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Track lane */}
      <div className="flex-1 relative h-10 overflow-hidden">
        {/* Loop region */}
        <div
          className="absolute top-0 bottom-0"
          style={{
            left: loopStart * pxPerSecond,
            width: (loopEnd - loopStart) * pxPerSecond,
            backgroundColor: track.color + "08",
            borderLeft: `1px solid ${track.color}30`,
            borderRight: `1px solid ${track.color}30`,
          }}
        />

        {/* Waveform preview — draw a mini sine wave */}
        <svg
          width={totalDuration * pxPerSecond}
          height={40}
          className="absolute inset-0"
        >
          <path
            d={generateMiniWaveform(track, totalDuration, pxPerSecond)}
            fill="none"
            stroke={track.color}
            strokeWidth={1.5}
            opacity={track.muted ? 0.2 : 0.6}
          />
        </svg>

        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-px bg-white/60"
          style={{ left: currentTime * pxPerSecond }}
        />
      </div>
    </div>
  );
}

function generateMiniWaveform(track: DAWTrack, duration: number, pxPerSec: number): string {
  const w = duration * pxPerSec;
  const h = 40;
  const mid = h / 2;
  const freq = track.frequency * 0.02; // scaled down for visual
  const amp = track.amplitude * (h / 2 - 4);
  const points: string[] = [];

  for (let x = 0; x < w; x += 2) {
    const t = x / pxPerSec;
    const y = mid - amp * Math.sin(2 * Math.PI * freq * t);
    points.push(`${x === 0 ? "M" : "L"}${x},${y.toFixed(1)}`);
  }
  return points.join(" ");
}
