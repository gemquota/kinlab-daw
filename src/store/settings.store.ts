import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WorkspaceId } from "@/types";

type DensityMode = "comfortable" | "compact";
type Locale = "en-US" | "en-GB" | "de-DE" | "fr-FR" | "ja-JP";

interface KeyboardShortcut {
  id: string;
  keys: string;
  action: string;
  category: string;
}

interface SettingsStore {
  defaultWorkspace: WorkspaceId;
  autosaveInterval: number;
  densityMode: DensityMode;
  locale: Locale;
  numberFormat: "decimal" | "scientific" | "engineering";
  reducedMotion: boolean;
  highContrast: boolean;
  fontScale: number;
  showKeyboardHints: boolean;
  keyboardShortcuts: KeyboardShortcut[];

  setDefaultWorkspace: (ws: WorkspaceId) => void;
  setAutosaveInterval: (ms: number) => void;
  setDensityMode: (mode: DensityMode) => void;
  setLocale: (locale: Locale) => void;
  setNumberFormat: (fmt: "decimal" | "scientific" | "engineering") => void;
  setReducedMotion: (reduced: boolean) => void;
  setHighContrast: (hc: boolean) => void;
  setFontScale: (scale: number) => void;
  setShowKeyboardHints: (show: boolean) => void;
  updateShortcut: (id: string, keys: string) => void;
}

const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  { id: "palette", keys: "Mod+k", action: "Open Command Palette", category: "General" },
  { id: "undo", keys: "Mod+z", action: "Undo", category: "General" },
  { id: "redo", keys: "Mod+Shift+z", action: "Redo", category: "General" },
  { id: "play", keys: "Space", action: "Play/Pause Simulation", category: "Simulation" },
  { id: "step-back", keys: "ArrowLeft", action: "Step Backward", category: "Simulation" },
  { id: "step-fwd", keys: "ArrowRight", action: "Step Forward", category: "Simulation" },
  { id: "workspace-1", keys: "1", action: "Dashboard", category: "Navigation" },
  { id: "workspace-2", keys: "2", action: "Taylor Laboratory", category: "Navigation" },
  { id: "workspace-3", keys: "3", action: "Motion Simulator", category: "Navigation" },
  { id: "workspace-4", keys: "4", action: "Encyclopedia", category: "Navigation" },
  { id: "workspace-5", keys: "5", action: "Visualizations", category: "Navigation" },
  { id: "toggle-sidebar", keys: "Mod+b", action: "Toggle Sidebar", category: "Layout" },
  { id: "toggle-inspector", keys: "Mod+Shift+b", action: "Toggle Inspector", category: "Layout" },
  { id: "toggle-theme", keys: "Mod+Shift+t", action: "Toggle Theme", category: "Appearance" },
  { id: "escape", keys: "Escape", action: "Close Overlay", category: "General" },
  { id: "export", keys: "Mod+e", action: "Export", category: "General" },
  { id: "save-preset", keys: "Mod+s", action: "Save Preset", category: "Presets" },
  { id: "reset", keys: "Mod+r", action: "Reset Coefficients", category: "Taylor" },
];

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      defaultWorkspace: "waveform",
      autosaveInterval: 5000,
      densityMode: "comfortable",
      locale: "en-US",
      numberFormat: "decimal",
      reducedMotion: false,
      highContrast: false,
      fontScale: 1,
      showKeyboardHints: true,
      keyboardShortcuts: [...DEFAULT_SHORTCUTS],

      setDefaultWorkspace: (ws) => set({ defaultWorkspace: ws }),
      setAutosaveInterval: (ms) => set({ autosaveInterval: Math.max(1000, ms) }),
      setDensityMode: (mode) => set({ densityMode: mode }),
      setLocale: (locale) => set({ locale }),
      setNumberFormat: (fmt) => set({ numberFormat: fmt }),
      setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
      setHighContrast: (hc) => set({ highContrast: hc }),
      setFontScale: (scale) => set({ fontScale: Math.max(0.8, Math.min(1.5, scale)) }),
      setShowKeyboardHints: (show) => set({ showKeyboardHints: show }),
      updateShortcut: (id, keys) =>
        set((s) => ({
          keyboardShortcuts: s.keyboardShortcuts.map((sc) =>
            sc.id === id ? { ...sc, keys } : sc,
          ),
        })),
    }),
    { name: "kinlab-settings" },
  ),
);
