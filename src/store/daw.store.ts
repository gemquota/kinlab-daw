import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FILTHY_TECHNO, MINIMAL_TECHNO, INDUSTRIAL, ACID, RUMBLE, type PatternDef } from "@/audio/technoSequencer";
import type { DrumType } from "@/audio/drumSynth";

export type SidePanel = null | "mixer" | "effects" | "visuals" | "instruments";

/**
 * DAW global state store with Zustand persist middleware.
 * Manages playback, BPM, mixer, effects, patterns, and UI state.
 * Persisted to localStorage as "void-daw-v3".
 */

interface DAWStore {
  bpm: number;
  playing: boolean;
  currentTime: number;
  masterVolume: number;
  currentStep: number;

  // Pattern
  activePattern: PatternDef;
  patternIndex: number;

  // Per-drum mixer
  drumVolumes: Record<DrumType, number>;
  drumMutes: Record<DrumType, boolean>;

  // Effects
  reverb: number;
  delayMix: number;
  filterCutoff: number;

  // UI
  sidePanel: SidePanel;

  // Actions
  setBpm: (bpm: number) => void;
  setPlaying: (v: boolean) => void;
  setCurrentTime: (t: number) => void;
  setMasterVolume: (v: number) => void;
  setPattern: (p: PatternDef) => void;
  cyclePattern: () => void;
  setDrumVolume: (type: DrumType, vol: number) => void;
  setDrumMute: (type: DrumType, muted: boolean) => void;
  setReverb: (v: number) => void;
  setDelayMix: (v: number) => void;
  setFilterCutoff: (v: number) => void;
  setSidePanel: (p: SidePanel) => void;
}

const PATTERNS = [FILTHY_TECHNO, MINIMAL_TECHNO, INDUSTRIAL, ACID, RUMBLE];

const DEFAULT_DRUM_VOLUMES: Record<DrumType, number> = {
  kick: 1, hat: 0.85, hatOpen: 0.7, clap: 0.8, bass: 0.9, perc: 0.6, tom: 0.7, crash: 0.5,
};

const DEFAULT_DRUM_MUTES: Record<DrumType, boolean> = {
  kick: false, hat: false, hatOpen: false, clap: false, bass: false, perc: false, tom: false, crash: false,
};

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

      drumVolumes: { ...DEFAULT_DRUM_VOLUMES },
      drumMutes: { ...DEFAULT_DRUM_MUTES },

      reverb: 0.35,
      delayMix: 0.18,
      filterCutoff: 20000,

      sidePanel: null,

      setBpm: (bpm) => set({ bpm: Math.max(60, Math.min(200, bpm)) }),
      setPlaying: (v) => set({ playing: v }),
      setCurrentTime: (t) => set({ currentTime: t }),
      setMasterVolume: (v) => set({ masterVolume: Math.max(0, Math.min(1, v)) }),
      setPattern: (p) => set({ activePattern: p, bpm: p.bpm }),
      cyclePattern: () => {
        const idx = (get().patternIndex + 1) % PATTERNS.length;
        set({ patternIndex: idx, activePattern: PATTERNS[idx]!, bpm: PATTERNS[idx]!.bpm });
      },
      setDrumVolume: (type, vol) => set((s) => ({
        drumVolumes: { ...s.drumVolumes, [type]: Math.max(0, Math.min(1, vol)) },
      })),
      setDrumMute: (type, muted) => set((s) => ({
        drumMutes: { ...s.drumMutes, [type]: muted },
      })),
      setReverb: (v) => set({ reverb: Math.max(0, Math.min(1, v)) }),
      setDelayMix: (v) => set({ delayMix: Math.max(0, Math.min(1, v)) }),
      setFilterCutoff: (v) => set({ filterCutoff: Math.max(50, Math.min(20000, v)) }),
      setSidePanel: (p) => set({ sidePanel: p }),
    }),
    {
      name: "void-daw-v4",
      partialize: (state) => ({
        masterVolume: state.masterVolume,
        drumVolumes: state.drumVolumes,
        drumMutes: state.drumMutes,
        reverb: state.reverb,
        delayMix: state.delayMix,
        filterCutoff: state.filterCutoff,
      }),
    },
  ),
);
