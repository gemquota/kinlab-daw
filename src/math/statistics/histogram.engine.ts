export interface HistogramBin {
  min: number;
  max: number;
  count: number;
  density: number;
}

/**
 * Compute a histogram from an array of values.
 */
export function computeHistogram(values: number[], binCount: number = 20): HistogramBin[] {
  if (values.length === 0) return [];
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (min === max) {
    return [{ min, max, count: values.length, density: 1 }];
  }

  const binWidth = (max - min) / binCount;
  const bins: HistogramBin[] = [];
  for (let i = 0; i < binCount; i++) {
    bins.push({
      min: min + i * binWidth,
      max: min + (i + 1) * binWidth,
      count: 0,
      density: 0,
    });
  }

  for (const v of values) {
    let idx = Math.floor((v - min) / binWidth);
    if (idx >= binCount) idx = binCount - 1;
    bins[idx]!.count++;
  }

  const totalArea = values.length * binWidth;
  for (const bin of bins) {
    bin.density = bin.count / totalArea;
  }

  return bins;
}
