import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VisualDrawer } from "../VisualDrawer";

vi.mock("@/store/visual.store", () => ({
  useVisualStore: vi.fn((selector) => {
    const state = {
      params: { hueShift: 0, speed: 1, particleCount: 100 },
      setParam: vi.fn(),
      resetParams: vi.fn(),
    };
    return selector(state);
  }),
}));

vi.mock("@/visual/visualParams", () => ({
  VISUAL_MODES: [
    { id: "nebula", name: "Nebula", icon: "🌌", desc: "Particle clouds" },
    { id: "network", name: "Network", icon: "🔗", desc: "Connected nodes" },
  ],
  getModeInfo: vi.fn(() => ({
    icon: "🌌",
    name: "Nebula",
    desc: "Particle clouds",
    paramGroups: [],
  })),
}));

describe("VisualDrawer", () => {
  const defaultProps = {
    visualMode: "nebula" as const,
    onModeChange: vi.fn(),
  };

  it("renders toggle button", () => {
    render(<VisualDrawer {...defaultProps} />);
    expect(screen.getByText("▲ VISUALS")).toBeInTheDocument();
  });

  it("expands when toggle clicked", () => {
    render(<VisualDrawer {...defaultProps} />);
    fireEvent.click(screen.getByText("▲ VISUALS"));
    expect(screen.getByText("▼ VISUALS")).toBeInTheDocument();
  });

  it("renders mode pills", () => {
    render(<VisualDrawer {...defaultProps} />);
    expect(screen.getByText("Nebula")).toBeInTheDocument();
    expect(screen.getByText("Network")).toBeInTheDocument();
  });

  it("calls onModeChange when mode pill clicked", () => {
    const onModeChange = vi.fn();
    render(<VisualDrawer {...defaultProps} onModeChange={onModeChange} />);
    fireEvent.click(screen.getByText("Network"));
    expect(onModeChange).toHaveBeenCalledWith("network");
  });
});
