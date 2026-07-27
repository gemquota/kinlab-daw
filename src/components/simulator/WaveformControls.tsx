import { useWaveformStore } from "@/store/waveform.store";
import {
  WAVEFORM_PRESETS,
  type WaveformConfig,
} from "@/math/waveform/waveform.engine";
import { cn } from "@/lib/cn";
import {
  Play, Pause, RotateCcw, Plus, Trash2, Volume2, Waves,
  Zap, Settings2, ChevronDown, ChevronUp,
} from "lucide-react";
import { useState } from "react";

const WAVE_TYPES: WaveformConfig["waveformType"][] = [
  "sine", "square", "sawtooth", "triangle", "custom",
];

export function WaveformControls() {
  const store = useWaveformStore();
  const [expandedSection, setExpandedSection] = useState<string | null>("components");

  function toggle(section: string) {
    setExpandedSection((s) => (s === section ? null : section));
  }

  return (
    <div className="space-y-3 text-xs">
      {/* Playback */}
      <div className="flex items-center gap-2">
        <button
        aria-label="Play/pause"
          onClick={store.togglePlayback}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors",
            store.isPlaying
              ? "bg-derivative-jerk-500/20 text-derivative-jerk-500"
              : "bg-derivative-velocity-500/20 text-derivative-velocity-500",
          )}
        >
          {store.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {store.isPlaying ? "Pause" : "Play"}
        </button>
        <button
        aria-label="Play/pause"
          onClick={store.reset}
          className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Time controls */}
      <div className="space-y-2">
        <SliderRow
          label="Time"
          value={store.currentTime}
          min={0}
          max={store.timeRange}
          step={0.01}
          onChange={store.setCurrentTime}
          format={(v) => `${v.toFixed(2)}s`}
        />
        <SliderRow
          label="Speed"
          value={store.speed}
          min={0.1}
          max={5}
          step={0.1}
          onChange={store.setSpeed}
          format={(v) => `${v.toFixed(1)}×`}
        />
        <SliderRow
          label="Time Window"
          value={store.timeRange}
          min={0.5}
          max={20}
          step={0.5}
          onChange={store.setTimeRange}
          format={(v) => `${v.toFixed(1)}s`}
        />
      </div>

      {/* Waveform type */}
      <Section
        title="Waveform Type"
        icon={<Waves className="w-3.5 h-3.5" />}
        expanded={expandedSection === "waveform"}
        onToggle={() => toggle("waveform")}
      >
        <div className="flex flex-wrap gap-1.5">
          {WAVE_TYPES.map((wt) => (
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
      </Section>

      {/* Harmonics */}
      <Section
        title={`Harmonics (${store.config.components.filter((c) => c.enabled).length})`}
        icon={<Volume2 className="w-3.5 h-3.5" />}
        expanded={expandedSection === "components"}
        onToggle={() => toggle("components")}
      >
        <div className="space-y-2">
          {store.config.components.map((comp, idx) => (
            <div
              key={comp.id}
              className={cn(
                "p-2 rounded-lg border transition-colors",
                comp.enabled
                  ? "border-border-accent bg-surface-primary"
                  : "border-border-subtle bg-surface-secondary opacity-60",
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => store.updateComponent(comp.id, { enabled: !comp.enabled })}
                    className={cn(
                      "w-4 h-4 rounded-full border-2 transition-colors",
                      comp.enabled
                        ? "bg-derivative-velocity-500 border-derivative-velocity-500"
                        : "border-text-tertiary",
                    )}
                  />
                  <span className="font-medium text-text-primary">
                    H{idx + 1}
                  </span>
                  <span className="text-text-tertiary font-mono">
                    {comp.frequency.toFixed(1)} Hz
                  </span>
                </div>
                <button
                  onClick={() => store.removeComponent(comp.id)}
                  className="p-1 rounded text-text-tertiary hover:text-derivative-jerk-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <SliderRow
                  label="Freq"
                  value={comp.frequency}
                  min={0.1}
                  max={20}
                  step={0.1}
                  onChange={(v) => store.updateComponent(comp.id, { frequency: v })}
                  format={(v) => `${v.toFixed(1)}Hz`}
                  compact
                />
                <SliderRow
                  label="Amp"
                  value={comp.amplitude}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={(v) => store.updateComponent(comp.id, { amplitude: v })}
                  format={(v) => v.toFixed(2)}
                  compact
                />
                <SliderRow
                  label="Phase"
                  value={comp.phase}
                  min={0}
                  max={6.28}
                  step={0.01}
                  onChange={(v) => store.updateComponent(comp.id, { phase: v })}
                  format={(v) => `${(v * 180 / Math.PI).toFixed(0)}°`}
                  compact
                />
              </div>
            </div>
          ))}
          <button
            onClick={store.addComponent}
            className="flex items-center gap-1.5 w-full px-3 py-2 rounded-lg border border-dashed border-border-default text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Harmonic
          </button>
        </div>
      </Section>

      {/* Effects */}
      <Section
        title="Effects"
        icon={<Zap className="w-3.5 h-3.5" />}
        expanded={expandedSection === "effects"}
        onToggle={() => toggle("effects")}
      >
        <div className="space-y-2">
          <SliderRow
            label="Damping"
            value={store.config.damping}
            min={0}
            max={2}
            step={0.01}
            onChange={store.setDamping}
            format={(v) => v.toFixed(2)}
          />
          <SliderRow
            label="AM Freq"
            value={store.config.modulationFreq}
            min={0}
            max={5}
            step={0.01}
            onChange={store.setModulationFreq}
            format={(v) => `${v.toFixed(1)}Hz`}
          />
          <SliderRow
            label="AM Depth"
            value={store.config.modulationDepth}
            min={0}
            max={1}
            step={0.01}
            onChange={store.setModulationDepth}
            format={(v) => `${(v * 100).toFixed(0)}%`}
          />
          <SliderRow
            label="Time Stretch"
            value={store.config.timeStretch}
            min={0.1}
            max={5}
            step={0.05}
            onChange={store.setTimeStretch}
            format={(v) => `${v.toFixed(2)}×`}
          />
          <SliderRow
            label="Noise"
            value={store.config.noiseAmount}
            min={0}
            max={0.5}
            step={0.01}
            onChange={store.setNoiseAmount}
            format={(v) => `${(v * 100).toFixed(0)}%`}
          />
        </div>
      </Section>

      {/* Resonance */}
      <Section
        title="Resonance"
        icon={<Zap className="w-3.5 h-3.5 text-derivative-acceleration-500" />}
        expanded={expandedSection === "resonance"}
        onToggle={() => toggle("resonance")}
      >
        <div className="space-y-2">
          <SliderRow
            label="Center Freq"
            value={store.config.resonanceFreq}
            min={0.1}
            max={20}
            step={0.1}
            onChange={store.setResonanceFreq}
            format={(v) => `${v.toFixed(1)}Hz`}
          />
          <SliderRow
            label="Q Factor"
            value={store.config.resonanceWidth}
            min={0.1}
            max={10}
            step={0.1}
            onChange={store.setResonanceWidth}
            format={(v) => `${(store.config.resonanceFreq / (2 * v)).toFixed(1)}`}
          />
          <SliderRow
            label="Gain"
            value={store.config.resonanceGain}
            min={1}
            max={5}
            step={0.1}
            onChange={store.setResonanceGain}
            format={(v) => `${v.toFixed(1)}×`}
          />
        </div>
      </Section>

      {/* Display toggles */}
      <Section
        title="Display"
        icon={<Settings2 className="w-3.5 h-3.5" />}
        expanded={expandedSection === "display"}
        onToggle={() => toggle("display")}
      >
        <div className="space-y-2">
          <ToggleRow
            label="Show Derivatives"
            checked={store.showDerivatives}
            onChange={store.setShowDerivatives}
          />
          <ToggleRow
            label="Show Components"
            checked={store.showComponents}
            onChange={store.setShowComponents}
          />
        </div>
      </Section>

      {/* Presets */}
      <Section
        title="Presets"
        icon={<Waves className="w-3.5 h-3.5" />}
        expanded={expandedSection === "presets"}
        onToggle={() => toggle("presets")}
      >
        <div className="space-y-1.5">
          {WAVEFORM_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                store.setConfig(preset.config);
                store.setActivePreset(preset.name);
                store.setCurrentTime(0);
              }}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg transition-colors",
                store.activePreset === preset.name
                  ? "bg-derivative-position-500/15 text-derivative-position-500"
                  : "text-text-secondary hover:bg-surface-tertiary hover:text-text-primary",
              )}
            >
              <div className="font-medium text-[11px]">{preset.name}</div>
              <div className="text-text-tertiary text-[10px]">{preset.description}</div>
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ─── Helper components ─── */

function Section({
  title,
  icon,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border-subtle rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 bg-surface-secondary hover:bg-surface-tertiary transition-colors"
      >
        <div className="flex items-center gap-2 text-text-primary font-medium">
          {icon}
          {title}
        </div>
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-text-tertiary" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-text-tertiary" />
        )}
      </button>
      {expanded && <div className="p-2.5 space-y-2">{children}</div>}
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  compact,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "" : ""}>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-text-tertiary text-[10px]">{label}</span>
        <span className="text-text-secondary font-mono text-[10px]">{format(value)}</span>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 rounded-full appearance-none bg-surface-tertiary accent-derivative-position-500 cursor-pointer"
      />
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-text-secondary">{label}</span>
      <div
        className={cn(
          "w-8 h-4.5 rounded-full transition-colors relative",
          checked ? "bg-derivative-velocity-500" : "bg-surface-tertiary",
        )}
        onClick={() => onChange(!checked)}
      >
        <div
          className={cn(
            "absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5",
          )}
        />
      </div>
    </label>
  );
}
