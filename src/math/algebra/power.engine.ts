/**
 * Fast integer power. Returns base^exponent for non-negative integer exponent.
 */
export function intPow(base: number, exponent: number): number {
  if (exponent < 0) {
    return 1 / intPow(base, -exponent);
  }
  if (exponent === 0) return 1;
  let result = 1;
  let b = base;
  let e = exponent;
  while (e > 0) {
    if (e & 1) result *= b;
    b *= b;
    e >>= 1;
  }
  return result;
}

/**
 * Falling factorial: x^(n) = x * (x-1) * (x-2) * ... * (x-n+1)
 */
export function fallingFactorial(x: number, n: number): number {
  if (n < 0) return 0;
  if (n === 0) return 1;
  let result = 1;
  for (let i = 0; i < n; i++) {
    result *= x - i;
  }
  return result;
}

/**
 * Rising factorial (Pochhammer symbol): x^(n) = x * (x+1) * ... * (x+n-1)
 */
export function risingFactorial(x: number, n: number): number {
  if (n < 0) return 0;
  if (n === 0) return 1;
  let result = 1;
  for (let i = 0; i < n; i++) {
    result *= x + i;
  }
  return result;
}
