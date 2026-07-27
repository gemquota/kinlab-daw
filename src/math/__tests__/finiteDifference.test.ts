import { describe, it, expect } from "vitest";
import { forwardDifference, centralDifference } from "../calculus/finiteDifference.engine";

describe("Finite Difference Engine", () => {
  it("forwardDifference approximates derivative", () => {
    // f(x) = x², f'(x) = 2x, at x=1: f'(1) = 2
    const result = forwardDifference((x) => x * x, 1, 0.001);
    expect(result).toBeCloseTo(2, 2);
  });

  it("centralDifference approximates derivative", () => {
    const result = centralDifference((x) => x * x, 1, 0.001);
    expect(result).toBeCloseTo(2, 3);
  });
});
