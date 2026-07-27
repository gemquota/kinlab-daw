import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DrumType } from "@/audio/drumSynth";

export interface PadConfig {
  id: string;
  type: DrumType;
  label: string;
  color: string;
  keyBinding?: string;
  volume: number;
  muted: boolean;
}

const DEFAULT_PADS: PadConfig[] = [
  { id: "pad-1", type: "kick", label: "KICK", color: "#3b82f6", keyBinding: "Q", volume: 1, muted: false },
  { id: "pad-2", type: "hat", label: "HAT", color: "#22c55e", keyBinding: "W", volume: 0.85, muted: false },
  { id: "pad-3", type: "clap", label: "CLAP", color: "#f97316", keyBinding: "E", volume: 0.8, muted: false },
  { id: "pad-4", type: "crash", label: "CRASH", color: "#eab308", keyBinding: "R", volume: 0.5, muted: false },
  { id: "pad-5", type: "bass", label: "BASS", color: "#ef4444", keyBinding: "A", volume: 0.9, muted: false },
  { id: "pad-6", type: "perc", label: "PERC", color: "#a855f7", keyBinding: "S", volume: 0.6, muted: false },
  { id: "pad-7", type: "tom", label: "TOM", color: "#06b6d4", keyBinding: "D", volume: 0.7, muted: false },
  { id: "pad-8", type: "hatOpen", label: "HAT+", color: "#10b981", keyBinding: "F", volume: 0.7, muted: false },
  { id: "pad-9", type: "kick", label: "KICK2", color: "#60a5fa", keyBinding: "Z", volume: 1, muted: false },
  { id: "pad-10", type: "hat", label: "HAT2", color: "#4ade80", keyBinding: "X", volume: 0.85, muted: false },
  { id: "pad-11", type: "clap", label: "CLP2", color: "#fb923c", keyBinding: "C", volume: 0.8, muted: false },
  { id: "pad-12", type: "bass", label: "BAS2", color: "#f87171", keyBinding: "V", volume: 0.9, muted: false },
  { id: "pad-13", type: "tom", label: "TOM2", color: "#22d3ee", keyBinding: "1", volume: 0.7, muted: false },
  { id: "pad-14", type: "perc", label: "PRC2", color: "#c084fc", keyBinding: "2", volume: 0.6, muted: false },
  { id: "pad-15", type: "crash", label: "CRS2", color: "#facc15", keyBinding: "3", volume: 0.5, muted: false },
  { id: "pad-16", type: "hatOpen", label: "HAT3", color: "#34d399", keyBinding: "4", volume: 0.7, muted: false },
];

interface PadGridStore {
  pads: PadConfig[];
  editingPadId: string | null;
  
  setPads: (pads: PadConfig[]) => void;
  updatePad: (id: string, patch: Partial<PadConfig>) => void;
  movePad: (fromIndex: number, toIndex: number) => void;
  addPad: (pad: PadConfig) => void;
  removePad: (id: string) => void;
  setEditingPad: (id: string | null) => void;
  setPadVolume: (id: string, volume: number) => void;
  togglePadMute: (id: string) => void;
}

export const usePadGridStore = create<PadGridStore>()(
  persist(
    (set) => ({
      pads: DEFAULT_PADS,
      editingPadId: null,
      
      setPads: (pads) => set({ pads }),
      
      updatePad: (id, patch) => set((s) => ({
        pads: s.pads.map((p) => p.id === id ? { ...p, ...patch } : p),
      })),
      
      movePad: (fromIndex, toIndex) => set((s) => {
        const newPads = [...s.pads];
        const [removed] = newPads.splice(fromIndex, 1);
        if (removed) {
          newPads.splice(toIndex, 0, removed);
        }
        return { pads: newPads };
      }),
      
      addPad: (pad) => set((s) => ({
        pads: [...s.pads, pad],
      })),
      
      removePad: (id) => set((s) => ({
        pads: s.pads.filter((p) => p.id !== id),
      })),
      
      setEditingPad: (id) => set({ editingPadId: id }),
      
      setPadVolume: (id, volume) => set((s) => ({
        pads: s.pads.map((p) => p.id === id ? { ...p, volume } : p),
      })),
      
      togglePadMute: (id) => set((s) => ({
        pads: s.pads.map((p) => p.id === id ? { ...p, muted: !p.muted } : p),
      })),
    }),
    { name: "void-pad-grid" },
  ),
);
