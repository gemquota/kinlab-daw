import type { DerivativeOrder, TaylorCoefficients } from "@/types";

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
}

export function validateDerivativeOrder(order: number): order is DerivativeOrder {
  return Number.isInteger(order) && order >= 0 && order <= 10;
}

export function validateCoefficients(coeffs: TaylorCoefficients): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!Array.isArray(coeffs.coefficients)) {
    errors.push({ code: "INVALID_ARRAY", message: "Coefficients must be an array", field: "coefficients" });
    return errors;
  }

  if (coeffs.coefficients.length === 0 || coeffs.coefficients.length > 11) {
    errors.push({
      code: "INVALID_LENGTH",
      message: "Coefficients array must have 1–11 elements",
      field: "coefficients",
    });
  }

  for (let i = 0; i < coeffs.coefficients.length; i++) {
    const val = coeffs.coefficients[i];
    if (typeof val !== "number" || !Number.isFinite(val)) {
      errors.push({
        code: "NON_FINITE",
        message: `Coefficient at index ${i} is not a finite number`,
        field: `coefficients[${i}]`,
      });
    }
  }

  if (typeof coeffs.t0 !== "number" || !Number.isFinite(coeffs.t0)) {
    errors.push({ code: "INVALID_T0", message: "Center point t₀ must be finite", field: "t0" });
  }

  if (!validateDerivativeOrder(coeffs.maxOrder)) {
    errors.push({ code: "INVALID_MAX_ORDER", message: "maxOrder must be 0–10", field: "maxOrder" });
  }

  return errors;
}

export function validateTimeRange(start: number, end: number): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    errors.push({ code: "INVALID_RANGE", message: "Time range must be finite" });
  }
  if (start >= end) {
    errors.push({ code: "EMPTY_RANGE", message: "Start time must be less than end time" });
  }
  return errors;
}
