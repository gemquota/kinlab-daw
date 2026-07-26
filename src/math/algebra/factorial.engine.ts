import { MAX_SAFE_FACTORIAL } from "../utilities/epsilon";

/**
 * Compute n! iteratively. Throws for n > 170 (overflow in float64).
 */
export function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`factorial requires a non-negative integer, got ${n}`);
  }
  if (n > MAX_SAFE_FACTORIAL) {
    throw new RangeError(`factorial(${n}) exceeds safe float64 range`);
  }
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Double factorial: n!! = n * (n-2) * (n-4) * ...
 */
export function doubleFactorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`doubleFactorial requires a non-negative integer, got ${n}`);
  }
  if (n <= 1) return 1;
  let result = 1;
  for (let i = n; i >= 2; i -= 2) {
    result *= i;
  }
  return result;
}

/**
 * Log-factorial: ln(n!) — more numerically stable for large n.
 */
export function logFactorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`logFactorial requires a non-negative integer, got ${n}`);
  }
  let result = 0;
  for (let i = 2; i <= n; i++) {
    result += Math.log(i);
  }
  return result;
}

/**
 * Binomial coefficient: C(n, k) = n! / (k! * (n-k)!)
 */
export function binomial(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  // Use the symmetric property to minimize computation
  const kMin = Math.min(k, n - k);
  let result = 1;
  for (let i = 0; i < kMin; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return Math.round(result);
}

/**
 * Precompute factorials up to maxN.
 */
export function precomputeFactorials(maxN: number): number[] {
  const table = new Array(maxN + 1);
  table[0] = 1;
  for (let i = 1; i <= maxN; i++) {
    table[i] = table[i - 1]! * i;
  }
  return table;
}
