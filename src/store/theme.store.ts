import { create } from "zustand";
import { persist } from "zustand/middleware";
import { applyTheme, getTheme } from "@/lib/theme";
import type { ThemeMode } from "@/types";

interface ThemeStore {
  mode: ThemeMode;
  resolvedTheme: "light" | "dark";
  reducedMotion: boolean;
  highContrast: boolean;
  fontScale: number;
  densityMode: "comfortable" | "compact";

  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  initSystemTheme: () => void;
  setReducedMotion: (reduced: boolean) => void;
  setHighContrast: (hc: boolean) => void;
  setFontScale: (scale: number) => void;
  setDensityMode: (mode: "comfortable" | "compact") => void;
}

function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}

function applyResolvedTheme(resolved: "light" | "dark"): void {
  const theme = getTheme(resolved);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  applyTheme(theme);
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: "dark",
      resolvedTheme: "dark",
      reducedMotion: false,
      highContrast: false,
      fontScale: 1,
      densityMode: "comfortable",

      setMode: (mode: ThemeMode) => {
        const resolved = resolveTheme(mode);
        applyResolvedTheme(resolved);
        set({ mode, resolvedTheme: resolved });
      },

      toggleTheme: () => {
        const current = get().mode;
        const next: ThemeMode = current === "dark" ? "light" : current === "light" ? "dark" : "system";
        get().setMode(next);
      },

      initSystemTheme: () => {
        const resolved = resolveTheme(get().mode);
        applyResolvedTheme(resolved);
        set({ resolvedTheme: resolved });

        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        mq.addEventListener("change", () => {
          if (get().mode === "system") {
            const newResolved = mq.matches ? "dark" : "light";
            applyResolvedTheme(newResolved);
            set({ resolvedTheme: newResolved });
          }
        });
      },

      setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
      setHighContrast: (hc) => set({ highContrast: hc }),
      setFontScale: (scale) => {
        document.documentElement.style.fontSize = `${Math.max(0.8, Math.min(1.5, scale)) * 16}px`;
        set({ fontScale: scale });
      },
      setDensityMode: (mode) => set({ densityMode: mode }),
    }),
    { name: "kinlab-theme" },
  ),
);
