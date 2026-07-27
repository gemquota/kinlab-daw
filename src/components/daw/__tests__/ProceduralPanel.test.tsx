import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProceduralPanel } from "../ProceduralPanel";

describe("ProceduralPanel", () => {
  it("renders placeholder text", () => {
    render(<ProceduralPanel />);
    expect(screen.getByText("Procedural — coming soon")).toBeInTheDocument();
  });
});
