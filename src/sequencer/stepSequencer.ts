/**
 * Step Sequencer engine.
 * Grid-based pattern programming with per-step pitch, velocity, gate, and skip.
 */

export interface Step {
  active: boolean;
  pitch: number;     // semitone offset from base (0=root, 12=octave up, etc.)
  velocity: number;  // 0..1
  gate: number;      // 0..1, fraction of step duration
  skip: boolean;     // skip this step
  slide: boolean;    // portamento to next note
}

export interface StepPattern {
  id: string;
  name: string;
  steps: Step[];
  length: number;    // 8, 16, 32, 64
  basePitch: number; // MIDI note number for root
  swing: number;     // 0..1
  humanize: number;  // 0..1
}

export interface SequencerState {
  patternId: string;
  position: number;  // current step (0-based)
  division: number;  // steps per beat (1=quarter, 2=eighth, 4=sixteenth)
  isPlaying: boolean;
}

const EMPTY_STEP: Step = {
  active: false,
  pitch: 0,
  velocity: 0.8,
  gate: 0.5,
  skip: false,
  slide: false,
};

/** Create a new empty step pattern */
export function createPattern(
  name: string,
  length: number = 16,
  basePitch: number = 60,
): StepPattern {
  return {
    id: `pat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    steps: Array.from({ length }, () => ({ ...EMPTY_STEP })),
    length,
    basePitch,
    swing: 0,
    humanize: 0,
  };
}

/** Toggle a step active/inactive */
export function toggleStep(pattern: StepPattern, index: number): StepPattern {
  const steps = [...pattern.steps];
  steps[index] = { ...steps[index]!, active: !steps[index]!.active };
  return { ...pattern, steps };
}

/** Set step pitch offset */
export function setStepPitch(pattern: StepPattern, index: number, pitch: number): StepPattern {
  const steps = [...pattern.steps];
  steps[index] = { ...steps[index]!, pitch };
  return { ...pattern, steps };
}

/** Set step velocity */
export function setStepVelocity(pattern: StepPattern, index: number, velocity: number): StepPattern {
  const steps = [...pattern.steps];
  steps[index] = { ...steps[index]!, velocity: Math.max(0, Math.min(1, velocity)) };
  return { ...pattern, steps };
}

/** Set step gate length */
export function setStepGate(pattern: StepPattern, index: number, gate: number): StepPattern {
  const steps = [...pattern.steps];
  steps[index] = { ...steps[index]!, gate: Math.max(0.1, Math.min(1, gate)) };
  return { ...pattern, steps };
}

/** Get MIDI note at a given step */
export function stepNoteAt(pattern: StepPattern, stepIndex: number): number | null {
  const step = pattern.steps[stepIndex];
  if (!step || !step.active || step.skip) return null;
  return pattern.basePitch + step.pitch;
}

/* ─── Preset patterns ─── */

export interface SequencerPreset {
  name: string;
  description: string;
  pattern: StepPattern;
}

function makePattern(
  name: string,
  desc: string,
  activeSteps: [number, number][],  // [stepIndex, pitchOffset][]
  length: number = 16,
  basePitch: number = 60,
): SequencerPreset {
  const pat = createPattern(name, length, basePitch);
  for (const [idx, pitch] of activeSteps) {
    if (idx < length) {
      pat.steps[idx] = { ...pat.steps[idx]!, active: true, pitch };
    }
  }
  return { name, description: desc, pattern: pat };
}

export const SEQUENCER_PRESETS: SequencerPreset[] = [
  makePattern("Techno Bass", "16th-note techno bassline",
    [[0,0],[4,0],[8,0],[10,-3],[12,0],[14,3]]),
  makePattern("House Beat", "Four-on-the-floor house pattern",
    [[0,0],[4,0],[8,0],[12,0]]),
  makePattern("Drum & Bass", "Fast breakbeat pattern",
    [[0,0],[2,5],[4,0],[6,3],[8,0],[10,7],[12,0],[14,5]]),
  makePattern("Minimal", "Sparse minimal pattern",
    [[0,0],[6,0],[10,7],[14,3]]),
  makePattern("Arp Up", "Ascending arpeggio across 2 octaves",
    Array.from({ length: 16 }, (_, i) => [i, (i % 4) * 3] as [number, number])),
  makePattern("Trance Gate", "Gated rhythmic pattern",
    [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,12],[9,12],[10,12],[11,12],[12,12],[13,12],[14,12],[15,12]]),
  makePattern("Dub Reggae", "Offbeat skank pattern",
    [[2,0],[6,0],[10,0],[14,0]]),
  makePattern("Swing Jazz", "Swung eighth notes",
    [[0,0],[1,4],[2,7],[3,4],[4,0],[5,4],[6,7],[7,4]], 16),
  makePattern("Waltz", "3/4 time waltz pattern",
    [[0,0],[4,7],[8,4]], 16),
  makePattern("Trap Hi-Hats", "Rolling trap hi-hat pattern",
    [[0,0],[2,0],[4,0],[5,0],[6,0],[8,0],[10,0],[12,0],[13,0],[14,0],[15,0]], 16),
  makePattern("Polyrhythm", "3 against 4 polyrhythm",
    [[0,0],[3,4],[6,7],[9,4],[12,0],[15,7]], 16),
  makePattern("Spiral", "Golden spiral pitch sequence",
    Array.from({ length: 16 }, (_, i) => {
      const pitch = Math.round(((i * 1.618) % 1) * 12);
      return [i, pitch] as [number, number];
    })),
];

/** Evaluate sequencer at a given time in seconds */
export function evaluateSequencer(
  pattern: StepPattern,
  time: number,
  bpm: number,
  division: number = 4,
): { note: number; velocity: number; gate: number; slide: boolean } | null {
  const beatDuration = 60 / bpm;
  const stepDuration = beatDuration / (division / 4);
  const stepIndex = Math.floor(time / stepDuration);
  const wrappedIndex = stepIndex % pattern.length;

  const step = pattern.steps[wrappedIndex];
  if (!step || !step.active || step.skip) return null;

  return {
    note: pattern.basePitch + step.pitch,
    velocity: step.velocity,
    gate: step.gate,
    slide: step.slide,
  };
}
