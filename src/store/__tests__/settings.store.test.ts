import { describe, it, expect, beforeEach } from "vitest";
import { useSettingsStore } from "@/store/settings.store";

describe("settingsStore", () => {
  beforeEach(() => {
    // Reset store state to defaults
    useSettingsStore.setState({
      defaultWorkspace: "waveform",
      autosaveInterval: 5000,
      densityMode: "comfortable",
      locale: "en-US",
      numberFormat: "decimal",
      reducedMotion: false,
      highContrast: false,
      fontScale: 1,
      showKeyboardHints: true,
    });
  });

  it("should have initial state", () => {
    const state = useSettingsStore.getState();
    expect(state.defaultWorkspace).toBe("waveform");
    expect(state.autosaveInterval).toBe(5000);
    expect(state.densityMode).toBe("comfortable");
    expect(state.locale).toBe("en-US");
    expect(state.numberFormat).toBe("decimal");
    expect(state.reducedMotion).toBe(false);
    expect(state.highContrast).toBe(false);
    expect(state.fontScale).toBe(1);
    expect(state.showKeyboardHints).toBe(true);
  });

  it("should set defaultWorkspace", () => {
    useSettingsStore.getState().setDefaultWorkspace("taylor");
    expect(useSettingsStore.getState().defaultWorkspace).toBe("taylor");
  });

  it("should set densityMode", () => {
    useSettingsStore.getState().setDensityMode("compact");
    expect(useSettingsStore.getState().densityMode).toBe("compact");
  });

  it("should set locale", () => {
    useSettingsStore.getState().setLocale("de-DE");
    expect(useSettingsStore.getState().locale).toBe("de-DE");
  });

  it("should set reducedMotion", () => {
    useSettingsStore.getState().setReducedMotion(true);
    expect(useSettingsStore.getState().reducedMotion).toBe(true);
  });

  it("should set highContrast", () => {
    useSettingsStore.getState().setHighContrast(true);
    expect(useSettingsStore.getState().highContrast).toBe(true);
  });

  it("should set fontScale with bounds", () => {
    useSettingsStore.getState().setFontScale(1.2);
    expect(useSettingsStore.getState().fontScale).toBe(1.2);
    
    // Should clamp to min
    useSettingsStore.getState().setFontScale(0.5);
    expect(useSettingsStore.getState().fontScale).toBe(0.8);
    
    // Should clamp to max
    useSettingsStore.getState().setFontScale(2.0);
    expect(useSettingsStore.getState().fontScale).toBe(1.5);
  });

  it("should set autosaveInterval with minimum", () => {
    useSettingsStore.getState().setAutosaveInterval(10000);
    expect(useSettingsStore.getState().autosaveInterval).toBe(10000);
    
    // Should enforce minimum
    useSettingsStore.getState().setAutosaveInterval(500);
    expect(useSettingsStore.getState().autosaveInterval).toBe(1000);
  });
});
