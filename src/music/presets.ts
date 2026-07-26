/**
 * Complete preset library: Songs, Instruments, Configs,
 * Step Sequences, MIDI Tracks, Scale Series, Arpeggio Patterns.
 */

type DAWTrack = { name?: string; waveformType: OscillatorType | "custom"; frequency: number; amplitude: number; filterFreq: number; filterQ: number; volume: number; pan: number; detune: number; color: string; };
import type { ArpConfig } from "./arpeggios";
import type { NoteName } from "./scales";
import type { MIDITrack } from "./midiTrack";
import { createMIDITrack, createNote, sortNotes } from "./midiTrack";

/* ════════════════════════════════════════════════════════════════════
   INSTRUMENTS
   ════════════════════════════════════════════════════════════════════ */

export interface InstrumentPreset {
  name: string;
  category: string;
  description: string;
  track: Partial<DAWTrack>;
}

export const INSTRUMENT_PRESETS: InstrumentPreset[] = [
  { name: "Sub Bass", category: "Bass", description: "Deep sine sub-bass", track: { waveformType: "sine", frequency: 55, amplitude: 1, filterFreq: 200, filterQ: 2, volume: 0.9 } },
  { name: "Saw Bass", category: "Bass", description: "Aggressive sawtooth bass", track: { waveformType: "sawtooth", frequency: 110, amplitude: 0.7, filterFreq: 800, filterQ: 4, volume: 0.8 } },
  { name: "Square Bass", category: "Bass", description: "Retro square wave bass", track: { waveformType: "square", frequency: 82.41, amplitude: 0.8, filterFreq: 1200, filterQ: 3, volume: 0.8 } },
  { name: "Reese Bass", category: "Bass", description: "Detuned saw pair", track: { waveformType: "sawtooth", frequency: 55, amplitude: 0.9, detune: 15, filterFreq: 600, filterQ: 6, volume: 0.85 } },
  { name: "Sine Lead", category: "Lead", description: "Pure sine melody", track: { waveformType: "sine", frequency: 440, amplitude: 0.6, filterFreq: 8000, filterQ: 1, volume: 0.7 } },
  { name: "Saw Lead", category: "Lead", description: "Bright sawtooth lead", track: { waveformType: "sawtooth", frequency: 440, amplitude: 0.5, filterFreq: 4000, filterQ: 2, volume: 0.7 } },
  { name: "Square Lead", category: "Lead", description: "Chiptune-style lead", track: { waveformType: "square", frequency: 440, amplitude: 0.5, filterFreq: 6000, filterQ: 1, volume: 0.65 } },
  { name: "Triangle Lead", category: "Lead", description: "Soft mellow lead", track: { waveformType: "triangle", frequency: 440, amplitude: 0.7, filterFreq: 3000, filterQ: 1, volume: 0.7 } },
  { name: "Warm Pad", category: "Pad", description: "Lush triangle pad", track: { waveformType: "triangle", frequency: 220, amplitude: 0.4, filterFreq: 2000, filterQ: 1, volume: 0.6 } },
  { name: "Dark Pad", category: "Pad", description: "Filtered saw pad", track: { waveformType: "sawtooth", frequency: 165, amplitude: 0.3, filterFreq: 800, filterQ: 4, volume: 0.5 } },
  { name: "Glass Pad", category: "Pad", description: "High sine pad", track: { waveformType: "sine", frequency: 660, amplitude: 0.25, filterFreq: 10000, filterQ: 1, volume: 0.5 } },
  { name: "Electric Piano", category: "Keys", description: "Soft sine keys", track: { waveformType: "sine", frequency: 330, amplitude: 0.6, filterFreq: 5000, filterQ: 1, volume: 0.65 } },
  { name: "Organ", category: "Keys", description: "Square wave organ", track: { waveformType: "square", frequency: 262, amplitude: 0.5, filterFreq: 3000, filterQ: 2, volume: 0.6 } },
  { name: "Clav", category: "Keys", description: "Sharp triangle clav", track: { waveformType: "triangle", frequency: 262, amplitude: 0.7, filterFreq: 4000, filterQ: 5, volume: 0.7 } },
  { name: "Noise Sweep", category: "FX", description: "Filtered noise texture", track: { waveformType: "sawtooth", frequency: 50, amplitude: 0.3, filterFreq: 2000, filterQ: 10, volume: 0.4 } },
  { name: "Sub Drop", category: "FX", description: "Deep sub hit", track: { waveformType: "sine", frequency: 30, amplitude: 1, filterFreq: 100, filterQ: 1, volume: 0.9 } },
  { name: "Resonant Blip", category: "FX", description: "High-resonance ping", track: { waveformType: "sine", frequency: 880, amplitude: 0.4, filterFreq: 2000, filterQ: 15, volume: 0.5 } },
];

