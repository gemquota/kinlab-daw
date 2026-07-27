import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const mockTogglePlayback = vi.fn();
const mockReset = vi.fn();

vi.mock("@/store/waveform.store", () => ({
  useWaveformStore: vi.fn(() => ({
    config: {
      waveformType: "sine",
      components: [],
      damping: 0,
      resonanceFreq: 0,
      resonanceWidth: 0,
      resonanceGain: 0,
      modulationFreq: 0,
      modulationDepth: 0,
      timeStretch: 1,
      noiseAmount: 0,
    },
    currentTime: 0,
    isPlaying: false,
    speed: 1,
    timeRange: 4,
    showDerivatives: false,
    showSpectrum: false,
    showComponents: true,
    activePreset: null,
    togglePlayback: mockTogglePlayback,
    reset: mockReset,
    setCurrentTime: vi.fn(),
    setSpeed: vi.fn(),
    setTimeRange: vi.fn(),
    setWaveformType: vi.fn(),
    setShowDerivatives: vi.fn(),
    setShowSpectrum: vi.fn(),
    setShowComponents: vi.fn(),
    setActivePreset: vi.fn(),
    updateComponent: vi.fn(),
    addComponent: vi.fn(),
    removeComponent: vi.fn(),
    setDamping: vi.fn(),
    setResonanceFreq: vi.fn(),
    setResonanceWidth: vi.fn(),
    setResonanceGain: vi.fn(),
    setModulationFreq: vi.fn(),
    setModulationDepth: vi.fn(),
    setTimeStretch: vi.fn(),
    setNoiseAmount: vi.fn(),
    setConfig: vi.fn(),
  })),
}));

import { WaveformControls } from "../WaveformControls";

describe("WaveformControls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders play button", () => {
    render(<WaveformControls />);
    const buttons = screen.getAllByLabelText("Play/pause");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it("shows Play text when not playing", () => {
    render(<WaveformControls />);
    expect(screen.getByText("Play")).toBeInTheDocument();
  });

  it("calls togglePlayback when play clicked", () => {
    render(<WaveformControls />);
    const playBtn = screen.getAllByLabelText("Play/pause")[0];
    fireEvent.click(playBtn);
    expect(mockTogglePlayback).toHaveBeenCalled();
  });

  it("renders speed controls", () => {
    render(<WaveformControls />);
    expect(screen.getByText("Speed")).toBeInTheDocument();
  });

  it("renders time controls", () => {
    render(<WaveformControls />);
    expect(screen.getByText("Time")).toBeInTheDocument();
  });
});
