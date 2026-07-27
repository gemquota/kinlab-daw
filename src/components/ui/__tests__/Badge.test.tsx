import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../Badge";

describe("Badge", () => {
  it("renders with children text", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("renders with role=status", () => {
    render(<Badge>Info</Badge>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("applies sm size class", () => {
    const { container } = render(<Badge size="sm">Small</Badge>);
    expect(container.firstChild).toHaveClass("px-1.5");
  });

  it("applies lg size class", () => {
    const { container } = render(<Badge size="lg">Large</Badge>);
    expect(container.firstChild).toHaveClass("px-2.5");
  });

  it("renders dot when dot=true", () => {
    const { container } = render(<Badge dot>With dot</Badge>);
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toBeInTheDocument();
  });

  it("applies filled variant class", () => {
    const { container } = render(<Badge variant="filled">Filled</Badge>);
    expect(container.firstChild).toHaveClass("rounded-full");
  });

  it("applies status color for success with filled variant", () => {
    const { container } = render(<Badge status="success" variant="filled">OK</Badge>);
    expect(container.firstChild).toHaveStyle({ backgroundColor: "var(--feedback-success)" });
  });

  it("applies status color for error with filled variant", () => {
    const { container } = render(<Badge status="error" variant="filled">Fail</Badge>);
    expect(container.firstChild).toHaveStyle({ backgroundColor: "var(--feedback-error)" });
  });

  it("accepts custom className", () => {
    const { container } = render(<Badge className="my-custom">Custom</Badge>);
    expect(container.firstChild).toHaveClass("my-custom");
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<Badge ref={ref}>Ref test</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
