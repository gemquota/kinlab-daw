import { describe, it, expect } from "vitest";
import { siUnitLabel, siDimensions, dimensionFormula } from "../kinematics/units.engine";

describe("Units Engine", () => {
  it("siUnitLabel returns m for order 0", () => {
    expect(siUnitLabel(0)).toBe("m");
  });

  it("siUnitLabel returns m/s for order 1", () => {
    expect(siUnitLabel(1)).toBe("m/s");
  });

  it("siDimensions returns correct components", () => {
    const d0 = siDimensions(0);
    expect(d0[0]).toBe(1);
    expect(d0[2]).toBe(0);
    const d2 = siDimensions(2);
    expect(d2[0]).toBe(1);
    expect(d2[1]).toBe(-2);
  });

  it("dimensionFormula returns L for order 0", () => {
    expect(dimensionFormula(0)).toBe("L");
  });
});
