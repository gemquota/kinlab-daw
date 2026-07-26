import { describe, it, expect } from "vitest";
import { DERIVATIVES, getDerivative, getDerivativeChain } from "../derivatives.data";

describe("derivatives.data", () => {
  it("has 11 derivative records", () => {
    expect(DERIVATIVES).toHaveLength(11);
  });

  it("Position is order 0 with unit m", () => {
    expect(getDerivative(0).name).toBe("Position");
    expect(getDerivative(0).symbol).toBe("x");
    expect(getDerivative(0).physical.siUnit.label).toBe("m");
  });

  it("Velocity is order 1 with unit m/s", () => {
    expect(getDerivative(1).name).toBe("Velocity");
    expect(getDerivative(1).physical.siUnit.label).toBe("m/s");
  });

  it("Acceleration is order 2 with unit m/s²", () => {
    expect(getDerivative(2).name).toBe("Acceleration");
    expect(getDerivative(2).physical.siUnit.label).toBe("m/s²");
  });

  it("Jerk has correct unit", () => {
    expect(getDerivative(3).physical.siUnit.label).toBe("m/s³");
  });

  it("each derivative has a unique color", () => {
    const colors = DERIVATIVES.map((d) => d.visualization.hexColor);
    expect(new Set(colors).size).toBe(11);
  });

  it("standardized derivatives are orders 0-6", () => {
    for (let i = 0; i <= 6; i++) {
      expect(getDerivative(i as 0 | 1 | 2 | 3 | 4 | 5 | 6).isStandardized).toBe(true);
    }
    for (let i = 7; i <= 10; i++) {
      expect(getDerivative(i as 7 | 8 | 9 | 10).isStandardized).toBe(false);
    }
  });

  it("derivative chain returns correct length", () => {
    expect(getDerivativeChain(3)).toHaveLength(4);
  });
});
