import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { IconButton } from "../IconButton";

describe("IconButton", () => {
  it("renders with icon", () => {
    render(
      <IconButton icon={<span data-testid="icon">★</span>} aria-label="Favorite" />
    );
    expect(screen.getByLabelText("Favorite")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(
      <IconButton icon={<span>★</span>} aria-label="Fav" onClick={onClick} />
    );
    screen.getByLabelText("Fav").click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(
      <IconButton icon={<span>★</span>} aria-label="Fav" disabled />
    );
    expect(screen.getByLabelText("Fav")).toBeDisabled();
  });

  it("shows loading spinner when loading", () => {
    const { container } = render(
      <IconButton icon={<span>★</span>} aria-label="Fav" loading />
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("accepts tooltip", () => {
    render(
      <IconButton icon={<span>★</span>} aria-label="Fav" tooltip="Favorite this" />
    );
    expect(screen.getByLabelText("Fav")).toBeInTheDocument();
  });

  it("applies size classes", () => {
    const { container } = render(
      <IconButton icon={<span>★</span>} aria-label="Fav" size="lg" />
    );
    expect(container.querySelector("button")).toHaveClass("h-11");
  });

  it("applies variant classes", () => {
    const { container } = render(
      <IconButton icon={<span>★</span>} aria-label="Fav" variant="primary" />
    );
    expect(container.querySelector("button")).toHaveClass("bg-[var(--text-accent)]");
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(
      <IconButton icon={<span>★</span>} aria-label="Fav" ref={ref} />
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
