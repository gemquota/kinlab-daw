import { describe, it, expect } from "vitest";
import { evaluatePolynomial, evaluatePolynomialDerivatives } from "../algebra/polynomial.engine";
import { differentiatePolynomial, integratePolynomial } from "../calculus/derivative.engine";

describe("polynomial.engine", () => {
  describe("evaluatePolynomial", () => {
    it("evaluates a constant polynomial", () => {
      expect(evaluatePolynomial([5], 10)).toBe(5);
    });
    it("evaluates x^2 at x=3", () => {
      expect(evaluatePolynomial([0, 0, 1], 3)).toBe(9);
    });
    it("evaluates 1 + 2x + 3x^2 at x=2", () => {
      expect(evaluatePolynomial([1, 2, 3], 2)).toBe(17);
    });
    it("evaluates empty coefficients as 0", () => {
      expect(evaluatePolynomial([], 5)).toBe(0);
    });
  });

  describe("evaluatePolynomialDerivatives", () => {
    it("computes derivatives of 1 + 2x + 3x^2", () => {
      const result = evaluatePolynomialDerivatives([1, 2, 3], 1, 2);
      expect(result[0]).toBe(6);
      expect(result[1]).toBe(8);
      expect(result[2]).toBe(6);
    });
  });

  describe("differentiatePolynomial", () => {
    it("differentiates a constant to 0", () => {
      expect(differentiatePolynomial([5])).toEqual([0]);
    });
    it("differentiates 1 + 2x + 3x^2 to 2 + 6x", () => {
      expect(differentiatePolynomial([1, 2, 3])).toEqual([2, 6]);
    });
  });

  describe("integratePolynomial", () => {
    it("integrates a constant", () => {
      const result = integratePolynomial([5]);
      expect(result).toEqual([0, 5]);
    });
  });
});
