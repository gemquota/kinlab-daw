import { describe, it, expect } from "vitest";
import { computeMotionState, simulateMotion } from "../kinematics/motion.engine";
import type { TaylorCoefficients } from "@/types";

describe("Motion Engine", () => {
  const coeffs: TaylorCoefficients = {
    coefficients: [0, 0, 0.5], // p(t) = 0.5 * t²
    t0: 0,
    maxOrder: 2,
  };

  it("computeMotionState returns motion properties", () => {
    const state = computeMotionState(coeffs, 1);
    expect(state).toHaveProperty("time", 1);
    expect(state).toHaveProperty("position");
    expect(state).toHaveProperty("velocity");
    expect(state).toHaveProperty("acceleration");
  });

  it("simulateMotion returns array of states", () => {
    const states = simulateMotion(coeffs, 0, 1, 0.1);
    expect(states.length).toBeGreaterThan(0);
    expect(states[0]).toHaveProperty("position");
  });
});
