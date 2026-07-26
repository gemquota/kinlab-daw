/**
 * Chain rule for composite functions.
 * d/dx [f(g(x))] = f'(g(x)) * g'(x)
 */
export function chainRule(
  fPrime: (u: number) => number,
  g: (x: number) => number,
  gPrime: (x: number) => number,
  x: number,
): number {
  return fPrime(g(x)) * gPrime(x);
}

/**
 * Second derivative via chain rule:
 * d²/dx² [f(g(x))] = f''(g(x)) * [g'(x)]² + f'(g(x)) * g''(x)
 */
export function chainRuleSecond(
  fPrime: (u: number) => number,
  fDoublePrime: (u: number) => number,
  g: (x: number) => number,
  gPrime: (x: number) => number,
  gDoublePrime: (x: number) => number,
  x: number,
): number {
  const gx = g(x);
  const gpx = gPrime(x);
  return fDoublePrime(gx) * gpx ** 2 + fPrime(gx) * gDoublePrime(x);
}
