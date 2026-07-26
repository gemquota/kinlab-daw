import type { Dimension, DerivativeOrder } from "@/types";

const SUPERSCRIPT_MAP: Record<string, string> = {
  "0": "\u2070", "1": "\u00B9", "2": "\u00B2", "3": "\u00B3", "4": "\u2074",
  "5": "\u2075", "6": "\u2076", "7": "\u2077", "8": "\u2078", "9": "\u2079", "-": "\u207B",
};

function superscript(n: number): string {
  if (n === 0) return "";
  return String(n).split("").map(function(c) { return SUPERSCRIPT_MAP[c] ?? c; }).join("");
}

export function buildDimension(order: DerivativeOrder): Dimension {
  return {
    L: 1,
    T: -order,
    M: 0,
    display: order === 0 ? "L" : "L T" + superscript(-order),
  };
}

export function dimensionsMatch(a: Dimension, b: Dimension): boolean {
  return a.L === b.L && a.T === b.T && a.M === b.M;
}

export function multiplyDimensions(a: Dimension, b: Dimension): Dimension {
  const L = a.L + b.L;
  const T = a.T + b.T;
  const M = a.M + b.M;
  return {
    L, T, M,
    display: (L > 0 ? "L" : "") + (T !== 0 ? " T" + superscript(-T) : ""),
  };
}
