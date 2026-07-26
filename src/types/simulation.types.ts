import type { DerivativeOrder } from "./derivative.types";

/**
 * 2D position, velocity, acceleration, etc. for a particle.
 */
export interface ParticleState {
  /** Current position */
  position: { x: number; y: number };
  /** Current velocity */
  velocity: { x: number; y: number };
  /** Current acceleration */
  acceleration: { x: number; y: number };
  /** Higher-order derivatives up to max order */
  higherDerivatives: { x: number; y: number }[];
  /** Time stamp in seconds */
  time: number;
}

/**
 * A single point in a motion trail.
 */
export interface TrailPoint {
  x: number;
  y: number;
  /** Normalised age 0 (newest) → 1 (oldest) */
  age: number;
  /** Derivative order that generated this trail */
  derivativeOrder: DerivativeOrder;
}

/**
 * Describes one frame of a physics animation.
 */
export interface AnimationFrame {
  /** Monotonically increasing frame index */
  frameIndex: number;
  /** Elapsed simulation time (s) */
  time: number;
  /** Particle state at this frame */
  particle: ParticleState;
  /** Active trail points */
  trails: TrailPoint[];
  /** Derived vector overlay data */
  vectors: {
    /** Derivative order for the vector */
    order: DerivativeOrder;
    /** Vector components */
    dx: number;
    dy: number;
    /** Scale factor for rendering */
    scale: number;
  }[];
}
