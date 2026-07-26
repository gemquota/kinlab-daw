/**
 * Min-max normalization to [0, 1].
 */
export function normalizeMinMax(values: number[]): number[] {
  if (values.length === 0) return [];
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const span = max - min;
  if (span < Number.EPSILON) return values.map(() => 0.5);
  return values.map((v) => (v - min) / span);
}

/**
 * Z-score normalization.
 */
export function normalizeZScore(values: number[]): number[] {
  if (values.length === 0) return [];
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  const std = Math.sqrt(variance);
  if (std < Number.EPSILON) return values.map(() => 0);
  return values.map((v) => (v - mean) / std);
}

/**
 * Normalize to [-1, 1].
 */
export function normalizeBipolar(values: number[]): number[] {
  if (values.length === 0) return [];
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const span = max - min;
  if (span < Number.EPSILON) return values.map(() => 0);
  return values.map((v) => ((v - min) / span) * 2 - 1);
}
