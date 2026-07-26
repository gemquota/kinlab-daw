import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock the stores before any imports
vi.mock("@/store/daw.store", () => ({
  useDAWStore: vi.fn((selector) => {
    const state = {
      playing: false,
      setPlaying: vi.fn(),
      bpm: 135,
      setBpm: vi.fn(),
      currentStep: 0,
      masterVolume: 0.8,
      setMasterVolume: vi.fn(),
      activePattern: { name: "Filthy Techno" },
      cyclePattern: vi.fn(),
    };
    return selector ? selector(state) : state;
  }),
}));

vi.mock("@/audio/audioEngine", () => ({
  resumeAudio: vi.fn(),
}));

describe("FloatingControls", () => {
  it("should render without errors", async () => {
    const { FloatingControls } = await import("@/components/immersive/FloatingControls");
    render(<FloatingControls />);
    expect(screen.getByRole("button", { name: /start playback/i })).toBeInTheDocument();
  });

  it("should display play button when not playing", async () => {
    const { FloatingControls } = await import("@/components/immersive/FloatingControls");
    render(<FloatingControls />);
    const playButton = screen.getByRole("button", { name: /start playback/i });
    expect(playButton).toHaveTextContent("▶");
  });

  it("should display BPM value", async () => {
    const { FloatingControls } = await import("@/components/immersive/FloatingControls");
    render(<FloatingControls />);
    const bpmInput = screen.getByRole("spinbutton", { name: /bpm value/i });
    expect(bpmInput).toHaveValue(135);
  });

  it("should display volume slider", async () => {
    const { FloatingControls } = await import("@/components/immersive/FloatingControls");
    render(<FloatingControls />);
    const volumeSlider = screen.getByRole("slider", { name: /master volume/i });
    expect(volumeSlider).toBeInTheDocument();
  });

  it("should display pattern name", async () => {
    const { FloatingControls } = await import("@/components/immersive/FloatingControls");
    render(<FloatingControls />);
    expect(screen.getByText("Filthy Techno")).toBeInTheDocument();
  });

  it("should have 16 step indicator dots", async () => {
    const { FloatingControls } = await import("@/components/immersive/FloatingControls");
    const { container } = render(<FloatingControls />);
    // The step indicators are divs with specific styling
    const stepIndicators = container.querySelectorAll(".w-1\\.5.h-1\\.5.rounded-full");
    expect(stepIndicators.length).toBe(16);
  });

  it("should have aria-labels on all interactive elements", async () => {
    const { FloatingControls } = await import("@/components/immersive/FloatingControls");
    render(<FloatingControls />);
    
    expect(screen.getByRole("button", { name: /start playback/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /decrease bpm/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /increase bpm/i })).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: /bpm value/i })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: /master volume/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /current pattern/i })).toBeInTheDocument();
  });
});
