import { describe, it, expect, beforeEach } from "vitest";
import { useTaylorStore } from "../taylor.store";

describe("taylor.store — increment-reset behavior", () => {
  beforeEach(() => {
    useTaylorStore.getState().resetToDefaults();
  });

  it("resets higher-order coefficients when incrementing", () => {
    const { setCoefficient } = useTaylorStore.getState();
    setCoefficient(3, 5);
    setCoefficient(5, 3);
    setCoefficient(7, 2);

    // Increment coefficient 2
    setCoefficient(2, 2);

    const state = useTaylorStore.getState().coefficients.coefficients;
    expect(state[2]).toBe(2);
    expect(state[3]).toBe(0);
    expect(state[4]).toBe(0);
    expect(state[5]).toBe(0);
    expect(state[6]).toBe(0);
    expect(state[7]).toBe(0);
    expect(state[8]).toBe(0);
    expect(state[9]).toBe(0);
    expect(state[10]).toBe(0);
  });

  it("does NOT reset higher-order coefficients when decrementing", () => {
    const { setCoefficient } = useTaylorStore.getState();
    setCoefficient(2, 5);
    setCoefficient(3, 3);

    setCoefficient(2, 2);

    const state = useTaylorStore.getState().coefficients.coefficients;
    expect(state[2]).toBe(2);
    expect(state[3]).toBe(3);
  });

  it("does NOT reset when value stays the same", () => {
    const { setCoefficient } = useTaylorStore.getState();
    setCoefficient(2, 3);
    setCoefficient(4, 7);

    setCoefficient(2, 3);

    const state = useTaylorStore.getState().coefficients.coefficients;
    expect(state[4]).toBe(7);
  });
});
