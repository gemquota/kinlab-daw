import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Divider } from "../Divider";

describe("Divider", () => {
  it("renders separator element", () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('[role="separator"]')).toBeInTheDocument();
  });

  it("renders vertical separator", () => {
    const { container } = render(<Divider orientation="vertical" />);
    const sep = container.querySelector('[role="separator"]');
    expect(sep).toHaveAttribute("aria-orientation", "vertical");
  });

  it("renders label text when provided", () => {
    render(<Divider label="Section" />);
    expect(screen.getByText("Section")).toBeInTheDocument();
  });

  it("sets aria-label when label is provided", () => {
    const { container } = render(<Divider label="Section divider" />);
    const sep = container.querySelector('[role="separator"]');
    expect(sep).toHaveAttribute("aria-label", "Section divider");
  });

  it("sets aria-hidden when decorative", () => {
    const { container } = render(<Divider decorative />);
    const sep = container.querySelector('[role="separator"]');
    expect(sep).toHaveAttribute("aria-hidden", "true");
  });

  it("accepts custom className", () => {
    const { container } = render(<Divider className="my-divider" />);
    expect(container.firstChild).toHaveClass("my-divider");
  });
});
