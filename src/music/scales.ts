/**
 * Music theory: scales, chords, intervals.
 * Pure functions, no dependencies.
 */

export type NoteName = "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B";

export const CHROMATIC: NoteName[] = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];

/** Semitone intervals from root for each scale type */
export const SCALE_INTERVALS: Record<string, number[]> = {
  "Major":              [0, 2, 4, 5, 7, 9, 11],
  "Natural Minor":      [0, 2, 3, 5, 7, 8, 10],
  "Harmonic Minor":     [0, 2, 3, 5, 7, 8, 11],
  "Melodic Minor":      [0, 2, 3, 5, 7, 9, 11],
  "Dorian":             [0, 2, 3, 5, 7, 9, 10],
  "Phrygian":           [0, 1, 3, 5, 7, 8, 10],
  "Lydian":             [0, 2, 4, 6, 7, 9, 11],
  "Mixolydian":         [0, 2, 4, 5, 7, 9, 10],
  "Locrian":            [0, 1, 3, 5, 6, 8, 10],
  "Major Pentatonic":   [0, 2, 4, 7, 9],
  "Minor Pentatonic":   [0, 3, 5, 7, 10],
  "Blues":              [0, 3, 5, 6, 7, 10],
  "Whole Tone":         [0, 2, 4, 6, 8, 10],
  "Chromatic":          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  "Diminished (HW)":    [0, 1, 3, 4, 6, 7, 9, 10],
  "Diminished (WH)":    [0, 2, 3, 5, 6, 8, 9, 11],
  "Hungarian Minor":    [0, 2, 3, 6, 7, 8, 11],
  "Japanese (In Sen)":  [0, 1, 5, 7, 8],
  "Arabic (Bayati)":    [0, 1.5, 3, 5, 7, 8.5, 10],
  "Gamelan Pelog":      [0, 1, 3, 7, 8],
  "Hirajoshi":          [0, 2, 3, 7, 8],
  "Iwato":              [0, 1, 5, 6, 10],
  "Kumoi":              [0, 1, 5, 7, 8],
  "Balinese":           [0, 1, 3, 7, 8],
  "Bebop Dominant":     [0, 2, 4, 5, 7, 9, 10, 11],
  "Lydian Augmented":   [0, 2, 4, 6, 8, 9, 11],
  "Super Locrian":      [0, 1, 3, 4, 6, 8, 10],
};

export interface ScaleInfo {
  name: string;
  root: NoteName;
  /** MIDI note numbers for 2 octaves starting at root octave */
  notes: number[];
  /** Frequency (Hz) for each note in the scale, 2 octaves */
  frequencies: number[];
  /** Semitone intervals */
  intervals: number[];
}

/** MIDI note number for a note name + octave */
export function noteToMidi(note: NoteName, octave: number): number {
  return CHROMATIC.indexOf(note) + (octave + 1) * 12;
}

/** MIDI note number to frequency (A4 = 440 Hz) */
export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** Note name from MIDI number */
export function midiToName(midi: number): string {
  const note = CHROMATIC[midi % 12]!;
  const octave = Math.floor(midi / 12) - 1;
  return `${note}${octave}`;
}

/** Build a scale from root note and scale type, spanning octaves */
export function buildScale(
  root: NoteName,
  scaleType: string,
  startOctave: number = 3,
  numOctaves: number = 2,
): ScaleInfo {
  const intervals = SCALE_INTERVALS[scaleType] ?? SCALE_INTERVALS["Major"]!;
  const rootMidi = noteToMidi(root, startOctave);
  const notes: number[] = [];
  const frequencies: number[] = [];

  for (let oct = 0; oct < numOctaves; oct++) {
    for (const interval of intervals) {
      const midi = rootMidi + oct * 12 + Math.round(interval);
      notes.push(midi);
      frequencies.push(midiToFreq(midi));
    }
  }
  // Add the top root
  notes.push(rootMidi + numOctaves * 12);
  frequencies.push(midiToFreq(rootMidi + numOctaves * 12));

  return { name: scaleType, root, notes, frequencies, intervals };
}

/* ─── Chord generation ─── */

export const CHORD_INTERVALS: Record<string, number[]> = {
  "Major":       [0, 4, 7],
  "Minor":       [0, 3, 7],
  "Diminished":  [0, 3, 6],
  "Augmented":   [0, 4, 8],
  "Major 7th":   [0, 4, 7, 11],
  "Minor 7th":   [0, 3, 7, 10],
  "Dominant 7th": [0, 4, 7, 10],
  "Diminished 7th": [0, 3, 6, 9],
  "Sus2":        [0, 2, 7],
  "Sus4":        [0, 5, 7],
  "Power (5th)": [0, 7],
  "Add9":        [0, 4, 7, 14],
  "Minor 9th":   [0, 3, 7, 10, 14],
  "Major 9th":   [0, 4, 7, 11, 14],
  "Diminished 5th": [0, 6],
  "Quartal":     [0, 5, 10],
  "Stacked 5ths": [0, 7, 14],
};

export function buildChord(root: NoteName, chordType: string, octave: number = 4): number[] {
  const intervals = CHORD_INTERVALS[chordType] ?? CHORD_INTERVALS["Major"]!;
  const rootMidi = noteToMidi(root, octave);
  return intervals.map((i) => rootMidi + i);
}

/** Generate diatonic chords for a scale (triads on each degree) */
export function diatonicChords(
  root: NoteName,
  scaleType: string,
  octave: number = 4,
): { degree: number; notes: number[]; name: string }[] {
  const scale = buildScale(root, scaleType, octave, 1);
  const result: { degree: number; notes: number[]; name: string }[] = [];

  for (let i = 0; i < scale.intervals.length; i++) {
    const rootMidi = scale.notes[i]!;
    const thirdIdx = (i + 2) % scale.notes.length;
    const fifthIdx = (i + 4) % scale.notes.length;
    const third = scale.notes[thirdIdx]!;
    const fifth = scale.notes[fifthIdx]!;
    // Ensure proper voicing (no drop below root)
    const notes = [rootMidi, third > rootMidi ? third : third + 12, fifth > rootMidi ? fifth : fifth + 12];
    result.push({ degree: i + 1, notes, name: `${CHROMATIC[rootMidi % 12]!}` });
  }
  return result;
}

/** All scale names */
export const ALL_SCALE_NAMES = Object.keys(SCALE_INTERVALS);
export const ALL_CHORD_NAMES = Object.keys(CHORD_INTERVALS);
