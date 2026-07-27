import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "../Sidebar";

vi.mock("react-router-dom", () => ({
  useLocation: () => ({ pathname: "/waveform" }),
  useNavigate: () => vi.fn(),
}));

describe("Sidebar", () => {
  it("renders navigation", () => {
    render(<Sidebar />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("has accessible label", () => {
    render(<Sidebar />);
    expect(screen.getByLabelText("Main navigation")).toBeInTheDocument();
  });

  it("renders KinLab branding", () => {
    render(<Sidebar />);
    expect(screen.getByText("KinLab")).toBeInTheDocument();
  });
});
