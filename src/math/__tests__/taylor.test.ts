import { describe, it, expect } from "vitest";
import { evaluateTaylor, sampleTaylor } from "../calculus/taylor.engine";
import type { TaylorCoefficients } from "@/types";

describe("taylor.engine", () => {
  it("evaluates a linear polynomial (position = t)", () => {
    const coeffs: TaylorCoefficients = {
      coefficients: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      t0: 0,
      maxOrder: 4,
    };
    const result = evaluateTaylor(coeffs, 5);
    expect(result.value).toBeCloseTo(5);
    expect(result.derivatives[1]).toBeCloseTo(1);
  });

  it("evaluates a quadratic (position = 0.5*t^2)", () => {
    const coeffs: TaylorCoefficients = {
      coefficients: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      t0: 0,
      maxOrder: 4,
    };
    const result = evaluateTaylor(coeffs, 3);
    expect(result.value).toBeCloseTo(4.5);
    expect(result.derivatives[1]).toBeCloseTo(3);
  });

  it("sampleTaylor generates the correct number of samples", () => {
    const coeffs: TaylorCoefficients = {
      coefficients: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      t0: 0,
      maxOrder: 4,
    };
    const points = sampleTaylor(coeffs, 0, 10, 50);
    expect(points).toHaveLength(50);
  });
});
