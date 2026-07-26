/**
 * Kinematic derivative order — the fundamental identifier.
 * Range: 0 (Position) through 10 (Put).
 */
export type DerivativeOrder = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * Canonical name for each derivative order.
 */
export type DerivativeName =
  | "Position"
  | "Velocity"
  | "Acceleration"
  | "Jerk"
  | "Snap"
  | "Crackle"
  | "Pop"
  | "Lock"
  | "Drop"
  | "Shot"
  | "Put";

/**
 * Common single-letter symbol.
 */
export type DerivativeSymbol = "x" | "v" | "a" | "j" | "s" | "c" | "p" | "l" | "d" | "h" | "u";

/**
 * Standardized notation systems.
 */
export interface NotationSet {
  /** e.g. x(t), v(t), a(t) */
  symbol: string;
  /** Leibniz: dx/dt, d²x/dt², ... */
  leibniz: string;
  /** Newton: ẋ, ẍ, x⃛, ... */
  newton: string;
  /** Lagrange: x'(t), x''(t), x'''(t), ... */
  lagrange: string;
}

/**
 * SI physical units for a derivative.
 */
export interface SiUnit {
  /** Full unit string, e.g. "m/s²" */
  label: string;
  /** Base: "m", "s" */
  base: string;
  /** Numerator dimension */
  numerator: string;
  /** Denominator dimension */
  denominator: string;
}

/**
 * Dimensional analysis result.
 */
export interface Dimension {
  /** Length exponent */
  L: number;
  /** Time exponent */
  T: number;
  /** Mass exponent */
  M: number;
  /** Display string, e.g. "L T⁻²" */
  display: string;
}

/**
 * Mathematical notation metadata.
 */
export interface MathematicalMetadata {
  notation: NotationSet;
  /** Taylor coefficient expression, e.g. "x⁽ⁿ⁾(t₀)/n!" */
  taylorExpression: string;
  /** Factorial scaling factor */
  factorialScale: number;
  /** Differential operator form */
  differentialForm: string;
}

/**
 * Physical metadata.
 */
export interface PhysicalMetadata {
  siUnit: SiUnit;
  dimension: Dimension;
  interpretation: string;
  typicalMagnitude: string;
  measurementMethods: string[];
}

/**
 * Educational content.
 */
export interface EducationalMetadata {
  explanation: string;
  misconceptions: string[];
  everydayExamples: string[];
  engineeringExamples: string[];
  historicalNote: string;
}

/**
 * Visualization configuration.
 */
export interface VisualizationMetadata {
  /** Tailwind color class for this derivative */
  colorToken: string;
  /** Hex color value */
  hexColor: string;
  /** CSS variable name */
  cssVar: string;
  /** Default chart visibility */
  defaultVisible: boolean;
  /** Stroke width for charts */
  strokeWidth: number;
  /** Legend display label */
  legendLabel: string;
  /** Accessibility description */
  a11yLabel: string;
}

/**
 * Animation parameters for simulator.
 */
export interface AnimationMetadata {
  /** Vector arrow color */
  vectorColor: string;
  /** Trail opacity */
  trailOpacity: number;
  /** Emphasis scale when selected */
  emphasisScale: number;
}

/**
 * Complete canonical derivative record.
 */
export interface DerivativeRecord {
  /** Derivative order (0–10) */
  order: DerivativeOrder;
  /** Canonical name */
  name: DerivativeName;
  /** Single-letter symbol */
  symbol: DerivativeSymbol;
  /** Standardized informality flag */
  isStandardized: boolean;
  /** Mathematical metadata */
  math: MathematicalMetadata;
  /** Physical metadata */
  physical: PhysicalMetadata;
  /** Educational content */
  educational: EducationalMetadata;
  /** Visualization configuration */
  visualization: VisualizationMetadata;
  /** Animation parameters */
  animation: AnimationMetadata;
}

/**
 * Chain relationship between derivatives.
 */
export interface DerivativeRelationship {
  parent: DerivativeOrder;
  child: DerivativeOrder;
}

/**
 * Taylor coefficient set — the core data structure
 * that feeds the entire application.
 */
export interface TaylorCoefficients {
  /** Coefficient for each order, indexed by derivative order */
  coefficients: number[];
  /** Center point t₀ */
  t0: number;
  /** Maximum order used */
  maxOrder: number;
}

/**
 * Polynomial evaluation result.
 */
export interface PolynomialResult {
  /** Value at the evaluation point */
  value: number;
  /** All derivative values up to maxOrder */
  derivatives: number[];
  /** Individual term contributions */
  contributions: number[];
  /** Whether numerical precision was adequate */
  isStable: boolean;
}

/**
 * Sampled data point for charts.
 */
export interface SamplePoint {
  t: number;
  values: number[];
  contributions: number[][];
}

/**
 * Playback state.
 */
export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  speed: number;
  loop: boolean;
}

/**
 * Theme mode.
 */
export type ThemeMode = "light" | "dark" | "system";

/**
 * Workspace identifier.
 */
export type WorkspaceId = "waveform";
