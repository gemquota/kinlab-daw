import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface VectorVisibility {
  position: boolean;
  velocity: boolean;
  acceleration: boolean;
  jerk: boolean;
}

interface SimulatorStore {
  /** Current simulation time */
  currentTime: number;
  /** Is playback active */
  isPlaying: boolean;
  /** Playback speed multiplier */
  speed: number;
  /** Whether to loop playback */
  loop: boolean;
  /** Minimum time domain */
  timeMin: number;
  /** Maximum time domain */
  timeMax: number;
  /** Number of trail points to retain */
  trailLength: number;
  /** Number of ghost frames for motion blur */
  ghostCount: number;
  /** Which vectors are visible */
  vectors: VectorVisibility;
  /** Trail rendering enabled */
  trailsEnabled: boolean;

  setCurrentTime: (t: number) => void;
  togglePlayback: () => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  setLoop: (loop: boolean) => void;
  setTimeDomain: (min: number, max: number) => void;
  setTrailLength: (length: number) => void;
  setGhostCount: (count: number) => void;
  toggleVector: (key: keyof VectorVisibility) => void;
  setVectors: (vectors: Partial<VectorVisibility>) => void;
  setTrailsEnabled: (enabled: boolean) => void;
  reset: () => void;
}

const DEFAULTS = {
  currentTime: 0,
  isPlaying: false,
  speed: 1,
  loop: true,
  timeMin: 0,
  timeMax: 10,
  trailLength: 100,
  ghostCount: 3,
  vectors: { position: true, velocity: true, acceleration: true, jerk: false } as VectorVisibility,
  trailsEnabled: true,
};

export const useSimulatorStore = create<SimulatorStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,

      setCurrentTime: (t) => set({ currentTime: t }),
      togglePlayback: () => set((s) => ({ isPlaying: !s.isPlaying })),
      setPlaying: (playing) => set({ isPlaying: playing }),
      setSpeed: (speed) => set({ speed: Math.max(0.1, Math.min(10, speed)) }),
      setLoop: (loop) => set({ loop }),
      setTimeDomain: (min, max) => set({ timeMin: min, timeMax: max }),
      setTrailLength: (length) => set({ trailLength: Math.max(10, Math.min(1000, length)) }),
      setGhostCount: (count) => set({ ghostCount: Math.max(0, Math.min(10, count)) }),
      toggleVector: (key) =>
        set((s) => ({
          vectors: { ...s.vectors, [key]: !s.vectors[key] },
        })),
      setVectors: (vectors) =>
        set((s) => ({ vectors: { ...s.vectors, ...vectors } })),
      setTrailsEnabled: (enabled) => set({ trailsEnabled: enabled }),
      reset: () => set(DEFAULTS),
    }),
    { name: "kinlab-simulator" },
  ),
);
