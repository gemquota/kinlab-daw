import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepSequencerUI } from "../StepSequencerUI";

describe("StepSequencerUI", () => {
  it("renders placeholder text", () => {
    render(<StepSequencerUI />);
    expect(screen.getByText("Step sequencer — coming soon")).toBeInTheDocument();
  });
});
