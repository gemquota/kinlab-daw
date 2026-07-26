import { factorial } from "../algebra/factorial.engine";
import type { TaylorCoefficients, PolynomialResult, SamplePoint } from "@/types";

/**
 * Evaluate the Taylor series at a given time t.
 * Taylor: f(t) = Σ [coeff[n] * (t - t0)^n]
 */
export function evaluateTaylor(
  coeffs: TaylorCoefficients,
  t: number,
): PolynomialResult {
  const { coefficients, t0, maxOrder } = coeffs;
  const dt = t - t0;

  // Compute polynomial value and all derivatives
  const values = new Array(maxOrder + 1).fill(0) as number[];
  const contributions = new Array(maxOrder + 1).fill(0) as number[];

  for (let n = 0; n <= maxOrder; n++) {
    const coeff = coefficients[n] ?? 0;
    const factorialN = factorial(n);
    const term = (coeff / factorialN) * dt ** n;
    contributions[n] = term;

    // Accumulate value from all terms
    values[n] = term;
  }

  const value = values.reduce((a, b) => a + b, 0);

  // Compute derivatives at t
  const derivatives: number[] = [];
  for (let k = 0; k <= maxOrder; k++) {
    let derivSum = 0;
    for (let n = k; n <= maxOrder; n++) {
      const coeff = coefficients[n] ?? 0;
      const factorialN = factorial(n);
      let fallingProd = 1;
      for (let j = 0; j < k; j++) {
        fallingProd *= n - j;
      }
      derivSum += (coeff / factorialN) * fallingProd * dt ** (n - k);
    }
    derivatives[k] = derivSum;
  }

  return {
    value,
    derivatives,
    contributions,
    isStable: true,
  };
}

/**
 * Sample the Taylor series over a range of time values.
 */
export function sampleTaylor(
  coeffs: TaylorCoefficients,
  start: number,
  end: number,
  numPoints: number = 200,
): SamplePoint[] {
  const step = (end - start) / (numPoints - 1);
  const points: SamplePoint[] = [];

  for (let i = 0; i < numPoints; i++) {
    const t = start + i * step;
    const result = evaluateTaylor(coeffs, t);
    points.push({
      t,
      values: result.derivatives,
      contributions: result.contributions.map((c) => [c]),
    });
  }

  return points;
}

/**
 * Generate the Taylor series coefficients for a known function
 * about a center point, up to a given order.
 */
export function taylorExpand(
  fn: (x: number) => number,
  t0: number,
  maxOrder: number,
): number[] {
  const coeffs: number[] = [];
  const h = 1e-4;

  for (let n = 0; n <= maxOrder; n++) {
    // Numerical n-th derivative at t0 using central differences
    let deriv = 0;
    for (let k = 0; k <= n; k++) {
      // Binomial coefficient * (-1)^(n-k)
      let binom = 1;
      for (let j = 0; j < k; j++) {
        binom = (binom * (n - j)) / (j + 1);
      }
      const sign = (n - k) % 2 === 0 ? 1 : -1;
      deriv += sign * binom * fn(t0 + (k - n / 2) * h);
    }
    deriv /= h ** n;
    coeffs.push(deriv / factorial(n));
  }

  return coeffs;
}
