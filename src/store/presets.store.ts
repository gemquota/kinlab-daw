import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DerivativeOrder } from "@/types";

export interface Preset {
  id: string;
  name: string;
  description: string;
  category: string;
  coefficients: number[];
  t0: number;
  maxOrder: DerivativeOrder;
  createdAt: string;
  modifiedAt: string;
  isBuiltIn: boolean;
}

interface PresetsStore {
  presets: Preset[];
  activePresetId: string | null;
  selectedCategory: string;

  addPreset: (preset: Omit<Preset, "id" | "createdAt" | "modifiedAt">) => void;
  updatePreset: (id: string, updates: Partial<Preset>) => void;
  deletePreset: (id: string) => void;
  setActivePreset: (id: string | null) => void;
  setSelectedCategory: (category: string) => void;
  loadPreset: (id: string) => { coefficients: number[]; t0: number; maxOrder: number } | null;
  getPresetsByCategory: (category: string) => Preset[];
}

let nextId = 1;

export const usePresetsStore = create<PresetsStore>()(
  persist(
    (set, get) => ({
      presets: [
        {
          id: "builtin-linear",
          name: "Linear Motion",
          description: "Constant velocity motion with no acceleration",
          category: "Basic",
          coefficients: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          t0: 0,
          maxOrder: 1,
          createdAt: "2026-01-01",
          modifiedAt: "2026-01-01",
          isBuiltIn: true,
        },
        {
          id: "builtin-quadratic",
          name: "Free Fall",
          description: "Acceleration under gravity (simplified)",
          category: "Basic",
          coefficients: [0, 0, 4.9, 0, 0, 0, 0, 0, 0, 0, 0],
          t0: 0,
          maxOrder: 2,
          createdAt: "2026-01-01",
          modifiedAt: "2026-01-01",
          isBuiltIn: true,
        },
        {
          id: "builtin-cubic",
          name: "Smooth Jerk",
          description: "Third-order motion with gradual acceleration change",
          category: "Advanced",
          coefficients: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
          t0: 0,
          maxOrder: 3,
          createdAt: "2026-01-01",
          modifiedAt: "2026-01-01",
          isBuiltIn: true,
        },
      ],
      activePresetId: null,
      selectedCategory: "All",

      addPreset: (preset) => {
        const now = new Date().toISOString();
        const id = `user-${nextId++}`;
        set((s) => ({
          presets: [
            ...s.presets,
            { ...preset, id, createdAt: now, modifiedAt: now, isBuiltIn: false },
          ],
        }));
      },

      updatePreset: (id, updates) =>
        set((s) => ({
          presets: s.presets.map((p) =>
            p.id === id ? { ...p, ...updates, modifiedAt: new Date().toISOString() } : p,
          ),
        })),

      deletePreset: (id) =>
        set((s) => ({
          presets: s.presets.filter((p) => p.id !== id || p.isBuiltIn),
          activePresetId: s.activePresetId === id ? null : s.activePresetId,
        })),

      setActivePreset: (id) => set({ activePresetId: id }),

      setSelectedCategory: (category) => set({ selectedCategory: category }),

      loadPreset: (id) => {
        const preset = get().presets.find((p) => p.id === id);
        if (!preset) return null;
        return { coefficients: preset.coefficients, t0: preset.t0, maxOrder: preset.maxOrder };
      },

      getPresetsByCategory: (category) => {
        const presets = get().presets;
        if (category === "All") return presets;
        return presets.filter((p) => p.category === category);
      },
    }),
    { name: "kinlab-presets" },
  ),
);
