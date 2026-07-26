import type {
  DerivativeRecord,
  DerivativeOrder,
  DerivativeName,
  DerivativeSymbol,
} from "@/types";

const NAMES: readonly DerivativeName[] = [
  "Position", "Velocity", "Acceleration", "Jerk",
  "Snap", "Crackle", "Pop", "Lock", "Drop", "Shot", "Put",
];

const SYMBOLS: readonly DerivativeSymbol[] = [
  "x", "v", "a", "j", "s", "c", "p", "l", "d", "h", "u",
];

const CSS_VARS: readonly string[] = [
  "--color-position", "--color-velocity", "--color-acceleration", "--color-jerk",
  "--color-snap", "--color-crackle", "--color-pop", "--color-lock",
  "--color-drop", "--color-shot", "--color-put",
];

const HEX_COLORS: readonly string[] = [
  "#3b82f6", "#22c55e", "#f97316", "#ef4444",
  "#a855f7", "#ec4899", "#06b6d4", "#eab308",
  "#14b8a6", "#6366f1", "#10b981",
];

const COLOR_TOKENS: readonly string[] = [
  "derivative-position", "derivative-velocity", "derivative-acceleration",
  "derivative-jerk", "derivative-snap", "derivative-crackle",
  "derivative-pop", "derivative-lock", "derivative-drop",
  "derivative-shot", "derivative-put",
];

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function superscript(n: number): string {
  if (n === 0) return "";
  const map: Record<string, string> = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻",
  };
  return String(n).split("").map((c) => map[c] ?? c).join("");
}

function buildNotation(order: DerivativeOrder, _name: DerivativeName, symbol: DerivativeSymbol) {
  const sup = superscript(order);
  const ordinal = order === 0
    ? ""
    : order === 1
      ? "′"
      : order === 2
        ? "″"
        : order === 3
          ? "‴"
          : `⁽${sup}⁾`;

  return {
    symbol: `${symbol}(${order === 0 ? "t" : "t"})`,
    leibniz: order === 0
      ? `${symbol}(t)`
      : `d${sup}${symbol}/dt${sup || ""}`,
    newton: order === 0
      ? symbol
      : `${symbol}${ordinal}`,
    lagrange: order === 0
      ? `${symbol}(t)`
      : `${symbol}${"'".repeat(Math.min(order, 3))}(t)`,
  };
}

function buildDimension(order: DerivativeOrder) {
  return {
    L: 1,
    T: -order,
    M: 0,
    display: order === 0 ? "L" : `L T${superscript(-order)}`,
  };
}

const INTERPRETATIONS: readonly string[] = [
  "The location of an object in space relative to a reference point.",
  "The rate of change of position with respect to time.",
  "The rate of change of velocity with respect to time.",
  "The rate of change of acceleration with respect to time.",
  "The fourth derivative of position with respect to time.",
  "The fifth derivative of position with respect to time.",
  "The sixth derivative of position with respect to time.",
  "The seventh derivative of position with respect to time.",
  "The eighth derivative of position with respect to time.",
  "The ninth derivative of position with respect to time.",
  "The tenth derivative of position with respect to time.",
];

const EXPLANATIONS: readonly string[] = [
  "Position tells you where something is. It's the most basic kinematic quantity — simply the coordinates of an object at a given moment.",
  "Velocity describes how fast and in what direction something moves. A car's speedometer shows the magnitude of velocity.",
  "Acceleration measures how quickly velocity changes. When you press the gas pedal, you feel acceleration pushing you back in your seat.",
  "Jerk is the rate at which acceleration changes. It explains the uncomfortable jolt when a elevator starts or stops abruptly.",
  "Snap (also called jounce) is the fourth derivative. It's important in ride quality analysis and precision motion control.",
  "Crackle is the fifth derivative, rarely discussed outside advanced dynamics and high-precision engineering.",
  "Pop is the sixth derivative. Beyond this, the names are informal extensions used in some engineering contexts.",
  "Lock is an informal name for the seventh derivative. It is not standardized in physics literature.",
  "Drop is an informal name for the eighth derivative. Used occasionally in specialized engineering analysis.",
  "Shot is an informal name for the ninth derivative. It has no standard physical interpretation.",
  "Put is an informal name for the tenth derivative. It represents an extremely high-order rate of change.",
];

