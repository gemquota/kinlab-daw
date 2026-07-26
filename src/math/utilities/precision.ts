import { EPSILON } from "./epsilon";

export function isFinite(value: number): boolean {
  return Number.isFinite(value) && !Number.isNaN(value);
}

export function isApproximately(a: number, b: number, tol = EPSILON): boolean {
  return Math.abs(a - b) < tol;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function significantDigits(value: number, digits: number): number {
  if (value === 0) return 0;
  const magnitude = Math.floor(Math.log10(Math.abs(value)));
  const factor = 10 ** (digits - 1 - magnitude);
  return Math.round(value * factor) / factor;
}
