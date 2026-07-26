/**
 * Procedural / mathematical / abstract generation algorithms.
 * Each returns arrays of {pitch, time, velocity, duration} events.
 * Pure functions — no audio or UI dependencies.
 */

import { SCALE_INTERVALS, CHROMATIC, type NoteName } from "./scales";

export interface GeneratedNote {
  pitch: number;     // MIDI note
  time: number;      // beats from start
  duration: number;  // beats
  velocity: number;  // 0..1
}

export interface GenerationParams {
  bpm: number;
  bars: number;
  rootNote: NoteName;
  octave: number;
  scaleType: string;
  density: number;   // 0..1, how many notes
  complexity: number; // 0..1
  seed: number;
}

/* ─── Seeded PRNG (xoshiro128**) ─── */

function xoshiro128(a: number, b: number, c: number, d: number) {
  return () => {
    const result = (b * 5) | 0;
    const t = b << 9;
    c ^= a; d ^= b; b ^= c; a ^= d; c ^= t;
    d = (d << 11) | (d >>> 21);
    return (result >>> 0) / 4294967296;
  };
}

function makeRng(seed: number) {
  let s = seed || 1;
  const next = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 4294967296; };
  return xoshiro128(next() * 0xffffffff, next() * 0xffffffff, next() * 0xffffffff, next() * 0xffffffff);
}

function seededArray(rng: () => number, len: number): number[] {
  return Array.from({ length: len }, () => rng());
}

/* ─── Helper: scale-degree to MIDI ─── */

function scaleMidi(root: NoteName, octave: number, scaleType: string, degree: number): number {
  const intervals = SCALE_INTERVALS[scaleType] ?? SCALE_INTERVALS["Major"]!;
  const rootMidi = CHROMATIC.indexOf(root) + (octave + 1) * 12;
  const octOffset = Math.floor(degree / intervals.length);
  const idx = ((degree % intervals.length) + intervals.length) % intervals.length;
  return rootMidi + intervals[idx]! + octOffset * 12;
}

function scaleLength(scaleType: string): number {
  return (SCALE_INTERVALS[scaleType] ?? SCALE_INTERVALS["Major"]!).length;
}

/* ════════════════════════════════════════════════════════════════════
   1. L-SYSTEM MELODY GENERATOR
   ════════════════════════════════════════════════════════════════════ */

const L_SYSTEMS: { name: string; axiom: string; rules: Record<string, string>; desc: string }[] = [
  {
    name: "Plant Growth",
    axiom: "X",
    rules: { X: "F+[[X]-X]-F[-FX]+X", F: "FF" },
    desc: "Fractal plant — branching melody with self-similarity",
  },
  {
    name: "Dragon Curve",
    axiom: "FX",
    rules: { X: "X+YF+", Y: "-FX-Y" },
    desc: "Dragon curve — spiraling recursive melody",
  },
  {
    name: "Hilbert Space",
    axiom: "A",
    rules: { A: "-BF+AFA+FB-", B: "+AF-BFB-FA+" },
    desc: "Hilbert space-filling curve — dense melodic path",
  },
  {
    name: "Koch Snowflake",
    axiom: "F--F--F",
    rules: { F: "F+F--F+F" },
    desc: "Koch fractal — triangular melodic contour",
  },
  {
    name: "Sierpinski Arrowhead",
    axiom: "A",
    rules: { A: "B-A-B", B: "A+B+A" },
    desc: "Sierpinski — triangulated melodic patterns",
  },
  {
    name: "Fibonacci Word",
    axiom: "A",
    rules: { A: "AB", B: "A" },
    desc: "Fibonacci word fractal — golden-ratio density",
  },
];

function expandLSystem(axiom: string, rules: Record<string, string>, iterations: number): string {
  let result = axiom;
  for (let i = 0; i < iterations; i++) {
    let next = "";
    for (const ch of result) {
      next += rules[ch] ?? ch;
    }
    result = next;
    if (result.length > 500) break; // cap to avoid explosion
  }
  return result;
}

