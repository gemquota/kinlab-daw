/**
 * Static build-time configuration.
 */
export const APP_CONFIG = {
  name: "KinLab",
  version: "0.1.0",
  description: "Scientific visualization platform for kinematics and Taylor series analysis",
  buildTime: typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : new Date().toISOString(),
  defaultTheme: "dark" as const,
  defaultPrecision: 1e-10,
  maxDerivativeOrder: 10,
  defaultSampleCount: 200,
  defaultTimeRange: { min: 0, max: 10 },
  maxHistoryEntries: 100,
  autosaveInterval: 5000,
} as const;

export type AppConfig = typeof APP_CONFIG;
