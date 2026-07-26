/**
 * 2D vector used throughout physics and visualization.
 */
export interface Vector2D {
  x: number;
  y: number;
}

/**
 * Force — rate of change of momentum.
 */
export interface Force {
  magnitude: number;
  direction: number;
  /** Newtons (N) */
  unit: string;
  /** Optional torque contribution */
  torque?: number;
}

/**
 * Energy — capacity to do work.
 */
export interface Energy {
  /** Joules (J) */
  kinetic: number;
  /** Joules (J) */
  potential: number;
  total(): number;
}

/**
 * Momentum — mass × velocity.
 */
export interface Momentum {
  /** kg⋅m/s */
  magnitude: number;
  /** Direction angle in radians */
  angle: number;
  x: number;
  y: number;
}

/**
 * Angular velocity (rad/s).
 */
export interface AngularVelocity {
  /** Radians per second */
  omega: number;
  /** Axis of rotation (default z-axis) */
  axis: Vector2D;
}

/**
 * Angular acceleration (rad/s²).
 */
export interface AngularAcceleration {
  /** Radians per second squared */
  alpha: number;
  axis: Vector2D;
}
