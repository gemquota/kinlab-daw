import type { DerivativeOrder } from "@/types";

export function siUnitLabel(order: DerivativeOrder): string {
  if (order === 0) return "m";
  if (order === 1) return "m/s";
  const sup = superscript(order);
  return "m/s" + sup;
}

export function siDimensions(order: DerivativeOrder): [number, number, number] {
  return [1, -order, 0];
}

export function dimensionFormula(order: DerivativeOrder): string {
  if (order === 0) return "L";
  return "L T" + superscript(-order);
}

export function convertUnit(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value;
  return value;
}

function superscript(n: number): string {
  const map: Record<string, string> = {
    "0": "\u2070", "1": "\u00B9", "2": "\u00B2", "3": "\u00B3", "4": "\u2074",
    "5": "\u2075", "6": "\u2076", "7": "\u2077", "8": "\u2078", "9": "\u2079", "-": "\u207B",
  };
  return String(n).split("").map(function(c) { return map[c] ?? c; }).join("");
}
