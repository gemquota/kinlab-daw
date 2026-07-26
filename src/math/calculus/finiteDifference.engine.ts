/**
 * Forward difference: f(x+h) - f(x)
 */
export function forwardDifference(
  fn: (x: number) => number,
  x: number,
  h = 1e-5,
): number {
  return (fn(x + h) - fn(x)) / h;
}

/**
 * Backward difference: f(x) - f(x-h)
 */
export function backwardDifference(
  fn: (x: number) => number,
  x: number,
  h = 1e-5,
): number {
  return (fn(x) - fn(x - h)) / h;
}

/**
 * Central difference: [f(x+h) - f(x-h)] / (2h)
 */
export function centralDifference(
  fn: (x: number) => number,
  x: number,
  h = 1e-5,
): number {
  return (fn(x + h) - fn(x - h)) / (2 * h);
}

/**
 * Second derivative via central differences.
 */
export function secondCentralDifference(
  fn: (x: number) => number,
  x: number,
  h = 1e-5,
): number {
  return (fn(x + h) - 2 * fn(x) + fn(x - h)) / (h * h);
}

/**
 * Richardson extrapolation for higher accuracy derivative approximation.
 */
export function richardsonExtrapolation(
  fn: (x: number) => number,
  x: number,
  order: number,
  h = 1e-3,
  levels: number = 4,
): number {
  const table: number[][] = [];
  for (let i = 0; i < levels; i++) {
    const hi = h / 2 ** i;
    const row: number[] = [];
    for (let j = 0; j <= order; j++) {
      row.push(forwardDifference(fn, x + j * hi, hi));
    }
    table.push(row);
  }
  // Simple extrapolation using the finest level
  return table[levels - 1]![order] ?? 0;
}
