import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/audio/audioEngine", () => ({
  resumeAudio: vi.fn(),
  setMasterVolume: vi.fn(),
  setDrumVolume: vi.fn(),
  setDrumMute: vi.fn(),
  setEffects: vi.fn(),
  setMasterFilterFreq: vi.fn(),
  createVoice: vi.fn(),
  updateVoice: vi.fn(),
  destroyAllVoices: vi.fn(),
  getAudioContext: vi.fn(() => ({ currentTime: 0 })),
}));

vi.mock("@/audio/drumSynth", () => ({
  triggerDrum: vi.fn(),
}));

vi.mock("@/audio/technoSequencer", () => ({
  FILTHY_TECHNO: { bpm: 135, steps: [] },
  getHitsOnStep: vi.fn(() => []),
}));

vi.mock("@/store/daw.store", () => ({
  useDAWStore: {
    getState: vi.fn(() => ({
      playing: false,
      bpm: 135,
      masterVolume: 0.8,
      masterFilterFreq: 20000,
      drumVolumes: {},
      drumMutes: {},
    })),
  },
}));

describe("useAudioSync", () => {
  let originalRAF: typeof globalThis.requestAnimationFrame;
  let originalCAF: typeof globalThis.cancelAnimationFrame;

  beforeEach(() => {
    originalRAF = globalThis.requestAnimationFrame;
    originalCAF = globalThis.cancelAnimationFrame;
    globalThis.requestAnimationFrame = vi.fn(() => 1);
    globalThis.cancelAnimationFrame = vi.fn();
  });

  afterEach(() => {
    globalThis.requestAnimationFrame = originalRAF;
    globalThis.cancelAnimationFrame = originalCAF;
    vi.restoreAllMocks();
  });

  it("should export a function", async () => {
    const { useAudioSync } = await import("@/hooks/useAudioSync");
    expect(typeof useAudioSync).toBe("function");
  });

  it("should be callable as a hook", async () => {
    const { useAudioSync } = await import("@/hooks/useAudioSync");
    const { renderHook } = await import("@testing-library/react");

    expect(() => {
      renderHook(() => useAudioSync());
    }).not.toThrow();
  });

  it("should set up animation frame loop", async () => {
    const { useAudioSync } = await import("@/hooks/useAudioSync");
    const { renderHook } = await import("@testing-library/react");

    renderHook(() => useAudioSync());

    expect(globalThis.requestAnimationFrame).toHaveBeenCalled();
  });
});
