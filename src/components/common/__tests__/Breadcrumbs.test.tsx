import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumbs } from "../Breadcrumbs";

vi.mock("react-router-dom", () => ({
  useLocation: () => ({ pathname: "/waveform" }),
}));

describe("Breadcrumbs", () => {
  it("renders breadcrumb navigation", () => {
    render(<Breadcrumbs />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("has aria-label", () => {
    render(<Breadcrumbs />);
    expect(screen.getByLabelText("Breadcrumb")).toBeInTheDocument();
  });

  it("shows root label", () => {
    render(<Breadcrumbs />);
    expect(screen.getByText("KinLab")).toBeInTheDocument();
  });

  it("shows current page label", () => {
    render(<Breadcrumbs />);
    expect(screen.getByText("Waveform")).toBeInTheDocument();
  });
});
