import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrackLanes } from "../TrackLanes";

describe("TrackLanes", () => {
  it("renders placeholder text", () => {
    render(<TrackLanes />);
    expect(screen.getByText("Track lanes — coming soon")).toBeInTheDocument();
  });
});