/* ════════════════════════════════════════════════════════════════════
   SCALE SERIES
   ════════════════════════════════════════════════════════════════════ */

export interface ScalePreset {
  name: string;
  category: string;
  description: string;
  root: NoteName;
  scaleType: string;
  octave: number;
}

export const SCALE_PRESETS: ScalePreset[] = [
  { name: "C Major", category: "Western", description: "Standard major scale", root: "C", scaleType: "Major", octave: 4 },
  { name: "A Natural Minor", category: "Western", description: "Aeolian mode", root: "A", scaleType: "Natural Minor", octave: 4 },
  { name: "D Dorian", category: "Modes", description: "Bright minor mode", root: "D", scaleType: "Dorian", octave: 4 },
  { name: "E Phrygian", category: "Modes", description: "Dark Spanish mode", root: "E", scaleType: "Phrygian", octave: 4 },
  { name: "F Lydian", category: "Modes", description: "Dreamy raised-4th mode", root: "F", scaleType: "Lydian", octave: 4 },
  { name: "G Mixolydian", category: "Modes", description: "Dominant bluesy mode", root: "G", scaleType: "Mixolydian", octave: 4 },
  { name: "B Locrian", category: "Modes", description: "Diminished unstable mode", root: "B", scaleType: "Locrian", octave: 4 },
  { name: "C Major Pentatonic", category: "Pentatonic", description: "5-note major scale", root: "C", scaleType: "Major Pentatonic", octave: 4 },
  { name: "A Minor Pentatonic", category: "Pentatonic", description: "Rock/blues 5-note", root: "A", scaleType: "Minor Pentatonic", octave: 4 },
  { name: "E Blues", category: "Blues", description: "Classic blues scale", root: "E", scaleType: "Blues", octave: 3 },
  { name: "C Harmonic Minor", category: "Exotic", description: "Augmented 2nd flavor", root: "C", scaleType: "Harmonic Minor", octave: 4 },
  { name: "C Hungarian Minor", category: "Exotic", description: "Middle-Eastern tension", root: "C", scaleType: "Hungarian Minor", octave: 4 },
  { name: "C Whole Tone", category: "Exotic", description: "Ambiguous dreamy scale", root: "C", scaleType: "Whole Tone", octave: 4 },
  { name: "C Diminished HW", category: "Exotic", description: "Symmetric octatonic", root: "C", scaleType: "Diminished (HW)", octave: 4 },
  { name: "C In Sen", category: "Japanese", description: "Japanese pentatonic", root: "C", scaleType: "Japanese (In Sen)", octave: 4 },
  { name: "C Hirajoshi", category: "Japanese", description: "Traditional Japanese", root: "C", scaleType: "Hirajoshi", octave: 4 },
  { name: "C Iwato", category: "Japanese", description: "Symmetric Japanese", root: "C", scaleType: "Iwato", octave: 4 },
  { name: "C Arabic Bayati", category: "Middle Eastern", description: "Quarter-tone Arabic", root: "C", scaleType: "Arabic (Bayati)", octave: 4 },
  { name: "C Gamelan Pelog", category: "Indonesian", description: "Balinese gamelan", root: "C", scaleType: "Gamelan Pelog", octave: 4 },
  { name: "C Bebop Dominant", category: "Jazz", description: "Bebop 8-note scale", root: "C", scaleType: "Bebop Dominant", octave: 4 },
  { name: "C Lydian Augmented", category: "Jazz", description: "Jazz altered scale", root: "C", scaleType: "Lydian Augmented", octave: 4 },
  { name: "C Super Locrian", category: "Jazz", description: "Altered dominant scale", root: "C", scaleType: "Super Locrian", octave: 4 },
];

/* ════════════════════════════════════════════════════════════════════
   ARPEGGIO PATTERNS
   ════════════════════════════════════════════════════════════════════ */

