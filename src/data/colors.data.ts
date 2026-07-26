import type { DerivativeOrder, DerivativeRecord } from "@/types";
import { DERIVATIVES } from "./derivatives.data";

/**
 * Derivative color palette indexed by order.
 */
export const DERIVATIVE_COLORS: readonly string[] = DERIVATIVES.map(
  (d) => d.visualization.hexColor,
);

/**
 * Derivative color tokens (Tailwind-friendly class fragments).
 */
export const DERIVATIVE_COLOR_TOKENS: readonly string[] = DERIVATIVES.map(
  (d) => d.visualization.colorToken,
);

/**
 * Derivative CSS variable names.
 */
export const DERIVATIVE_CSS_VARS: readonly string[] = DERIVATIVES.map(
  (d) => d.visualization.cssVar,
);

/**
 * Get the hex color for a derivative order.
 */
export function getColorForOrder(order: DerivativeOrder): string {
  return DERIVATIVES[order]!.visualization.hexColor;
}

/**
 * Linearly interpolate between two hex colors.
 * `t` is clamped to [0, 1].
 */
export function interpolateColor(hex1: string, hex2: string, t: number): string {
  const clamp = Math.max(0, Math.min(1, t));

  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);

  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * clamp);
  const g = Math.round(g1 + (g2 - g1) * clamp);
  const b = Math.round(b1 + (b2 - b1) * clamp);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Generate a gradient array of n colours between hex1 and hex2.
 */
export function colorGradient(hex1: string, hex2: string, steps: number): string[] {
  if (steps <= 0) return [];
  if (steps === 1) return [hex1];
  return Array.from({ length: steps }, (_, i) =>
    interpolateColor(hex1, hex2, i / (steps - 1)),
  );
}

/**
 * Parse a hex string to [r, g, b].
 */
function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

/**
 * Relative luminance per WCAG 2.1.
 */
function luminance(r: number, g: number, b: number): number {
  const rgb = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const rs = rgb[0]!;
  const gs = rgb[1]!;
  const bs = rgb[2]!;
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * WCAG contrast ratio between two hex colours.
 */
export function contrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = luminance(r1, g1, b1);
  const l2 = luminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Returns an accessible colour pair (foreground, background) from the palette
 * that meets the requested WCAG level. Defaults to "AA".
 */
export function findAccessiblePair(
  derivatives: readonly DerivativeRecord[],
  level: "AA" | "AAA" = "AA",
): { foreground: string; background: string } | null {
  const minRatio = level === "AAA" ? 7 : 4.5;

  for (let i = 0; i < derivatives.length; i++) {
    for (let j = i + 1; j < derivatives.length; j++) {
      const fg = derivatives[i]!.visualization.hexColor;
      const bg = derivatives[j]!.visualization.hexColor;
      if (contrastRatio(fg, bg) >= minRatio) {
        return { foreground: fg, background: bg };
      }
    }
  }
  return null;
}

/**
 * Get all accessible colour pairs at the given WCAG level.
 */
export function getAllAccessiblePairs(
  level: "AA" | "AAA" = "AA",
): { foreground: string; background: string; ratio: number }[] {
  const minRatio = level === "AAA" ? 7 : 4.5;
  const pairs: { foreground: string; background: string; ratio: number }[] = [];

  for (let i = 0; i < DERIVATIVES.length; i++) {
    for (let j = i + 1; j < DERIVATIVES.length; j++) {
      const fg = DERIVATIVES[i]!.visualization.hexColor;
      const bg = DERIVATIVES[j]!.visualization.hexColor;
      const ratio = contrastRatio(fg, bg);
      if (ratio >= minRatio) {
        pairs.push({ foreground: fg, background: bg, ratio });
      }
    }
  }

  return pairs.sort((a, b) => b.ratio - a.ratio);
}
