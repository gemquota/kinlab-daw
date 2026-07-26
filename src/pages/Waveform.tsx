import { useWaveformStore } from "@/store/waveform.store";
import { useDAWStore } from "@/store/daw.store";
import { useAudioSync } from "@/hooks/useAudioSync";
import { WaveformCanvas } from "@/components/simulator/WaveformCanvas";
import { TransportBar } from "@/components/daw/TransportBar";
import { TrackLanes } from "@/components/daw/TrackLanes";
import { Mixer } from "@/components/daw/Mixer";
import { MasterMeter } from "@/components/daw/MasterMeter";
import { StepSequencerUI } from "@/components/daw/StepSequencerUI";
import { ArpeggioPanel } from "@/components/daw/ArpeggioPanel";
import { ProceduralPanel } from "@/components/daw/ProceduralPanel";
import { PresetBrowser } from "@/components/daw/PresetBrowser";
import { analyzeResonance } from "@/math/waveform/waveform.engine";
import { DERIVATIVES } from "@/data/derivatives.data";
import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  Layers, SlidersHorizontal, Grid3x3, Waves, Dices, Library,
} from "lucide-react";

type RightPanel = "mixer" | "seq" | "arp" | "proc" | "presets";

const RIGHT_TABS: { id: RightPanel; icon: React.ReactNode; label: string }[] = [
  { id: "mixer", icon: <SlidersHorizontal className="w-3 h-3" />, label: "Mixer" },
  { id: "seq", icon: <Grid3x3 className="w-3 h-3" />, label: "Seq" },
  { id: "arp", icon: <Waves className="w-3 h-3" />, label: "Arp" },
  { id: "proc", icon: <Dices className="w-3 h-3" />, label: "Procedural" },
  { id: "presets", icon: <Library className="w-3 h-3" />, label: "Presets" },
];

export function Waveform() {
  const waveStore = useWaveformStore();
  const dawStore = useDAWStore();
  const [showTracks, setShowTracks] = useState(true);
  const [rightPanel, setRightPanel] = useState<RightPanel>("mixer");

  useAudioSync();

  const resonance = analyzeResonance(waveStore.config);
  const enabledCount = waveStore.config.components.filter((c) => c.enabled).length;

  return (
    <div className="flex flex-col h-full">
      <TransportBar />

      <div className="flex flex-1 min-h-0">
        {/* Left: Canvas + Tracks */}
        <div className="flex flex-col flex-1 min-w-0">
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

            {/* Overlays */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 pointer-events-none">
              <LegendItem color="#3b82f6" label="Waveform" />
              {waveStore.showDerivatives && (
                <>
                  <LegendItem color="#22c55e" label="Velocity" dashed />
                  <LegendItem color="#f97316" label="Accel" dashed />
                  <LegendItem color="#ef4444" label="Jerk" dashed />
                  <LegendItem color="#a855f7" label="Snap" dashed />
                </>
              )}
            </div>

            <div className="absolute bottom-2 left-2 bg-surface-primary/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border-subtle">
              <div className="grid grid-cols-5 gap-x-3 gap-y-0.5 text-[10px] font-mono">
                {DERIVATIVES.slice(0, 5).map((d, i) => {
                  const val = i === 0
                    ? waveStore.config.components.filter((c) => c.enabled).reduce((sum, c) => {
                        const omega = 2 * Math.PI * c.frequency * waveStore.config.timeStretch;
                        return sum + c.amplitude * Math.sin(omega * dawStore.currentTime + c.phase) * Math.exp(-waveStore.config.damping * dawStore.currentTime);
                      }, 0) : 0;
                  return (
                    <div key={d.order} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: d.visualization.hexColor }} />
                      <span className="text-text-tertiary">{d.symbol}:</span>
                      <span className="text-text-primary">{val.toFixed(3)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="absolute top-2 right-2 bg-surface-primary/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border-subtle pointer-events-none">
              <div className="text-[10px] font-mono space-y-0.5">
                <div className="text-text-tertiary">Harmonics: <span className="text-text-primary">{enabledCount}</span></div>
                <div className="text-text-tertiary">Q: <span className="text-text-primary">{resonance.qFactor.toFixed(1)}</span></div>
                <div className="text-text-tertiary">Peak: <span className="text-text-primary">{resonance.peakAmplitude.toFixed(2)}</span></div>
                <div className="text-text-tertiary">BPM: <span className="text-text-primary">{dawStore.bpm}</span></div>
                {dawStore.sequencerActive && <div className="text-derivative-velocity-500">SEQ: ON</div>}
                {dawStore.arpActive && <div className="text-derivative-velocity-500">ARP: ON</div>}
              </div>
            </div>

            <div className="absolute bottom-2 right-2 w-48 h-10 pointer-events-none">
              <MasterMeter />
            </div>
          </div>

          {showTracks && (
            <div className="h-48 border-t border-border-subtle shrink-0">
              <TrackLanes />
            </div>
          )}
        </div>

        {/* Right panel with tabs */}
        <div className="flex flex-col border-l border-border-subtle bg-surface-secondary w-80">
          {/* Tab bar */}
          <div className="flex border-b border-border-subtle shrink-0">
            {RIGHT_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRightPanel(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1 py-2 text-[9px] font-medium transition-colors",
                  rightPanel === tab.id
                    ? "text-derivative-position-500 bg-surface-tertiary"
                    : "text-text-tertiary hover:text-text-primary",
                )}
                title={tab.label}
              >
                {tab.icon}
                <span className="hidden xl:inline">{tab.label}</span>
              </button>
            ))}
            <button
              onClick={() => setShowTracks(!showTracks)}
              className={cn(
                "px-2 py-2 text-[9px] font-medium transition-colors border-l border-border-subtle",
                showTracks ? "text-derivative-position-500 bg-surface-tertiary" : "text-text-tertiary hover:text-text-primary",
              )}
              title="Toggle track lanes"
            >
              <Layers className="w-3 h-3" />
            </button>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-hidden">
            {rightPanel === "mixer" && <Mixer />}
            {rightPanel === "seq" && <StepSequencerUI />}
            {rightPanel === "arp" && <ArpeggioPanel />}
            {rightPanel === "proc" && <ProceduralPanel />}
            {rightPanel === "presets" && <PresetBrowser />}
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-1 bg-surface-primary/60 backdrop-blur-sm rounded px-1.5 py-0.5">
      <div className={cn("w-3 h-0.5 rounded-full", dashed && "border-t border-dashed")}
        style={{ backgroundColor: dashed ? "transparent" : color, borderColor: dashed ? color : undefined }} />
      <span className="text-[9px] text-text-secondary">{label}</span>
    </div>
  );
}
