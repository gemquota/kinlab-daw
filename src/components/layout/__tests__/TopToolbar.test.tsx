import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock the stores
vi.mock("@/store", () => ({
  useThemeStore: vi.fn((selector) => {
    const state = {
      resolvedTheme: "dark",
      toggleTheme: vi.fn(),
    };
    return selector ? selector(state) : state;
  }),
}));

vi.mock("@/components/common/HelpModal", () => ({
  useHelpStore: vi.fn((selector) => {
    const state = {
      openHelp: vi.fn(),
    };
    return selector ? selector(state) : state;
  }),
}));

describe("TopToolbar", () => {
  const defaultProps = {
    onMenuToggle: vi.fn(),
    onInspectorToggle: vi.fn(),
  };

  it("should render without errors", async () => {
    const { TopToolbar } = await import("@/components/layout/TopToolbar");
    render(<TopToolbar {...defaultProps} />);
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
  });

  it("should have correct aria-label", async () => {
    const { TopToolbar } = await import("@/components/layout/TopToolbar");
    render(<TopToolbar {...defaultProps} />);
    expect(screen.getByRole("toolbar")).toHaveAttribute("aria-label", "Application toolbar");
  });

  it("should display app title", async () => {
    const { TopToolbar } = await import("@/components/layout/TopToolbar");
    render(<TopToolbar {...defaultProps} />);
    expect(screen.getByText("Waveform")).toBeInTheDocument();
  });

  it("should call onMenuToggle when menu button clicked", async () => {
    const mockOnMenuToggle = vi.fn();
    const { TopToolbar } = await import("@/components/layout/TopToolbar");
    render(<TopToolbar onMenuToggle={mockOnMenuToggle} onInspectorToggle={vi.fn()} />);
    
    const menuButton = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(menuButton);
    
    expect(mockOnMenuToggle).toHaveBeenCalled();
  });

  it("should call onInspectorToggle when inspector button clicked", async () => {
    const mockOnInspectorToggle = vi.fn();
    const { TopToolbar } = await import("@/components/layout/TopToolbar");
    render(<TopToolbar onMenuToggle={vi.fn()} onInspectorToggle={mockOnInspectorToggle} />);
    
    const inspectorButton = screen.getByRole("button", { name: /toggle inspector panel/i });
    fireEvent.click(inspectorButton);
    
    expect(mockOnInspectorToggle).toHaveBeenCalled();
  });

  it("should have theme toggle button", async () => {
    const { TopToolbar } = await import("@/components/layout/TopToolbar");
    render(<TopToolbar {...defaultProps} />);
    
    const themeButton = screen.getByRole("button", { name: /switch to.*mode/i });
    expect(themeButton).toBeInTheDocument();
  });

  it("should have help button", async () => {
    const { TopToolbar } = await import("@/components/layout/TopToolbar");
    render(<TopToolbar {...defaultProps} />);
    
    const helpButton = screen.getByRole("button", { name: /open help/i });
    expect(helpButton).toBeInTheDocument();
  });
});