const EXAMPLES: readonly string[][] = [
  ["GPS coordinates of a phone", "Position of a pendulum bob", "Location of a robot arm end-effector"],
  ["Car speed on a highway", "Orbital velocity of a satellite", "Blood flow velocity in arteries"],
  ["Gravity (9.81 m/s²)", "Centripetal acceleration in circular motion", "Braking deceleration of a vehicle"],
  ["Vibration in elevator cables", "Shifting gears in a transmission", "Launch vehicle thrust profile"],
  ["High-speed rail ride comfort", "Cam mechanism design in engines", "Optical scan patterns"],
  ["Micro-electromechanical systems", "Precision servo control", "Seismic wave analysis"],
  ["Advanced vibration control", "Ultra-precision machining", "Spacecraft attitude control"],
  ["Hypothetical ride comfort models", "Theoretical control theory", "Mathematical extensions"],
  ["Theoretical mechanics", "High-order motion planning", "Mathematical curiosity"],
  ["Mathematical physics research", "Signal processing theory", "Abstract dynamics"],
  ["Pure mathematical analysis", "Theoretical extension", "No standard application"],
];

const MEASUREMENT_METHODS: readonly string[][] = [
  ["GPS", "odometry", "laser rangefinder", "encoder"],
  ["Speedometer", "Doppler radar", "GPS differentiation", "accelerometer integration"],
  ["Accelerometer", "force sensor / F=ma", "GPS double differentiation", "IMU"],
  ["Differentiation of accelerometer data", "jerk meters", "high-rate IMU"],
  ["High-frequency IMU differentiation", "precision motion capture", "simulation"],
  ["Simulation and numerical differentiation", "theoretical analysis"],
  ["Numerical analysis", "high-order simulation"],
  ["Theoretical and computational"],
  ["Theoretical and computational"],
  ["Theoretical and computational"],
  ["Theoretical and computational"],
];

function buildDerivativeRecord(order: DerivativeOrder): DerivativeRecord {
  const name = NAMES[order]!;
  const symbol = SYMBOLS[order]!;
  const n = factorial(order);

  return {
    order,
    name,
    symbol,
    isStandardized: order <= 6,
    math: {
      notation: buildNotation(order, name, symbol),
      taylorExpression: `${symbol}⁽${order}⁾(t₀)/${n}!`,
      factorialScale: n,
      differentialForm: order === 0
        ? `${symbol}(t)`
        : `d${superscript(order)}${symbol}/dt${superscript(order) || ""}`,
    },
    physical: {
      siUnit: {
        label: order === 0 ? "m" : order === 1 ? "m/s" : `m/s${superscript(order)}`,
        base: "m",
        numerator: "m",
        denominator: order === 0 ? "" : `s${superscript(order)}`,
      },
      dimension: buildDimension(order),
      interpretation: INTERPRETATIONS[order]!,
      typicalMagnitude: order === 0 ? "0–1000 m" : `10^${-(order - 1)} base units`,
      measurementMethods: MEASUREMENT_METHODS[order]!,
    },
    educational: {
      explanation: EXPLANATIONS[order]!,
      misconceptions: [],
      everydayExamples: EXAMPLES[order]!,
      engineeringExamples: EXAMPLES[order]!,
      historicalNote: order <= 6
        ? `${name} was established in classical mechanics.`
        : `${name} is an informal extension beyond the standard kinematic hierarchy.`,
    },
    visualization: {
      colorToken: COLOR_TOKENS[order]!,
      hexColor: HEX_COLORS[order]!,
      cssVar: CSS_VARS[order]!,
      defaultVisible: order <= 3,
      strokeWidth: order <= 2 ? 2 : 1.5,
      legendLabel: `${name} (${symbol})`,
      a11yLabel: `${name} — order ${order} derivative`,
    },
    animation: {
      vectorColor: HEX_COLORS[order]!,
      trailOpacity: Math.max(0.2, 1 - order * 0.08),
      emphasisScale: order <= 2 ? 1.0 : 0.8,
    },
  };
}

/**
 * All 11 canonical derivative records, indexed by order.
 * This is the single source of truth for the entire application.
 */
export const DERIVATIVES: readonly DerivativeRecord[] = Array.from(
  { length: 11 },
  (_, i) => buildDerivativeRecord(i as DerivativeOrder),
);

/**
 * Lookup a derivative by its order.
 */
export function getDerivative(order: DerivativeOrder): DerivativeRecord {
  return DERIVATIVES[order]!;
}

/**
 * Get all derivatives as an array (already is, but explicit API).
 */
export function getAllDerivatives(): readonly DerivativeRecord[] {
  return DERIVATIVES;
}

/**
 * Get the chain of derivatives from order 0 to the given order.
 */
export function getDerivativeChain(upTo: DerivativeOrder): readonly DerivativeRecord[] {
  return DERIVATIVES.slice(0, upTo + 1);
}

/**
 * Get parent-child relationships.
 */
export function getRelationships(): readonly { parent: DerivativeOrder; child: DerivativeOrder }[] {
  const relationships: { parent: DerivativeOrder; child: DerivativeOrder }[] = [];
  for (let i = 0; i < 10; i++) {
    relationships.push({ parent: i as DerivativeOrder, child: (i + 1) as DerivativeOrder });
  }
  return relationships;
}
