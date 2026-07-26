import type { TaylorCoefficients, PlaybackState } from "@/types";
import { evaluateTaylor } from "../calculus/taylor.engine";

/**
 * Compute all kinematic quantities at a given time.
 */
export interface MotionState {
  time: number;
  position: number;
  velocity: number;
  acceleration: number;
  jerk: number;
  higherOrders: number[];
}

export function computeMotionState(
  coeffs: TaylorCoefficients,
  t: number,
): MotionState {
  const result = evaluateTaylor(coeffs, t);
  return {
    time: t,
    position: result.derivatives[0] ?? 0,
    velocity: result.derivatives[1] ?? 0,
    acceleration: result.derivatives[2] ?? 0,
    jerk: result.derivatives[3] ?? 0,
    higherOrders: result.derivatives.slice(4),
  };
}

/**
 * Simulate motion over a time range and return states.
 */
export function simulateMotion(
  coeffs: TaylorCoefficients,
  start: number,
  end: number,
  dt: number = 0.016,
): MotionState[] {
  const states: MotionState[] = [];
  for (let t = start; t <= end; t += dt) {
    states.push(computeMotionState(coeffs, t));
  }
  return states;
}

/**
 * Advance playback time.
 */
export function advanceTime(
  currentTime: number,
  playback: PlaybackState,
  dt: number,
): number {
  if (!playback.isPlaying) return currentTime;
  const newTime = currentTime + playback.speed * dt;
  return playback.loop ? ((newTime % 10) + 10) % 10 : newTime;
}
