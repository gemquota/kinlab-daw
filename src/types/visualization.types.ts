import type { DerivativeOrder } from "./derivative.types";

/**
 * Supported chart renderer types.
 */
export type ChartType =
  | "line"
  | "area"
  | "bar"
  | "scatter"
  | "heatmap"
  | "polar"
  | "timeline";

/**
 * Axis configuration for a chart.
 */
export interface AxisConfig {
  /** Human-readable label */
  label: string;
  /** Unit string, e.g. "s", "m/s" */
  unit: string;
  /** Minimum domain value */
  min?: number;
  /** Maximum domain value */
  max?: number;
  /** Number of tick marks */
  tickCount?: number;
  /** Logarithmic scale flag */
  logScale?: boolean;
}

/**
 * Series (dataset) configuration for a chart.
 */
export interface SeriesConfig {
  /** Derivative order this series represents */
  derivativeOrder: DerivativeOrder;
  /** Display label override */
  label?: string;
  /** Stroke color (hex) */
  color: string;
  /** Line width in px */
  strokeWidth?: number;
  /** Dash pattern, e.g. [5, 3] */
  dashPattern?: number[];
  /** Whether this series is currently visible */
  visible?: boolean;
  /** Point radius (0 hides points) */
  pointRadius?: number;
  /** Area fill opacity 0–1 */
  fillOpacity?: number;
}

/**
 * Tooltip configuration for chart hover.
 */
export interface TooltipConfig {
  /** Whether tooltips are enabled */
  enabled: boolean;
  /** Tooltip format string: {t}, {name}, {value} placeholders */
  format?: string;
  /** Maximum decimal places */
  precision?: number;
  /** Position relative to cursor */
  position?: "top" | "bottom" | "follow";
  /** Show all series values at the same time */
  shared?: boolean;
}

/**
 * Legend configuration for chart.
 */
export interface LegendConfig {
  /** Whether legend is shown */
  visible: boolean;
  /** Position within the chart area */
  position: "top" | "bottom" | "left" | "right";
  /** Allow clicking to toggle series visibility */
  interactive?: boolean;
  /** Maximum items before scrolling */
  maxItems?: number;
}

/**
 * Complete chart layout descriptor.
 */
export interface ChartLayout {
  type: ChartType;
  title: string;
  xAxis: AxisConfig;
  yAxis: AxisConfig;
  series: SeriesConfig[];
  tooltip: TooltipConfig;
  legend: LegendConfig;
}
