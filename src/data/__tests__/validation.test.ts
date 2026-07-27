import { describe, it, expect } from "vitest";
import {
  validateCoefficients,
  validateTimeRange,
  validateSampleCount,
  validateDerivativeOrder,
  isDerivativeOrder,
} from "../validation";

describe("Validation Module", () => {
  describe("validateCoefficients", () => {
    it("accepts valid array", () => {
      expect(validateCoefficients([1, 2, 3]).ok).toBe(true);
    });

    it("rejects empty array", () => {
      const result = validateCoefficients([]);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.field).toBe("coefficients");
    });

    it("rejects non-finite values", () => {
      const result = validateCoefficients([1, NaN, 3]);
      expect(result.ok).toBe(false);
    });
  });

  describe("validateTimeRange", () => {
    it("accepts valid range tuple", () => {
      expect(validateTimeRange([0, 10]).ok).toBe(true);
    });

    it("rejects when start >= end", () => {
      expect(validateTimeRange([10, 0]).ok).toBe(false);
    });

    it("rejects non-finite values", () => {
      expect(validateTimeRange([NaN, 10]).ok).toBe(false);
    });

    it("rejects non-tuple", () => {
      expect(validateTimeRange("bad" as never).ok).toBe(false);
    });
  });

  describe("validateSampleCount", () => {
    it("accepts valid count", () => {
      expect(validateSampleCount(100).ok).toBe(true);
    });

    it("rejects non-finite", () => {
      expect(validateSampleCount(NaN).ok).toBe(false);
    });

    it("rejects non-integer", () => {
      expect(validateSampleCount(1.5).ok).toBe(false);
    });
  });

  describe("validateDerivativeOrder", () => {
    it("accepts valid order", () => {
      expect(validateDerivativeOrder(3).ok).toBe(true);
    });

    it("accepts zero (valid 0-10 range)", () => {
      expect(validateDerivativeOrder(0).ok).toBe(true);
    });

    it("rejects out of range", () => {
      expect(validateDerivativeOrder(11).ok).toBe(false);
    });

    it("rejects non-number", () => {
      expect(validateDerivativeOrder("3").ok).toBe(false);
    });
  });

  describe("isDerivativeOrder", () => {
    it("returns true for valid orders", () => {
      expect(isDerivativeOrder(0)).toBe(true);
      expect(isDerivativeOrder(5)).toBe(true);
      expect(isDerivativeOrder(10)).toBe(true);
    });

    it("returns false for invalid", () => {
      expect(isDerivativeOrder(11)).toBe(false);
      expect(isDerivativeOrder(-1)).toBe(false);
    });
  });
});