export interface ArpPreset {
  name: string;
  category: string;
  description: string;
  config: Partial<ArpConfig>;
  notes: number[];
}

export const ARP_PRESETS: ArpPreset[] = [
  { name: "C Major Triad", category: "Triads", description: "Root-3rd-5th ascending", config: { pattern: "up", rate: 4, octaves: 2 }, notes: [60, 64, 67] },
  { name: "A Minor Arp", category: "Triads", description: "Minor triad ascending", config: { pattern: "up", rate: 4, octaves: 2 }, notes: [57, 60, 64] },
  { name: "G7 Arpeggio", category: "7th Chords", description: "Dominant 7th arpeggio", config: { pattern: "up", rate: 4, octaves: 1 }, notes: [55, 59, 62, 65] },
  { name: "Maj7 Sweep", category: "7th Chords", description: "Major 7th sweep", config: { pattern: "upDown", rate: 4, octaves: 1 }, notes: [60, 64, 67, 71] },
  { name: "Diminished Run", category: "Extended", description: "Diminished 7th pattern", config: { pattern: "up", rate: 4, octaves: 2 }, notes: [60, 63, 66, 69] },
  { name: "Trance Gate", category: "Rhythmic", description: "Fast 16th-note gate", config: { pattern: "upDown", rate: 4, octaves: 2, gate: 0.3 }, notes: [60, 64, 67, 72] },
  { name: "Wobble Bass", category: "Rhythmic", description: "Slow 8th-note wobble", config: { pattern: "down", rate: 2, octaves: 1, gate: 0.8 }, notes: [36, 43, 48] },
  { name: "Dub Delay", category: "Rhythmic", description: "Sparse dub arp", config: { pattern: "up", rate: 2, octaves: 2, gate: 0.2, swing: 0.3 }, notes: [60, 67, 72] },
  { name: "Techno Pulse", category: "Rhythmic", description: "Driving techno arp", config: { pattern: "up", rate: 4, octaves: 2, gate: 0.4 }, notes: [36, 48, 60] },
  { name: "Fibonacci Chord", category: "Mathematical", description: "Fibonacci-indexed notes", config: { pattern: "fibonacci", rate: 4, octaves: 2 }, notes: [60, 63, 67, 70, 72] },
  { name: "Golden Ratio", category: "Mathematical", description: "φ-spaced pitch selection", config: { pattern: "goldenRatio", rate: 4, octaves: 2 }, notes: [60, 62, 64, 65, 67, 69, 71, 72] },
  { name: "Converge Pad", category: "Mathematical", description: "Notes converging to center", config: { pattern: "converge", rate: 2, octaves: 1, gate: 0.7 }, notes: [48, 55, 60, 67, 72] },
  { name: "Ping Pong Stereo", category: "Mathematical", description: "Bouncing L-R pattern", config: { pattern: "pingPong", rate: 4, octaves: 2 }, notes: [60, 67, 72] },
  { name: "Alberti Bass", category: "Classical", description: "Mozart-style broken chord", config: { pattern: "alberti", rate: 4, octaves: 1, gate: 0.4 }, notes: [48, 52, 55, 52] },
  { name: "Baroque Figuration", category: "Classical", description: "Bach-style broken chord", config: { pattern: "baroque", rate: 4, octaves: 2, gate: 0.4 }, notes: [60, 64, 67, 64] },
  { name: "Staircase Runs", category: "Classical", description: "Rotating scale runs", config: { pattern: "staircase", rate: 4, octaves: 2, gate: 0.3 }, notes: [60, 62, 64, 65, 67] },
  { name: "Evolving Cloud", category: "Ambient", description: "Slow random cloud", config: { pattern: "random", rate: 1, octaves: 3, gate: 0.9, humanize: 0.3 }, notes: [48, 55, 60, 67, 72, 79] },
  { name: "Dream Cascade", category: "Ambient", description: "Random walk through chord", config: { pattern: "randomWalk", rate: 2, octaves: 2, gate: 0.6, swing: 0.2 }, notes: [60, 64, 67, 72, 76] },
  { name: "Shimmer", category: "Ambient", description: "Octave-doubled shimmer", config: { pattern: "up", rate: 2, octaves: 3, gate: 0.8 }, notes: [60, 67, 72] },
];

