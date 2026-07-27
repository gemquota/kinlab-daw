import { describe, it, expect } from "vitest";
import { nthDerivative, allDerivatives, differentiatePolynomial } from "../calculus/derivative.engine";

describe("Derivative Engine", () => {
  it("nthDerivative computes first derivative", () => {
    // p(x) = 3x^2 + 2x + 1 => p'(x) = 6x + 2
    const coeffs = [1, 2, 3];
    expect(nthDerivative(coeffs, 1, 1)).toBe(8); // 6*1 + 2 = 8
  });

  it("nthDerivative computes second derivative", () => {
    // p(x) = 3x^2 + 2x + 1 => p''(x) = 6
    const coeffs = [1, 2, 3];
    expect(nthDerivative(coeffs, 1, 2)).toBe(6);
  });

  it("allDerivatives returns all orders", () => {
    const coeffs = [1, 2, 3];
    const results = allDerivatives(coeffs, 1, 2);
    expect(results).toHaveLength(3);
    expect(results[0]).toBe(6); // p(1) = 3 + 2 + 1 = 6
  });

  it("differentiatePolynomial reduces degree", () => {
    // p(x) = 3x^2 + 2x + 1 => p'(x) = 6x + 2
    const coeffs = [1, 2, 3];
    const deriv = differentiatePolynomial(coeffs);
    expect(deriv).toEqual([2, 6]);
  });
});
