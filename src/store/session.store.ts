import { create } from "zustand";
import type { WorkspaceId, DerivativeOrder, PlaybackState } from "@/types";

interface SessionStore {
  activeWorkspace: WorkspaceId;
  selectedDerivative: DerivativeOrder;
  playback: PlaybackState;
  setWorkspace: (id: WorkspaceId) => void;
  setSelectedDerivative: (order: DerivativeOrder) => void;
  setPlayback: (state: Partial<PlaybackState>) => void;
  togglePlayback: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  activeWorkspace: "waveform",
  selectedDerivative: 0,
  playback: {
    isPlaying: false,
    currentTime: 0,
    speed: 1,
    loop: true,
  },

  setWorkspace: (id) => set({ activeWorkspace: id }),
  setSelectedDerivative: (order) => set({ selectedDerivative: order }),
  setPlayback: (partial) =>
    set((s) => ({ playback: { ...s.playback, ...partial } })),
  togglePlayback: () =>
    set((s) => ({
      playback: { ...s.playback, isPlaying: !s.playback.isPlaying },
    })),
}));
