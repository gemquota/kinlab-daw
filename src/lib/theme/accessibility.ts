import type { ThemeColors } from "./themes";

export interface AccessibilityOverrides {
  highContrast: boolean;
  reducedMotion: boolean;
  fontScale: number;
}

export function applyAccessibilityOverrides(
  colors: ThemeColors,
  overrides: AccessibilityOverrides,
): ThemeColors {
  if (!overrides.highContrast) return colors;

  return {
    ...colors,
    text: {
      ...colors.text,
      primary: "#ffffff",
      secondary: "#e2e8f0",
      tertiary: "#cbd5e1",
    },
    border: {
      ...colors.border,
      subtle: "#475569",
      default: "#64748b",
    },
  };
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function prefersHighContrast(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-contrast: more)").matches;
}
