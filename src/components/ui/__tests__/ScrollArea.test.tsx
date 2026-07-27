import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollArea } from "../ScrollArea";

describe("ScrollArea", () => {
  it("renders children", () => {
    render(<ScrollArea><p>Content here</p></ScrollArea>);
    expect(screen.getByText("Content here")).toBeInTheDocument();
  });

  it("has role=region", () => {
    render(<ScrollArea>Content</ScrollArea>);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("sets aria-orientation for vertical", () => {
    render(<ScrollArea orientation="vertical">Content</ScrollArea>);
    const region = screen.getByRole("region");
    expect(region).toHaveAttribute("aria-orientation", "vertical");
  });

  it("sets aria-orientation for horizontal", () => {
    render(<ScrollArea orientation="horizontal">Content</ScrollArea>);
    const region = screen.getByRole("region");
    expect(region).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("applies maxHeight style", () => {
    const { container } = render(<ScrollArea maxHeight={300}>Content</ScrollArea>);
    expect(container.firstChild).toHaveStyle({ maxHeight: 300 });
  });

  it("applies maxWidth style", () => {
    const { container } = render(<ScrollArea maxWidth={500}>Content</ScrollArea>);
    expect(container.firstChild).toHaveStyle({ maxWidth: 500 });
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<ScrollArea ref={ref}>Content</ScrollArea>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
