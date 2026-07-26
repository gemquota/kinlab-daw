// Algebra
export { factorial, doubleFactorial, logFactorial, binomial, precomputeFactorials } from "./algebra/factorial.engine";
export { evaluatePolynomial, evaluatePolynomialWithTerms, evaluatePolynomialDerivatives, addPolynomials, scalePolynomial, multiplyPolynomials } from "./algebra/polynomial.engine";
export { derivativeValuesToTaylorCoeffs, taylorCoeffsToDerivativeValues, normalizeCoefficients, effectiveOrder } from "./algebra/coefficients.engine";
export { intPow, fallingFactorial, risingFactorial } from "./algebra/power.engine";

// Calculus
export { nthDerivative, allDerivatives, differentiatePolynomial, integratePolynomial, finiteDifference } from "./calculus/derivative.engine";
export { definiteIntegral, simpsonIntegral, gaussianQuadrature } from "./calculus/integral.engine";
export { evaluateTaylor, sampleTaylor, taylorExpand } from "./calculus/taylor.engine";
export { chainRule, chainRuleSecond } from "./calculus/chainRule.engine";
export { forwardDifference, backwardDifference, centralDifference, secondCentralDifference, richardsonExtrapolation } from "./calculus/finiteDifference.engine";

// Kinematics
export { computeMotionState, simulateMotion, advanceTime } from "./kinematics/motion.engine";
export type { MotionState } from "./kinematics/motion.engine";
export { vec2, vec3, addVec2, subVec2, scaleVec2, magnitudeVec2, normalizeVec2, dotVec2, distanceVec2, lerpVec2, angleVec2, rotateVec2 } from "./kinematics/vectors.engine";
export type { Vec2, Vec3 } from "./kinematics/vectors.engine";
export { siUnitLabel, siDimensions, dimensionFormula, convertUnit } from "./kinematics/units.engine";
export { buildDimension, dimensionsMatch, multiplyDimensions } from "./kinematics/dimensions.engine";

// Sampling
export { uniformSamples, adaptiveSamples, lttbDownsample } from "./sampling/sampler.engine";
export { lerp, hermiteInterpolate, catmullRom, interpolateArray } from "./sampling/interpolation.engine";
export { movingAverage, gaussianSmooth, exponentialSmooth } from "./sampling/smoothing.engine";
export { createAdaptiveStep, adjustStep } from "./sampling/adaptiveStep.engine";

// Statistics
export { findLocalExtrema, findGlobalExtrema, findZeroCrossings } from "./statistics/extrema.engine";
export { computeRange, computeDerivativeRange, padRange } from "./statistics/ranges.engine";
export { normalizeMinMax, normalizeZScore, normalizeBipolar } from "./statistics/normalization.engine";
export { computeHistogram } from "./statistics/histogram.engine";

// Utilities
export { EPSILON, TOLERANCE, TAYLOR_TOLERANCE, MAX_SAFE_FACTORIAL } from "./utilities/epsilon";
export { isFinite, isApproximately, clamp, roundTo, significantDigits } from "./utilities/precision";
export { memoize, memoizeFactory } from "./utilities/memoization";
export { validateDerivativeOrder, validateCoefficients, validateTimeRange } from "./utilities/validation";
