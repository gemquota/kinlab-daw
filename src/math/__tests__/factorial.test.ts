import { describe, it, expect } from "vitest";
import { factorial, logFactorial, binomial } from "../algebra/factorial.engine";

describe("factorial.engine", () => {
  it("computes 0! = 1", () => expect(factorial(0)).toBe(1));
  it("computes 5! = 120", () => expect(factorial(5)).toBe(120));
  it("computes 10! = 3628800", () => expect(factorial(10)).toBe(3628800));
  it("throws for negative input", () => expect(() => factorial(-1)).toThrow());
  it("throws for non-integer input", () => expect(() => factorial(1.5)).toThrow());

  it("logFactorial(5) equals ln(120)", () => {
    expect(logFactorial(5)).toBeCloseTo(Math.log(120));
  });

  it("binomial(5,2) = 10", () => expect(binomial(5, 2)).toBe(10));
  it("binomial(n,0) = 1", () => expect(binomial(5, 0)).toBe(1));
  it("binomial returns 0 for k > n", () => expect(binomial(3, 5)).toBe(0));
});
