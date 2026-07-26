import { factorial } from "./factorial.engine";

/**
 * Convert raw derivative values to Taylor coefficients.
 * taylorCoeff[n] = derivativeValue[n] / n!
 */
export function derivativeValuesToTaylorCoeffs(
  derivativeValues: number[],
): number[] {
  return derivativeValues.map((val, n) => val / factorial(n));
}

/**
 * Convert Taylor coefficients to derivative values.
 * derivativeValue[n] = taylorCoeff[n] * n!
 */
export function taylorCoeffsToDerivativeValues(
  taylorCoeffs: number[],
): number[] {
  return taylorCoeffs.map((coeff, n) => coeff * factorial(n));
}

/**
 * Normalize coefficients so that the leading non-zero coefficient is 1.
 */
export function normalizeCoefficients(coefficients: number[]): number[] {
  for (let i = coefficients.length - 1; i >= 0; i--) {
    if (Math.abs(coefficients[i]!) > Number.EPSILON) {
      const scale = coefficients[i]!;
      return coefficients.map((c) => c / scale);
    }
  }
  return [...coefficients];
}

/**
 * Extract effective order (highest non-zero coefficient index).
 */
export function effectiveOrder(coefficients: number[]): number {
  for (let i = coefficients.length - 1; i >= 0; i--) {
    if (Math.abs(coefficients[i]!) > Number.EPSILON) {
      return i;
    }
  }
  return 0;
}
