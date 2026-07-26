/**
 * Adaptive step size controller.
 * Adjusts step size based on estimated error.
 */
export interface AdaptiveStepState {
  h: number;
  hMin: number;
  hMax: number;
  safety: number;
  minScale: number;
  maxScale: number;
  error: number;
}

export function createAdaptiveStep(
  initialH: number,
  options: Partial<Omit<AdaptiveStepState, "h" | "error">> = {},
): AdaptiveStepState {
  return {
    h: initialH,
    hMin: options.hMin ?? 1e-8,
    hMax: options.hMax ?? 1.0,
    safety: options.safety ?? 0.9,
    minScale: options.minScale ?? 0.2,
    maxScale: options.maxScale ?? 5.0,
    error: 0,
  };
}

/**
 * Adjust step size based on estimated error and tolerance.
 */
export function adjustStep(
  state: AdaptiveStepState,
  estimatedError: number,
  tolerance: number,
): AdaptiveStepState {
  if (estimatedError <= 0) {
    return { ...state, h: Math.min(state.h * state.maxScale, state.hMax), error: 0 };
  }

  const scale = state.safety * (tolerance / estimatedError) ** 0.25;
  const clampedScale = Math.max(state.minScale, Math.min(scale, state.maxScale));
  const newH = Math.max(state.hMin, Math.min(state.h * clampedScale, state.hMax));

  return { ...state, h: newH, error: estimatedError };
}
