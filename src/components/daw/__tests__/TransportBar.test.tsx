import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TransportBar } from "../TransportBar";

describe("TransportBar", () => {
  it("renders placeholder text", () => {
    render(<TransportBar />);
    expect(screen.getByText("Transport — coming soon")).toBeInTheDocument();
  });

  it("renders with proper styling", () => {
    const { container } = render(<TransportBar />);
    expect(container.firstChild).toHaveClass("p-4");
  });
});