function lStringToNotes(str: string, params: GenerationParams, rng: () => number): GeneratedNote[] {
  const notes: GeneratedNote[] = [];
  let time = 0;
  let degree = Math.floor(scaleLength(params.scaleType) / 2); // start middle
  const stepDur = 0.5;

  for (const ch of str) {
    switch (ch) {
      case "F":
      case "A":
      case "B": {
        const dur = stepDur * (0.5 + rng() * 0.5);
        if (rng() < params.density) {
          notes.push({
            pitch: scaleMidi(params.rootNote, params.octave, params.scaleType, degree),
            time,
            duration: dur,
            velocity: 0.5 + rng() * 0.4,
          });
        }
        time += stepDur;
        break;
      }
      case "+": degree = Math.min(degree + 1 + Math.floor(rng() * 3 * params.complexity), scaleLength(params.scaleType) * 3); break;
      case "-": degree = Math.max(degree - 1 - Math.floor(rng() * 3 * params.complexity), -scaleLength(params.scaleType)); break;
      case "[": break; // stack (simplified — no branching in linear output)
      case "]": break;
    }
  }

  // Trim to bar length
  const maxTime = params.bars * 4;
  return notes.filter((n) => n.time < maxTime);
}

export function generateLSystem(params: GenerationParams, systemIndex: number = 0): { name: string; desc: string; notes: GeneratedNote[] } {
  const system = L_SYSTEMS[systemIndex % L_SYSTEMS.length]!;
  const rng = makeRng(params.seed);
  const iterations = Math.min(4, Math.floor(2 + params.complexity * 4));
  const str = expandLSystem(system.axiom, system.rules, iterations);
  return { name: system.name, desc: system.desc, notes: lStringToNotes(str, params, rng) };
}

export const ALL_L_SYSTEMS = L_SYSTEMS;

/* ════════════════════════════════════════════════════════════════════
   2. CELLULAR AUTOMATA MELODY
   ════════════════════════════════════════════════════════════════════ */

export function generateCellularAutomata(params: GenerationParams, rule: number = 30): { name: string; desc: string; notes: GeneratedNote[] } {
  const rng = makeRng(params.seed);
  const width = 32;
  const maxTime = params.bars * 4;
  const notes: GeneratedNote[] = [];

  // Initial state: random with density
  let state = seededArray(rng, width).map((v) => (v < params.density ? 1 : 0));

  for (let row = 0; row < Math.ceil(maxTime / 0.5); row++) {
    const time = row * 0.5;

    for (let i = 0; i < width; i++) {
      if (state[i]) {
        const degree = Math.floor((i / width) * scaleLength(params.scaleType) * 2);
        notes.push({
          pitch: scaleMidi(params.rootNote, params.octave, params.scaleType, degree),
          time,
          duration: 0.4,
          velocity: 0.5 + rng() * 0.3,
        });
      }
    }

    // Next generation
    const next = new Array(width).fill(0);
    for (let i = 0; i < width; i++) {
      const left = state[(i - 1 + width) % width]!;
      const center = state[i]!;
      const right = state[(i + 1) % width]!;
      const pattern = (left << 2) | (center << 1) | right;
      next[i] = (rule >> pattern) & 1;
    }
    state = next;
  }

  return { name: `Rule ${rule} Cellular Automata`, desc: `Wolfram Rule ${rule} — emergent pattern melody`, notes };
}

/* ════════════════════════════════════════════════════════════════════
   3. CHAOS / STRANGE ATTRACTOR MODULATION
   ════════════════════════════════════════════════════════════════════ */

export function generateChaosAttractor(params: GenerationParams, attractor: "lorenz" | "rossler" | "halvorsen" = "lorenz"): { name: string; desc: string; notes: GeneratedNote[] } {
  const rng = makeRng(params.seed);
  const maxTime = params.bars * 4;
  const notes: GeneratedNote[] = [];

  // Attractor parameters
  const configs = {
    lorenz: { sigma: 10, rho: 28, beta: 8 / 3, dt: 0.005 },
    rossler: { a: 0.2, b: 0.2, c: 5.7, dt: 0.01 },
    halvorsen: { a: 1.89, dt: 0.005 },
  };
  const cfg = configs[attractor] as any;

  let x = rng() * 2 - 1;
  let y = rng() * 2 - 1;
  let z = rng() * 2 - 1;

  const scaleLen = scaleLength(params.scaleType);
  let lastNoteTime = -1;
  const noteSpacing = 0.25 + (1 - params.density) * 0.75;

  for (let t = 0; t < maxTime; t += cfg.dt * 4) {
    // Integrate
    for (let s = 0; s < 4; s++) {
      let dx: number, dy: number, dz: number;
      if (attractor === "lorenz") {
        dx = cfg.sigma * (y - x);
        dy = x * (cfg.rho - z) - y;
        dz = x * y - cfg.beta * z;
      } else if (attractor === "rossler") {
        dx = -y - z;
        dy = x + cfg.a * y;
        dz = cfg.b + z * (x - cfg.c);
      } else {
        dx = -cfg.a * x - 4 * y - 4 * z - y * y;
        dy = -cfg.a * y - 4 * z - 4 * x - z * z;
        dz = -cfg.a * z - 4 * x - 4 * y - x * x;
      }
      x += dx * cfg.dt;
      y += dy * cfg.dt;
      z += dz * cfg.dt;
    }

    if (t - lastNoteTime >= noteSpacing && rng() < params.density) {
      // Map attractor state to pitch
      const pitchNorm = ((Math.atan2(y, x) + Math.PI) / (2 * Math.PI)); // 0..1
      const degree = Math.floor(pitchNorm * scaleLen * 2);
      const velNorm = (Math.abs(z) % 1);
      notes.push({
        pitch: scaleMidi(params.rootNote, params.octave, params.scaleType, degree),
        time: t,
        duration: noteSpacing * 0.8,
        velocity: 0.3 + velNorm * 0.6,
      });
      lastNoteTime = t;
    }
  }

  return { name: `${attractor.charAt(0).toUpperCase() + attractor.slice(1)} Attractor`, desc: `Strange attractor — chaotic organic melody`, notes };
}

