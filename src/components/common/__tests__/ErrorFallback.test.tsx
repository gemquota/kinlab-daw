import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorFallback } from "../ErrorFallback";

describe("ErrorFallback", () => {
  const mockError = new Error("Test error message");
  const mockReset = vi.fn();

  it("renders error message", () => {
    render(<ErrorFallback error={mockError} resetErrorBoundary={mockReset} />);
    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  it("renders fallback message for non-Error", () => {
    render(<ErrorFallback error={"string error" as never} resetErrorBoundary={mockReset} />);
    expect(screen.getByText("An unexpected error occurred")).toBeInTheDocument();
  });

  it("renders heading", () => {
    render(<ErrorFallback error={mockError} resetErrorBoundary={mockReset} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("calls resetErrorBoundary when button clicked", () => {
    render(<ErrorFallback error={mockError} resetErrorBoundary={mockReset} />);
    screen.getByText("Try again").click();
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it("renders warning emoji", () => {
    render(<ErrorFallback error={mockError} resetErrorBoundary={mockReset} />);
    expect(screen.getByText("⚠️")).toBeInTheDocument();
  });
});
