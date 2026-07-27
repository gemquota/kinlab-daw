import { describe, it, expect } from "vitest";
import { chainRule, chainRuleSecond } from "../calculus/chainRule.engine";

describe("Chain Rule Engine", () => {
  it("chainRule computes d/dx[f(g(x))]", () => {
    // f(u) = u², g(x) = 2x => f(g(x)) = 4x²
    // f'(u) = 2u, g'(x) = 2
    // d/dx = f'(g(x)) * g'(x) = 2*(2x) * 2 = 8x
    const result = chainRule(
      (u) => 2 * u,
      (x) => 2 * x,
      () => 2,
      3,
    );
    expect(result).toBeCloseTo(24); // 8 * 3
  });

  it("chainRuleSecond computes second derivative", () => {
    // f(u) = u², g(x) = x => f(g(x)) = x²
    // f'(u) = 2u, f''(u) = 2, g'(x) = 1, g''(x) = 0
    // d²/dx² = f''(g(x)) * [g'(x)]² + f'(g(x)) * g''(x) = 2 * 1 + 0 = 2
    const result = chainRuleSecond(
      (u) => 2 * u,
      () => 2,
      (x) => x,
      () => 1,
      () => 0,
      5,
    );
    expect(result).toBeCloseTo(2);
  });
});
