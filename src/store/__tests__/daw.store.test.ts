import { describe, it, expect, beforeEach } from "vitest";
import { useDAWStore } from "@/store/daw.store";

describe("DAW Store", () => {
  beforeEach(() => {
    localStorage.clear();
    useDAWStore.setState({
      bpm: 135,
      playing: false,
      currentTime: 0,
      masterVolume: 0.85,
      currentStep: 0,
      patternIndex: 0,
      sidePanel: null,
      reverb: 0.35,
      delayMix: 0.18,
      filterCutoff: 20000,
    });
  });

  it("has correct initial state", () => {
    const state = useDAWStore.getState();
    expect(state.bpm).toBe(135);
    expect(state.playing).toBe(false);
    expect(state.masterVolume).toBe(0.85);
    expect(state.sidePanel).toBeNull();
  });

  it("setBpm clamps to 60-200 range", () => {
    const { setBpm } = useDAWStore.getState();
    setBpm(10);
    expect(useDAWStore.getState().bpm).toBe(60);
    setBpm(300);
    expect(useDAWStore.getState().bpm).toBe(200);
    setBpm(120);
    expect(useDAWStore.getState().bpm).toBe(120);
  });

  it("setPlaying toggles", () => {
    const { setPlaying } = useDAWStore.getState();
    setPlaying(true);
    expect(useDAWStore.getState().playing).toBe(true);
    setPlaying(false);
    expect(useDAWStore.getState().playing).toBe(false);
  });

  it("setMasterVolume clamps to 0-1", () => {
    const { setMasterVolume } = useDAWStore.getState();
    setMasterVolume(-0.5);
    expect(useDAWStore.getState().masterVolume).toBe(0);
    setMasterVolume(1.5);
    expect(useDAWStore.getState().masterVolume).toBe(1);
    setMasterVolume(0.7);
    expect(useDAWStore.getState().masterVolume).toBe(0.7);
  });

  it("cyclePattern rotates through patterns", () => {
    const { cyclePattern } = useDAWStore.getState();
    const initial = useDAWStore.getState().patternIndex;
    cyclePattern();
    expect(useDAWStore.getState().patternIndex).toBe((initial + 1) % 5);
  });

  it("setDrumVolume clamps 0-1", () => {
    const { setDrumVolume } = useDAWStore.getState();
    setDrumVolume("kick", -1);
    expect(useDAWStore.getState().drumVolumes.kick).toBe(0);
    setDrumVolume("kick", 2);
    expect(useDAWStore.getState().drumVolumes.kick).toBe(1);
  });

  it("setDrumMute toggles", () => {
    const { setDrumMute } = useDAWStore.getState();
    setDrumMute("hat", true);
    expect(useDAWStore.getState().drumMutes.hat).toBe(true);
    setDrumMute("hat", false);
    expect(useDAWStore.getState().drumMutes.hat).toBe(false);
  });

  it("setSidePanel updates", () => {
    const { setSidePanel } = useDAWStore.getState();
    setSidePanel("mixer");
    expect(useDAWStore.getState().sidePanel).toBe("mixer");
    setSidePanel(null);
    expect(useDAWStore.getState().sidePanel).toBeNull();
  });

  it("setFilterCutoff clamps 50-20000", () => {
    const { setFilterCutoff } = useDAWStore.getState();
    setFilterCutoff(10);
    expect(useDAWStore.getState().filterCutoff).toBe(50);
    setFilterCutoff(30000);
    expect(useDAWStore.getState().filterCutoff).toBe(20000);
  });
});
