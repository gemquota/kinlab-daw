import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StepPattern } from "@/sequencer/stepSequencer";
import { createPattern } from "@/sequencer/stepSequencer";
import type { ArpConfig, ArpNote } from "@/music/arpeggios";
import { DEFAULT_ARP_CONFIG } from "@/music/arpeggios";
import type { MIDITrack } from "@/music/midiTrack";
import { createMIDITrack } from "@/music/midiTrack";

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

export type ProceduralGenId =
  | "l-system" | "cellular" | "lorenz" | "rossler"
  | "markov" | "randomWalk" | "fractal" | "golden"
  | "euclidean" | "hybrid";

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

  // Step sequencer
  sequencerPattern: StepPattern;
  sequencerDivision: number;
  sequencerActive: boolean;

  // Arpeggiator
  arpConfig: ArpConfig;
  arpNotes: number[];
  arpActive: boolean;
  generatedArpNotes: ArpNote[];

  // MIDI tracks
  midiTracks: MIDITrack[];
  activeMidiTrackId: string | null;

  // Procedural
  proceduralGenId: ProceduralGenId;
  proceduralSeed: number;
  proceduralDensity: number;
  proceduralComplexity: number;

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

  // Sequencer actions
  setSequencerPattern: (pat: StepPattern) => void;
  setSequencerDivision: (d: number) => void;
  toggleSequencerActive: () => void;

  // Arp actions
  setArpConfig: (cfg: Partial<ArpConfig>) => void;
  setArpNotes: (notes: number[]) => void;
  toggleArpActive: () => void;
  setGeneratedArpNotes: (notes: ArpNote[]) => void;

  // MIDI actions
  addMidiTrack: (track?: Partial<MIDITrack>) => void;
  removeMidiTrack: (id: string) => void;
  updateMidiTrack: (id: string, patch: Partial<MIDITrack>) => void;
  setActiveMidiTrack: (id: string | null) => void;

  // Procedural actions
  setProceduralGen: (id: ProceduralGenId) => void;
  setProceduralSeed: (s: number) => void;
  setProceduralDensity: (d: number) => void;
  setProceduralComplexity: (c: number) => void;
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
    muted: false, solo: false, volume: 0.7, pan: 0,
    waveformType: "sine",
    frequency: 220 * Math.pow(2, idx / 12),
    amplitude: 0.5, detune: 0, filterFreq: 20000, filterQ: 1,
    color: TRACK_COLORS[idx % TRACK_COLORS.length]!,
    ...overrides,
  };
}

export const useDAWStore = create<DAWStore>()(
  persist(
    (set) => ({
      bpm: 120, loopEnabled: true, loopStart: 0, loopEnd: 4,
      playing: false, recording: false, currentTime: 0,
      tracks: [
        defaultTrack({ name: "Bass", frequency: 110, waveformType: "sawtooth", color: "#3b82f6" }),
        defaultTrack({ name: "Lead", frequency: 440, waveformType: "sine", color: "#22c55e" }),
        defaultTrack({ name: "Pad", frequency: 220, waveformType: "triangle", color: "#a855f7" }),
      ],
      activeTrackId: null, masterVolume: 0.8, zoom: 1,

      sequencerPattern: createPattern("Default", 16, 60),
      sequencerDivision: 4,
      sequencerActive: false,

      arpConfig: { ...DEFAULT_ARP_CONFIG },
      arpNotes: [60, 64, 67, 72],
      arpActive: false,
      generatedArpNotes: [],

      midiTracks: [],
      activeMidiTrackId: null,

      proceduralGenId: "l-system",
      proceduralSeed: 42,
      proceduralDensity: 0.7,
      proceduralComplexity: 0.5,

      setBpm: (bpm) => set({ bpm: Math.max(20, Math.min(300, bpm)) }),
      setLoopEnabled: (v) => set({ loopEnabled: v }),
      setLoopPoints: (start, end) => set({ loopStart: start, loopEnd: Math.max(start + 0.1, end) }),
      setPlaying: (v) => set({ playing: v }),
      setRecording: (v) => set({ recording: v }),
      setCurrentTime: (t) => set({ currentTime: t }),
      addTrack: (o) => set((s) => ({ tracks: [...s.tracks, defaultTrack(o)] })),
      removeTrack: (id) => set((s) => ({ tracks: s.tracks.filter((t) => t.id !== id), activeTrackId: s.activeTrackId === id ? null : s.activeTrackId })),
      updateTrack: (id, patch) => set((s) => ({ tracks: s.tracks.map((t) => t.id === id ? { ...t, ...patch } : t) })),
      setActiveTrack: (id) => set({ activeTrackId: id }),
      setMasterVolume: (v) => set({ masterVolume: Math.max(0, Math.min(1, v)) }),
      setZoom: (z) => set({ zoom: Math.max(0.25, Math.min(4, z)) }),
      toggleMute: (id) => set((s) => ({ tracks: s.tracks.map((t) => t.id === id ? { ...t, muted: !t.muted } : t) })),
      toggleSolo: (id) => set((s) => ({ tracks: s.tracks.map((t) => t.id === id ? { ...t, solo: !t.solo } : t) })),

      setSequencerPattern: (pat) => set({ sequencerPattern: pat }),
      setSequencerDivision: (d) => set({ sequencerDivision: d }),
      toggleSequencerActive: () => set((s) => ({ sequencerActive: !s.sequencerActive })),

      setArpConfig: (cfg) => set((s) => ({ arpConfig: { ...s.arpConfig, ...cfg } })),
      setArpNotes: (notes) => set({ arpNotes: notes }),
      toggleArpActive: () => set((s) => ({ arpActive: !s.arpActive })),
      setGeneratedArpNotes: (notes) => set({ generatedArpNotes: notes }),

      addMidiTrack: (o) => set((s) => ({ midiTracks: [...s.midiTracks, createMIDITrack(o?.name ?? `MIDI ${s.midiTracks.length + 1}`, o?.length ?? 4, o?.color)] })),
      removeMidiTrack: (id) => set((s) => ({ midiTracks: s.midiTracks.filter((t) => t.id !== id), activeMidiTrackId: s.activeMidiTrackId === id ? null : s.activeMidiTrackId })),
      updateMidiTrack: (id, patch) => set((s) => ({ midiTracks: s.midiTracks.map((t) => t.id === id ? { ...t, ...patch } : t) })),
      setActiveMidiTrack: (id) => set({ activeMidiTrackId: id }),

      setProceduralGen: (id) => set({ proceduralGenId: id }),
      setProceduralSeed: (s) => set({ proceduralSeed: s }),
      setProceduralDensity: (d) => set({ proceduralDensity: Math.max(0, Math.min(1, d)) }),
      setProceduralComplexity: (c) => set({ proceduralComplexity: Math.max(0, Math.min(1, c)) }),
    }),
    { name: "kinlab-daw-v2" },
  ),
);
