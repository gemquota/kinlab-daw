import type { DerivativeOrder } from "@/types";

/**
 * SI unit definition for a derivative order.
 */
export interface UnitDefinition {
  /** Derivative order this unit corresponds to */
  order: DerivativeOrder;
  /** SI label, e.g. "m/s²" */
  siLabel: string;
  /** SI base symbols, e.g. ["m","s","s"] */
  siBases: string[];
  /** Human-readable name */
  name: string;
}

const SI_UNITS: readonly UnitDefinition[] = [
  { order: 0, siLabel: "m",          siBases: ["m"],            name: "Metre" },
  { order: 1, siLabel: "m/s",        siBases: ["m", "s"],       name: "Metres per second" },
  { order: 2, siLabel: "m/s²",       siBases: ["m", "s", "s"],  name: "Metres per second squared" },
  { order: 3, siLabel: "m/s³",       siBases: ["m", "s", "s", "s"], name: "Metres per second cubed" },
  { order: 4, siLabel: "m/s⁴",       siBases: ["m", "s", "s", "s", "s"], name: "Metres per second to the fourth" },
  { order: 5, siLabel: "m/s⁵",       siBases: ["m", "s", "s", "s", "s", "s"], name: "Metres per second to the fifth" },
  { order: 6, siLabel: "m/s⁶",       siBases: ["m", "s", "s", "s", "s", "s", "s"], name: "Metres per second to the sixth" },
  { order: 7, siLabel: "m/s⁷",       siBases: ["m", "s", "s", "s", "s", "s", "s", "s"], name: "Metres per second to the seventh" },
  { order: 8, siLabel: "m/s⁸",       siBases: ["m", "s", "s", "s", "s", "s", "s", "s", "s"], name: "Metres per second to the eighth" },
  { order: 9, siLabel: "m/s⁹",       siBases: ["m", "s", "s", "s", "s", "s", "s", "s", "s", "s"], name: "Metres per second to the ninth" },
  { order: 10, siLabel: "m/s¹⁰",     siBases: ["m", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s"], name: "Metres per second to the tenth" },
] as const;

/**
 * Get the SI unit definition for a derivative order.
 */
export function getSiUnit(order: DerivativeOrder): UnitDefinition {
  return SI_UNITS[order]!;
}

/**
 * All SI unit definitions indexed by order.
 */
export const ALL_SI_UNITS: readonly UnitDefinition[] = SI_UNITS;

/**
 * Conversion factor: multiply the SI value by this to get the target unit.
 */
export interface ConversionFactor {
  /** Target unit abbreviation */
  targetUnit: string;
  /** Full label */
  label: string;
  /** Multiply SI value by this factor to convert */
  factor: number;
  /** Derivative orders this conversion applies to */
  applicableOrders: readonly DerivativeOrder[];
}

/**
 * Common non-SI conversions for velocity (order 1) and position (order 0).
 */
export const CONVERSION_FACTORS: readonly ConversionFactor[] = [
  {
    targetUnit: "ft/s",
    label: "Feet per second",
    factor: 3.28084,
    applicableOrders: [1],
  },
  {
    targetUnit: "mph",
    label: "Miles per hour",
    factor: 2.23694,
    applicableOrders: [1],
  },
  {
    targetUnit: "km/h",
    label: "Kilometres per hour",
    factor: 3.6,
    applicableOrders: [1],
  },
  {
    targetUnit: "kn",
    label: "Knots",
    factor: 1.94384,
    applicableOrders: [1],
  },
  {
    targetUnit: "ft",
    label: "Feet",
    factor: 3.28084,
    applicableOrders: [0],
  },
  {
    targetUnit: "in",
    label: "Inches",
    factor: 39.3701,
    applicableOrders: [0],
  },
  {
    targetUnit: "yd",
    label: "Yards",
    factor: 1.09361,
    applicableOrders: [0],
  },
  {
    targetUnit: "ft/s²",
    label: "Feet per second squared",
    factor: 3.28084,
    applicableOrders: [2],
  },
];

/**
 * Convert a value from SI to a target unit.
 */
export function convertUnit(
  siValue: number,
  targetUnit: string,
  order: DerivativeOrder,
): number | null {
  const conversion = CONVERSION_FACTORS.find(
    (c) => c.targetUnit === targetUnit && c.applicableOrders.includes(order),
  );
  if (!conversion) return null;
  return siValue * conversion.factor;
}

/**
 * Get all available conversions for a given derivative order.
 */
export function getConversionsForOrder(order: DerivativeOrder): readonly ConversionFactor[] {
  return CONVERSION_FACTORS.filter((c) => c.applicableOrders.includes(order));
}
