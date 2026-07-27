import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "../ProgressBar";

describe("ProgressBar", () => {
  it("renders progressbar role", () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("sets aria-valuenow", () => {
    render(<ProgressBar value={75} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "75");
  });

  it("sets aria-valuemin and aria-valuemax", () => {
    render(<ProgressBar value={50} max={200} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "200");
  });

  it("shows label when provided", () => {
    render(<ProgressBar value={50} label="Progress" />);
    expect(screen.getByText("Progress")).toBeInTheDocument();
  });

  it("shows value when showValue is true", () => {
    render(<ProgressBar value={75} showValue />);
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("uses custom formatValue", () => {
    render(
      <ProgressBar
        value={50}
        max={100}
        showValue
        formatValue={(v, m) => `${v}/${m} items`}
      />
    );
    expect(screen.getByText("50/100 items")).toBeInTheDocument();
  });

  it("clamps value to max", () => {
    render(<ProgressBar value={150} max={100} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
  });

  it("applies sm size class", () => {
    const { container } = render(<ProgressBar value={50} size="sm" />);
    expect(container.querySelector(".h-1")).toBeInTheDocument();
  });

  it("applies lg size class", () => {
    const { container } = render(<ProgressBar value={50} size="lg" />);
    expect(container.querySelector(".h-2\\.5")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<ProgressBar value={50} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
