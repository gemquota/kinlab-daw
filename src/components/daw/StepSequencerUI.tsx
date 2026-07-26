import { useDAWStore } from "@/store/daw.store";
import { toggleStep, setStepPitch } from "@/sequencer/stepSequencer";
import { SEQ_PRESETS } from "@/music/presets";
import { createPattern } from "@/sequencer/stepSequencer";
import { cn } from "@/lib/cn";

const PITCH_LABELS = ["12", "11", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1", "0", "-1", "-2", "-3"];

export function StepSequencerUI() {
  const { sequencerPattern, setSequencerPattern, sequencerActive, toggleSequencerActive, currentTime, bpm } = useDAWStore();

  const stepDuration = (60 / bpm) / (4 / 4);
  const totalSteps = sequencerPattern.length;
  const currentStep = Math.floor(currentTime / stepDuration) % totalSteps;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle bg-surface-secondary shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-primary">Step Sequencer</span>
          <span className="text-[10px] text-text-tertiary">{totalSteps} steps</span>
        </div>
        <button
          onClick={toggleSequencerActive}
          className={cn(
            "px-2 py-1 rounded-md text-[11px] font-medium transition-colors",
            sequencerActive
              ? "bg-derivative-velocity-500/20 text-derivative-velocity-500"
              : "bg-surface-tertiary text-text-secondary hover:text-text-primary",
          )}
        >
          {sequencerActive ? "Active" : "Inactive"}
        </button>
      </div>

      {/* Presets row */}
      <div className="flex gap-1 px-3 py-2 border-b border-border-subtle overflow-x-auto shrink-0">
        {SEQ_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => {
              const pat = createPattern(preset.name, 16, preset.basePitch);
              preset.steps.forEach(([idx, pitch]) => {
                if (idx < 16) pat.steps[idx] = { ...pat.steps[idx]!, active: true, pitch };
              });
              pat.swing = preset.swing;
              setSequencerPattern(pat);
            }}
            className="px-2 py-1 rounded text-[9px] font-medium bg-surface-tertiary text-text-secondary hover:text-text-primary hover:bg-surface-primary transition-colors whitespace-nowrap shrink-0"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto p-3">
        <div className="space-y-px">
          {/* Pitch labels */}
          {PITCH_LABELS.map((label, rowIdx) => {
            const pitchOffset = 12 - rowIdx;
            return (
              <div key={label} className="flex items-center gap-px">
                <span className="w-6 text-[8px] text-text-tertiary font-mono text-right pr-1 shrink-0">
                  {pitchOffset >= 0 ? `+${pitchOffset}` : pitchOffset}
                </span>
                {Array.from({ length: totalSteps }, (_, colIdx) => {
                  const step = sequencerPattern.steps[colIdx]!;
                  const isActive = step.active && step.pitch === pitchOffset;
                  const isPlaying = colIdx === currentStep;
                  const isBar = colIdx % 4 === 0;
                  return (
                    <button
                      key={colIdx}
                      onClick={() => {
                        if (isActive) {
                          setSequencerPattern(toggleStep(sequencerPattern, colIdx));
                        } else {
                          setSequencerPattern(setStepPitch(sequencerPattern, colIdx, pitchOffset));
                          if (!step.active) setSequencerPattern(toggleStep(sequencerPattern, colIdx));
                        }
                      }}
                      className={cn(
                        "w-5 h-4 rounded-sm transition-colors",
                        isActive && isPlaying && "ring-1 ring-white",
                        isActive && "bg-derivative-position-500",
                        !isActive && isPlaying && "bg-surface-tertiary",
                        !isActive && !isPlaying && isBar && "bg-surface-secondary",
                        !isActive && !isPlaying && !isBar && "bg-surface-primary hover:bg-surface-secondary",
                      )}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
