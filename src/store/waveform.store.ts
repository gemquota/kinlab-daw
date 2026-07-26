import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createDefaultWaveformConfig,
  type WaveformConfig,
  type HarmonicComponent,
} from "@/math/waveform/waveform.engine";

interface WaveformStore {
  config: WaveformConfig;
  currentTime: number;
  isPlaying: boolean;
  speed: number;
  timeRange: number;
  showDerivatives: boolean;
  showSpectrum: boolean;
  showComponents: boolean;
  activePreset: string | null;

  // Component editing
  updateComponent: (id: string, patch: Partial<HarmonicComponent>) => void;
  addComponent: () => void;
  removeComponent: (id: string) => void;

  // Config editing
  setDamping: (v: number) => void;
  setResonanceFreq: (v: number) => void;
  setResonanceWidth: (v: number) => void;
  setResonanceGain: (v: number) => void;
  setModulationFreq: (v: number) => void;
  setModulationDepth: (v: number) => void;
  setTimeStretch: (v: number) => void;
  setNoiseAmount: (v: number) => void;
  setWaveformType: (v: WaveformConfig["waveformType"]) => void;
  setConfig: (config: WaveformConfig) => void;

  // Playback
  setCurrentTime: (t: number) => void;
  togglePlayback: () => void;
  setSpeed: (s: number) => void;
  setTimeRange: (r: number) => void;
  reset: () => void;

  // UI toggles
  setShowDerivatives: (v: boolean) => void;
  setShowSpectrum: (v: boolean) => void;
  setShowComponents: (v: boolean) => void;
  setActivePreset: (name: string | null) => void;
}

let nextId = 100;

export const useWaveformStore = create<WaveformStore>()(
  persist(
    (set) => ({
      config: createDefaultWaveformConfig(),
      currentTime: 0,
      isPlaying: false,
      speed: 1,
      timeRange: 4,
      showDerivatives: true,
      showSpectrum: false,
      showComponents: false,
      activePreset: null,

      updateComponent: (id, patch) =>
        set((s) => ({
          config: {
            ...s.config,
            components: s.config.components.map((c) =>
              c.id === id ? { ...c, ...patch } : c,
            ),
          },
        })),

      addComponent: () =>
        set((s) => ({
          config: {
            ...s.config,
            components: [
              ...s.config.components,
              {
                id: `h${++nextId}`,
                frequency: s.config.components.length + 1,
                amplitude: 0.3,
                phase: 0,
                enabled: true,
              },
            ],
          },
        })),

      removeComponent: (id) =>
        set((s) => ({
          config: {
            ...s.config,
            components: s.config.components.filter((c) => c.id !== id),
          },
        })),

      setDamping: (v) => set((s) => ({ config: { ...s.config, damping: v } })),
      setResonanceFreq: (v) => set((s) => ({ config: { ...s.config, resonanceFreq: v } })),
      setResonanceWidth: (v) => set((s) => ({ config: { ...s.config, resonanceWidth: v } })),
      setResonanceGain: (v) => set((s) => ({ config: { ...s.config, resonanceGain: v } })),
      setModulationFreq: (v) => set((s) => ({ config: { ...s.config, modulationFreq: v } })),
      setModulationDepth: (v) => set((s) => ({ config: { ...s.config, modulationDepth: v } })),
      setTimeStretch: (v) => set((s) => ({ config: { ...s.config, timeStretch: v } })),
      setNoiseAmount: (v) => set((s) => ({ config: { ...s.config, noiseAmount: v } })),
      setWaveformType: (v) => set((s) => ({ config: { ...s.config, waveformType: v } })),
      setConfig: (config) => set({ config }),

      setCurrentTime: (t) => set({ currentTime: t }),
      togglePlayback: () => set((s) => ({ isPlaying: !s.isPlaying })),
      setSpeed: (s) => set({ speed: Math.max(0.1, Math.min(10, s)) }),
      setTimeRange: (r) => set({ timeRange: Math.max(0.5, Math.min(20, r)) }),
      reset: () =>
        set({
          config: createDefaultWaveformConfig(),
          currentTime: 0,
          isPlaying: false,
          activePreset: null,
        }),

      setShowDerivatives: (v) => set({ showDerivatives: v }),
      setShowSpectrum: (v) => set({ showSpectrum: v }),
      setShowComponents: (v) => set({ showComponents: v }),
      setActivePreset: (name) => set({ activePreset: name }),
    }),
    { name: "kinlab-waveform" },
  ),
);
