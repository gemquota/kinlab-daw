import { describe, it, expect, beforeEach } from "vitest";
import { useSessionStore } from "@/store/session.store";

describe("sessionStore", () => {
  beforeEach(() => {
    // Reset store state to defaults
    useSessionStore.setState({
      activeWorkspace: "waveform",
      selectedDerivative: 0,
      playback: {
        isPlaying: false,
        currentTime: 0,
        speed: 1,
        loop: true,
      },
    });
  });

  it("should have initial state", () => {
    const state = useSessionStore.getState();
    expect(state.activeWorkspace).toBe("waveform");
    expect(state.selectedDerivative).toBe(0);
    expect(state.playback).toEqual({
      isPlaying: false,
      currentTime: 0,
      speed: 1,
      loop: true,
    });
  });

  it("should set workspace", () => {
    useSessionStore.getState().setWorkspace("taylor");
    expect(useSessionStore.getState().activeWorkspace).toBe("taylor");
  });

  it("should set selectedDerivative", () => {
    useSessionStore.getState().setSelectedDerivative(3);
    expect(useSessionStore.getState().selectedDerivative).toBe(3);
  });

  it("should set playback state", () => {
    useSessionStore.getState().setPlayback({ isPlaying: true, currentTime: 10 });
    expect(useSessionStore.getState().playback.isPlaying).toBe(true);
    expect(useSessionStore.getState().playback.currentTime).toBe(10);
    // Other properties should remain
    expect(useSessionStore.getState().playback.speed).toBe(1);
    expect(useSessionStore.getState().playback.loop).toBe(true);
  });

  it("should toggle playback", () => {
    expect(useSessionStore.getState().playback.isPlaying).toBe(false);
    useSessionStore.getState().togglePlayback();
    expect(useSessionStore.getState().playback.isPlaying).toBe(true);
    useSessionStore.getState().togglePlayback();
    expect(useSessionStore.getState().playback.isPlaying).toBe(false);
  });
});
