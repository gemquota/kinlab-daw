import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock requestAnimationFrame before any imports
const mockRAF = vi.fn((callback: FrameRequestCallback) => {
  return setTimeout(callback, 0) as unknown as number;
});

const mockCAF = vi.fn((handle: number) => {
  clearTimeout(handle);
});

vi.stubGlobal("requestAnimationFrame", mockRAF);
vi.stubGlobal("cancelAnimationFrame", mockCAF);

// Mock audio engine
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
  getAudioContext: vi.fn(() => ({
    currentTime: 0,
  })),
}));

// Mock drum synth
vi.mock("@/audio/drumSynth", () => ({
  triggerDrum: vi.fn(),
}));

// Mock techno sequencer
vi.mock("@/audio/technoSequencer", () => ({
  FILTHY_TECHNO: {
    bpm: 135,
    steps: [],
  },
  getHitsOnStep: vi.fn(() => []),
}));

// Mock store
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
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should export a function", async () => {
    const { useAudioSync } = await import("@/hooks/useAudioSync");
    expect(typeof useAudioSync).toBe("function");
  });

  it("should be callable as a hook", async () => {
    const { useAudioSync } = await import("@/hooks/useAudioSync");
    const { renderHook } = await import("@testing-library/react");
    
    // The hook should not throw when called
    expect(() => {
      renderHook(() => useAudioSync());
    }).not.toThrow();
  });

  it("should set up animation frame loop", async () => {
    const { useAudioSync } = await import("@/hooks/useAudioSync");
    const { renderHook } = await import("@testing-library/react");
    
    renderHook(() => useAudioSync());
    
    // Should have called requestAnimationFrame at least once
    // (The hook runs an animation loop)
    expect(mockRAF).toHaveBeenCalled();
  });
});
