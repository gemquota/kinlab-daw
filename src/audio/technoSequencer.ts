import type { DrumType } from "@/audio/drumSynth";

export interface DrumHit {
  type: DrumType;
  step: number;
  vel?: number;
}

export interface PatternDef {
  name: string;
  bpm: number;
  hits: DrumHit[];
}

/* ── FILTHY TECHNO — default demo ── */
export const FILTHY_TECHNO: PatternDef = {
  name: "FILTH",
  bpm: 138,
  hits: [
    // Four-on-the-floor kick
    { type: "kick", step: 0 },
    { type: "kick", step: 4 },
    { type: "kick", step: 8 },
    { type: "kick", step: 12 },
    // Offbeat clap
    { type: "clap", step: 4, vel: 0.7 },
    { type: "clap", step: 12, vel: 0.85 },
    // Driving hi-hats — 16ths with accents
    { type: "hat", step: 0, vel: 0.35 },
    { type: "hat", step: 1, vel: 0.2 },
    { type: "hat", step: 2, vel: 0.55 },
    { type: "hat", step: 3, vel: 0.2 },
    { type: "hat", step: 4, vel: 0.15 },
    { type: "hat", step: 5, vel: 0.2 },
    { type: "hat", step: 6, vel: 0.55 },
    { type: "hat", step: 7, vel: 0.2 },
    { type: "hat", step: 8, vel: 0.35 },
    { type: "hat", step: 9, vel: 0.2 },
    { type: "hat", step: 10, vel: 0.55 },
    { type: "hat", step: 11, vel: 0.2 },
    { type: "hat", step: 12, vel: 0.15 },
    { type: "hat", step: 13, vel: 0.2 },
    { type: "hat", step: 14, vel: 0.55 },
    { type: "hat", step: 15, vel: 0.2 },
    // Open hats on offbeats
    { type: "hatOpen", step: 3, vel: 0.15 },
    { type: "hatOpen", step: 11, vel: 0.12 },
    // Rumbling bass — sparse, deep
    { type: "bass", step: 0, vel: 0.9 },
    { type: "bass", step: 3, vel: 0.4 },
    { type: "bass", step: 6, vel: 0.65 },
    { type: "bass", step: 8, vel: 0.75 },
    { type: "bass", step: 10, vel: 0.5 },
    { type: "bass", step: 11, vel: 0.35 },
    { type: "bass", step: 14, vel: 0.55 },
    // Metallic perc accents
    { type: "perc", step: 3, vel: 0.3 },
    { type: "perc", step: 7, vel: 0.25 },
    { type: "perc", step: 11, vel: 0.3 },
    { type: "perc", step: 15, vel: 0.2 },
    // Tom fills
    { type: "tom", step: 13, vel: 0.35 },
    { type: "tom", step: 14, vel: 0.25 },
  ],
};

/* ── MINIMAL — stripped-back warehouse ── */
export const MINIMAL_TECHNO: PatternDef = {
  name: "MINIMAL",
  bpm: 128,
  hits: [
    { type: "kick", step: 0 },
    { type: "kick", step: 8 },
    { type: "hat", step: 6 },
    { type: "hat", step: 14 },
    { type: "hat", step: 2, vel: 0.2 },
    { type: "hat", step: 10, vel: 0.2 },
    { type: "clap", step: 4, vel: 0.45 },
    { type: "bass", step: 0, vel: 0.7 },
    { type: "bass", step: 6, vel: 0.4 },
    { type: "bass", step: 10, vel: 0.55 },
    { type: "perc", step: 7, vel: 0.2 },
    { type: "perc", step: 15, vel: 0.15 },
  ],
};

/* ── INDUSTRIAL — aggressive, metallic ── */
export const INDUSTRIAL: PatternDef = {
  name: "INDUSTRIAL",
  bpm: 142,
  hits: [
    { type: "kick", step: 0 },
    { type: "kick", step: 3 },
    { type: "kick", step: 8 },
    { type: "kick", step: 11 },
    { type: "hat", step: 2 },
    { type: "hat", step: 5 },
    { type: "hat", step: 10 },
    { type: "hat", step: 13 },
    { type: "hatOpen", step: 14 },
    { type: "clap", step: 4 },
    { type: "clap", step: 12 },
    { type: "bass", step: 0, vel: 0.95 },
    { type: "bass", step: 2, vel: 0.55 },
    { type: "bass", step: 6, vel: 0.7 },
    { type: "bass", step: 8, vel: 0.85 },
    { type: "bass", step: 10, vel: 0.45 },
    { type: "bass", step: 14, vel: 0.6 },
    { type: "perc", step: 1, vel: 0.35 },
    { type: "perc", step: 5, vel: 0.3 },
    { type: "perc", step: 9, vel: 0.35 },
    { type: "perc", step: 13, vel: 0.3 },
    { type: "tom", step: 6, vel: 0.4 },
    { type: "tom", step: 14, vel: 0.35 },
    { type: "crash", step: 0, vel: 0.25 },
  ],
};

/* ── ACID — 303-style squelch ── */
export const ACID: PatternDef = {
  name: "ACID",
  bpm: 140,
  hits: [
    { type: "kick", step: 0 },
    { type: "kick", step: 4 },
    { type: "kick", step: 8 },
    { type: "kick", step: 12 },
    { type: "hat", step: 2 },
    { type: "hat", step: 6 },
    { type: "hat", step: 10 },
    { type: "hat", step: 14 },
    { type: "clap", step: 4 },
    { type: "bass", step: 0, vel: 0.9 },
    { type: "bass", step: 1, vel: 0.4 },
    { type: "bass", step: 3, vel: 0.65 },
    { type: "bass", step: 5, vel: 0.5 },
    { type: "bass", step: 7, vel: 0.75 },
    { type: "bass", step: 8, vel: 0.85 },
    { type: "bass", step: 9, vel: 0.35 },
    { type: "bass", step: 10, vel: 0.6 },
    { type: "bass", step: 12, vel: 0.75 },
    { type: "bass", step: 13, vel: 0.4 },
    { type: "bass", step: 15, vel: 0.55 },
    { type: "perc", step: 5, vel: 0.25 },
    { type: "perc", step: 13, vel: 0.2 },
  ],
};

/* ── RUMBLE — deep, dark, minimal kick ── */
export const RUMBLE: PatternDef = {
  name: "RUMBLE",
  bpm: 132,
  hits: [
    { type: "kick", step: 0 },
    { type: "kick", step: 4 },
    { type: "kick", step: 8 },
    { type: "kick", step: 12 },
    { type: "hat", step: 10 },
    { type: "hat", step: 14, vel: 0.3 },
    { type: "bass", step: 0, vel: 0.95 },
    { type: "bass", step: 3, vel: 0.3 },
    { type: "bass", step: 7, vel: 0.5 },
    { type: "bass", step: 10, vel: 0.7 },
    { type: "bass", step: 11, vel: 0.4 },
    { type: "bass", step: 14, vel: 0.55 },
  ],
};

export const ALL_PATTERNS: PatternDef[] = [FILTHY_TECHNO, MINIMAL_TECHNO, INDUSTRIAL, ACID, RUMBLE];

/**
 * Returns all DrumHits that occur on a given step in a pattern.
 */
export function getHitsOnStep(pattern: PatternDef, step: number): DrumHit[] {
  return pattern.hits.filter(h => h.step === step);
}
