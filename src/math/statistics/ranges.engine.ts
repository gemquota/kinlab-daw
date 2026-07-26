export interface ValueRange {
  min: number;
  max: number;
  span: number;
  mean: number;
}

/**
 * Compute the range and mean of an array of values.
 */
export function computeRange(values: number[]): ValueRange {
  if (values.length === 0) {
    return { min: 0, max: 0, span: 0, mean: 0 };
  }
  let min = Infinity;
  let max = -Infinity;
  let sum = 0;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
    sum += v;
  }
  return { min, max, span: max - min, mean: sum / values.length };
}

/**
 * Compute the range across all derivative values at each time step.
 */
export function computeDerivativeRange(
  data: Array<{ values: number[] }>,
): ValueRange[] {
  if (data.length === 0) return [];
  const numDerivatives = data[0]!.values.length;
  const ranges: ValueRange[] = [];
  for (let d = 0; d < numDerivatives; d++) {
    const vals = data.map((pt) => pt.values[d]!);
    ranges.push(computeRange(vals));
  }
  return ranges;
}

/**
 * Pad a range with a given margin.
 */
export function padRange(range: ValueRange, margin = 0.1): ValueRange {
  const padAmount = range.span * margin;
  return {
    min: range.min - padAmount,
    max: range.max + padAmount,
    span: range.span + 2 * padAmount,
    mean: range.mean,
  };
}