/* ════════════════════════════════════════════════════════════════════
   CONFIGURATIONS
   ════════════════════════════════════════════════════════════════════ */

export interface ConfigPreset {
  name: string;
  category: string;
  description: string;
  masterVolume: number;
  bpm: number;
  tracks: Partial<DAWTrack>[];
}

export const CONFIG_PRESETS: ConfigPreset[] = [
  { name: "Studio Mix", category: "Mixing", description: "Balanced studio setup", masterVolume: 0.8, bpm: 120,
    tracks: [
      { name: "Kick", frequency: 55, waveformType: "sine", volume: 0.9, filterFreq: 200, pan: 0, color: "#3b82f6" },
      { name: "Snare", frequency: 200, waveformType: "triangle", volume: 0.7, filterFreq: 5000, pan: 0, color: "#22c55e" },
      { name: "HiHat", frequency: 800, waveformType: "square", volume: 0.4, filterFreq: 10000, pan: 0.3, color: "#eab308" },
      { name: "Bass", frequency: 110, waveformType: "sawtooth", volume: 0.8, filterFreq: 800, pan: 0, color: "#ef4444" },
      { name: "Lead", frequency: 440, waveformType: "sine", volume: 0.6, filterFreq: 6000, pan: -0.2, color: "#a855f7" },
      { name: "Pad", frequency: 220, waveformType: "triangle", volume: 0.4, filterFreq: 2000, pan: 0.4, color: "#06b6d4" },
    ] },
  { name: "Minimal Setup", category: "Mixing", description: "Stripped-down minimal", masterVolume: 0.7, bpm: 125,
    tracks: [
      { name: "Kick", frequency: 55, waveformType: "sine", volume: 0.9, filterFreq: 150, pan: 0, color: "#3b82f6" },
      { name: "Bass", frequency: 110, waveformType: "sawtooth", volume: 0.7, filterFreq: 600, pan: 0, color: "#22c55e" },
      { name: "Synth", frequency: 330, waveformType: "square", volume: 0.5, filterFreq: 3000, pan: 0.2, color: "#a855f7" },
    ] },
  { name: "Wide Stereo", category: "Mixing", description: "Hard-panned wide mix", masterVolume: 0.75, bpm: 110,
    tracks: [
      { name: "Bass L", frequency: 82, waveformType: "sawtooth", volume: 0.7, filterFreq: 500, pan: -0.8, color: "#3b82f6" },
      { name: "Bass R", frequency: 82.5, waveformType: "sawtooth", volume: 0.7, filterFreq: 500, pan: 0.8, color: "#22c55e" },
      { name: "Lead L", frequency: 440, waveformType: "sine", volume: 0.5, filterFreq: 8000, pan: -0.6, color: "#a855f7" },
      { name: "Lead R", frequency: 440, waveformType: "triangle", volume: 0.5, filterFreq: 8000, pan: 0.6, color: "#ef4444" },
      { name: "Center", frequency: 262, waveformType: "triangle", volume: 0.4, filterFreq: 3000, pan: 0, color: "#eab308" },
    ] },
  { name: "Orchestral", category: "Mixing", description: "Full orchestral spread", masterVolume: 0.7, bpm: 80,
    tracks: [
      { name: "Basses", frequency: 65, waveformType: "sawtooth", volume: 0.6, filterFreq: 400, pan: -0.3, color: "#3b82f6" },
      { name: "Cellos", frequency: 131, waveformType: "triangle", volume: 0.5, filterFreq: 2000, pan: -0.2, color: "#22c55e" },
      { name: "Violas", frequency: 220, waveformType: "triangle", volume: 0.5, filterFreq: 4000, pan: 0, color: "#eab308" },
      { name: "Violins", frequency: 440, waveformType: "sine", volume: 0.5, filterFreq: 8000, pan: 0.2, color: "#ef4444" },
      { name: "Flutes", frequency: 880, waveformType: "sine", volume: 0.35, filterFreq: 12000, pan: 0.3, color: "#a855f7" },
      { name: "Horns", frequency: 262, waveformType: "sawtooth", volume: 0.4, filterFreq: 3000, pan: -0.4, color: "#06b6d4" },
    ] },
];

