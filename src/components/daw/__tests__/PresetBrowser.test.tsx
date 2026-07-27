import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PresetBrowser } from "../PresetBrowser";

describe("PresetBrowser", () => {
  it("renders placeholder text", () => {
    render(<PresetBrowser />);
    expect(screen.getByText("Preset browser — coming soon")).toBeInTheDocument();
  });
});
