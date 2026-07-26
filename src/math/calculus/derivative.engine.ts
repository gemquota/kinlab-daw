import { evaluatePolynomialDerivatives } from "../algebra/polynomial.engine";

/**
 * Compute the n-th derivative of a polynomial at point x.
 */
export function nthDerivative(
  coefficients: number[],
  x: number,
  order: number,
): number {
  const results = evaluatePolynomialDerivatives(coefficients, x, order);
  return results[order]!;
}

/**
 * Compute all derivatives from 0 to maxOrder at point x.
 */
export function allDerivatives(
  coefficients: number[],
  x: number,
  maxOrder: number,
): number[] {
  return evaluatePolynomialDerivatives(coefficients, x, maxOrder);
}

/**
 * Symbolically differentiate a polynomial.
 * Given coefficients p(x) = c_0 + c_1*x + c_2*x^2 + ...,
 * returns the coefficients of p'(x) = c_1 + 2*c_2*x + ...
 */
export function differentiatePolynomial(coefficients: number[]): number[] {
  if (coefficients.length <= 1) return [0];
  return coefficients.slice(1).map((c, i) => c * (i + 1));
}

/**
 * Symbolically integrate a polynomial (indefinite integral, constant = 0).
 */
export function integratePolynomial(coefficients: number[]): number[] {
  const result = [0];
  for (let i = 0; i < coefficients.length; i++) {
    result.push(coefficients[i]! / (i + 1));
  }
  return result;
}

/**
 * Finite difference approximation of the n-th derivative.
 * Uses central differences for interior points, forward/backward for boundaries.
 */
export function finiteDifference(
  fn: (x: number) => number,
  x: number,
  order: number,
  h = 1e-5,
): number {
  if (order === 0) return fn(x);

  // Use central difference for better accuracy
  const coeff = centralDifferenceCoefficients(order);
  let result = 0;
  for (let i = 0; i < coeff.length; i++) {
    const offset = (i - order) * h;
    result += coeff[i]! * fn(x + offset);
  }
  return result / h ** order;
}

/**
 * Central difference coefficients for n-th derivative.
 * Uses the standard stencil: [1, -2, 1] for 2nd derivative, etc.
 */
function centralDifferenceCoefficients(order: number): number[] {
  const n = order;
  const size = 2 * n + 1;
  const coefficients = new Array(size).fill(0) as number[];

  for (let k = 0; k <= n; k++) {
    // Binomial coefficient: C(n, k) * (-1)^(n-k)
    let binom = 1;
    for (let j = 0; j < k; j++) {
      binom = (binom * (n - j)) / (j + 1);
    }
    const sign = (n - k) % 2 === 0 ? 1 : -1;
    coefficients[n - k] = binom * sign;
    coefficients[n + k] = binom * sign;
  }

  return coefficients;
}
