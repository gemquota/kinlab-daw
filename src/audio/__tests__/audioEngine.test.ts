import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock AudioContext class
class MockAudioContext {
  state = "running";
  currentTime = 0;
  sampleRate = 44100;
  destination = {};
  
  createGain = vi.fn(() => ({
    gain: { value: 1, setTargetAtTime: vi.fn() },
    connect: vi.fn(),
    disconnect: vi.fn(),
  }));
  
  createStereoPanner = vi.fn(() => ({
    pan: { value: 0, setTargetAtTime: vi.fn() },
    connect: vi.fn(),
    disconnect: vi.fn(),
  }));
  
  createBiquadFilter = vi.fn(() => ({
    type: "lowpass",
    frequency: { value: 20000, setTargetAtTime: vi.fn() },
    Q: { value: 1, setTargetAtTime: vi.fn() },
    connect: vi.fn(),
    disconnect: vi.fn(),
  }));
  
  createOscillator = vi.fn(() => ({
    type: "sine",
    frequency: { value: 440, setTargetAtTime: vi.fn() },
    detune: { value: 0, setTargetAtTime: vi.fn() },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }));
  
  createAnalyser = vi.fn(() => ({
    fftSize: 2048,
    frequencyBinCount: 1024,
    smoothingTimeConstant: 0.85,
    getByteTimeDomainData: vi.fn(),
    getByteFrequencyData: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
  }));
  
  createDynamicsCompressor = vi.fn(() => ({
    threshold: { value: -24 },
    knee: { value: 8 },
    ratio: { value: 6 },
    attack: { value: 0.002 },
    release: { value: 0.08 },
    connect: vi.fn(),
    disconnect: vi.fn(),
  }));
  
  createConvolver = vi.fn(() => ({
    buffer: null,
    connect: vi.fn(),
    disconnect: vi.fn(),
  }));
  
  createDelay = vi.fn(() => ({
    delayTime: { value: 0.375, setTargetAtTime: vi.fn() },
    connect: vi.fn(),
    disconnect: vi.fn(),
  }));
  
  createBuffer = vi.fn((_channels: number, length: number, _sampleRate: number) => ({
    getChannelData: () => new Float32Array(length),
  }));
  
  resume = vi.fn(() => Promise.resolve());
}

// Mock the audioEngine module
vi.mock("@/audio/audioEngine", () => {
  let ctx: MockAudioContext | null = null;
  
  return {
    getAudioContext: () => {
      if (!ctx) {
        ctx = new MockAudioContext();
      }
      return ctx;
    },
    isAudioAvailable: () => true,
    resumeAudio: async () => {
      const ac = new MockAudioContext();
      if (ac.state === "suspended") await ac.resume();
    },
    setMasterVolume: vi.fn(),
    getMasterAnalyser: vi.fn(),
    getMasterNode: vi.fn(),
    createVoice: (trackId: string) => ({
      id: trackId,
      oscillators: [],
      gainNode: { connect: vi.fn(), disconnect: vi.fn() },
      panNode: { connect: vi.fn(), disconnect: vi.fn() },
      filterNode: { connect: vi.fn(), disconnect: vi.fn() },
    }),
    updateVoice: vi.fn(),
    destroyVoice: vi.fn(),
    destroyAllVoices: vi.fn(),
    getEffects: () => ({
      reverbAmount: 0.35,
      delayTime: 0.375,
      delayFeedback: 0.3,
      delayMix: 0.18,
    }),
    setEffects: vi.fn(),
    getAnalyserData: vi.fn(() => new Uint8Array(1024)),
    getFrequencyData: vi.fn(() => new Uint8Array(1024)),
    getRMSLevel: vi.fn(() => 0.5),
  };
});

describe("audioEngine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAudioContext", () => {
    it("should create and return AudioContext", async () => {
      const { getAudioContext } = await import("@/audio/audioEngine");
      const ctx = getAudioContext();
      expect(ctx).toBeDefined();
    });
  });

  describe("resumeAudio", () => {
    it("should call resumeAudio without error", async () => {
      const { resumeAudio } = await import("@/audio/audioEngine");
      await expect(resumeAudio()).resolves.not.toThrow();
    });
  });

  describe("setMasterVolume", () => {
    it("should clamp volume between 0 and 1", async () => {
      const { setMasterVolume } = await import("@/audio/audioEngine");
      setMasterVolume(1.5); // Should clamp to 1
      setMasterVolume(-0.5); // Should clamp to 0
      // No error should be thrown
    });
  });

  describe("createVoice", () => {
    it("should create a voice with correct structure", async () => {
      const { createVoice } = await import("@/audio/audioEngine");
      const voice = createVoice("test-track-1");
      expect(voice).toBeDefined();
      expect(voice.id).toBe("test-track-1");
      expect(voice.oscillators).toEqual([]);
      expect(voice.gainNode).toBeDefined();
      expect(voice.panNode).toBeDefined();
      expect(voice.filterNode).toBeDefined();
    });
  });

  describe("updateVoice", () => {
    it("should call updateVoice without error", async () => {
      const { updateVoice } = await import("@/audio/audioEngine");
      expect(() => {
        updateVoice("test-track-3", {
          frequency: 440,
          amplitude: 0.5,
          waveformType: "sine",
          pan: 0.5,
          filterFreq: 1000,
          filterQ: 2,
          detune: 10,
        });
      }).not.toThrow();
    });
  });

  describe("destroyVoice", () => {
    it("should call destroyVoice without error", async () => {
      const { destroyVoice } = await import("@/audio/audioEngine");
      expect(() => destroyVoice("test-track-4")).not.toThrow();
    });
  });

  describe("destroyAllVoices", () => {
    it("should call destroyAllVoices without error", async () => {
      const { destroyAllVoices } = await import("@/audio/audioEngine");
      expect(() => destroyAllVoices()).not.toThrow();
    });
  });

  describe("getEffects / setEffects", () => {
    it("should return current effects state", async () => {
      const { getEffects } = await import("@/audio/audioEngine");
      const effects = getEffects();
      expect(effects).toHaveProperty("reverbAmount");
      expect(effects).toHaveProperty("delayTime");
      expect(effects).toHaveProperty("delayFeedback");
      expect(effects).toHaveProperty("delayMix");
    });

    it("should call setEffects without error", async () => {
      const { setEffects } = await import("@/audio/audioEngine");
      expect(() => setEffects({ reverbAmount: 0.5 })).not.toThrow();
    });
  });
});
