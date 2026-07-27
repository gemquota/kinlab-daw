import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MasterMeter } from "../MasterMeter";

describe("MasterMeter", () => {
  it("renders placeholder text", () => {
    render(<MasterMeter />);
    expect(screen.getByText("Master meter — coming soon")).toBeInTheDocument();
  });
});
