export function formatNumber(value: number, decimals = 4): string {
  if (!Number.isFinite(value)) return "∞";
  return value.toFixed(decimals);
}

export function formatUnit(unit: string): string {
  return unit;
}

export function formatExponent(n: number): string {
  if (n === 0) return "";
  if (n === 1) return "¹";
  const superscripts: Record<string, string> = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
    "-": "⁻",
  };
  return String(n)
    .split("")
    .map((c) => superscripts[c] ?? c)
    .join("");
}

export function formatSiUnit(order: number): string {
  if (order === 0) return "m";
  if (order === 1) return "m/s";
  return `m/s${formatExponent(order)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function isApproximately(
  a: number,
  b: number,
  epsilon = Number.EPSILON,
): boolean {
  return Math.abs(a - b) < epsilon;
}
