import { describe, it, expect, beforeEach } from "vitest";
import { useWaveformStore } from "@/store/waveform.store";

describe("Waveform Store", () => {
  beforeEach(() => {
    localStorage.clear();
    useWaveformStore.setState({ activePreset: null });
  });

  it("has initial state", () => {
    const state = useWaveformStore.getState();
    expect(state.activePreset).toBeNull();
  });

  it("setActivePreset updates preset", () => {
    useWaveformStore.getState().setActivePreset("test-preset");
    expect(useWaveformStore.getState().activePreset).toBe("test-preset");
  });

  it("setActivePreset can clear", () => {
    useWaveformStore.getState().setActivePreset("test");
    useWaveformStore.getState().setActivePreset(null);
    expect(useWaveformStore.getState().activePreset).toBeNull();
  });
});
