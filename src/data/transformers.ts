import type { DerivativeOrder, SamplePoint, TaylorCoefficients } from "@/types";
import { getSiUnit, CONVERSION_FACTORS, type ConversionFactor } from "./units.data";

/* -------------------------------------------------------------------------- */
/*  Coefficient normalisation                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Remove trailing near-zero coefficients and normalise so the leading
 * (highest-order non-zero) coefficient has magnitude 1.
 */
export function normaliseCoefficients(coeffs: number[]): {
  coefficients: number[];
  scaleFactor: number;
} {
  let maxOrder = coeffs.length - 1;

  // Strip trailing zeros
  while (maxOrder > 0 && Math.abs(coeffs[maxOrder]!) < 1e-15) {
    maxOrder--;
  }

  const trimmed = coeffs.slice(0, maxOrder + 1);

  // Find leading non-zero coefficient
  const leading = trimmed.find((c) => Math.abs(c) > 1e-15);
  if (leading === undefined || Math.abs(leading) < 1e-15) {
    return { coefficients: [0], scaleFactor: 0 };
  }

  const scaleFactor = leading;
  const normalised = trimmed.map((c) => c / scaleFactor);

  return { coefficients: normalised, scaleFactor };
}

/**
 * Centre coefficients around a new t₀.
 * Returns a new coefficient array evaluated at the shifted point.
 */
export function centreCoefficients(
  coeffs: number[],
  oldT0: number,
  newT0: number,
): number[] {
  const dt = newT0 - oldT0;
  const n = coeffs.length;
  const result: number[] = new Array(n).fill(0) as number[];

  for (let i = 0; i < n; i++) {
    const ci = coeffs[i]!;
    if (Math.abs(ci) < 1e-15) continue;

    // Each term ci * (t - oldT0)^i contributes to all orders >= i
    for (let k = i; k < n; k++) {
      // binomial coefficient C(k, i)
      let binom = 1;
      for (let j = 0; j < i; j++) {
        binom = (binom * (k - j)) / (j + 1);
      }
      result[k]! += ci * binom * dt ** (k - i);
    }
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/*  Unit conversion                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Convert all values in a SamplePoint array from SI to a target unit.
 */
export function convertSamplePoints(
  points: SamplePoint[],
  order: DerivativeOrder,
  targetUnit: string,
): SamplePoint[] {
  const conversion = CONVERSION_FACTORS.find(
    (c: ConversionFactor) => c.targetUnit === targetUnit && c.applicableOrders.includes(order),
  );
  if (!conversion) return points;

  const factor = conversion.factor;

  return points.map((pt) => ({
    t: pt.t,
    values: pt.values.map((v, i) => (i === order ? v * factor : v)),
    contributions: pt.contributions,
  }));
}

/**
 * Convert a single scalar value from SI to target unit.
 */
export function convertValue(
  value: number,
  order: DerivativeOrder,
  targetUnit: string,
): number | null {
  const conversion = CONVERSION_FACTORS.find(
    (c: ConversionFactor) => c.targetUnit === targetUnit && c.applicableOrders.includes(order),
  );
  if (!conversion) return null;
  return value * conversion.factor;
}

/* -------------------------------------------------------------------------- */
/*  Format conversion                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Convert TaylorCoefficients to a compact serialisable form.
 */
export function coefficientsToJSON(tc: TaylorCoefficients): string {
  return JSON.stringify({
    t0: tc.t0,
    maxOrder: tc.maxOrder,
    c: tc.coefficients,
  });
}

/**
 * Parse compact JSON back to TaylorCoefficients.
 */
export function coefficientsFromJSON(json: string): TaylorCoefficients | null {
  try {
    const parsed = JSON.parse(json) as {
      t0: number;
      maxOrder: number;
      c: number[];
    };

    if (
      typeof parsed.t0 !== "number" ||
      typeof parsed.maxOrder !== "number" ||
      !Array.isArray(parsed.c)
    ) {
      return null;
    }

    return {
      t0: parsed.t0,
      maxOrder: parsed.maxOrder,
      coefficients: parsed.c,
    };
  } catch {
    return null;
  }
}

/**
 * Convert a SamplePoint array to a CSV string (for export).
 */
export function samplePointsToCSV(
  points: SamplePoint[],
  derivativeCount: number,
): string {
  const headers = ["t", ...Array.from({ length: derivativeCount }, (_, i) => `d${i}`)];
  const rows = points.map((pt) =>
    [pt.t, ...pt.values.slice(0, derivativeCount)].join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

/**
 * Parse a CSV string back to a SamplePoint array.
 */
export function samplePointsFromCSV(csv: string, derivativeCount: number): SamplePoint[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];

  // Skip header row
  return lines.slice(1).map((line) => {
    const parts = line.split(",").map((s) => parseFloat(s.trim()));
    const t = parts[0]!;
    const values = parts.slice(1, derivativeCount + 1);
    return {
      t,
      values,
      contributions: [],
    };
  });
}

/**
 * Get the SI unit label for a derivative order.
 */
export function getUnitLabel(order: DerivativeOrder): string {
  return getSiUnit(order).siLabel;
}
