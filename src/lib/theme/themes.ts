import { DERIVATIVE_COLORS } from "./tokens";

export interface ThemeColors {
  surface: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    accent: string;
  };
  border: {
    subtle: string;
    default: string;
    strong: string;
    accent: string;
  };
  feedback: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  glass: {
    bg: string;
    border: string;
    blur: string;
  };
}

export const LIGHT_THEME: Theme = {
  name: "light",
  colors: {
    surface: {
      primary: "#ffffff",
      secondary: "#f8fafc",
      tertiary: "#f1f5f9",
      elevated: "#ffffff",
      overlay: "rgba(0, 0, 0, 0.5)",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
      tertiary: "#94a3b8",
      inverse: "#ffffff",
      accent: "#3b82f6",
    },
    border: {
      subtle: "#e2e8f0",
      default: "#cbd5e1",
      strong: "#94a3b8",
      accent: "#3b82f6",
    },
    feedback: {
      success: "#22c55e",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
  },
  glass: {
    bg: "rgba(255, 255, 255, 0.7)",
    border: "rgba(255, 255, 255, 0.3)",
    blur: "blur(12px)",
  },
};

export const DARK_THEME: Theme = {
  name: "dark",
  colors: {
    surface: {
      primary: "#0f172a",
      secondary: "#1e293b",
      tertiary: "#334155",
      elevated: "#1e293b",
      overlay: "rgba(0, 0, 0, 0.7)",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#94a3b8",
      tertiary: "#64748b",
      inverse: "#0f172a",
      accent: "#60a5fa",
    },
    border: {
      subtle: "#1e293b",
      default: "#334155",
      strong: "#475569",
      accent: "#60a5fa",
    },
    feedback: {
      success: "#4ade80",
      warning: "#fbbf24",
      error: "#f87171",
      info: "#60a5fa",
    },
  },
  glass: {
    bg: "rgba(15, 23, 42, 0.8)",
    border: "rgba(255, 255, 255, 0.1)",
    blur: "blur(12px)",
  },
};

/**
 * Apply a theme to the document root.
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const { colors, glass } = theme;

  root.style.setProperty("--surface-primary", colors.surface.primary);
  root.style.setProperty("--surface-secondary", colors.surface.secondary);
  root.style.setProperty("--surface-tertiary", colors.surface.tertiary);
  root.style.setProperty("--surface-elevated", colors.surface.elevated);
  root.style.setProperty("--surface-overlay", colors.surface.overlay);

  root.style.setProperty("--text-primary", colors.text.primary);
  root.style.setProperty("--text-secondary", colors.text.secondary);
  root.style.setProperty("--text-tertiary", colors.text.tertiary);
  root.style.setProperty("--text-inverse", colors.text.inverse);
  root.style.setProperty("--text-accent", colors.text.accent);

  root.style.setProperty("--border-subtle", colors.border.subtle);
  root.style.setProperty("--border-default", colors.border.default);
  root.style.setProperty("--border-strong", colors.border.strong);
  root.style.setProperty("--border-accent", colors.border.accent);

  for (const [order, color] of Object.entries(DERIVATIVE_COLORS)) {
    root.style.setProperty(`--color-derivative-${order}`, color.hex);
  }

  root.style.setProperty("--glass-bg", glass.bg);
  root.style.setProperty("--glass-border", glass.border);
}

export function getTheme(name: "light" | "dark"): Theme {
  return name === "dark" ? DARK_THEME : LIGHT_THEME;
}
