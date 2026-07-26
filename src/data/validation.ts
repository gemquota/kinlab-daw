import type { DerivativeOrder, TaylorCoefficients } from "@/types";

/* -------------------------------------------------------------------------- */
/*  Result types                                                               */
/* -------------------------------------------------------------------------- */

/** Successful validation result. */
export interface ValidationSuccess {
  ok: true;
}

/** Failed validation result. */
export interface ValidationError {
  ok: false;
  field: string;
  message: string;
}

export type ValidationResult = ValidationSuccess | ValidationError;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function success(): ValidationSuccess {
  return { ok: true };
}

function error(field: string, message: string): ValidationError {
  return { ok: false, field, message };
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/* -------------------------------------------------------------------------- */
/*  Taylor coefficient validation                                              */
/* -------------------------------------------------------------------------- */

const MAX_ORDER = 10;
const MAX_COEFFICIENT_MAGITUDE = 1e12;
const MIN_COEFFICIENT_MAGITUDE = 1e-15;

/**
 * Validate a Taylor coefficient array.
 * Returns the first error found, or success.
 */
export function validateCoefficients(coeffs: number[]): ValidationResult {
  if (!Array.isArray(coeffs)) {
    return error("coefficients", "Coefficients must be an array.");
  }

  if (coeffs.length === 0) {
    return error("coefficients", "At least one coefficient is required.");
  }

  if (coeffs.length > MAX_ORDER + 1) {
    return error(
      "coefficients",
      `Coefficient array length must be ≤ ${MAX_ORDER + 1}.`,
    );
  }

  for (let i = 0; i < coeffs.length; i++) {
    if (!isFiniteNumber(coeffs[i])) {
      return error(
        `coefficients[${i}]`,
        `Coefficient at index ${i} is not a finite number.`,
      );
    }

    const abs = Math.abs(coeffs[i]!);
    if (abs > MAX_COEFFICIENT_MAGITUDE) {
      return error(
        `coefficients[${i}]`,
        `Coefficient at index ${i} exceeds maximum magnitude of ${MAX_COEFFICIENT_MAGITUDE}.`,
      );
    }
    if (abs !== 0 && abs < MIN_COEFFICIENT_MAGITUDE) {
      return error(
        `coefficients[${i}]`,
        `Coefficient at index ${i} is below minimum non-zero magnitude of ${MIN_COEFFICIENT_MAGITUDE}.`,
      );
    }
  }

  return success();
}

/**
 * Validate a full TaylorCoefficients object.
 */
export function validateTaylorCoefficients(tc: TaylorCoefficients): ValidationResult {
  if (!tc || typeof tc !== "object") {
    return error("taylorCoefficients", "Taylor coefficients object is required.");
  }

  const coeffResult = validateCoefficients(tc.coefficients);
  if (!coeffResult.ok) return coeffResult;

  if (!isFiniteNumber(tc.t0)) {
    return error("t0", "t₀ must be a finite number.");
  }

  if (tc.maxOrder < 0 || tc.maxOrder > MAX_ORDER) {
    return error("maxOrder", `maxOrder must be between 0 and ${MAX_ORDER}.`);
  }

  if (tc.maxOrder !== tc.coefficients.length - 1) {
    return error(
      "maxOrder",
      "maxOrder must equal coefficients.length - 1.",
    );
  }

  return success();
}

/* -------------------------------------------------------------------------- */
/*  Time range validation                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Validate a [start, end] time range.
 */
export function validateTimeRange(
  range: [number, number],
): ValidationResult {
  if (!Array.isArray(range) || range.length !== 2) {
    return error("timeRange", "Time range must be a [start, end] tuple.");
  }

  const [start, end] = range as [number, number];

  if (!isFiniteNumber(start)) {
    return error("timeRange.start", "Start time must be a finite number.");
  }

  if (!isFiniteNumber(end)) {
    return error("timeRange.end", "End time must be a finite number.");
  }

  if (start >= end) {
    return error("timeRange", "Start time must be strictly less than end time.");
  }

  if (end - start > 1e6) {
    return error("timeRange", "Time range span must not exceed 1,000,000 seconds.");
  }

  return success();
}

/* -------------------------------------------------------------------------- */
/*  Sample count validation                                                    */
/* -------------------------------------------------------------------------- */

const MIN_SAMPLES = 2;
const MAX_SAMPLES = 50_000;

/**
 * Validate a sample count for chart rendering.
 */
export function validateSampleCount(count: number): ValidationResult {
  if (!isFiniteNumber(count)) {
    return error("sampleCount", "Sample count must be a finite number.");
  }

  if (!Number.isInteger(count)) {
    return error("sampleCount", "Sample count must be an integer.");
  }

  if (count < MIN_SAMPLES) {
    return error("sampleCount", `Sample count must be ≥ ${MIN_SAMPLES}.`);
  }

  if (count > MAX_SAMPLES) {
    return error("sampleCount", `Sample count must be ≤ ${MAX_SAMPLES}.`);
  }

  return success();
}

/* -------------------------------------------------------------------------- */
/*  Derivative order validation                                                */
/* -------------------------------------------------------------------------- */

/**
 * Validate a derivative order value.
 */
export function validateDerivativeOrder(order: unknown): ValidationResult {
  if (!isFiniteNumber(order)) {
    return error("order", "Derivative order must be a finite number.");
  }

  if (!Number.isInteger(order)) {
    return error("order", "Derivative order must be an integer.");
  }

  if (order < 0 || order > 10) {
    return error("order", "Derivative order must be between 0 and 10.");
  }

  return success();
}

/**
 * Type guard: assert that an unknown value is a valid DerivativeOrder.
 */
export function isDerivativeOrder(value: unknown): value is DerivativeOrder {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 10
  );
}

/* -------------------------------------------------------------------------- */
/*  Composite validation                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Validate all inputs for a Taylor evaluation.
 */
export function validateTaylorEvaluation(
  coefficients: number[],
  t0: number,
  timeRange: [number, number],
  sampleCount: number,
): ValidationResult[] {
  const results: ValidationResult[] = [
    validateCoefficients(coefficients),
    validateTimeRange(timeRange),
    validateSampleCount(sampleCount),
  ];

  if (!isFiniteNumber(t0)) {
    results.push(error("t0", "t₀ must be a finite number."));
  }

  return results;
}
