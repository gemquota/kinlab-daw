import { useWaveformStore } from "@/store/waveform.store";
import { useDAWStore } from "@/store/daw.store";
import { useAudioSync } from "@/hooks/useAudioSync";
import { WaveformCanvas } from "@/components/simulator/WaveformCanvas";
import { TransportBar } from "@/components/daw/TransportBar";
import { TrackLanes } from "@/components/daw/TrackLanes";
import { Mixer } from "@/components/daw/Mixer";
import { MasterMeter } from "@/components/daw/MasterMeter";
import { analyzeResonance } from "@/math/waveform/waveform.engine";
import { DERIVATIVES } from "@/data/derivatives.data";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Layers, SlidersHorizontal } from "lucide-react";

export function Waveform() {
  const waveStore = useWaveformStore();
  const dawStore = useDAWStore();
  const [showMixer, setShowMixer] = useState(true);
  const [showTracks, setShowTracks] = useState(true);

  // Sync audio engine
  useAudioSync();

  const resonance = analyzeResonance(waveStore.config);
  const enabledCount = waveStore.config.components.filter((c) => c.enabled).length;

  return (
    <div className="flex flex-col h-full">
      {/* Transport bar */}
      <TransportBar />

      {/* Main workspace */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Canvas + Track lanes */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Canvas area */}
          <div className="flex-1 min-h-0 relative">
            <WaveformCanvas
              config={waveStore.config}
              currentTime={dawStore.currentTime}
              timeRange={waveStore.timeRange}
              showDerivatives={waveStore.showDerivatives}
              showComponents={waveStore.showComponents}
              isPlaying={dawStore.playing}
              speed={1}
              onTimeUpdate={(t) => waveStore.setCurrentTime(t)}
            />

            {/* Legend overlay */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 pointer-events-none">
              <LegendItem color="#3b82f6" label="Waveform" />
              {waveStore.showDerivatives && (
                <>
                  <LegendItem color="#22c55e" label="Velocity" dashed />
                  <LegendItem color="#f97316" label="Acceleration" dashed />
                  <LegendItem color="#ef4444" label="Jerk" dashed />
                  <LegendItem color="#a855f7" label="Snap" dashed />
                </>
              )}
            </div>

            {/* Live values overlay */}
            <div className="absolute bottom-2 left-2 bg-surface-primary/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border-subtle">
              <div className="grid grid-cols-5 gap-x-3 gap-y-0.5 text-[10px] font-mono">
                {DERIVATIVES.slice(0, 5).map((d, i) => {
                  const val = i === 0
                    ? waveStore.config.components
                        .filter((c) => c.enabled)
                        .reduce((sum, c) => {
                          const omega = 2 * Math.PI * c.frequency * waveStore.config.timeStretch;
                          const phase = c.phase;
                          const raw = Math.sin(omega * dawStore.currentTime + phase);
                          const decay = Math.exp(-waveStore.config.damping * dawStore.currentTime);
                          return sum + c.amplitude * raw * decay;
                        }, 0)
                    : 0;
                  return (
                    <div key={d.order} className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: d.visualization.hexColor }}
                      />
                      <span className="text-text-tertiary">{d.symbol}:</span>
                      <span className="text-text-primary">{val.toFixed(3)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resonance info */}
            <div className="absolute top-2 right-2 bg-surface-primary/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border-subtle pointer-events-none">
              <div className="text-[10px] font-mono space-y-0.5">
                <div className="text-text-tertiary">Harmonics: <span className="text-text-primary">{enabledCount}</span></div>
                <div className="text-text-tertiary">Q: <span className="text-text-primary">{resonance.qFactor.toFixed(1)}</span></div>
                <div className="text-text-tertiary">Peak: <span className="text-text-primary">{resonance.peakAmplitude.toFixed(2)}</span></div>
                <div className="text-text-tertiary">BPM: <span className="text-text-primary">{dawStore.bpm}</span></div>
              </div>
            </div>

            {/* Master meter overlay */}
            <div className="absolute bottom-2 right-2 w-48 h-10 pointer-events-none">
              <MasterMeter />
            </div>
          </div>

          {/* Track lanes */}
          {showTracks && (
            <div className="h-48 border-t border-border-subtle shrink-0">
              <TrackLanes />
            </div>
          )}
        </div>

        {/* Right panel: Harmonic controls + Mixer */}
        <div className="flex flex-col border-l border-border-subtle bg-surface-secondary">
          {/* Toggle buttons */}
          <div className="flex border-b border-border-subtle">
            <button
              onClick={() => setShowTracks(!showTracks)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors",
                showTracks
                  ? "text-derivative-position-500 bg-surface-tertiary"
                  : "text-text-tertiary hover:text-text-primary",
              )}
              title="Toggle track lanes"
            >
              <Layers className="w-3 h-3" />
              Tracks
            </button>
            <button
              onClick={() => setShowMixer(!showMixer)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors",
                showMixer
                  ? "text-derivative-position-500 bg-surface-tertiary"
                  : "text-text-tertiary hover:text-text-primary",
              )}
              title="Toggle mixer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              Mixer
            </button>
          </div>

          {/* Mixer or Harmonic controls */}
          <div className="flex-1 overflow-auto">
            {showMixer ? <Mixer /> : <WaveformControlsInner />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Inline waveform controls (harmonic editor) ── */

function WaveformControlsInner() {
  const store = useWaveformStore();
  const [expandedSection, setExpandedSection] = useState<string | null>("components");

  function toggle(section: string) {
    setExpandedSection((s) => (s === section ? null : section));
  }

  return (
    <div className="p-2 space-y-2 text-xs overflow-auto">
      {/* Waveform type */}
      <div className="border border-border-subtle rounded-lg overflow-hidden">
        <button
          onClick={() => toggle("waveform")}
          className="w-full flex items-center justify-between px-3 py-2 bg-surface-secondary hover:bg-surface-tertiary transition-colors"
        >
          <span className="text-text-primary font-medium text-[11px]">Waveform Type</span>
          <span className="text-text-tertiary text-[10px]">{store.config.waveformType}</span>
        </button>
        {expandedSection === "waveform" && (
          <div className="p-2.5 flex flex-wrap gap-1.5">
            {(["sine", "square", "sawtooth", "triangle"] as const).map((wt) => (
              <button
                key={wt}
                onClick={() => store.setWaveformType(wt)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors capitalize",
                  store.config.waveformType === wt
                    ? "bg-derivative-position-500/20 text-derivative-position-500"
                    : "bg-surface-tertiary text-text-secondary hover:text-text-primary",
                )}
              >
                {wt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Harmonics */}
      <div className="border border-border-subtle rounded-lg overflow-hidden">
        <button
          onClick={() => toggle("components")}
          className="w-full flex items-center justify-between px-3 py-2 bg-surface-secondary hover:bg-surface-tertiary transition-colors"
        >
          <span className="text-text-primary font-medium text-[11px]">
            Harmonics ({store.config.components.filter((c) => c.enabled).length})
          </span>
        </button>
        {expandedSection === "components" && (
          <div className="p-2.5 space-y-2">
            {store.config.components.map((comp, idx) => (
              <div
                key={comp.id}
                className={cn(
                  "p-2 rounded-lg border",
                  comp.enabled
                    ? "border-border-accent bg-surface-primary"
                    : "border-border-subtle bg-surface-secondary opacity-60",
                )}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <button
                    onClick={() => store.updateComponent(comp.id, { enabled: !comp.enabled })}
                    className={cn(
                      "w-3.5 h-3.5 rounded-full border-2 transition-colors",
                      comp.enabled ? "bg-derivative-velocity-500 border-derivative-velocity-500" : "border-text-tertiary",
                    )}
                  />
                  <span className="font-medium text-text-primary text-[11px]">H{idx + 1}</span>
                  <span className="text-text-tertiary font-mono text-[10px]">{comp.frequency.toFixed(1)} Hz</span>
                </div>
                <MiniSlider label="Amp" value={comp.amplitude} min={0} max={1} step={0.01}
                  onChange={(v) => store.updateComponent(comp.id, { amplitude: v })} />
                <MiniSlider label="Phase" value={comp.phase} min={0} max={6.28} step={0.01}
                  onChange={(v) => store.updateComponent(comp.id, { phase: v })} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Global params */}
      <div className="border border-border-subtle rounded-lg overflow-hidden">
        <button
          onClick={() => toggle("global")}
          className="w-full flex items-center justify-between px-3 py-2 bg-surface-secondary hover:bg-surface-tertiary transition-colors"
        >
          <span className="text-text-primary font-medium text-[11px]">Global</span>
        </button>
        {expandedSection === "global" && (
          <div className="p-2.5 space-y-2">
            <MiniSlider label="Damping" value={store.config.damping} min={0} max={1} step={0.01}
              onChange={(v) => store.setDamping(v)} format={(v) => v.toFixed(2)} />
            <MiniSlider label="Resonance" value={store.config.resonanceFreq} min={0.5} max={20} step={0.1}
              onChange={(v) => store.setResonanceFreq(v)} format={(v) => `${v.toFixed(1)}Hz`} />
            <MiniSlider label="Q Factor" value={store.config.resonanceWidth} min={0.1} max={10} step={0.1}
              onChange={(v) => store.setResonanceWidth(v)} format={(v) => `${(store.config.resonanceFreq / (2 * v)).toFixed(1)}`} />
            <MiniSlider label="Time Stretch" value={store.config.timeStretch} min={0.1} max={10} step={0.1}
              onChange={(v) => store.setTimeStretch(v)} format={(v) => `${v.toFixed(1)}×`} />
          </div>
        )}
      </div>

      {/* Presets */}
      <div className="border border-border-subtle rounded-lg overflow-hidden">
        <button
          onClick={() => toggle("presets")}
          className="w-full flex items-center justify-between px-3 py-2 bg-surface-secondary hover:bg-surface-tertiary transition-colors"
        >
          <span className="text-text-primary font-medium text-[11px]">Presets</span>
        </button>
        {expandedSection === "presets" && (
          <div className="p-2.5 space-y-1.5">
            {(() => {
              // Import presets inline
              const presets = [
                { name: "Pure Sine", description: "Single harmonic", config: { ...store.config, components: store.config.components.map((c, i) => ({ ...c, enabled: i === 0, frequency: 1, amplitude: 1 })) } },
                { name: "Rich Harmonics", description: "Multiple overtones", config: { ...store.config, components: store.config.components.map((c, i) => ({ ...c, enabled: i < 4, frequency: i + 1, amplitude: 1 / (i + 1) })) } },
              ];
              return presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => store.setConfig(preset.config)}
                  className="w-full text-left px-3 py-2 rounded-lg text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors"
                >
                  <div className="font-medium text-[11px]">{preset.name}</div>
                  <div className="text-text-tertiary text-[10px]">{preset.description}</div>
                </button>
              ));
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

function MiniSlider({
  label, value, min, max, step, onChange, format,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format?: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-text-tertiary text-[9px]">{label}</span>
        <span className="text-text-secondary font-mono text-[9px]">
          {format ? format(value) : value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 rounded-full appearance-none bg-surface-tertiary accent-derivative-position-500 cursor-pointer"
      />
    </div>
  );
}

function LegendItem({
  color, label, dashed,
}: {
  color: string; label: string; dashed?: boolean;
}) {
  return (
    <div className="flex items-center gap-1 bg-surface-primary/60 backdrop-blur-sm rounded px-1.5 py-0.5">
      <div
        className={cn("w-3 h-0.5 rounded-full", dashed && "border-t border-dashed")}
        style={{ backgroundColor: dashed ? "transparent" : color, borderColor: dashed ? color : undefined }}
      />
      <span className="text-[9px] text-text-secondary">{label}</span>
    </div>
  );
}
