/**
 * Linear interpolation between two values.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Cubic Hermite spline interpolation.
 */
export function hermiteInterpolate(
  p0: number, m0: number,
  p1: number, m1: number,
  t: number,
): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * p0 +
    (t3 - 2 * t2 + t) * m0 +
    (-2 * t3 + 3 * t2) * p1 +
    (t3 - t2) * m1;
}

/**
 * Catmull-Rom spline interpolation through a set of points.
 */
export function catmullRom(
  points: number[],
  t: number,
): number {
  const n = points.length - 1;
  const i = Math.min(Math.floor(t * n), n - 1);
  const localT = t * n - i;

  const p0 = points[Math.max(i - 1, 0)]!;
  const p1 = points[i]!;
  const p2 = points[Math.min(i + 1, n)]!;
  const p3 = points[Math.min(i + 2, n)]!;

  const t2 = localT * localT;
  const t3 = t2 * localT;

  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * localT +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

/**
 * Interpolate a sampled array at an arbitrary position.
 */
export function interpolateArray(
  data: number[],
  position: number,
): number {
  if (data.length === 0) return 0;
  if (data.length === 1) return data[0]!;
  const idx = Math.max(0, Math.min(position, data.length - 2));
  const frac = idx - Math.floor(idx);
  const i = Math.floor(idx);
  return lerp(data[i]!, data[i + 1]!, frac);
}
