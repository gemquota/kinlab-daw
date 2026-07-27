import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Slider } from "../Slider";

describe("Slider", () => {
  it("renders with label", () => {
    render(<Slider label="Volume" value={50} onChange={vi.fn()} min={0} max={100} />);
    expect(screen.getByText("Volume")).toBeInTheDocument();
  });

  it("renders range input", () => {
    render(<Slider label="Vol" value={50} onChange={vi.fn()} min={0} max={100} />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });
});
