import { useState } from "react";
import { useDAWStore } from "@/store/daw.store";
import { useWaveformStore } from "@/store/waveform.store";
import { getEffects, setEffects, type EffectsState } from "@/audio/audioEngine";
import { cn } from "@/lib/cn";

export function FloatingControls() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2 pointer-events-auto">
      {/* Transport — minimal floating pill */}
      <TransportPill />

      {/* Expandable control pods */}
      <div className="flex gap-2 flex-wrap justify-end">
        <ControlPod
          label="Synthesis"
          icon="◎"
          expanded={expanded === "synth"}
          onToggle={() => setExpanded(expanded === "synth" ? null : "synth")}
        >
          <SynthControls />
        </ControlPod>

        <ControlPod
          label="Effects"
          icon="✦"
          expanded={expanded === "fx"}
          onToggle={() => setExpanded(expanded === "fx" ? null : "fx")}
        >
          <EffectsControls />
        </ControlPod>

        <ControlPod
          label="Harmonics"
          icon="∿"
          expanded={expanded === "harm"}
          onToggle={() => setExpanded(expanded === "harm" ? null : "harm")}
        >
          <HarmonicControls />
        </ControlPod>
      </div>
    </div>
  );
}

/* ── Transport Pill ── */

function TransportPill() {
  const { playing, setPlaying, bpm, setBpm, currentTime, loopEnabled, setLoopEnabled } = useDAWStore();

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.06] shadow-2xl shadow-black/50">
      {/* Play/Stop */}
      <button
        onClick={() => setPlaying(!playing)}
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-300",
          playing
            ? "bg-white/15 text-white shadow-lg shadow-white/10"
            : "bg-white/[0.06] text-white/50 hover:bg-white/10 hover:text-white/80",
        )}
      >
        {playing ? "⏸" : "▶"}
      </button>

      {/* Time */}
      <div className="font-mono text-sm text-white/70 min-w-[5ch] text-right tabular-nums">
        {currentTime.toFixed(1)}
      </div>

      {/* BPM */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setBpm(bpm - 1)}
          className="w-6 h-6 rounded-lg bg-white/[0.04] text-white/30 hover:text-white/60 flex items-center justify-center text-xs"
        >−</button>
        <input
          type="number"
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value) || 120)}
          className="w-10 text-center bg-transparent text-white/80 font-mono text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={() => setBpm(bpm + 1)}
          className="w-6 h-6 rounded-lg bg-white/[0.04] text-white/30 hover:text-white/60 flex items-center justify-center text-xs"
        >+</button>
        <span className="text-[9px] text-white/20 font-mono">BPM</span>
      </div>

      {/* Loop toggle */}
      <button
        onClick={() => setLoopEnabled(!loopEnabled)}
        className={cn(
          "px-2 py-1 rounded-lg text-[10px] font-medium transition-all",
          loopEnabled
            ? "bg-white/10 text-white/70"
            : "text-white/20 hover:text-white/40",
        )}
      >
        ⟳ Loop
      </button>
    </div>
  );
}

/* ── Control Pod ── */

