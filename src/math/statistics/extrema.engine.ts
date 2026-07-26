export interface Extremum {
  value: number;
  t: number;
  type: "min" | "max";
}

/**
 * Find all local extrema in a sampled dataset.
 */
export function findLocalExtrema(data: Array<{ t: number; value: number }>): Extremum[] {
  const extrema: Extremum[] = [];
  for (let i = 1; i < data.length - 1; i++) {
    const prev = data[i - 1]!.value;
    const curr = data[i]!.value;
    const next = data[i + 1]!.value;
    if (curr > prev && curr > next) {
      extrema.push({ value: curr, t: data[i]!.t, type: "max" });
    } else if (curr < prev && curr < next) {
      extrema.push({ value: curr, t: data[i]!.t, type: "min" });
    }
  }
  return extrema;
}

/**
 * Find global maximum and minimum.
 */
export function findGlobalExtrema(data: Array<{ t: number; value: number }>): {
  min: Extremum;
  max: Extremum;
} | null {
  if (data.length === 0) return null;
  let minVal = data[0]!.value;
  let maxVal = data[0]!.value;
  let minIdx = 0;
  let maxIdx = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i]!.value < minVal) { minVal = data[i]!.value; minIdx = i; }
    if (data[i]!.value > maxVal) { maxVal = data[i]!.value; maxIdx = i; }
  }
  return {
    min: { value: minVal, t: data[minIdx]!.t, type: "min" },
    max: { value: maxVal, t: data[maxIdx]!.t, type: "max" },
  };
}

/**
 * Find zero crossings.
 */
export function findZeroCrossings(data: Array<{ t: number; value: number }>): number[] {
  const crossings: number[] = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i - 1]!.value * data[i]!.value < 0) {
      // Linear interpolation to find the crossing point
      const t0 = data[i - 1]!.t;
      const t1 = data[i]!.t;
      const v0 = data[i - 1]!.value;
      const v1 = data[i]!.value;
      crossings.push(t0 - v0 * (t1 - t0) / (v1 - v0));
    }
  }
  return crossings;
}
