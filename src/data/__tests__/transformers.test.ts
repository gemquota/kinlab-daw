import { describe, it, expect } from "vitest";
import {
  coefficientsToJSON,
  coefficientsFromJSON,
  samplePointsToCSV,
} from "../transformers";

describe("Transformers", () => {
  describe("coefficientsToJSON / coefficientsFromJSON", () => {
    it("roundtrips correctly", () => {
      const original = { t0: 0, maxOrder: 3, coefficients: [1, 2, 3, 4] };
      const json = coefficientsToJSON(original);
      const restored = coefficientsFromJSON(json);
      expect(restored).not.toBeNull();
      expect(restored!.t0).toBe(0);
      expect(restored!.maxOrder).toBe(3);
      expect(restored!.coefficients).toEqual([1, 2, 3, 4]);
    });

    it("returns null for invalid JSON", () => {
      expect(coefficientsFromJSON("not json")).toBeNull();
    });

    it("returns null for missing fields", () => {
      expect(coefficientsFromJSON('{"t0": 0}')).toBeNull();
    });
  });

  describe("samplePointsToCSV", () => {
    it("generates CSV with headers", () => {
      const points = [{ t: 0, values: [1, 2] }, { t: 1, values: [3, 4] }];
      const csv = samplePointsToCSV(points, 2);
      expect(csv).toContain("t,d0,d1");
      expect(csv).toContain("0,1,2");
      expect(csv).toContain("1,3,4");
    });
  });
});
