import { useDAWStore } from "@/store/daw.store";
import { cn } from "@/lib/cn";
import { Volume2, VolumeX, Headphones, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function Mixer() {
  const {
    tracks, activeTrackId, setActiveTrack,
    updateTrack, toggleMute, toggleSolo,
    masterVolume, setMasterVolume,
  } = useDAWStore();
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);


  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle bg-surface-secondary shrink-0">
        <span className="text-xs font-semibold text-text-primary">Mixer</span>
      </div>

      <div className="flex-1 overflow-auto p-2 space-y-2">
        {/* Master fader */}
        <div className="p-2.5 rounded-lg border border-border-subtle bg-surface-secondary">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-text-primary uppercase tracking-wider">Master</span>
            <span className="text-[10px] text-text-tertiary font-mono">{(masterVolume * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={masterVolume}
            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-surface-tertiary accent-derivative-position-500 cursor-pointer"
          />
          {/* Mini meter */}
          <div className="flex gap-px mt-2 h-3">
            {Array.from({ length: 20 }, (_, i) => {
              const level = masterVolume * 20;
              const active = i < level;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-sm transition-colors",
                    i < 14
                      ? active ? "bg-derivative-velocity-500" : "bg-surface-tertiary"
                      : active ? "bg-red-400" : "bg-surface-tertiary",
                  )}
                />
              );
            })}
          </div>
        </div>

        {/* Channel strips */}
        <div className="space-y-1">
          {tracks.map((track) => {
            const isExpanded = expandedTrack === track.id;
            return (
              <div
                key={track.id}
                className={cn(
                  "rounded-lg border transition-colors overflow-hidden",
                  track.id === activeTrackId
                    ? "border-border-accent bg-surface-secondary"
                    : "border-border-subtle bg-surface-primary hover:bg-surface-secondary",
                )}
              >
                {/* Channel header */}
                <div
                  className="flex items-center gap-2 px-2.5 py-2 cursor-pointer"
                  onClick={() => {
                    setActiveTrack(track.id);
                    setExpandedTrack(isExpanded ? null : track.id);
                  }}
                >
                  <div className="w-2 h-6 rounded-full shrink-0" style={{ backgroundColor: track.color }} />

                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium text-text-primary truncate">{track.name}</div>
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleMute(track.id); }}
                      className={cn(
                        "p-0.5 rounded transition-colors",
                        track.muted ? "text-red-400" : "text-text-tertiary hover:text-text-primary",
                      )}
                    >
                      {track.muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSolo(track.id); }}
                      className={cn(
                        "p-0.5 rounded transition-colors",
                        track.solo ? "text-yellow-400" : "text-text-tertiary hover:text-text-primary",
                      )}
                    >
                      <Headphones className="w-3 h-3" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-3 h-3 text-text-tertiary" /> : <ChevronDown className="w-3 h-3 text-text-tertiary" />}
                  </div>
                </div>

                {/* Expanded controls */}
                {isExpanded && (
                  <div className="px-2.5 pb-2.5 space-y-2 border-t border-border-subtle pt-2">
                    {/* Volume fader */}
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[9px] text-text-tertiary">Volume</span>
                        <span className="text-[9px] text-text-secondary font-mono">{(track.volume * 100).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={track.volume}
                        onChange={(e) => updateTrack(track.id, { volume: parseFloat(e.target.value) })}
                        className="w-full h-1 rounded-full appearance-none bg-surface-tertiary accent-derivative-position-500 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Pan */}
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[9px] text-text-tertiary">Pan</span>
                        <span className="text-[9px] text-text-secondary font-mono">
                          {track.pan === 0 ? "C" : track.pan < 0 ? `L${Math.abs(track.pan * 100).toFixed(0)}` : `R${(track.pan * 100).toFixed(0)}`}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-1}
                        max={1}
                        step={0.01}
                        value={track.pan}
                        onChange={(e) => updateTrack(track.id, { pan: parseFloat(e.target.value) })}
                        className="w-full h-1 rounded-full appearance-none bg-surface-tertiary accent-derivative-position-500 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Frequency */}
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[9px] text-text-tertiary">Freq</span>
                        <span className="text-[9px] text-text-secondary font-mono">{track.frequency.toFixed(0)} Hz</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={2000}
                        step={1}
                        value={track.frequency}
                        onChange={(e) => updateTrack(track.id, { frequency: parseFloat(e.target.value) })}
                        className="w-full h-1 rounded-full appearance-none bg-surface-tertiary accent-derivative-position-500 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Waveform type */}
                    <div>
                      <span className="text-[9px] text-text-tertiary block mb-1">Waveform</span>
                      <div className="flex gap-1">
                        {(["sine", "square", "sawtooth", "triangle"] as const).map((wt) => (
                          <button
                            key={wt}
                            onClick={(e) => { e.stopPropagation(); updateTrack(track.id, { waveformType: wt }); }}
                            className={cn(
                              "flex-1 py-1 rounded text-[9px] font-medium transition-colors capitalize",
                              track.waveformType === wt
                                ? "bg-derivative-position-500/20 text-derivative-position-500"
                                : "bg-surface-tertiary text-text-tertiary hover:text-text-primary",
                            )}
                          >
                            {wt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filter */}
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[9px] text-text-tertiary">Filter</span>
                        <span className="text-[9px] text-text-secondary font-mono">{track.filterFreq.toFixed(0)} Hz</span>
                      </div>
                      <input
                        type="range"
                        min={100}
                        max={20000}
                        step={10}
                        value={track.filterFreq}
                        onChange={(e) => updateTrack(track.id, { filterFreq: parseFloat(e.target.value) })}
                        className="w-full h-1 rounded-full appearance-none bg-surface-tertiary accent-derivative-position-500 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