/* ════════════════════════════════════════════════════════════════════
   SONGS
   ════════════════════════════════════════════════════════════════════ */

export interface SongPreset {
  name: string;
  category: string;
  description: string;
  bpm: number;
  key: NoteName;
  scale: string;
  bars: number;
  tracks: {
    name: string;
    waveformType: OscillatorType | "custom";
    frequency: number;
    volume: number;
    pan: number;
    color: string;
    pattern: number[];
  }[];
}

export const SONG_PRESETS: SongPreset[] = [
  { name: "Techno Builder", category: "Electronic", description: "Classic techno arrangement", bpm: 128, key: "E", scale: "Minor Pentatonic", bars: 16,
    tracks: [
      { name: "Kick", waveformType: "sine", frequency: 55, volume: 0.95, pan: 0, color: "#3b82f6", pattern: [0,-1,-1,-1,0,-1,-1,-1,0,-1,-1,-1,0,-1,-1,-1] },
      { name: "Bass", waveformType: "sawtooth", frequency: 110, volume: 0.8, pan: 0, color: "#22c55e", pattern: [0,-1,0,-1,-1,-1,0,-1,0,-1,-1,0,-1,0,-1,-1] },
      { name: "HiHat", waveformType: "square", frequency: 800, volume: 0.35, pan: 0.3, color: "#eab308", pattern: [-1,0,-1,0,-1,0,-1,0,-1,0,-1,0,-1,0,-1,0] },
      { name: "Synth", waveformType: "square", frequency: 440, volume: 0.45, pan: -0.2, color: "#a855f7", pattern: [0,-1,-1,-1,-1,-1,7,-1,-1,-1,0,-1,-1,5,-1,-1] },
    ] },
  { name: "Lo-Fi Chill", category: "Chill", description: "Relaxed lo-fi beat", bpm: 85, key: "C", scale: "Major Pentatonic", bars: 16,
    tracks: [
      { name: "Kick", waveformType: "sine", frequency: 55, volume: 0.85, pan: 0, color: "#3b82f6", pattern: [0,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,0,-1,-1,-1] },
      { name: "Keys", waveformType: "sine", frequency: 262, volume: 0.5, pan: -0.3, color: "#22c55e", pattern: [0,-1,-1,4,-1,-1,7,-1,-1,-1,4,-1,0,-1,-1,-1] },
      { name: "Bass", waveformType: "triangle", frequency: 82, volume: 0.6, pan: 0, color: "#eab308", pattern: [0,-1,-1,-1,-1,-1,-1,-1,7,-1,-1,-1,-1,-1,-1,-1] },
      { name: "Pads", waveformType: "triangle", frequency: 330, volume: 0.3, pan: 0.2, color: "#a855f7", pattern: [0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1] },
    ] },
  { name: "Drum & Bass", category: "Electronic", description: "High-energy DnB", bpm: 174, key: "A", scale: "Minor Pentatonic", bars: 16,
    tracks: [
      { name: "Kick", waveformType: "sine", frequency: 55, volume: 0.95, pan: 0, color: "#3b82f6", pattern: [0,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,0,-1] },
      { name: "Snare", waveformType: "triangle", frequency: 200, volume: 0.8, pan: 0, color: "#22c55e", pattern: [-1,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,-1] },
      { name: "Bass", waveformType: "sawtooth", frequency: 55, volume: 0.9, pan: 0, color: "#ef4444", pattern: [0,-1,-1,12,-1,-1,7,-1,-1,0,-1,-1,-1,12,-1,7] },
      { name: "HiHat", waveformType: "square", frequency: 800, volume: 0.3, pan: 0.4, color: "#eab308", pattern: [-1,0,-1,0,-1,0,-1,0,-1,0,-1,0,-1,0,-1,0] },
    ] },
  { name: "Ambient Drift", category: "Ambient", description: "Evolving ambient texture", bpm: 60, key: "D", scale: "Major Pentatonic", bars: 32,
    tracks: [
      { name: "Drone", waveformType: "sine", frequency: 73, volume: 0.3, pan: 0, color: "#3b82f6", pattern: [0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1] },
      { name: "Shimmer", waveformType: "triangle", frequency: 294, volume: 0.2, pan: 0.4, color: "#a855f7", pattern: [7,-1,-1,-1,-1,-1,4,-1,-1,-1,-1,-1,0,-1,-1,-1] },
      { name: "Pad", waveformType: "sine", frequency: 147, volume: 0.25, pan: -0.3, color: "#22c55e", pattern: [0,-1,-1,-1,-1,-1,-1,-1,4,-1,-1,-1,-1,-1,-1,-1] },
    ] },
];