/* ════════════════════════════════════════════════════════════════════
   4. MARKOV CHAIN MELODY
   ════════════════════════════════════════════════════════════════════ */

export function generateMarkovChain(params: GenerationParams): { name: string; desc: string; notes: GeneratedNote[] } {
  const rng = makeRng(params.seed);
  const scaleLen = scaleLength(params.scaleType);
  const maxTime = params.bars * 4;
  const notes: GeneratedNote[] = [];

  // Transition matrix: [current_degree][next_degree] probability
  // Built from complexity parameter — higher = more random, lower = more scalar
  const matrix: number[][] = [];
  for (let i = 0; i < scaleLen; i++) {
    matrix[i] = [];
    for (let j = 0; j < scaleLen; j++) {
      const interval = Math.abs(j - i);
      // Prefer scalar motion (close intervals)
      matrix[i]![j] = Math.exp(-interval * (2 - params.complexity * 2)) + rng() * params.complexity * 0.5;
    }
    // Normalize
    const sum = matrix[i]!.reduce((a, b) => a + b, 0);
    for (let j = 0; j < scaleLen; j++) matrix[i]![j]! /= sum;
  }

  let currentDegree = Math.floor(rng() * scaleLen);
  let time = 0;

  while (time < maxTime) {
    // Sample next from transition matrix
    const probs = matrix[currentDegree]!;
    const r = rng();
    let cumul = 0;
    let nextDegree = 0;
    for (let j = 0; j < scaleLen; j++) {
      cumul += probs[j]!;
      if (r < cumul) { nextDegree = j; break; }
    }

    const dur = (0.25 + rng() * 0.75) * (1 / (1 + params.complexity));
    if (rng() < params.density) {
      notes.push({
        pitch: scaleMidi(params.rootNote, params.octave, params.scaleType, nextDegree),
        time,
        duration: dur,
        velocity: 0.5 + rng() * 0.4,
      });
    }

    currentDegree = nextDegree;
    time += dur;
  }

  return { name: "Markov Chain", desc: "Probabilistic chain — scalar motion with stochastic jumps", notes };
}

/* ════════════════════════════════════════════════════════════════════
   5. STOCHASTIC RANDOM WALK
   ════════════════════════════════════════════════════════════════════ */

export function generateRandomWalk(params: GenerationParams): { name: string; desc: string; notes: GeneratedNote[] } {
  const rng = makeRng(params.seed);
  const scaleLen = scaleLength(params.scaleType);
  const maxTime = params.bars * 4;
  const notes: GeneratedNote[] = [];

  let degree = Math.floor(scaleLen / 2);
  let time = 0;
  let velocity = 0.7;

  while (time < maxTime) {
    const step = Math.round((rng() - 0.5) * 2 * (1 + params.complexity * 3));
    degree = Math.max(-scaleLen, Math.min(scaleLen * 2, degree + step));

    velocity = Math.max(0.3, Math.min(1, velocity + (rng() - 0.5) * 0.2));

    if (rng() < params.density) {
      const dur = 0.25 + rng() * 0.5;
      notes.push({
        pitch: scaleMidi(params.rootNote, params.octave, params.scaleType, degree),
        time,
        duration: dur,
        velocity,
      });
      time += dur;
    } else {
      time += 0.25; // rest
    }
  }

  return { name: "Random Walk", desc: "Brownian motion melody — wandering pitch path", notes };
}

