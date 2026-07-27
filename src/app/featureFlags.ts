/**
 * Feature flags for progressive rollout.
 * Enable/disable features without code changes.
 */
export interface FeatureFlags {
  /** Enable Web Worker offloading for heavy computation */
  workerOffloading: boolean;
  /** Enable 3D phase space visualization */
  phaseSpace3D: boolean;
  /** Enable symbolic differentiation */
  symbolicDiff: boolean;
  /** Enable parametric curve support */
  parametricCurves: boolean;
  /** Enable multi-dimensional kinematics */
  multiDimensional: boolean;
  /** Enable collaborative features */
  collaboration: boolean;
  /** Enable performance monitoring overlay */
  perfMonitor: boolean;
  /** Enable experimental animations */
  experimentalAnimations: boolean;
  /** Enable advanced export formats */
  advancedExport: boolean;
}

export const DEFAULT_FLAGS: FeatureFlags = {
  workerOffloading: false,
  phaseSpace3D: false,
  symbolicDiff: false,
  parametricCurves: false,
  multiDimensional: false,
  collaboration: false,
  perfMonitor: import.meta.env.DEV,
  experimentalAnimations: false,
  advancedExport: false,
};

let flags = { ...DEFAULT_FLAGS };

/**
 * Returns the current value of a feature flag by key.
 */
export function getFeatureFlag<K extends keyof FeatureFlags>(key: K): FeatureFlags[K] {
  return flags[key];
}

/**
 * Sets a feature flag value at runtime.
 */
export function setFeatureFlag<K extends keyof FeatureFlags>(key: K, value: FeatureFlags[K]): void {
  flags[key] = value;
}

export function getAllFeatureFlags(): FeatureFlags {
  return { ...flags };
}

export function resetFeatureFlags(): void {
  flags = { ...DEFAULT_FLAGS };
}