/* ════════════════════════════════════════════════════════════════════
   STEP SEQUENCER PRESETS
   ════════════════════════════════════════════════════════════════════ */

export interface SeqPreset {
  name: string;
  category: string;
  description: string;
  division: number;
  swing: number;
  basePitch: number;
  steps: [number, number][];
}

export const SEQ_PRESETS: SeqPreset[] = [
  { name: "Techno Bass 16th", category: "Electronic", description: "Driving 16th-note bass", division: 4, swing: 0, basePitch: 36,
    steps: [[0,0],[2,0],[4,0],[6,0],[8,0],[10,0],[12,0],[14,0]] },
  { name: "House Groove", category: "House", description: "Four-on-the-floor house", division: 4, swing: 0, basePitch: 36,
    steps: [[0,0],[4,0],[8,0],[12,0],[2,12],[6,12],[10,12],[14,12]] },
  { name: "Swing 16ths", category: "Jazz", description: "Swung 16th pattern", division: 4, swing: 0.55, basePitch: 60,
    steps: [[0,0],[1,4],[2,7],[3,4],[4,0],[5,4],[6,7],[7,4]] },
  { name: "DnB Break", category: "Electronic", description: "Drum & bass breakbeat", division: 4, swing: 0, basePitch: 36,
    steps: [[0,0],[3,12],[4,0],[6,7],[8,0],[10,5],[12,0],[14,12]] },
  { name: "Dubstep Wobble", category: "Electronic", description: "Wobbling bass pattern", division: 4, swing: 0, basePitch: 36,
    steps: [[0,0],[1,0],[2,0],[4,12],[6,12],[8,0],[9,0],[10,7],[12,0],[13,0],[14,5]] },
  { name: "Reggae Skank", category: "Reggae", description: "Offbeat reggae chords", division: 4, swing: 0.1, basePitch: 60,
    steps: [[2,0],[6,0],[10,0],[14,0]] },
  { name: "Trap Hats", category: "Trap", description: "Rolling trap hi-hats", division: 4, swing: 0, basePitch: 84,
    steps: [[0,0],[1,0],[2,0],[4,0],[5,12],[6,0],[7,12],[8,0],[9,0],[10,0],[12,0],[13,0],[14,0],[15,0]] },
  { name: "Minimal Sequence", category: "Minimal", description: "Sparse minimal pattern", division: 4, swing: 0.2, basePitch: 48,
    steps: [[0,0],[4,7],[8,0],[12,5]] },
  { name: "Polyrhythm 3:4", category: "Experimental", description: "3 against 4 polyrhythm", division: 4, swing: 0, basePitch: 60,
    steps: [[0,0],[3,4],[6,7],[9,4],[12,0],[15,7]] },
  { name: "Spiral Melody", category: "Mathematical", description: "φ-spaced pitch pattern", division: 4, swing: 0, basePitch: 60,
    steps: [[0,0],[1,3],[2,7],[3,5],[4,0],[5,8],[6,3],[7,10],[8,7],[9,2],[10,5],[11,9],[12,0],[13,6],[14,3],[15,8]] },
];

/* ════════════════════════════════════════════════════════════════════
   MIDI TRACK PRESETS
   ════════════════════════════════════════════════════════════════════ */

function makeMidiPreset(name: string, category: string, desc: string, notes: [number, number, number, number][], color: string = "#3b82f6", bars: number = 4): MIDITrackPreset {
  const track = createMIDITrack(name, bars, color);
  track.notes = notes.map(([p, s, d, v]) => createNote(p, s, d, v));
  return { name, category, description: desc, track: sortNotes(track) };
}

export interface MIDITrackPreset {
  name: string;
  category: string;
  description: string;
  track: MIDITrack;
}