function ControlPod({
  label, icon, expanded, onToggle, children,
}: {
  label: string; icon: string; expanded: boolean;
  onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={cn(
          "px-3 py-2 rounded-xl text-[11px] font-medium transition-all duration-300 backdrop-blur-xl border",
          expanded
            ? "bg-white/10 text-white border-white/[0.1] shadow-lg shadow-black/30"
            : "bg-black/30 text-white/40 border-white/[0.04] hover:bg-white/[0.06] hover:text-white/60",
        )}
      >
        <span className="mr-1.5">{icon}</span>
        {label}
      </button>

      {expanded && (
        <div className="absolute bottom-full right-0 mb-2 w-64 p-3 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/50 space-y-2.5">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Synth Controls ── */

function SynthControls() {
  const daw = useDAWStore();
  const [trackIdx, setTrackIdx] = useState(0);
  const track = daw.tracks[trackIdx];

  return (
    <div className="space-y-2">
      <div className="text-[9px] text-white/30 uppercase tracking-wider font-medium">Track Controls</div>

      {/* Track selector */}
      <div className="flex gap-1">
        {daw.tracks.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setTrackIdx(i)}
            className={cn(
              "flex-1 py-1 rounded-md text-[9px] font-medium transition-all",
              i === trackIdx ? "bg-white/10 text-white" : "text-white/30 hover:text-white/50",
            )}
          >
            {t.name}
          </button>
        ))}
      </div>

      {track && (
        <>
          <GlassSlider
            label="Volume"
            value={track.volume}
            onChange={(v) => daw.updateTrack(track.id, { volume: v })}
          />
          <GlassSlider
            label="Frequency"
            value={track.frequency}
            min={20} max={2000} step={1}
            onChange={(v) => daw.updateTrack(track.id, { frequency: v })}
            format={(v) => `${v.toFixed(0)} Hz`}
          />
          <GlassSlider
            label="Pan"
            value={track.pan}
            min={-1} max={1} step={0.01}
            onChange={(v) => daw.updateTrack(track.id, { pan: v })}
            format={(v) => v === 0 ? "C" : v < 0 ? `L${Math.abs(v * 100).toFixed(0)}` : `R${(v * 100).toFixed(0)}`}
          />
          <GlassSlider
            label="Filter"
            value={track.filterFreq}
            min={100} max={20000} step={10}
            onChange={(v) => daw.updateTrack(track.id, { filterFreq: v })}
            format={(v) => `${v.toFixed(0)} Hz`}
          />
          <GlassSlider
            label="Resonance"
            value={track.filterQ}
            min={0.1} max={20} step={0.1}
            onChange={(v) => daw.updateTrack(track.id, { filterQ: v })}
          />

          {/* Waveform type */}
          <div className="flex gap-1">
            {(["sine", "square", "sawtooth", "triangle"] as const).map((wt) => (
              <button
                key={wt}
                onClick={() => daw.updateTrack(track.id, { waveformType: wt })}
                className={cn(
                  "flex-1 py-1 rounded-md text-[9px] font-medium transition-all capitalize",
                  track.waveformType === wt
                    ? "bg-white/15 text-white"
                    : "text-white/25 hover:text-white/50",
                )}
              >
                {wt[0]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Effects Controls ── */

function EffectsControls() {
  const [fx, setFx] = useState<EffectsState>(getEffects());

  function update(patch: Partial<EffectsState>) {
    setEffects(patch);
    setFx({ ...fx, ...patch });
  }

  return (
    <div className="space-y-2">
      <div className="text-[9px] text-white/30 uppercase tracking-wider font-medium">Effects</div>
      <GlassSlider label="Reverb" value={fx.reverbAmount} min={0} max={1} step={0.01}
        onChange={(v) => update({ reverbAmount: v })} format={(v) => `${(v * 100).toFixed(0)}%`} />
      <GlassSlider label="Delay Time" value={fx.delayTime} min={0.05} max={1} step={0.01}
        onChange={(v) => update({ delayTime: v })} format={(v) => `${(v * 1000).toFixed(0)}ms`} />
      <GlassSlider label="Feedback" value={fx.delayFeedback} min={0} max={0.9} step={0.01}
        onChange={(v) => update({ delayFeedback: v })} format={(v) => `${(v * 100).toFixed(0)}%`} />
      <GlassSlider label="Delay Mix" value={fx.delayMix} min={0} max={1} step={0.01}
        onChange={(v) => update({ delayMix: v })} format={(v) => `${(v * 100).toFixed(0)}%`} />
    </div>
  );
}

/* ── Harmonic Controls ── */

function HarmonicControls() {
  const wave = useWaveformStore();

  return (
    <div className="space-y-2">
      <div className="text-[9px] text-white/30 uppercase tracking-wider font-medium">Harmonics</div>
      {wave.config.components.filter((c) => c.enabled).map((comp, idx) => (
        <div key={comp.id} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50">H{idx + 1}</span>
            <span className="text-[9px] text-white/30 font-mono">{comp.frequency.toFixed(1)} Hz</span>
          </div>
          <GlassSlider
            label=""
            value={comp.amplitude}
            min={0} max={1} step={0.01}
            onChange={(v) => wave.updateComponent(comp.id, { amplitude: v })}
          />
        </div>
      ))}

      <div className="text-[9px] text-white/30 uppercase tracking-wider font-medium mt-3">Global</div>
      <GlassSlider label="Damping" value={wave.config.damping} min={0} max={1} step={0.01}
        onChange={(v) => wave.setDamping(v)} format={(v) => v.toFixed(2)} />
      <GlassSlider label="Resonance" value={wave.config.resonanceFreq} min={0.5} max={20} step={0.1}
        onChange={(v) => wave.setResonanceFreq(v)} format={(v) => `${v.toFixed(1)} Hz`} />
    </div>
  );
}

/* ── Glass Slider ── */

function GlassSlider({
  label, value, min = 0, max = 1, step = 0.01, onChange, format,
}: {
  label: string; value: number; min?: number; max?: number; step?: number;
  onChange: (v: number) => void; format?: (v: number) => string;
}) {
  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[9px] text-white/25">{label}</span>
          <span className="text-[9px] text-white/40 font-mono">{format ? format(value) : value.toFixed(2)}</span>
        </div>
      )}
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-[3px] rounded-full appearance-none bg-white/[0.08] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/70 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-white/20 [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  );
}
