import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type VisualParams, DEFAULT_PARAMS } from "@/visual/visualParams";

interface VisualStore {
  params: VisualParams;
  setParam: <K extends keyof VisualParams>(key: K, value: VisualParams[K]) => void;
  setParams: (patch: Partial<VisualParams>) => void;
  resetParams: () => void;
}

export const useVisualStore = create<VisualStore>()(
  persist(
    (set) => ({
      params: { ...DEFAULT_PARAMS },
      setParam: (key, value) => set((s) => ({
        params: { ...s.params, [key]: value },
      })),
      setParams: (patch) => set((s) => ({
        params: { ...s.params, ...patch },
      })),
      resetParams: () => set({ params: { ...DEFAULT_PARAMS } }),
    }),
    { name: "void-visual-params" },
  ),
);
