import { describe, it, expect, beforeEach, vi } from "vitest";
import { useThemeStore } from "@/store/theme.store";

vi.mock("@/lib/theme", () => ({
  getTheme: vi.fn(() => ({ colors: {} })),
  applyTheme: vi.fn(),
}));

describe("Theme Store", () => {
  beforeEach(() => {
    localStorage.clear();
    useThemeStore.setState({
      mode: "dark",
      resolvedTheme: "dark",
      reducedMotion: false,
      highContrast: false,
      fontScale: 1,
      densityMode: "comfortable",
    });
  });

  it("has correct initial state", () => {
    const state = useThemeStore.getState();
    expect(state.mode).toBe("dark");
    expect(state.resolvedTheme).toBe("dark");
    expect(state.reducedMotion).toBe(false);
  });

  it("toggleTheme cycles dark -> light -> dark", () => {
    const { toggleTheme } = useThemeStore.getState();
    toggleTheme();
    expect(useThemeStore.getState().mode).toBe("light");
    toggleTheme();
    expect(useThemeStore.getState().mode).toBe("dark");
  });

  it("setReducedMotion works", () => {
    useThemeStore.getState().setReducedMotion(true);
    expect(useThemeStore.getState().reducedMotion).toBe(true);
  });

  it("setHighContrast works", () => {
    useThemeStore.getState().setHighContrast(true);
    expect(useThemeStore.getState().highContrast).toBe(true);
  });

  it("setDensityMode works", () => {
    useThemeStore.getState().setDensityMode("compact");
    expect(useThemeStore.getState().densityMode).toBe("compact");
  });
});
