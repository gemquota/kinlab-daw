import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Toggle } from "../Toggle";

describe("Toggle", () => {
  it("renders with label", () => {
    render(<Toggle label="Dark mode" checked={false} onChange={vi.fn()} />);
    expect(screen.getByText("Dark mode")).toBeInTheDocument();
  });

  it("renders switch role", () => {
    render(<Toggle label="Dark mode" checked={true} onChange={vi.fn()} />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("can be disabled", () => {
    render(<Toggle label="Test" disabled onChange={vi.fn()} />);
    expect(screen.getByRole("switch")).toBeDisabled();
  });
});
