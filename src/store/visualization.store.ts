import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DerivativeOrder } from "@/types";

type ScaleMode = "linear" | "log";
type NormalizationMode = "none" | "minmax" | "zscore";

interface VisualizationStore {
  visibleDerivatives: DerivativeOrder[];
  scaleMode: ScaleMode;
  normalizationMode: NormalizationMode;
  showGrid: boolean;
  showLegend: boolean;
  hoveredSample: number | null;
  crosshairPosition: number | null;
  sampleCount: number;
  zoomLevel: number;
  panOffset: number;

  toggleDerivative: (order: DerivativeOrder) => void;
  setVisibleDerivatives: (orders: DerivativeOrder[]) => void;
  setScaleMode: (mode: ScaleMode) => void;
  setNormalizationMode: (mode: NormalizationMode) => void;
  setShowGrid: (show: boolean) => void;
  setShowLegend: (show: boolean) => void;
  setHoveredSample: (index: number | null) => void;
  setCrosshairPosition: (t: number | null) => void;
  setSampleCount: (count: number) => void;
  setZoomLevel: (level: number) => void;
  setPanOffset: (offset: number) => void;
}

const DEFAULT_VISIBLE: DerivativeOrder[] = [0, 1, 2, 3];

export const useVisualizationStore = create<VisualizationStore>()(
  persist(
    (set) => ({
      visibleDerivatives: [...DEFAULT_VISIBLE],
      scaleMode: "linear",
      normalizationMode: "none",
      showGrid: true,
      showLegend: true,
      hoveredSample: null,
      crosshairPosition: null,
      sampleCount: 200,
      zoomLevel: 1,
      panOffset: 0,

      toggleDerivative: (order) =>
        set((s) => {
          const visible = s.visibleDerivatives.includes(order)
            ? s.visibleDerivatives.filter((o) => o !== order)
            : [...s.visibleDerivatives, order];
          return { visibleDerivatives: visible };
        }),
      setVisibleDerivatives: (orders) => set({ visibleDerivatives: orders }),
      setScaleMode: (mode) => set({ scaleMode: mode }),
      setNormalizationMode: (mode) => set({ normalizationMode: mode }),
      setShowGrid: (show) => set({ showGrid: show }),
      setShowLegend: (show) => set({ showLegend: show }),
      setHoveredSample: (index) => set({ hoveredSample: index }),
      setCrosshairPosition: (t) => set({ crosshairPosition: t }),
      setSampleCount: (count) => set({ sampleCount: Math.max(10, Math.min(2000, count)) }),
      setZoomLevel: (level) => set({ zoomLevel: Math.max(0.1, Math.min(10, level)) }),
      setPanOffset: (offset) => set({ panOffset: offset }),
    }),
    { name: "kinlab-visualization" },
  ),
);
