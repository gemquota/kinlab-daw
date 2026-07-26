import { create } from "zustand";
import type { TaylorCoefficients, DerivativeOrder } from "@/types";

interface TaylorStore {
  coefficients: TaylorCoefficients;
  setCoefficient: (order: DerivativeOrder, value: number) => void;
  setCoefficients: (coeffs: number[]) => void;
  setCenterPoint: (t0: number) => void;
  resetToDefaults: () => void;
}

const DEFAULT_COEFFICIENTS = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const DEFAULT_T0 = 0;

export const useTaylorStore = create<TaylorStore>((set) => ({
  coefficients: {
    coefficients: [...DEFAULT_COEFFICIENTS],
    t0: DEFAULT_T0,
    maxOrder: 4,
  },

  /**
   * Set a coefficient at a given order.
   * When the value increases (increments), all higher-order
   * coefficients reset to zero — like a mechanical counter.
   */
  setCoefficient: (order, value) =>
    set((s) => {
      const prev = s.coefficients.coefficients;
      const oldValue = prev[order] ?? 0;
      const newCoeffs = [...prev];

      newCoeffs[order] = value;

      // On increment, reset all higher-order coefficients to zero
      if (value > oldValue) {
        for (let i = order + 1; i < newCoeffs.length; i++) {
          newCoeffs[i] = 0;
        }
      }

      // Recompute maxOrder from the highest non-zero coefficient
      let maxOrder: DerivativeOrder = 0;
      for (let i = newCoeffs.length - 1; i >= 0; i--) {
        if (Math.abs(newCoeffs[i] ?? 0) > 1e-10) {
          maxOrder = i as DerivativeOrder;
          break;
        }
      }

      return {
        coefficients: {
          ...s.coefficients,
          coefficients: newCoeffs,
          maxOrder,
        },
      };
    }),

  setCoefficients: (coeffs) =>
    set((s) => ({
      coefficients: { ...s.coefficients, coefficients: coeffs },
    })),

  setCenterPoint: (t0) =>
    set((s) => ({
      coefficients: { ...s.coefficients, t0 },
    })),

  resetToDefaults: () =>
    set({
      coefficients: {
        coefficients: [...DEFAULT_COEFFICIENTS],
        t0: DEFAULT_T0,
        maxOrder: 4,
      },
    }),
}));
