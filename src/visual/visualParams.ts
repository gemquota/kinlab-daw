/**
 * Visual parameter definitions for each visualization mode.
 * Every mode has a unique set of tunable parameters exposed via the bottom drawer UI.
 */

export type VisualMode =
  | "nebula" | "network" | "kaleidoscope"
  | "waveField" | "terrain"
  | "cellular" | "fluid"
  | "orbs" | "lissajous" | "fractal";

export interface VisualParams {
  // Shared
  hueShift: number;
  speed: number;
  intensity: number;
  trailFade: number;

  // Particle-based
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

  // Network
  networkLinkDist: number;
  networkLineWidth: number;

  // Kaleidoscope
  kaleidoSegments: number;
  kaleidoRings: number;
  kaleidoSpin: number;

  // Wave field
  waveLines: number;
  waveAmplitude: number;
  waveFrequency: number;
  waveThickness: number;

  // Terrain
  terrainLayers: number;
  terrainHeight: number;
  terrainPerspective: number;
  terrainScanlines: boolean;

  // Cellular
  cellSize: number;
  cellThreshold: number;
  cellHueSpread: number;

  // Fluid
  fluidScale: number;
  fluidOctaves: number;
  fluidLacunarity: number;
  fluidPersistence: number;

  // Orbs
  orbCount: number;
  orbMinSize: number;
  orbMaxSize: number;
  orbGravity: number;
  orbGlow: number;
  orbTrail: number;

  // Lissajous
  lissFreqX: number;
  lissFreqY: number;
  lissPhase: number;
  lissLineWidth: number;
  lissRotation: number;
  lissLayers: number;

  // Fractal
  fractalDepth: number;
  fractalAngle: number;
  fractalLength: number;
  fractalBranches: number;
  fractalWind: number;
}

export const DEFAULT_PARAMS: VisualParams = {
  hueShift: 0,
  speed: 1,
  intensity: 1,
  trailFade: 0.08,

  particleCount: 2000,
  particleSize: 2.5,
  particleSpeed: 1,
  beatForce: 8,
  mouseForce: 0.06,
  friction: 0.96,

  nebulaClouds: 6,
  nebulaNoise: 0.15,
  nebulaGlow: 3,

  networkLinkDist: 80,
  networkLineWidth: 0.5,

  kaleidoSegments: 8,
  kaleidoRings: 6,
  kaleidoSpin: 0.5,

  waveLines: 40,
  waveAmplitude: 1,
  waveFrequency: 1,
  waveThickness: 1,

  terrainLayers: 30,
  terrainHeight: 1,
  terrainPerspective: 0.45,
  terrainScanlines: true,

  cellSize: 12,
  cellThreshold: 0.48,
  cellHueSpread: 70,

  fluidScale: 0.003,
  fluidOctaves: 4,
  fluidLacunarity: 2,
  fluidPersistence: 0.5,

  orbCount: 15,
  orbMinSize: 20,
  orbMaxSize: 80,
  orbGravity: 0.02,
  orbGlow: 1,
  orbTrail: 0.05,

  lissFreqX: 3,
  lissFreqY: 2,
  lissPhase: 0,
  lissLineWidth: 1.5,
  lissRotation: 0.3,
  lissLayers: 5,

  fractalDepth: 8,
  fractalAngle: 25,
  fractalLength: 100,
  fractalBranches: 2,
  fractalWind: 0,
};

/** Get default params for a specific mode */
export function getDefaultParams(_mode: VisualMode): Partial<VisualParams> {
  return { ...DEFAULT_PARAMS };
}