export const MIDI_TRACK_PRESETS: MIDITrackPreset[] = [
  makeMidiPreset("C Major Scale", "Scales", "One-octave ascending",
    [[60,0,0.9,0.8],[62,1,0.9,0.8],[64,2,0.9,0.8],[65,3,0.9,0.8],[67,4,0.9,0.8],[69,5,0.9,0.8],[71,6,0.9,0.8],[72,7,0.9,0.8]]),
  makeMidiPreset("Blues Lick", "Blues", "Pentatonic blues phrase",
    [[60,0,0.45,0.75],[63,0.5,0.45,0.75],[65,1,0.45,0.75],[66,1.5,0.45,0.75],[67,2,0.45,0.75],[70,2.5,0.45,0.75],[67,3,0.45,0.75],[66,3.5,0.45,0.75],[65,4,0.45,0.75],[63,4.5,0.45,0.75],[60,5,0.45,0.75],[58,5.5,0.45,0.75]], "#ef4444"),
  makeMidiPreset("Arp Sequence", "Patterns", "Eighth-note arp",
    [[60,0,0.4,0.75],[64,0.5,0.4,0.75],[67,1,0.4,0.75],[72,1.5,0.4,0.75],[67,2,0.4,0.75],[64,2.5,0.4,0.75],[60,3,0.4,0.75],[64,3.5,0.4,0.75],[67,4,0.4,0.75],[72,4.5,0.4,0.75],[76,5,0.4,0.75],[72,5.5,0.4,0.75],[67,6,0.4,0.75],[64,6.5,0.4,0.75],[60,7,0.4,0.75],[55,7.5,0.4,0.75]], "#06b6d4"),
  makeMidiPreset("Chord Stabs", "Harmony", "Quarter-note chord stabs",
    [[60,0,0.5,0.85],[64,0,0.5,0.85],[67,0,0.5,0.85],[65,4,0.5,0.85],[69,4,0.5,0.85],[72,4,0.5,0.85],[67,8,0.5,0.85],[71,8,0.5,0.85],[74,8,0.5,0.85],[60,12,0.5,0.85],[64,12,0.5,0.85],[67,12,0.5,0.85]], "#a855f7", 8),
  makeMidiPreset("Walking Bass", "Jazz", "Walking bass line",
    [[36,0,0.9,0.7],[38,1,0.9,0.7],[40,2,0.9,0.7],[41,3,0.9,0.7],[43,4,0.9,0.7],[41,5,0.9,0.7],[40,6,0.9,0.7],[38,7,0.9,0.7],[36,8,0.9,0.7],[33,9,0.9,0.7],[35,10,0.9,0.7],[36,11,0.9,0.7],[38,12,0.9,0.7],[40,13,0.9,0.7],[41,14,0.9,0.7],[43,15,0.9,0.7]], "#eab308", 8),
  makeMidiPreset("Funky Bass", "Funk", "Syncopated bass groove",
    [[36,0,0.75,0.9],[36,1,0.25,0.9],[43,1.5,0.5,0.9],[36,2,0.75,0.9],[48,2.75,0.25,0.9],[43,3,0.5,0.9],[36,3.5,0.5,0.9]], "#22c55e"),
  makeMidiPreset("Ambient Pad", "Ambient", "Slow evolving chords",
    [[60,0,3.5,0.5],[64,0,3.5,0.5],[67,0,3.5,0.5],[72,0,3.5,0.5],[65,4,3.5,0.5],[69,4,3.5,0.5],[72,4,3.5,0.5],[77,4,3.5,0.5],[67,8,3.5,0.5],[71,8,3.5,0.5],[74,8,3.5,0.5],[79,8,3.5,0.5],[60,12,3.5,0.5],[64,12,3.5,0.5],[67,12,3.5,0.5],[72,12,3.5,0.5]], "#a855f7", 16),
  makeMidiPreset("Pentatonic Solo", "Improvisation", "Pentatonic improvisation",
    [[72,0,0.4,0.65],[74,0.5,0.4,0.65],[76,1,0.4,0.65],[79,1.5,0.4,0.65],[81,2,0.4,0.65],[79,2.5,0.4,0.65],[76,3,0.4,0.65],[74,3.5,0.4,0.65],[72,4,0.4,0.65],[74,4.5,0.4,0.65],[76,5,0.4,0.65],[79,5.5,0.4,0.65],[84,6,0.4,0.65],[81,6.5,0.4,0.65],[79,7,0.4,0.65],[76,7.5,0.4,0.65]], "#ef4444", 8),
];
