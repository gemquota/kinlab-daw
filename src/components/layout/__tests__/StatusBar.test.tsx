import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBar } from "../StatusBar";

describe("StatusBar", () => {
  it("renders status bar", () => {
    render(<StatusBar />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("has accessible label", () => {
    render(<StatusBar />);
    expect(screen.getByLabelText("Status bar")).toBeInTheDocument();
  });
});
