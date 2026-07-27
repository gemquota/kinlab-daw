import { describe, it, expect } from "vitest";
import type { DerivativeOrder } from "@/types";
import {
  DERIVATIVE_COLORS,
  DERIVATIVE_COLOR_TOKENS,
  DERIVATIVE_CSS_VARS,
  getColorForOrder,
} from "../colors.data";

describe("Colors Data", () => {
  it("exports color arrays", () => {
    expect(Array.isArray(DERIVATIVE_COLORS)).toBe(true);
    expect(DERIVATIVE_COLORS.length).toBeGreaterThan(0);
  });

  it("exports color tokens", () => {
    expect(Array.isArray(DERIVATIVE_COLOR_TOKENS)).toBe(true);
    expect(DERIVATIVE_COLOR_TOKENS.length).toBeGreaterThan(0);
  });

  it("exports CSS vars", () => {
    expect(Array.isArray(DERIVATIVE_CSS_VARS)).toBe(true);
    expect(DERIVATIVE_CSS_VARS.length).toBeGreaterThan(0);
  });

  it("getColorForOrder returns hex color", () => {
    const color = getColorForOrder(0);
    expect(color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("getColorForOrder works for multiple orders", () => {
    for (let i = 0; i < 5; i++) {
      const color = getColorForOrder(i as DerivativeOrder);
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
