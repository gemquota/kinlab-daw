/**
 * Simple moving average.
 */
export function movingAverage(data: number[], window: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let count = 0;
    for (let j = Math.max(0, i - window); j <= Math.min(data.length - 1, i + window); j++) {
      sum += data[j]!;
      count++;
    }
    result.push(sum / count);
  }
  return result;
}

/**
 * Gaussian smoothing.
 */
export function gaussianSmooth(data: number[], sigma: number): number[] {
  const radius = Math.ceil(sigma * 3);
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    let weightedSum = 0;
    let weightSum = 0;
    for (let j = Math.max(0, i - radius); j <= Math.min(data.length - 1, i + radius); j++) {
      const dist = j - i;
      const weight = Math.exp(-(dist * dist) / (2 * sigma * sigma));
      weightedSum += data[j]! * weight;
      weightSum += weight;
    }
    result.push(weightedSum / weightSum);
  }
  return result;
}

/**
 * Exponential smoothing.
 */
export function exponentialSmooth(data: number[], alpha: number): number[] {
  const result: number[] = [data[0]!];
  for (let i = 1; i < data.length; i++) {
    result.push(alpha * data[i]! + (1 - alpha) * result[i - 1]!);
  }
  return result;
}
