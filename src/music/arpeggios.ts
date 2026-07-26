/**
 * Arpeggio pattern engine.
 * Generates note sequences from chords/scales with various patterns.
 */

export type ArpPattern =
  | "up" | "down" | "upDown" | "downUp"
  | "random" | "randomWalk"
  | "converge" | "diverge"
  | "pingPong" | "staircase"
  | "fibonacci" | "goldenRatio"
  | "baroque" | "alberti";

export interface ArpConfig {
  pattern: ArpPattern;
  rate: number;        // notes per beat (1=quarter, 2=eighth, 4=sixteenth)
  octaves: number;     // spread across N octaves
  gate: number;        // 0..1, note length as fraction of step
  velocity: number;    // 0..1 base velocity
  swing: number;       // 0..1 swing amount
  humanize: number;    // 0..1 timing randomization
}

export interface ArpNote {
  time: number;     // beat position
  pitch: number;    // MIDI note
  duration: number; // beats
  velocity: number; // 0..1
}

const DEFAULT_ARP: ArpConfig = {
  pattern: "up",
  rate: 4,
  octaves: 2,
  gate: 0.5,
  velocity: 0.8,
  swing: 0,
  humanize: 0,
};

/** Generate an arpeggio pattern from a set of MIDI notes */
export function generateArpeggio(
  notes: number[],
  config: Partial<ArpConfig> = {},
  bars: number = 4,

): ArpNote[] {
  const cfg = { ...DEFAULT_ARP, ...config };
  const totalBeats = bars * 4; // 4/4 time
  const stepDuration = 1 / cfg.rate;
  const totalSteps = Math.ceil(totalBeats / stepDuration);

  // Expand notes across octaves
  const expanded: number[] = [];
  for (let oct = 0; oct < cfg.octaves; oct++) {
    for (const n of notes) {
      expanded.push(n + oct * 12);
    }
  }
  if (expanded.length === 0) return [];

  const sequence = patternSequence(cfg.pattern, expanded, totalSteps);
  const result: ArpNote[] = [];

  for (let i = 0; i < sequence.length; i++) {
    let time = i * stepDuration;

    // Swing: delay even steps
    if (cfg.swing > 0 && i % 2 === 1) {
      time += stepDuration * cfg.swing * 0.5;
    }

    // Humanize
    if (cfg.humanize > 0) {
      time += (Math.random() - 0.5) * stepDuration * cfg.humanize * 0.5;
    }

    const pitch = sequence[i]!;
    const velocity = cfg.velocity * (0.85 + Math.random() * 0.15);

    result.push({
      time: Math.max(0, time),
      pitch,
      duration: stepDuration * cfg.gate,
      velocity: Math.min(1, velocity),
    });
  }

  return result;
}

/** Generate pattern index sequence */
function patternSequence(
  pattern: ArpPattern,
  notes: number[],
  steps: number,
): number[] {
  const n = notes.length;
  const result: number[] = [];

  switch (pattern) {
    case "up":
      for (let i = 0; i < steps; i++) result.push(notes[i % n]!);
      break;

    case "down":
      for (let i = 0; i < steps; i++) result.push(notes[(n - 1 - (i % n) + n) % n]!);
      break;

    case "upDown": {
      let idx = 0;
      let dir = 1;
      for (let i = 0; i < steps; i++) {
        result.push(notes[idx]!);
        if (idx >= n - 1) dir = -1;
        if (idx <= 0) dir = 1;
        idx += dir;
      }
      break;
    }

    case "downUp": {
      let idx = n - 1;
      let dir = -1;
      for (let i = 0; i < steps; i++) {
        result.push(notes[idx]!);
        if (idx <= 0) dir = 1;
        if (idx >= n - 1) dir = -1;
        idx += dir;
      }
      break;
    }

    case "random":
      for (let i = 0; i < steps; i++) result.push(notes[Math.floor(Math.random() * n)]!);
      break;

    case "randomWalk": {
      let idx = 0;
      for (let i = 0; i < steps; i++) {
        result.push(notes[idx]!);
        idx = Math.max(0, Math.min(n - 1, idx + (Math.random() < 0.5 ? -1 : 1)));
      }
      break;
    }

    case "converge":
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const idx = Math.round(n / 2 + (n / 2 - 1) * Math.cos(Math.PI * t) * (i % 2 === 0 ? 1 : -1));
        result.push(notes[Math.max(0, Math.min(n - 1, idx))]!);
      }
      break;

    case "diverge":
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const idx = Math.round(n / 2 + (n / 2 - 1) * Math.sin(Math.PI * t) * (i % 2 === 0 ? -1 : 1));
        result.push(notes[Math.max(0, Math.min(n - 1, idx))]!);
      }
      break;

    case "pingPong": {
      const period = n * 2 - 2;
      for (let i = 0; i < steps; i++) {
        const pos = i % period;
        const idx = pos < n ? pos : period - pos;
        result.push(notes[idx]!);
      }
      break;
    }

    case "staircase":
      for (let i = 0; i < steps; i++) {
        const row = Math.floor(i / n);
        const idx = (i % n + row) % n;
        result.push(notes[idx]!);
      }
      break;

    case "fibonacci": {
      let a = 0, b = 1;
      for (let i = 0; i < steps; i++) {
        result.push(notes[a % n]!);
        [a, b] = [b, a + b];
      }
      break;
    }

    case "goldenRatio":
      for (let i = 0; i < steps; i++) {
        const idx = Math.floor(((i * 1.618033988749895) % 1) * n);
        result.push(notes[idx % n]!);
      }
      break;

    case "baroque": {
      // Common baroque figuration: root-third-fifth-third
      const pattern = [0, 2, Math.min(4, n - 1), 2];
      for (let i = 0; i < steps; i++) {
        result.push(notes[pattern[i % pattern.length]!]!);
      }
      break;
    }

    case "alberti": {
      // Alberti bass: lowest-highest-middle-highest
      const p = [0, Math.min(3, n - 1), Math.min(2, n - 1), Math.min(4, n - 1)];
      for (let i = 0; i < steps; i++) {
        result.push(notes[p[i % p.length]!]!);
      }
      break;
    }
  }

  return result;
}

export const ARP_PATTERNS: { id: ArpPattern; name: string; desc: string }[] = [
  { id: "up", name: "Up", desc: "Ascending through notes" },
  { id: "down", name: "Down", desc: "Descending through notes" },
  { id: "upDown", name: "Up-Down", desc: "Ascending then descending" },
  { id: "downUp", name: "Down-Up", desc: "Descending then ascending" },
  { id: "random", name: "Random", desc: "Random note selection" },
  { id: "randomWalk", name: "Random Walk", desc: "Random walk between adjacent notes" },
  { id: "converge", name: "Converge", desc: "Notes converge toward center" },
  { id: "diverge", name: "Diverge", desc: "Notes diverge from center" },
  { id: "pingPong", name: "Ping Pong", desc: "Bouncing back and forth" },
  { id: "staircase", name: "Staircase", desc: "Rotating staircase pattern" },
  { id: "fibonacci", name: "Fibonacci", desc: "Fibonacci sequence indexing" },
  { id: "goldenRatio", name: "Golden Ratio", desc: "Golden ratio spacing" },
  { id: "baroque", name: "Baroque", desc: "Root-third-fifth-third figuration" },
  { id: "alberti", name: "Alberti", desc: "Alberti bass pattern" },
];

export const DEFAULT_ARP_CONFIG = DEFAULT_ARP;
