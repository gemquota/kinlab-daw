import { evaluateTaylor, sampleTaylor, factorial } from "@/math";
import { validateCoefficients } from "@/math/utilities/validation";
import type {
  TaylorCoefficients,
  PolynomialResult,
  SamplePoint,
  DerivativeOrder,
} from "@/types";

/* ─── Validation Result ─── */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/* ─── Computed Statistics ─── */
export interface DerivativeStats {
  order: DerivativeOrder;
  min: number;
  max: number;
  mean: number;
  rms: number;
  peakMagnitude: number;
}

/* ─── Full Scientific Result ─── */
export interface ScientificResult {
  /** Input parameters */
  input: {
    coefficients: TaylorCoefficients;
    timeDomain: { min: number; max: number };
    sampleCount: number;
  };
  /** Validation outcome */
  validation: ValidationResult;
  /** Evaluation at current time */
  evaluation: PolynomialResult;
  /** Sampled data across the domain */
  samples: SamplePoint[];
  /** Per-derivative statistics */
  statistics: DerivativeStats[];
  /** Taylor expression string */
  expression: string;
  /** Metadata */
  metadata: {
    maxOrder: number;
    sampleCount: number;
    computationTimeMs: number;
  };
}

/* ─── Pipeline Input ─── */
export interface PipelineInput {
  coefficients: TaylorCoefficients;
  currentTime: number;
  timeMin: number;
  timeMax: number;
  sampleCount: number;
}

/**
 * Run the complete scientific computation pipeline.
 * This is the single entry point for all derived data.
 * Pure function — no side effects, no store access.
 */
export function runPipeline(input: PipelineInput): ScientificResult {
  const startTime = performance.now();

  // 1. Validate
  const validation = validateInput(input);

  // 2. Evaluate at current time
  const evaluation = evaluateTaylor(input.coefficients, input.currentTime);

  // 3. Sample across the domain
  const samples = sampleTaylor(
    input.coefficients,
    input.timeMin,
    input.timeMax,
    input.sampleCount,
  );

  // 4. Compute statistics for each derivative
  const statistics = computeStatistics(samples, input.coefficients.maxOrder);

  // 5. Build expression string
  const expression = buildExpression(input.coefficients);

  // 6. Package metadata
  const computationTimeMs = performance.now() - startTime;

  return {
    input: {
      coefficients: input.coefficients,
      timeDomain: { min: input.timeMin, max: input.timeMax },
      sampleCount: input.sampleCount,
    },
    validation,
    evaluation,
    samples,
    statistics,
    expression,
    metadata: {
      maxOrder: input.coefficients.maxOrder,
      sampleCount: input.sampleCount,
      computationTimeMs,
    },
  };
}

function validateInput(input: PipelineInput): ValidationResult {
  const errors: string[] = [];
  const validation = validateCoefficients(input.coefficients);
  for (const err of validation) {
    errors.push(err.message);
  }
  if (input.timeMin >= input.timeMax) {
    errors.push("Time minimum must be less than time maximum");
  }
  if (input.sampleCount < 10) {
    errors.push("Sample count must be at least 10");
  }
  return { isValid: errors.length === 0, errors };
}

function computeStatistics(samples: SamplePoint[], maxOrder: number): DerivativeStats[] {
  const stats: DerivativeStats[] = [];
  for (let order = 0; order <= maxOrder; order++) {
    const values = samples.map((pt) => pt.values[order] ?? 0);
    let sum = 0;
    let sumSq = 0;
    let min = Infinity;
    let max = -Infinity;
    for (const v of values) {
      sum += v;
      sumSq += v * v;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    const mean = sum / values.length;
    const rms = Math.sqrt(sumSq / values.length);
    stats.push({
      order: order as DerivativeOrder,
      min,
      max,
      mean,
      rms,
      peakMagnitude: Math.max(Math.abs(min), Math.abs(max)),
    });
  }
  return stats;
}

function buildExpression(coeffs: TaylorCoefficients): string {
  const SUPERSCRIPTS = "\u2070\u00B9\u00B2\u00B3\u2074\u2075\u2076\u2077\u2078\u2079";
  const terms: string[] = [];

  for (let n = 0; n < coeffs.coefficients.length; n++) {
    const c = coeffs.coefficients[n] ?? 0;
    if (Math.abs(c) < 1e-10) continue;
    const factN = factorial(n);
    const normalized = c / factN;

    const sup = String(n)
      .split("")
      .map((ch) => SUPERSCRIPTS[parseInt(ch)] ?? ch)
      .join("");

    if (n === 0) {
      terms.push(`${normalized.toFixed(4)}`);
    } else {
      const tPart = coeffs.t0 === 0 ? "t" : `(t\u2212${coeffs.t0})`;
      terms.push(`${normalized.toFixed(4)}${tPart}${n === 1 ? "" : sup}`);
    }
  }

  return terms.length > 0 ? "f(t) = " + terms.join(" + ") : "f(t) = 0";
}