/* ════════════════════════════════════════════════════════════════════
   6. FRACTAL RECURSIVE PATTERNS
   ════════════════════════════════════════════════════════════════════ */

function fractalBranch(
  depth: number, time: number, degree: number, dir: number,
  params: GenerationParams, rng: () => number, notes: GeneratedNote[],
): number {
  if (depth <= 0 || time >= params.bars * 4) return time;

  const dur = 0.5 / (depth * 0.5);
  if (rng() < params.density) {
    notes.push({
      pitch: scaleMidi(params.rootNote, params.octave, params.scaleType, degree),
      time,
      duration: dur * 0.8,
      velocity: 0.4 + depth * 0.15,
    });
  }

  time += dur;

  // Branch
  const branchProb = 0.3 + params.complexity * 0.4;
  if (rng() < branchProb && depth > 1) {
    time = fractalBranch(depth - 1, time, degree + dir * 2, -dir, params, rng, notes);
  }
  time = fractalBranch(depth - 1, time, degree + dir, dir, params, rng, notes);

  return time;
}

export function generateFractal(params: GenerationParams): { name: string; desc: string; notes: GeneratedNote[] } {
  const rng = makeRng(params.seed);
  const maxDepth = Math.floor(2 + params.complexity * 4);
  const notes: GeneratedNote[] = [];
  fractalBranch(maxDepth, 0, 0, 1, params, rng, notes);
  return { name: "Fractal Recursive", desc: `Depth-${maxDepth} fractal — self-similar branching melody`, notes };
}

/* ════════════════════════════════════════════════════════════════════
   7. GOLDEN RATIO / PHI SPIRAL
   ════════════════════════════════════════════════════════════════════ */

export function generateGoldenSpiral(params: GenerationParams): { name: string; desc: string; notes: GeneratedNote[] } {
  const rng = makeRng(params.seed);
  const scaleLen = scaleLength(params.scaleType);
  const maxTime = params.bars * 4;
  const notes: GeneratedNote[] = [];
  const PHI = 1.618033988749895;

  let time = 0;
  let i = 0;

  while (time < maxTime) {
    const angle = (i * PHI * 2 * Math.PI) % (2 * Math.PI);
    const radius = Math.sqrt(i) * 0.3;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const degree = Math.floor(((x + 3) / 6) * scaleLen * 2);
    const vel = Math.max(0.3, Math.min(1, 0.5 + y * 0.2));

    if (rng() < params.density) {
      const dur = 0.25 + (1 / (1 + i * 0.1)) * 0.75;
      notes.push({
        pitch: scaleMidi(params.rootNote, params.octave, params.scaleType, degree),
        time,
        duration: dur,
        velocity: vel,
      });
      time += dur;
    } else {
      time += 0.25;
    }

    i++;
  }

  return { name: "Golden Spiral", desc: `φ-based spiral — pitch traces golden ratio geometry`, notes };
}

/* ════════════════════════════════════════════════════════════════════
   8. EUCLIDEAN RHYTHM + PITCH
   ════════════════════════════════════════════════════════════════════ */

/** Bjorklund's algorithm: distribute k pulses evenly in n steps */
function euclideanRhythm(k: number, n: number): boolean[] {
  if (k <= 0) return new Array(n).fill(false);
  if (k >= n) return new Array(n).fill(true);

  let groups: boolean[][] = [];
  for (let i = 0; i < k; i++) groups.push([true]);
  for (let i = 0; i < n - k; i++) groups.push([false]);

  let iter = 0;
  while (groups.length > 1) {
    const merged: boolean[][] = [];
    let i = 0;
    for (; i < Math.min(groups.length - 1, groups[groups.length - 1]!.length); i++) {
      merged.push([...groups[i]!, ...groups[groups.length - 1 - i]!]);
    }
    for (; i < groups.length - 1; i++) {
      merged.push(groups[i]!);
    }
    if (groups.length % 2 === 1) merged.push(groups[Math.floor(groups.length / 2)]!);
    groups = merged;
    if (++iter > 100) break;
  }

  return groups[0] ?? new Array(n).fill(false);
}