/** Mode metadata */
export interface VisualModeInfo {
  id: VisualMode;
  name: string;
  icon: string;
  desc: string;
  /** Which param keys are relevant for this mode */
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
    id: "nebula", name: "Nebula", icon: "✦", desc: "Cosmic clouds and scattered particles",
    paramGroups: [
      { label: "Clouds", params: [
        S("nebulaClouds", "Count", 1, 12, 1),
        S("nebulaNoise", "Grain", 0, 0.5),
        S("nebulaGlow", "Glow", 0, 5),
      ]},
      { label: "Particles", params: [
        S("particleCount", "Count", 200, 4000, 50),
        S("particleSize", "Size", 0.5, 6),
        S("beatForce", "Beat force", 0, 20),
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
      { label: "Particles", params: [
        S("particleCount", "Count", 100, 3000, 50),
        S("particleSize", "Size", 0.5, 5),
        S("particleSpeed", "Speed", 0.2, 3),
      ]},
      { label: "Connections", params: [
        S("networkLinkDist", "Link distance", 20, 200, 5),
        S("networkLineWidth", "Line width", 0.1, 2),
      ]},
      { label: "Forces", params: [
        S("beatForce", "Beat force", 0, 20),
        S("mouseForce", "Mouse force", 0, 0.5),
        S("friction", "Friction", 0.8, 0.99),
      ]},
    ],
  },
  {
    id: "kaleidoscope", name: "Kaleidoscope", icon: "❋", desc: "Symmetric mandala geometry",
    paramGroups: [
      { label: "Symmetry", params: [
        S("kaleidoSegments", "Segments", 3, 16, 1),
        S("kaleidoRings", "Rings", 2, 12, 1),
        S("kaleidoSpin", "Spin", 0, 2),
      ]},
      { label: "Particles", params: [
        S("particleCount", "Count", 200, 3000, 50),
        S("particleSize", "Size", 0.5, 5),
        S("beatForce", "Beat force", 0, 15),
      ]},
    ],
  },
  {
    id: "waveField", name: "Wave Field", icon: "≋", desc: "Audio-driven wave interference",
    paramGroups: [
      { label: "Waves", params: [
        S("waveLines", "Lines", 10, 80, 1),
        S("waveAmplitude", "Amplitude", 0.2, 3),
        S("waveFrequency", "Frequency", 0.2, 3),
        S("waveThickness", "Thickness", 0.3, 3),
      ]},
      { label: "Motion", params: [
        S("speed", "Speed", 0.2, 3),
        S("trailFade", "Trail", 0, 0.3),
      ]},
    ],
  },
  {
    id: "terrain", name: "Terrain", icon: "⊿", desc: "Retro scanline landscape",
    paramGroups: [
      { label: "Landscape", params: [
        S("terrainLayers", "Layers", 10, 60, 1),
        S("terrainHeight", "Height", 0.3, 2),
        S("terrainPerspective", "Horizon", 0.2, 0.8),
      ]},
      { label: "Style", params: [
        S("speed", "Speed", 0.2, 3),
        S("intensity", "Intensity", 0.3, 2),
      ]},
    ],
  },
  {
    id: "cellular", name: "Cellular", icon: "▣", desc: "Wave interference grid",
    paramGroups: [
      { label: "Grid", params: [
        S("cellSize", "Cell size", 4, 30, 1),
        S("cellThreshold", "Threshold", 0.2, 0.8),
        S("cellHueSpread", "Hue spread", 10, 150, 5),
      ]},
      { label: "Motion", params: [
        S("speed", "Speed", 0.2, 3),
        S("trailFade", "Trail", 0, 0.3),
      ]},
    ],
  },
  {
    id: "fluid", name: "Fluid", icon: "◎", desc: "Simplex noise fluid simulation",
    paramGroups: [
      { label: "Noise", params: [
        S("fluidScale", "Scale", 0.0005, 0.01),
        S("fluidOctaves", "Octaves", 1, 8, 1),
        S("fluidLacunarity", "Lacunarity", 1, 4),
        S("fluidPersistence", "Persistence", 0.1, 0.9),
      ]},
      { label: "Motion", params: [
        S("speed", "Speed", 0.1, 3),
        S("intensity", "Intensity", 0.3, 2),
        S("trailFade", "Trail", 0, 0.3),
      ]},
    ],
  },
  {
    id: "orbs", name: "Orbs", icon: "●", desc: "Gravitational orbs pulsing with audio",
    paramGroups: [
      { label: "Orbs", params: [
        S("orbCount", "Count", 3, 30, 1),
        S("orbMinSize", "Min size", 5, 40, 1),
        S("orbMaxSize", "Max size", 30, 150, 5),
        S("orbGlow", "Glow", 0, 3),
      ]},
      { label: "Physics", params: [
        S("orbGravity", "Gravity", 0.001, 0.1),
        S("orbTrail", "Trail", 0, 0.2),
        S("beatForce", "Beat force", 0, 20),
      ]},
    ],
  },
  {
    id: "lissajous", name: "Lissajous", icon: "∞", desc: "Lissajous curves and spirographs",
    paramGroups: [
      { label: "Curve", params: [
        S("lissFreqX", "Freq X", 1, 12, 1),
        S("lissFreqY", "Freq Y", 1, 12, 1),
        S("lissPhase", "Phase", 0, 6.28),
        S("lissRotation", "Rotation", 0, 2),
      ]},
      { label: "Style", params: [
        S("lissLayers", "Layers", 1, 12, 1),
        S("lissLineWidth", "Line width", 0.3, 4),
        S("intensity", "Intensity", 0.3, 2),
      ]},
    ],
  },
  {
    id: "fractal", name: "Fractal", icon: "BR", desc: "Recursive fractal trees",
    paramGroups: [
      { label: "Structure", params: [
        S("fractalDepth", "Depth", 3, 12, 1),
        S("fractalAngle", "Angle", 5, 60, 1, (v) => `${v.toFixed(0)}°`),
        S("fractalLength", "Length", 20, 200, 5),
        S("fractalBranches", "Branches", 2, 5, 1),
      ]},
      { label: "Motion", params: [
        S("fractalWind", "Wind", 0, 1),
        S("speed", "Speed", 0.2, 3),
        S("intensity", "Intensity", 0.3, 2),
      ]},
    ],
  },
];

export function getModeInfo(mode: VisualMode): VisualModeInfo {
  return VISUAL_MODES.find((m) => m.id === mode) ?? VISUAL_MODES[0]!;
}
