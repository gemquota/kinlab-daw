/**
 * Visual parameter definitions — 6 distinct visualization modes.
 * Each mode uses a fundamentally different rendering algorithm.
 * Every mode has ~double the tunable parameters for deep control.
 */

export type VisualMode =
  | "nebula" | "network" | "plasma"
  | "orbs" | "voronoi" | "fractal";

export interface VisualParams {
  // Shared
  hueShift: number;
  speed: number;
  intensity: number;
  trailFade: number;

  // Particle-based (nebula/network)
  particleCount: number;
  particleSize: number;
  particleSpeed: number;
  beatForce: number;
  mouseForce: number;
  friction: number;

  // Nebula
  nebulaClouds: number;
  nebulaNoise: number;
  nebulaGlow: number;
  nebulaRotation: number;
  nebulaPulse: number;
  nebulaDepth: number;
  nebulaWarp: number;
  nebulaSwirl: number;
  particleHue: number;
  particleAlpha: number;
  particleDrag: number;

  // Network
  networkLinkDist: number;
  networkLineWidth: number;
  networkPulse: number;
  networkNodeGlow: number;
  linkOpacity: number;
  networkJitter: number;
  networkDecay: number;
  nodeShape: number;
  linkPulseSpeed: number;
  networkColor: number;

  // Plasma
  plasmaScale: number;
  plasmaSpeed: number;
  plasmaLayers: number;
  plasmaPalette: number;
  plasmaWarp: number;
  plasmaFrequency: number;
  plasmaContrast: number;
  plasmaRotation: number;
  plasmaDepth: number;
  plasmaAlpha: number;

  // Orbs
  orbCount: number;
  orbMinSize: number;
  orbMaxSize: number;
  orbGravity: number;
  orbGlow: number;
  orbTrail: number;
  orbDamping: number;
  orbCharge: number;
  orbBounce: number;
  orbColor: number;
  orbMagnetism: number;
  orbOpacity: number;
  orbPulse: number;

  // Voronoi
  voronoiPoints: number;
  voronoiCellSize: number;
  voronoiEdgeWidth: number;
  voronoiFill: boolean;
  voronoiDrift: number;
  voronoiPulse: number;
  voronoiColor: number;
  voronoiNoise: number;
  voronoiOpacity: number;
  voronoiFade: number;

  // Fractal
  fractalDepth: number;
  fractalAngle: number;
  fractalLength: number;
  fractalBranches: number;
  fractalWind: number;
  fractalColor: number;
  fractalDecay: number;
  fractalSway: number;
  fractalThickness: number;
  fractalGlow: number;
  fractalChaos: number;
}

export const DEFAULT_PARAMS: VisualParams = {
  // Shared
  hueShift: 0, speed: 1, intensity: 1, trailFade: 0.08,
  // Particles
  particleCount: 800, particleSize: 2.5, particleSpeed: 1,
  beatForce: 8, mouseForce: 0.06, friction: 0.96,
  // Nebula
  nebulaClouds: 6, nebulaNoise: 0.15, nebulaGlow: 3,
  nebulaRotation: 0.3, nebulaPulse: 0.5, nebulaDepth: 3,
  nebulaWarp: 0.2, nebulaSwirl: 0.4,
  particleHue: 40, particleAlpha: 0.7, particleDrag: 0.98,
  // Network
  networkLinkDist: 80, networkLineWidth: 0.5,
  networkPulse: 0.6, networkNodeGlow: 2,
  linkOpacity: 0.4, networkJitter: 0.1, networkDecay: 0.95,
  nodeShape: 0, linkPulseSpeed: 2, networkColor: 0,
  // Plasma
  plasmaScale: 1, plasmaSpeed: 1, plasmaLayers: 4, plasmaPalette: 0,
  plasmaWarp: 0.3, plasmaFrequency: 1.5, plasmaContrast: 1,
  plasmaRotation: 0.2, plasmaDepth: 0.5, plasmaAlpha: 0.8,
  // Orbs
  orbCount: 12, orbMinSize: 20, orbMaxSize: 80,
  orbGravity: 0.02, orbGlow: 1, orbTrail: 0.05,
  orbDamping: 0.995, orbCharge: 0.3, orbBounce: 0.8,
  orbColor: 0, orbMagnetism: 0.1, orbOpacity: 0.85, orbPulse: 0.4,
  // Voronoi
  voronoiPoints: 25, voronoiCellSize: 20, voronoiEdgeWidth: 1.5, voronoiFill: true,
  voronoiDrift: 0.3, voronoiPulse: 0.5, voronoiColor: 0,
  voronoiNoise: 0.2, voronoiOpacity: 0.6, voronoiFade: 0.3,
  // Fractal
  fractalDepth: 8, fractalAngle: 25, fractalLength: 100,
  fractalBranches: 2, fractalWind: 0,
  fractalColor: 0, fractalDecay: 0.72, fractalSway: 0.3,
  fractalThickness: 4, fractalGlow: 0.5, fractalChaos: 0.1,
};

