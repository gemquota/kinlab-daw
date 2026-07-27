import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NumericInput } from "../NumericInput";

describe("NumericInput", () => {
  it("renders with label", () => {
    render(<NumericInput label="Temperature" />);
    expect(screen.getByLabelText("Temperature")).toBeInTheDocument();
  });

  it("displays default value", () => {
    render(<NumericInput defaultValue={42} />);
    expect(screen.getByRole("textbox")).toHaveValue("42");
  });

  it("calls onChange with incremented value", () => {
    const onChange = vi.fn();
    render(<NumericInput defaultValue={10} onChange={onChange} />);
    screen.getByLabelText("Increment").click();
    expect(onChange).toHaveBeenCalledWith(11);
  });

  it("calls onChange with decremented value", () => {
    const onChange = vi.fn();
    render(<NumericInput defaultValue={10} onChange={onChange} />);
    screen.getByLabelText("Decrement").click();
    expect(onChange).toHaveBeenCalledWith(9);
  });

  it("respects min boundary", () => {
    const onChange = vi.fn();
    render(<NumericInput defaultValue={0} min={0} max={100} onChange={onChange} />);
    screen.getByLabelText("Decrement").click();
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("respects max boundary", () => {
    const onChange = vi.fn();
    render(<NumericInput defaultValue={100} min={0} max={100} onChange={onChange} />);
    screen.getByLabelText("Increment").click();
    expect(onChange).toHaveBeenCalledWith(100);
  });

  it("can be disabled", () => {
    render(<NumericInput defaultValue={5} disabled />);
    expect(screen.getByLabelText("Increment")).toBeDisabled();
    expect(screen.getByLabelText("Decrement")).toBeDisabled();
  });

  it("shows unit when provided", () => {
    render(<NumericInput defaultValue={25} unit="°C" />);
    expect(screen.getByText("°C")).toBeInTheDocument();
  });

  it("has correct aria attributes", () => {
    render(<NumericInput defaultValue={50} min={0} max={100} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-valuemin", "0");
    expect(input).toHaveAttribute("aria-valuemax", "100");
    expect(input).toHaveAttribute("aria-valuenow", "50");
  });
});
