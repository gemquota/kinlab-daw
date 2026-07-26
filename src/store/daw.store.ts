import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DAWTrack {
  id: string;
  name: string;
  muted: boolean;
  solo: boolean;
  volume: number;      // 0..1
  pan: number;         // -1..1
  waveformType: OscillatorType | "custom";
  frequency: number;
  amplitude: number;
  detune: number;      // cents
  filterFreq: number;  // Hz
  filterQ: number;
  color: string;
}

interface DAWStore {
  bpm: number;
  loopEnabled: boolean;
  loopStart: number;
  loopEnd: number;
  playing: boolean;
  recording: boolean;
  currentTime: number;
  tracks: DAWTrack[];
  activeTrackId: string | null;
  masterVolume: number;
  zoom: number;

  // Actions
  setBpm: (bpm: number) => void;
  setLoopEnabled: (v: boolean) => void;
  setLoopPoints: (start: number, end: number) => void;
  setPlaying: (v: boolean) => void;
  setRecording: (v: boolean) => void;
  setCurrentTime: (t: number) => void;
  addTrack: (track?: Partial<DAWTrack>) => void;
  removeTrack: (id: string) => void;
  updateTrack: (id: string, patch: Partial<DAWTrack>) => void;
  setActiveTrack: (id: string | null) => void;
  setMasterVolume: (v: number) => void;
  setZoom: (z: number) => void;
  toggleMute: (id: string) => void;
  toggleSolo: (id: string) => void;
}

const TRACK_COLORS = [
  "#3b82f6", "#22c55e", "#f97316", "#ef4444",
  "#a855f7", "#06b6d4", "#eab308", "#ec4899",
  "#14b8a6", "#6366f1",
];

let trackCounter = 0;

function defaultTrack(overrides?: Partial<DAWTrack>): DAWTrack {
  const idx = trackCounter++;
  return {
    id: `track-${Date.now()}-${idx}`,
    name: `Track ${idx + 1}`,
    muted: false,
    solo: false,
    volume: 0.7,
    pan: 0,
    waveformType: "sine",
    frequency: 220 * Math.pow(2, idx / 12),
    amplitude: 0.5,
    detune: 0,
    filterFreq: 20000,
    filterQ: 1,
    color: TRACK_COLORS[idx % TRACK_COLORS.length]!,
    ...overrides,
  };
}

export const useDAWStore = create<DAWStore>()(
  persist(
    (set) => ({
      bpm: 120,
      loopEnabled: true,
      loopStart: 0,
      loopEnd: 4,
      playing: false,
      recording: false,
      currentTime: 0,
      tracks: [
        defaultTrack({ name: "Bass", frequency: 110, waveformType: "sawtooth", color: "#3b82f6" }),
        defaultTrack({ name: "Lead", frequency: 440, waveformType: "sine", color: "#22c55e" }),
        defaultTrack({ name: "Pad", frequency: 220, waveformType: "triangle", color: "#a855f7" }),
      ],
      activeTrackId: null,
      masterVolume: 0.8,
      zoom: 1,

      setBpm: (bpm) => set({ bpm: Math.max(20, Math.min(300, bpm)) }),
      setLoopEnabled: (v) => set({ loopEnabled: v }),
      setLoopPoints: (start, end) => set({ loopStart: start, loopEnd: Math.max(start + 0.1, end) }),
      setPlaying: (v) => set({ playing: v }),
      setRecording: (v) => set({ recording: v }),
      setCurrentTime: (t) => set({ currentTime: t }),
      addTrack: (overrides) =>
        set((s) => ({ tracks: [...s.tracks, defaultTrack(overrides)] })),
      removeTrack: (id) =>
        set((s) => ({
          tracks: s.tracks.filter((t) => t.id !== id),
          activeTrackId: s.activeTrackId === id ? null : s.activeTrackId,
        })),
      updateTrack: (id, patch) =>
        set((s) => ({
          tracks: s.tracks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      setActiveTrack: (id) => set({ activeTrackId: id }),
      setMasterVolume: (v) => set({ masterVolume: Math.max(0, Math.min(1, v)) }),
      setZoom: (z) => set({ zoom: Math.max(0.25, Math.min(4, z)) }),
      toggleMute: (id) =>
        set((s) => ({
          tracks: s.tracks.map((t) => (t.id === id ? { ...t, muted: !t.muted } : t)),
        })),
      toggleSolo: (id) =>
        set((s) => ({
          tracks: s.tracks.map((t) => (t.id === id ? { ...t, solo: !t.solo } : t)),
        })),
    }),
    { name: "kinlab-daw" },
  ),
);