export function getDefaultParams(_mode: VisualMode): Partial<VisualParams> {
  return { ...DEFAULT_PARAMS };
}

export interface VisualModeInfo {
  id: VisualMode;
  name: string;
  icon: string;
  desc: string;
  paramGroups: ParamGroup[];
}

export interface ParamGroup {
  label: string;
  params: ParamDef[];
}

export interface ParamDef {
  key: keyof VisualParams;
  label: string;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
}

const S = (key: keyof VisualParams, label: string, min: number, max: number, step = 0.01, format?: (v: number) => string): ParamDef =>
  ({ key, label, min, max, step, format });

export const VISUAL_MODES: VisualModeInfo[] = [
  {
    id: "nebula", name: "Nebula", icon: "✦", desc: "Cosmic radial gradient clouds",
    paramGroups: [
      { label: "Clouds", params: [
        S("nebulaClouds", "Count", 1, 12, 1),
        S("nebulaNoise", "Grain", 0, 0.5),
        S("nebulaGlow", "Glow", 0, 5),
        S("nebulaRotation", "Rotation", 0, 2),
        S("nebulaPulse", "Pulse", 0, 1),
        S("nebulaDepth", "Depth", 1, 8, 1),
        S("nebulaWarp", "Warp", 0, 1),
        S("nebulaSwirl", "Swirl", 0, 2),
      ]},
      { label: "Particles", params: [
        S("particleCount", "Count", 100, 2000, 50),
        S("particleSize", "Size", 0.5, 6),
        S("beatForce", "Beat force", 0, 20),
        S("particleHue", "Hue spread", 0, 180),
        S("particleAlpha", "Alpha", 0.1, 1),
        S("particleDrag", "Drag", 0.9, 1),
      ]},
      { label: "Motion", params: [
        S("speed", "Speed", 0.1, 3),
        S("friction", "Friction", 0.8, 0.99),
        S("trailFade", "Trail", 0, 0.3),
      ]},
    ],
  },
  {
    id: "network", name: "Network", icon: "⬡", desc: "Connected particle graph",
    paramGroups: [
      { label: "Nodes", params: [
        S("particleCount", "Count", 50, 1500, 50),
        S("particleSize", "Size", 0.5, 5),
        S("particleSpeed", "Speed", 0.2, 3),
        S("networkNodeGlow", "Glow", 0, 5),
        S("nodeShape", "Shape", 0, 2, 1, (v) => ["●", "■", "▲"][v] ?? "●"),
      ]},
      { label: "Links", params: [
        S("networkLinkDist", "Link distance", 20, 200, 5),
        S("networkLineWidth", "Line width", 0.1, 2),
        S("linkOpacity", "Link alpha", 0.1, 1),
        S("networkPulse", "Pulse", 0, 1),
        S("linkPulseSpeed", "Pulse speed", 0.5, 4),
      ]},
      { label: "Motion", params: [
        S("beatForce", "Beat force", 0, 20),
        S("mouseForce", "Mouse force", 0, 0.5),
        S("friction", "Friction", 0.8, 0.99),
        S("networkJitter", "Jitter", 0, 1),
        S("networkDecay", "Decay", 0.8, 1),
        S("networkColor", "Color", 0, 3, 1),
      ]},
    ],
  },
  {
    id: "plasma", name: "Plasma", icon: "◎", desc: "Demoscene plasma color field",
    paramGroups: [
      { label: "Plasma", params: [
        S("plasmaScale", "Scale", 0.2, 3),
        S("plasmaSpeed", "Speed", 0.2, 3),
        S("plasmaLayers", "Layers", 1, 8, 1),
        S("plasmaPalette", "Palette", 0, 3, 1),
        S("plasmaFrequency", "Frequency", 0.5, 4),
        S("plasmaContrast", "Contrast", 0.3, 2),
      ]},
      { label: "Warp", params: [
        S("plasmaWarp", "Warp", 0, 1),
        S("plasmaRotation", "Rotation", 0, 2),
        S("plasmaDepth", "Depth", 0, 1),
        S("plasmaAlpha", "Alpha", 0.3, 1),
        S("intensity", "Intensity", 0.3, 2),
        S("trailFade", "Trail", 0, 0.3),
      ]},
    ],
  },
  {
    id: "orbs", name: "Orbs", icon: "●", desc: "Gravitational orbs with glow",
    paramGroups: [
      { label: "Orbs", params: [
        S("orbCount", "Count", 3, 25, 1),
        S("orbMinSize", "Min size", 5, 40, 1),
        S("orbMaxSize", "Max size", 30, 150, 5),
        S("orbGlow", "Glow", 0, 3),
        S("orbOpacity", "Opacity", 0.2, 1),
        S("orbPulse", "Pulse", 0, 1),
      ]},
      { label: "Physics", params: [
        S("orbGravity", "Gravity", 0.001, 0.1),
        S("orbTrail", "Trail", 0, 0.2),
        S("beatForce", "Beat force", 0, 20),
        S("orbDamping", "Damping", 0.95, 1),
        S("orbCharge", "Charge", -1, 1),
        S("orbBounce", "Bounce", 0, 1),
        S("orbMagnetism", "Magnetism", 0, 1),
        S("orbColor", "Color", 0, 3, 1),
      ]},
    ],
  },
  {
    id: "voronoi", name: "Voronoi", icon: "◆", desc: "Organic cell tessellation",
    paramGroups: [
      { label: "Cells", params: [
        S("voronoiPoints", "Points", 5, 60, 1),
        S("voronoiCellSize", "Cell size", 5, 50, 1),
        S("voronoiEdgeWidth", "Edge width", 0.5, 4),
        S("voronoiFill", "Fill", 0, 1, 1, (v) => v > 0.5 ? "On" : "Off"),
        S("voronoiOpacity", "Opacity", 0.1, 1),
        S("voronoiFade", "Edge fade", 0, 1),
      ]},
      { label: "Motion", params: [
        S("speed", "Speed", 0.1, 3),
        S("intensity", "Intensity", 0.3, 2),
        S("beatForce", "Beat force", 0, 10),
        S("voronoiDrift", "Drift", 0, 1),
        S("voronoiPulse", "Pulse", 0, 1),
        S("voronoiColor", "Color", 0, 3, 1),
        S("voronoiNoise", "Noise", 0, 1),
      ]},
    ],
  },
  {
    id: "fractal", name: "Fractal", icon: "BR", desc: "Recursive branching trees",
    paramGroups: [
      { label: "Structure", params: [
        S("fractalDepth", "Depth", 3, 12, 1),
        S("fractalAngle", "Angle", 5, 60, 1, (v) => `${v.toFixed(0)}°`),
        S("fractalLength", "Length", 20, 200, 5),
        S("fractalBranches", "Branches", 2, 5, 1),
        S("fractalDecay", "Decay", 0.5, 0.9),
        S("fractalThickness", "Thickness", 0.5, 6),
      ]},
      { label: "Motion", params: [
        S("fractalWind", "Wind", 0, 1),
        S("speed", "Speed", 0.2, 3),
        S("intensity", "Intensity", 0.3, 2),
        S("fractalSway", "Sway", 0, 1),
        S("fractalGlow", "Glow", 0, 2),
        S("fractalChaos", "Chaos", 0, 1),
        S("fractalColor", "Color", 0, 3, 1),
      ]},
    ],
  },
];

export function getModeInfo(mode: VisualMode): VisualModeInfo {
  return VISUAL_MODES.find((m) => m.id === mode) ?? VISUAL_MODES[0]!;
}
