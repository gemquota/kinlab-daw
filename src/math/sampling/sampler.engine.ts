export interface SampleConfig {
  start: number;
  end: number;
  count: number;
}

export interface SampledPoint {
  t: number;
  index: number;
}

/**
 * Generate uniformly spaced sample points.
 */
export function uniformSamples(config: SampleConfig): SampledPoint[] {
  const { start, end, count } = config;
  const step = (end - start) / Math.max(count - 1, 1);
  const points: SampledPoint[] = [];
  for (let i = 0; i < count; i++) {
    points.push({ t: start + i * step, index: i });
  }
  return points;
}

/**
 * Generate adaptive sample points with higher density where the function changes rapidly.
 * Uses a simple curvature-based heuristic.
 */
export function adaptiveSamples(
  fn: (t: number) => number,
  config: SampleConfig,
  maxError: number = 0.01,
): SampledPoint[] {
  const { start, end } = config;
  const points: SampledPoint[] = [];

  function subdivide(a: number, b: number, depth: number): void {
    if (depth <= 0) {
      points.push({ t: (a + b) / 2, index: points.length });
      return;
    }
    const mid = (a + b) / 2;
    const slopeA = Math.abs(fn(mid) - fn(a)) / (mid - a);
    const slopeB = Math.abs(fn(b) - fn(mid)) / (b - mid);
    const curvature = Math.abs(slopeB - slopeA);

    if (curvature > maxError && depth > 1) {
      subdivide(a, mid, depth - 1);
      subdivide(mid, b, depth - 1);
    } else {
      points.push({ t: mid, index: points.length });
    }
  }

  subdivide(start, end, 8);
  points.sort((a, b) => a.t - b.t);
  return points;
}

/**
 * Downsample to a fixed number of points using LTTB (Largest Triangle Three Buckets).
 */
export function lttbDownsample(
  data: Array<{ t: number; value: number }>,
  targetPoints: number,
): Array<{ t: number; value: number }> {
  if (data.length <= targetPoints) return data;
  if (targetPoints <= 2) return [data[0]!, data[data.length - 1]!];

  const sampled: Array<{ t: number; value: number }> = [data[0]!];
  const bucketSize = (data.length - 2) / (targetPoints - 2);

  let a = 0;
  for (let i = 1; i < targetPoints - 1; i++) {
    const rangeStart = Math.floor((i - 1) * bucketSize) + 1;
    const rangeEnd = Math.min(Math.floor(i * bucketSize) + 1, data.length);
    const avgStart = Math.floor(i * bucketSize) + 1;
    const avgEnd = Math.min(Math.floor((i + 1) * bucketSize) + 1, data.length);

    let avgT = 0;
    let avgVal = 0;
    const avgCount = avgEnd - avgStart;
    for (let j = avgStart; j < avgEnd; j++) {
      avgT += data[j]!.t;
      avgVal += data[j]!.value;
    }
    if (avgCount > 0) {
      avgT /= avgCount;
      avgVal /= avgCount;
    }

    let maxArea = -1;
    let maxIdx = rangeStart;
    for (let j = rangeStart; j < rangeEnd; j++) {
      const area = Math.abs(
        (data[a]!.t - avgT) * (data[j]!.value - data[a]!.value) -
        (data[a]!.t - data[j]!.t) * (avgVal - data[a]!.value),
      );
      if (area > maxArea) {
        maxArea = area;
        maxIdx = j;
      }
    }

    sampled.push(data[maxIdx]!);
    a = maxIdx;
  }

  sampled.push(data[data.length - 1]!);
  return sampled;
}
