
/**
 * Definite integral of a polynomial from a to b.
 * Uses the antiderivative evaluated at bounds.
 */
export function definiteIntegral(
  coefficients: number[],
  a: number,
  b: number,
): number {
  // Antiderivative: sum of c_i * x^(i+1) / (i+1)
  const antiderivative = coefficients.map((c, i) => c / (i + 1));

  return antiderivative.reduce((sum, coeff, i) => {
    return sum + coeff * (b ** (i + 1) - a ** (i + 1));
  }, 0);
}

/**
 * Numerical integration using Simpson's 1/3 rule.
 */
export function simpsonIntegral(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number = 100,
): number {
  if (n % 2 !== 0) n += 1;
  const h = (b - a) / n;
  let sum = fn(a) + fn(b);

  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    sum += (i % 2 === 0 ? 2 : 4) * fn(x);
  }

  return (h / 3) * sum;
}

/**
 * Numerical integration using Gaussian quadrature (4-point).
 */
export function gaussianQuadrature(
  fn: (x: number) => number,
  a: number,
  b: number,
  points: number = 4,
): number {
  // 4-point Gauss-Legendre nodes and weights on [-1, 1]
  const nodes = [-0.861136, -0.339981, 0.339981, 0.861136];
  const weights = [0.347855, 0.652145, 0.652145, 0.347855];

  const usePoints = Math.min(points, nodes.length);
  let sum = 0;

  for (let i = 0; i < usePoints; i++) {
    const t = nodes[i]!;
    const w = weights[i]!;
    // Transform from [-1, 1] to [a, b]
    const x = ((b - a) * t + a + b) / 2;
    sum += w * fn(x);
  }

  return ((b - a) / 2) * sum;
}
