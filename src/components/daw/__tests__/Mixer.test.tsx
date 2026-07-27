import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Mixer } from "../Mixer";

describe("Mixer", () => {
  it("renders placeholder text", () => {
    render(<Mixer />);
    expect(screen.getByText("Mixer — coming soon")).toBeInTheDocument();
  });
});
