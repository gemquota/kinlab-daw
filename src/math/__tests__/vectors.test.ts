import { describe, it, expect } from "vitest";
import {
  vec2, addVec2, subVec2, scaleVec2,
  magnitudeVec2, normalizeVec2, dotVec2, distanceVec2,
} from "../kinematics/vectors.engine";

describe("vectors.engine", () => {
  it("creates a vec2", () => expect(vec2(3, 4)).toEqual({ x: 3, y: 4 }));
  it("adds two vectors", () => expect(addVec2(vec2(1, 2), vec2(3, 4))).toEqual({ x: 4, y: 6 }));
  it("subtracts two vectors", () => expect(subVec2(vec2(5, 7), vec2(2, 3))).toEqual({ x: 3, y: 4 }));
  it("scales a vector", () => expect(scaleVec2(vec2(2, 3), 2)).toEqual({ x: 4, y: 6 }));
  it("computes magnitude", () => expect(magnitudeVec2(vec2(3, 4))).toBeCloseTo(5));
  it("normalizes a vector", () => {
    const n = normalizeVec2(vec2(3, 4));
    expect(n.x).toBeCloseTo(0.6);
    expect(n.y).toBeCloseTo(0.8);
  });
  it("computes dot product", () => expect(dotVec2(vec2(1, 2), vec2(3, 4))).toBe(11));
  it("computes distance", () => expect(distanceVec2(vec2(0, 0), vec2(3, 4))).toBeCloseTo(5));
});
