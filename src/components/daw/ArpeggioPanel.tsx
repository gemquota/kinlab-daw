import { useState } from "react";
import { useDAWStore } from "@/store/daw.store";
import { ARP_PATTERNS } from "@/music/arpeggios";
import { ARP_PRESETS } from "@/music/presets";
import { cn } from "@/lib/cn";
import { Waves, Play, Pause } from "lucide-react";

export function ArpeggioPanel() {
  const { arpConfig, setArpConfig, arpNotes, setArpNotes, arpActive, toggleArpActive } = useDAWStore();
  const [showPresets, setShowPresets] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle bg-surface-secondary shrink-0">
        <div className="flex items-center gap-2">
          <Waves className="w-3.5 h-3.5 text-text-tertiary" />
          <span className="text-xs font-semibold text-text-primary">Arpeggiator</span>
        </div>
        <button
          onClick={toggleArpActive}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors",
            arpActive
              ? "bg-derivative-velocity-500/20 text-derivative-velocity-500"
              : "bg-surface-tertiary text-text-secondary hover:text-text-primary",
          )}
        >
          {arpActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {arpActive ? "Active" : "Inactive"}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-3">
        {/* Pattern selector */}
        <div>
          <label className="text-[9px] text-text-tertiary uppercase tracking-wider block mb-1.5">Pattern</label>
          <div className="grid grid-cols-2 gap-1 max-h-40 overflow-auto">
            {ARP_PATTERNS.map((p) => (
              <button
                key={p.id}
                onClick={() => setArpConfig({ pattern: p.id })}
                className={cn(
                  "text-left px-2 py-1.5 rounded-md text-[10px] transition-colors",
                  arpConfig.pattern === p.id
                    ? "bg-derivative-position-500/15 text-derivative-position-500"
                    : "bg-surface-tertiary text-text-secondary hover:text-text-primary",
                )}
              >
                <div className="font-medium">{p.name}</div>
                <div className="text-[8px] text-text-tertiary">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Parameters */}
        <div className="space-y-2">
          <ArpSlider label="Rate" value={arpConfig.rate} min={0.5} max={8} step={0.5}
            onChange={(v) => setArpConfig({ rate: v })} format={(v) => `${v}n`} />
          <ArpSlider label="Octaves" value={arpConfig.octaves} min={1} max={4} step={1}
            onChange={(v) => setArpConfig({ octaves: v })} format={(v) => `${v}`} />
          <ArpSlider label="Gate" value={arpConfig.gate} min={0.1} max={1} step={0.05}
            onChange={(v) => setArpConfig({ gate: v })} format={(v) => `${(v * 100).toFixed(0)}%`} />
          <ArpSlider label="Velocity" value={arpConfig.velocity} min={0.1} max={1} step={0.05}
            onChange={(v) => setArpConfig({ velocity: v })} format={(v) => `${(v * 100).toFixed(0)}%`} />
          <ArpSlider label="Swing" value={arpConfig.swing} min={0} max={0.8} step={0.05}
            onChange={(v) => setArpConfig({ swing: v })} format={(v) => `${(v * 100).toFixed(0)}%`} />
          <ArpSlider label="Humanize" value={arpConfig.humanize} min={0} max={0.5} step={0.05}
            onChange={(v) => setArpConfig({ humanize: v })} format={(v) => `${(v * 100).toFixed(0)}%`} />
        </div>

        {/* Input notes */}
        <div>
          <label className="text-[9px] text-text-tertiary uppercase tracking-wider block mb-1.5">
            Input Notes ({arpNotes.length})
          </label>
          <div className="flex flex-wrap gap-1">
            {arpNotes.map((n, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded bg-surface-tertiary text-[9px] font-mono text-text-secondary">
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* Presets */}
        <div>
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="text-[9px] text-text-tertiary hover:text-text-primary transition-colors"
          >
            {showPresets ? "Hide" : "Show"} Arp Presets
          </button>
          {showPresets && (
            <div className="mt-1.5 space-y-1 max-h-48 overflow-auto">
              {ARP_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setArpConfig(p.config);
                    setArpNotes(p.notes);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-md bg-surface-primary hover:bg-surface-secondary border border-border-subtle transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-text-primary">{p.name}</span>
                    <span className="text-[8px] text-text-tertiary">{p.category}</span>
                  </div>
                  <div className="text-[8px] text-text-tertiary">{p.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ArpSlider({ label, value, min, max, step, onChange, format }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[9px] text-text-tertiary">{label}</span>
        <span className="text-[9px] text-text-secondary font-mono">{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 rounded-full appearance-none bg-surface-tertiary accent-derivative-position-500 cursor-pointer"
      />
    </div>
  );
}
