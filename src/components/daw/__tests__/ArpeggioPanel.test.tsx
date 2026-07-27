import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArpeggioPanel } from "../ArpeggioPanel";

describe("ArpeggioPanel", () => {
  it("renders placeholder text", () => {
    render(<ArpeggioPanel />);
    expect(screen.getByText("Arpeggiator — coming soon")).toBeInTheDocument();
  });
});
