import type { TaylorCoefficients } from "@/types";

/**
 * A named preset for a Taylor coefficient configuration.
 */
export interface Preset {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Short description */
  description: string;
  /** Category for grouping */
  category: "linear" | "polynomial" | "trigonometric" | "exponential" | "custom";
  /** Taylor coefficients */
  coefficients: TaylorCoefficients;
  /** Suggested simulation time range [start, end] */
  timeRange: [number, number];
  /** Suggested number of sample points */
  sampleCount: number;
  /** Preview icon or emoji */
  icon: string;
}

function buildCoefficients(
  values: number[],
  t0: number = 0,
): TaylorCoefficients {
  return {
    coefficients: values,
    t0,
    maxOrder: values.length - 1,
  };
}

export const PRESETS: readonly Preset[] = [
  {
    id: "constant-velocity",
    name: "Constant Velocity",
    description:
      "Zero acceleration — the object moves at a steady speed. Position grows linearly with time.",
    category: "linear",
    coefficients: buildCoefficients([0, 1]),
    timeRange: [-5, 5],
    sampleCount: 200,
    icon: "→",
  },
  {
    id: "free-fall",
    name: "Free Fall",
    description:
      "Gravity acts alone (g = 9.81 m/s²). Quadratic position, constant acceleration.",
    category: "polynomial",
    coefficients: buildCoefficients([0, 0, 4.905]),
    timeRange: [0, 10],
    sampleCount: 200,
    icon: "⬇",
  },
  {
    id: "shm-sinusoidal",
    name: "Simple Harmonic Motion",
    description:
      "Sinusoidal oscillation with amplitude A = 1, angular frequency ω = 2π. Classic spring-mass system.",
    category: "trigonometric",
    coefficients: buildCoefficients([0, 1, 0, -(Math.pow(2 * Math.PI, 2)) / 6, 0, Math.pow(2 * Math.PI, 4) / 120]),
    timeRange: [0, 4],
    sampleCount: 500,
    icon: "〰",
  },
  {
    id: "cubic-spline",
    name: "Cubic Spline",
    description:
      "A cubic polynomial trajectory with non-zero jerk. Useful for smooth motion planning.",
    category: "polynomial",
    coefficients: buildCoefficients([0, 1, 0.5, -0.1]),
    timeRange: [-3, 3],
    sampleCount: 300,
    icon: "∿",
  },
  {
    id: "exponential-growth",
    name: "Exponential Growth",
    description:
      "All Taylor coefficients are 1/n! which produces e^t. Unbounded exponential acceleration.",
    category: "exponential",
    coefficients: buildCoefficients([1, 1, 0.5, 1 / 6, 1 / 24, 1 / 120, 1 / 720]),
    timeRange: [-2, 3],
    sampleCount: 400,
    icon: "📈",
  },
  {
    id: "custom-blank",
    name: "Custom",
    description:
      "Start from scratch with zero coefficients. Build your own Taylor polynomial.",
    category: "custom",
    coefficients: buildCoefficients([0]),
    timeRange: [-5, 5],
    sampleCount: 200,
    icon: "✏",
  },
];

/**
 * Lookup a preset by id.
 */
export function getPreset(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}

/**
 * Get presets filtered by category.
 */
export function getPresetsByCategory(category: Preset["category"]): readonly Preset[] {
  return PRESETS.filter((p) => p.category === category);
}
