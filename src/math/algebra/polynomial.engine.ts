/**
 * Evaluate a polynomial at point x.
 * coefficients[i] is the coefficient of x^i.
 *
 * Uses Horner's method for numerical stability.
 */
export function evaluatePolynomial(coefficients: number[], x: number): number {
  if (coefficients.length === 0) return 0;
  let result = coefficients[coefficients.length - 1]!;
  for (let i = coefficients.length - 2; i >= 0; i--) {
    result = result * x + coefficients[i]!;
  }
  return result;
}

/**
 * Evaluate a polynomial and return individual term contributions.
 */
export function evaluatePolynomialWithTerms(
  coefficients: number[],
  x: number,
): { value: number; terms: number[] } {
  const terms: number[] = [];
  for (let i = 0; i < coefficients.length; i++) {
    terms.push(coefficients[i]! * x ** i);
  }
  return { value: terms.reduce((a, b) => a + b, 0), terms };
}

/**
 * Evaluate polynomial derivatives up to order maxDerivative.
 * Returns an array where result[k] is the k-th derivative at x.
 */
export function evaluatePolynomialDerivatives(
  coefficients: number[],
  x: number,
  maxDerivative: number,
): number[] {
  const n = coefficients.length;
  const results = new Array(maxDerivative + 1).fill(0) as number[];

  // For each derivative order k
  for (let k = 0; k <= maxDerivative; k++) {
    let sum = 0;
    for (let i = k; i < n; i++) {
      // d^k/dx^k (c_i * x^i) = c_i * i! / (i-k)! * x^(i-k)
      let coeff = coefficients[i]!;
      // Multiply by falling factorial: i * (i-1) * ... * (i-k+1)
      for (let j = 0; j < k; j++) {
        coeff *= i - j;
      }
      sum += coeff * x ** (i - k);
    }
    results[k] = sum;
  }

  return results;
}

/**
 * Add two polynomials (element-wise).
 */
export function addPolynomials(a: number[], b: number[]): number[] {
  const maxLen = Math.max(a.length, b.length);
  const result = new Array(maxLen).fill(0) as number[];
  for (let i = 0; i < maxLen; i++) {
    result[i] = (a[i] ?? 0) + (b[i] ?? 0);
  }
  return result;
}

/**
 * Scale a polynomial by a constant.
 */
export function scalePolynomial(coefficients: number[], scalar: number): number[] {
  return coefficients.map((c) => c * scalar);
}

/**
 * Multiply two polynomials.
 */
export function multiplyPolynomials(a: number[], b: number[]): number[] {
  const result = new Array(a.length + b.length - 1).fill(0) as number[];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      result[i + j]! += a[i]! * b[j]!;
    }
  }
  return result;
}
