import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "../Skeleton";

describe("Skeleton", () => {
  it("renders with default text variant", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("h-4");
  });

  it("renders circular variant", () => {
    const { container } = render(<Skeleton variant="circular" />);
    expect(container.firstChild).toHaveClass("rounded-full");
  });

  it("renders rectangular variant", () => {
    const { container } = render(<Skeleton variant="rectangular" />);
    expect(container.firstChild).toHaveClass("rounded-md");
  });

  it("applies custom width as string", () => {
    const { container } = render(<Skeleton width="200px" />);
    expect(container.firstChild).toHaveStyle({ width: "200px" });
  });

  it("applies custom height as string", () => {
    const { container } = render(<Skeleton height="40px" />);
    expect(container.firstChild).toHaveStyle({ height: "40px" });
  });

  it("is aria-hidden", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });
});
