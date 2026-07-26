/**
 * Design tokens — the single source of truth for all visual values.
 * Components consume these tokens, never raw values.
 */

/* ─── Derivative Colors ─── */
export const DERIVATIVE_COLORS = {
  0: { name: "Position",   hex: "#3b82f6", hsl: "217 91% 60%" },
  1: { name: "Velocity",   hex: "#22c55e", hsl: "142 71% 45%" },
  2: { name: "Acceleration", hex: "#f97316", hsl: "25 95% 53%" },
  3: { name: "Jerk",       hex: "#ef4444", hsl: "0 84% 60%" },
  4: { name: "Snap",       hex: "#a855f7", hsl: "271 91% 65%" },
  5: { name: "Crackle",    hex: "#ec4899", hsl: "330 81% 60%" },
  6: { name: "Pop",        hex: "#06b6d4", hsl: "188 80% 43%" },
  7: { name: "Lock",       hex: "#eab308", hsl: "48 96% 47%" },
  8: { name: "Drop",       hex: "#14b8a6", hsl: "168 76% 40%" },
  9: { name: "Shot",       hex: "#6366f1", hsl: "239 84% 67%" },
  10: { name: "Put",       hex: "#10b981", hsl: "160 84% 39%" },
} as const;

/* ─── Typography Tokens ─── */
export const TYPOGRAPHY = {
  fontFamily: {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
    math: "'Latin Modern Math', 'STIX Two Math', serif",
    display: "'Inter', system-ui, sans-serif",
  },
  scale: {
    displayLg:  { size: "3rem",     weight: "700", lineHeight: "1.1" },
    displayMd:  { size: "2.25rem",  weight: "700", lineHeight: "1.15" },
    displaySm:  { size: "1.875rem", weight: "600", lineHeight: "1.2" },
    h1:         { size: "1.5rem",   weight: "600", lineHeight: "1.25" },
    h2:         { size: "1.25rem",  weight: "600", lineHeight: "1.3" },
    h3:         { size: "1.125rem", weight: "600", lineHeight: "1.35" },
    bodyLg:     { size: "1.0625rem", weight: "400", lineHeight: "1.6" },
    body:       { size: "0.9375rem", weight: "400", lineHeight: "1.6" },
    caption:    { size: "0.8125rem", weight: "400", lineHeight: "1.5" },
    micro:      { size: "0.6875rem", weight: "400", lineHeight: "1.4" },
    mono:       { size: "0.875rem",  weight: "400", lineHeight: "1.5" },
  },
} as const;

/* ─── Spacing Tokens ─── */
export const SPACING = {
  px: "1px",
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
} as const;

/* ─── Radius Tokens ─── */
export const RADIUS = {
  none: "0",
  xs: "0.25rem",
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
  "3xl": "2rem",
  full: "9999px",
} as const;

/* ─── Motion Tokens ─── */
export const MOTION = {
  duration: {
    instant: "0ms",
    fast: "100ms",
    standard: "200ms",
    smooth: "300ms",
    emphasized: "500ms",
    educational: "1000ms",
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
} as const;

/* ─── Elevation Tokens ─── */
export const ELEVATION = {
  none: "none",
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
  glass: "0 8px 32px rgba(0, 0, 0, 0.08)",
} as const;
