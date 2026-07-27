import { describe, it, expect } from "vitest";
import { definiteIntegral, simpsonIntegral } from "../calculus/integral.engine";

describe("Integral Engine", () => {
  it("definiteIntegral computes correctly for linear", () => {
    // ∫₀¹ (2x + 1) dx = x² + x |₀¹ = 2
    const coeffs = [1, 2];
    expect(definiteIntegral(coeffs, 0, 1)).toBeCloseTo(2);
  });

  it("definiteIntegral computes correctly for quadratic", () => {
    // ∫₀¹ x² dx = 1/3
    const coeffs = [0, 0, 1];
    expect(definiteIntegral(coeffs, 0, 1)).toBeCloseTo(1 / 3);
  });

  it("simpsonIntegral approximates correctly", () => {
    // ∫₀¹ x² dx ≈ 1/3
    const result = simpsonIntegral((x) => x * x, 0, 1, 100);
    expect(result).toBeCloseTo(1 / 3, 3);
  });
});
