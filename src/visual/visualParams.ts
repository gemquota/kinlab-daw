/**
 * Visual parameter definitions — 10 truly distinct visualization modes.
 * Each mode uses a fundamentally different rendering algorithm.
 */

export type VisualMode =
  | "nebula" | "network" | "kaleidoscope"
  | "oscilloscope" | "terrain"
  | "plasma" | "fluid"
  | "orbs" | "voronoi" | "fractal";

export interface VisualParams {
  // Shared
  hueShift: number;
  speed: number;
  intensity: number;
  trailFade: number;

  // Particle-based (nebula/network/kaleidoscope)
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

  // Oscilloscope
  oscTraceLength: number;
  oscDecay: number;
  oscScale: number;
  oscLayers: number;
  oscXYMode: boolean;

  // Terrain
  terrainLayers: number;
  terrainHeight: number;
  terrainPerspective: number;
  terrainScanlines: boolean;

  // Plasma
  plasmaScale: number;
  plasmaSpeed: number;
  plasmaLayers: number;
  plasmaPalette: number;

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

  // Voronoi
  voronoiPoints: number;
  voronoiCellSize: number;
  voronoiEdgeWidth: number;
  voronoiFill: boolean;

  // Fractal
  fractalDepth: number;
  fractalAngle: number;
  fractalLength: number;
  fractalBranches: number;
  fractalWind: number;
}

export const DEFAULT_PARAMS: VisualParams = {
  hueShift: 0, speed: 1, intensity: 1, trailFade: 0.08,
  particleCount: 2000, particleSize: 2.5, particleSpeed: 1,
  beatForce: 8, mouseForce: 0.06, friction: 0.96,
  nebulaClouds: 6, nebulaNoise: 0.15, nebulaGlow: 3,
  networkLinkDist: 80, networkLineWidth: 0.5,
  kaleidoSegments: 8, kaleidoRings: 6, kaleidoSpin: 0.5,
  oscTraceLength: 2000, oscDecay: 0.92, oscScale: 0.4, oscLayers: 3, oscXYMode: true,
  terrainLayers: 30, terrainHeight: 1, terrainPerspective: 0.45, terrainScanlines: true,
  plasmaScale: 1, plasmaSpeed: 1, plasmaLayers: 4, plasmaPalette: 0,
  fluidScale: 0.003, fluidOctaves: 4, fluidLacunarity: 2, fluidPersistence: 0.5,
  orbCount: 15, orbMinSize: 20, orbMaxSize: 80, orbGravity: 0.02, orbGlow: 1, orbTrail: 0.05,
  voronoiPoints: 30, voronoiCellSize: 20, voronoiEdgeWidth: 1.5, voronoiFill: true,
  fractalDepth: 8, fractalAngle: 25, fractalLength: 100, fractalBranches: 2, fractalWind: 0,
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
    id: "kaleidoscope", name: "Kaleidoscope", icon: "❋", desc: "Symmetric particle mandala",
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
    id: "oscilloscope", name: "Oscilloscope", icon: "∿", desc: "XY-mode oscilloscope traces",
    paramGroups: [
      { label: "Trace", params: [
        S("oscTraceLength", "Length", 500, 5000, 100),
        S("oscDecay", "Decay", 0.8, 0.99),
        S("oscScale", "Scale", 0.1, 0.8),
      ]},
      { label: "Style", params: [
        S("oscLayers", "Layers", 1, 6, 1),
        S("intensity", "Intensity", 0.3, 2),
      ]},
    ],
  },
  {
    id: "terrain", name: "Terrain", icon: "⊿", desc: "Retro 3D scanline landscape",
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
    id: "plasma", name: "Plasma", icon: "◎", desc: "Demoscene plasma color field",
    paramGroups: [
      { label: "Plasma", params: [
        S("plasmaScale", "Scale", 0.2, 3),
        S("plasmaSpeed", "Speed", 0.2, 3),
        S("plasmaLayers", "Layers", 1, 8, 1),
        S("plasmaPalette", "Palette", 0, 3, 1),
      ]},
      { label: "Audio", params: [
        S("intensity", "Intensity", 0.3, 2),
        S("trailFade", "Trail", 0, 0.3),
      ]},
    ],
  },
  {
    id: "fluid", name: "Fluid", icon: "≋", desc: "Simplex noise flow field",
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
    id: "orbs", name: "Orbs", icon: "●", desc: "Gravitational orbs with glow",
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
    id: "voronoi", name: "Voronoi", icon: "⬡", desc: "Organic cell tessellation",
    paramGroups: [
      { label: "Cells", params: [
        S("voronoiPoints", "Points", 5, 80, 1),
        S("voronoiEdgeWidth", "Edge width", 0.5, 4),
        S("voronoiFill", "Fill", 0, 1, 1, (v) => v > 0.5 ? "On" : "Off"),
      ]},
      { label: "Motion", params: [
        S("speed", "Speed", 0.1, 3),
        S("intensity", "Intensity", 0.3, 2),
        S("beatForce", "Beat force", 0, 10),
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
