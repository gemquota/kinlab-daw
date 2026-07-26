import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FILTHY_TECHNO, MINIMAL_TECHNO, INDUSTRIAL, ACID, RUMBLE, type PatternDef } from "@/audio/technoSequencer";

export interface DAWTrack {
  id: string;
  name: string;
  muted: boolean;
  solo: boolean;
  volume: number;
  pan: number;
  waveformType: OscillatorType | "custom";
  frequency: number;
  amplitude: number;
  detune: number;
  filterFreq: number;
  filterQ: number;
  color: string;
}

interface DAWStore {
  bpm: number;
  playing: boolean;
  currentTime: number;
  masterVolume: number;
  currentStep: number;

  // Techno pattern
  activePattern: PatternDef;
  patternIndex: number;

  // Tracks (kept for UI but audio is pattern-driven)
  tracks: DAWTrack[];
  activeTrackId: string | null;

  // Actions
  setBpm: (bpm: number) => void;
  setPlaying: (v: boolean) => void;
  setCurrentTime: (t: number) => void;
  setMasterVolume: (v: number) => void;
  setPattern: (p: PatternDef) => void;
  cyclePattern: () => void;
}

const PATTERNS = [FILTHY_TECHNO, MINIMAL_TECHNO, INDUSTRIAL, ACID, RUMBLE];

let trackCounter = 0;
function defaultTrack(overrides?: Partial<DAWTrack>): DAWTrack {
  const idx = trackCounter++;
  const colors = ["#3b82f6", "#22c55e", "#f97316", "#ef4444", "#a855f7"];
  return {
    id: `track-${Date.now()}-${idx}`,
    name: `Track ${idx + 1}`,
    muted: false, solo: false, volume: 0.7, pan: 0,
    waveformType: "sine",
    frequency: 220 * Math.pow(2, idx / 12),
    amplitude: 0.5, detune: 0, filterFreq: 20000, filterQ: 1,
    color: colors[idx % colors.length]!,
    ...overrides,
  };
}

export const useDAWStore = create<DAWStore>()(
  persist(
    (set, get) => ({
      bpm: FILTHY_TECHNO.bpm,
      playing: false,
      currentTime: 0,
      masterVolume: 0.85,
      currentStep: 0,

      activePattern: FILTHY_TECHNO,
      patternIndex: 0,

      tracks: [
        defaultTrack({ name: "Kick", frequency: 55, waveformType: "sine", color: "#3b82f6" }),
        defaultTrack({ name: "Hat", frequency: 8000, waveformType: "square", color: "#22c55e" }),
        defaultTrack({ name: "Bass", frequency: 55, waveformType: "sawtooth", color: "#f97316" }),
      ],
      activeTrackId: null,

      setBpm: (bpm) => set({ bpm: Math.max(60, Math.min(200, bpm)) }),
      setPlaying: (v) => set({ playing: v }),
      setCurrentTime: (t) => set({ currentTime: t }),
      setMasterVolume: (v) => set({ masterVolume: Math.max(0, Math.min(1, v)) }),
      setPattern: (p) => set({ activePattern: p, bpm: p.bpm }),
      cyclePattern: () => {
        const idx = (get().patternIndex + 1) % PATTERNS.length;
        set({ patternIndex: idx, activePattern: PATTERNS[idx]!, bpm: PATTERNS[idx]!.bpm });
      },
    }),
    {
      name: "void-daw-v3",
      partialize: (state) => ({
        masterVolume: state.masterVolume,
      }),
    },
  ),
);