export function generateEuclidean(params: GenerationParams): { name: string; desc: string; notes: GeneratedNote[] } {
  const rng = makeRng(params.seed);
  const scaleLen = scaleLength(params.scaleType);
  const maxTime = params.bars * 4;

  const steps = 16;
  const hits = Math.max(1, Math.round(steps * params.density));
  const rhythm = euclideanRhythm(hits, steps);
  const notes: GeneratedNote[] = [];

  let degree = Math.floor(scaleLen / 2);
  const stepDur = (4 / steps); // one bar of 16th notes

  for (let t = 0; t < maxTime; t += stepDur) {
    const stepIdx = Math.floor(t / stepDur) % steps;
    if (rhythm[stepIdx]) {
      degree = Math.max(0, Math.min(scaleLen * 2, degree + Math.round((rng() - 0.5) * params.complexity * 4)));
      notes.push({
        pitch: scaleMidi(params.rootNote, params.octave, params.scaleType, degree),
        time: t,
        duration: stepDur * 0.7,
        velocity: 0.6 + rng() * 0.3,
      });
    }
  }

  return { name: "Euclidean Rhythm", desc: `E(${hits},${steps}) — evenly distributed pulses with scalar motion`, notes };
}

/* ════════════════════════════════════════════════════════════════════
   9. MARKOV + L-SYSTEM HYBRID
   ════════════════════════════════════════════════════════════════════ */

export function generateHybrid(params: GenerationParams): { name: string; desc: string; notes: GeneratedNote[] } {
  const rng = makeRng(params.seed);
  const scaleLen = scaleLength(params.scaleType);
  const maxTime = params.bars * 4;
  const notes: GeneratedNote[] = [];

  // Combine L-system structure with Markov pitch choices
  const systemIdx = Math.floor(rng() * L_SYSTEMS.length);
  const system = L_SYSTEMS[systemIdx]!;
  const iterations = Math.floor(2 + params.complexity * 2);
  const lStr = expandLSystem(system.axiom, system.rules, iterations);

  // Markov transition (2nd order)
  const trans: Record<string, number[]> = {};
  for (let i = 2; i < scaleLen * 2; i++) {
    const key = `${i - 2},${i - 1}`;
    if (!trans[key]) trans[key] = [];
    trans[key]!.push(i);
  }

  let time = 0;
  let degree = Math.floor(scaleLen / 2);
  let prevDeg = degree;

  for (const ch of lStr) {
    if (time >= maxTime) break;

    if (ch === "F" || ch === "A" || ch === "B") {
      // Markov-style pitch: prefer stepwise, occasional jumps
      const jump = Math.round((rng() - 0.5) * 2 * (1 + params.complexity * 4));
      degree = Math.max(0, Math.min(scaleLen * 2, prevDeg + jump));
      prevDeg = degree;

      if (rng() < params.density) {
        notes.push({
          pitch: scaleMidi(params.rootNote, params.octave, params.scaleType, degree),
          time,
          duration: 0.4 + rng() * 0.3,
          velocity: 0.5 + rng() * 0.4,
        });
      }
      time += 0.3 + rng() * 0.4;
    } else if (ch === "+") {
      degree = Math.min(degree + 1, scaleLen * 2);
    } else if (ch === "-") {
      degree = Math.max(degree - 1, 0);
    }
  }

  return { name: `Hybrid (${system.name})`, desc: `L-system structure + Markov pitch — organic complexity`, notes };
}

/* ─── All generators ─── */

export interface GeneratorInfo {
  id: string;
  name: string;
  desc: string;
  generate: (params: GenerationParams) => { name: string; desc: string; notes: GeneratedNote[] };
}

export const ALL_GENERATORS: GeneratorInfo[] = [
  { id: "l-system", name: "L-System", desc: "Fractal grammar → melody", generate: (p) => generateLSystem(p, 0) },
  { id: "cellular", name: "Cellular Automata", desc: "Wolfram rules → rhythm", generate: (p) => generateCellularAutomata(p, 30) },
  { id: "lorenz", name: "Lorenz Attractor", desc: "Chaos theory → organic melody", generate: (p) => generateChaosAttractor(p, "lorenz") },
  { id: "rossler", name: "Rössler Attractor", desc: "Spiral chaos → looping melody", generate: (p) => generateChaosAttractor(p, "rossler") },
  { id: "markov", name: "Markov Chain", desc: "Probabilistic transitions", generate: generateMarkovChain },
  { id: "randomWalk", name: "Random Walk", desc: "Brownian motion pitch", generate: generateRandomWalk },
  { id: "fractal", name: "Fractal Branch", desc: "Recursive branching melody", generate: generateFractal },
  { id: "golden", name: "Golden Spiral", desc: "φ-based pitch geometry", generate: generateGoldenSpiral },
  { id: "euclidean", name: "Euclidean", desc: "Bjorklund rhythm + scalar", generate: generateEuclidean },
  { id: "hybrid", name: "L-System + Markov", desc: "Hybrid fractal-probabilistic", generate: generateHybrid },
];
