import { describe, it, expect, beforeEach } from "vitest";
import { useSimulatorStore } from "@/store/simulator.store";

describe("Simulator Store", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("has initial state", () => {
    const state = useSimulatorStore.getState();
    expect(state.isPlaying).toBe(false);
    expect(state.speed).toBeGreaterThan(0);
    expect(state.loop).toBe(true);
  });

  it("setPlaying toggles", () => {
    useSimulatorStore.getState().setPlaying(true);
    expect(useSimulatorStore.getState().isPlaying).toBe(true);
  });

  it("speed updates", () => {
    useSimulatorStore.getState().setSpeed(2.5);
    expect(useSimulatorStore.getState().speed).toBe(2.5);
  });

  it("time domain updates", () => {
    useSimulatorStore.getState().setTimeDomain(-5, 5);
    const state = useSimulatorStore.getState();
    expect(state.timeMin).toBe(-5);
    expect(state.timeMax).toBe(5);
  });
});
