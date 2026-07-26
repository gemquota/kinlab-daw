/**
 * Harmonic Waveform Engine
 *
 * Computes complex waveforms from summed harmonic components with
 * resonance, damping, phase modulation, and amplitude envelopes.
 * All functions are pure — no side effects, no React dependencies.
 */

/* ─── Types ─── */

export interface HarmonicComponent {
  id: string;
  frequency: number;      // Hz
  amplitude: number;       // 0–1 normalized
  phase: number;           // radians
  enabled: boolean;
}

export interface WaveformConfig {
  components: HarmonicComponent[];
  damping: number;         // 0–1, exponential decay rate
  resonanceFreq: number;   // Hz, center of resonance peak
  resonanceWidth: number;  // Q factor (narrower = sharper resonance)
  resonanceGain: number;   // 0–5, amplification at resonance
  modulationFreq: number;  // Hz, AM modulation frequency
  modulationDepth: number; // 0–1, AM modulation depth
  timeStretch: number;     // 0.1–10, time scaling factor
  noiseAmount: number;     // 0–0.5, additive noise
  waveformType: WaveformType;
}

export type WaveformType = "sine" | "square" | "sawtooth" | "triangle" | "custom";

export interface WaveformSample {
  t: number;
  value: number;
  derivatives: number[];   // [value, 1st, 2nd, 3rd, 4th]
  components: number[];    // individual component contributions
}

export interface ResonanceInfo {
  peakFreq: number;
  peakAmplitude: number;
  bandwidth: number;
  qFactor: number;
}

/* ─── Base waveform generators ─── */

function baseWave(t: number, type: WaveformType): number {
  switch (type) {
    case "sine":
      return Math.sin(t);
    case "square":
      return Math.sin(t) >= 0 ? 1 : -1;
    case "sawtooth":
      return 2 * ((t / (2 * Math.PI)) % 1) - 1;
    case "triangle":
      return 2 * Math.abs(2 * ((t / (2 * Math.PI)) % 1) - 1) - 1;
    case "custom":
      // Sum of first 5 odd harmonics with 1/n² weighting (smoothed square)
      return Math.sin(t) + 0.33 * Math.sin(3 * t) + 0.2 * Math.sin(5 * t)
        + 0.14 * Math.sin(7 * t) + 0.1 * Math.sin(9 * t);
  }
}

/* ─── Resonance curve (Lorentzian) ─── */

function resonanceResponse(
  freq: number,
  centerFreq: number,
  width: number,
  gain: number,
): number {
  if (width <= 0) return freq === centerFreq ? gain : 1;
  const ratio = (freq - centerFreq) / width;
  return 1 + (gain - 1) / (1 + ratio * ratio);
}

/* ─── Evaluate single harmonic at time t ─── */

function evaluateHarmonic(
  component: HarmonicComponent,
  t: number,
  config: WaveformConfig,
): number {
  if (!component.enabled) return 0;

  const omega = 2 * Math.PI * component.frequency * config.timeStretch;
  const phase = component.phase;

  // Base waveform
  const raw = baseWave(omega * t + phase, config.waveformType);

  // Resonance amplification
  const resBoost = resonanceResponse(
    component.frequency,
    config.resonanceFreq,
    config.resonanceWidth,
    config.resonanceGain,
  );

  // Damping envelope
  const decay = Math.exp(-config.damping * t);

  // AM modulation
  const mod = 1 - config.modulationDepth +
    config.modulationDepth * Math.sin(2 * Math.PI * config.modulationFreq * t);

  return component.amplitude * raw * resBoost * decay * mod;
}

/* ─── Compute n-th derivative of base waveform ─── */


/* ─── Sample the waveform ─── */

export function sampleWaveform(
  config: WaveformConfig,
  tStart: number,
  tEnd: number,
  numPoints: number = 500,
): WaveformSample[] {
  const dt = (tEnd - tStart) / (numPoints - 1);
  const samples: WaveformSample[] = [];

  for (let i = 0; i < numPoints; i++) {
    const t = tStart + i * dt;
    const value = evaluateWaveformAt(config, t);
    const derivatives = computeDerivatives(config, t, 4);
    const components = config.components.map((c) =>
      c.enabled ? evaluateHarmonic(c, t, config) : 0,
    );

    samples.push({ t, value, derivatives, components });
  }

  return samples;
}

/* ─── Evaluate full waveform at time t ─── */

export function evaluateWaveformAt(config: WaveformConfig, t: number): number {
  let sum = 0;
  for (const comp of config.components) {
    sum += evaluateHarmonic(comp, t, config);
  }

  // Add noise
  if (config.noiseAmount > 0) {
    sum += (Math.random() * 2 - 1) * config.noiseAmount;
  }

  return sum;
}

/* ─── Compute derivatives numerically ─── */

function computeDerivatives(
  config: WaveformConfig,
  t: number,
  maxOrder: number,
): number[] {
  const h = 1e-3;
  const derivs: number[] = [];

  // 0th derivative = value
  derivs.push(evaluateWaveformAt(config, t));

  if (maxOrder >= 1) {
    // 1st derivative: central difference
    derivs.push(
      (evaluateWaveformAt(config, t + h) - evaluateWaveformAt(config, t - h)) / (2 * h),
    );
  }

  if (maxOrder >= 2) {
    // 2nd derivative
    derivs.push(
      (evaluateWaveformAt(config, t + h) - 2 * evaluateWaveformAt(config, t) +
        evaluateWaveformAt(config, t - h)) / (h * h),
    );
  }

  if (maxOrder >= 3) {
    // 3rd derivative
    derivs.push(
      (-evaluateWaveformAt(config, t + 2 * h) + 2 * evaluateWaveformAt(config, t + h) -
        2 * evaluateWaveformAt(config, t - h) + evaluateWaveformAt(config, t - 2 * h)) /
        (2 * h * h * h),
    );
  }

  if (maxOrder >= 4) {
    // 4th derivative
    const f = (tt: number) => evaluateWaveformAt(config, tt);
    derivs.push(
      (f(t + 2 * h) - 4 * f(t + h) + 6 * f(t) - 4 * f(t - h) + f(t - 2 * h)) /
        (h * h * h * h),
    );
  }

  return derivs;
}

/* ─── Resonance analysis ─── */

export function analyzeResonance(config: WaveformConfig): ResonanceInfo {
  const centerFreq = config.resonanceFreq;
  const width = config.resonanceWidth;
  const gain = config.resonanceGain;

  // Peak amplitude: sum of all components at resonance
  let peakAmplitude = 0;
  for (const comp of config.components) {
    if (!comp.enabled) continue;
    const resBoost = resonanceResponse(comp.frequency, centerFreq, width, gain);
    peakAmplitude += comp.amplitude * resBoost;
  }

  // Bandwidth (FWHM of Lorentzian)
  const bandwidth = 2 * width;

  // Q factor
  const qFactor = width > 0 ? centerFreq / bandwidth : Infinity;

  return {
    peakFreq: centerFreq,
    peakAmplitude,
    bandwidth,
    qFactor,
  };
}

/* ─── Spectrum analysis (FFT-like) ─── */

export function computeSpectrum(
  config: WaveformConfig,
  freqMin: number = 0,
  freqMax: number = 100,
  numBins: number = 200,
): { freq: number; magnitude: number }[] {
  const bins: { freq: number; magnitude: number }[] = [];
  const df = (freqMax - freqMin) / numBins;

  for (let i = 0; i < numBins; i++) {
    const freq = freqMin + i * df;
    let magnitude = 0;

    // Sum contributions from each harmonic
    for (const comp of config.components) {
      if (!comp.enabled) continue;
      // Lorentzian response around each harmonic
      const diff = freq - comp.frequency;
      const sigma = 0.5;
      const contribution = comp.amplitude * Math.exp(-(diff * diff) / (2 * sigma * sigma));
      magnitude += contribution;
    }

    // Resonance peak
    const resBoost = resonanceResponse(freq, config.resonanceFreq, config.resonanceWidth, config.resonanceGain);
    magnitude *= resBoost;

    bins.push({ freq, magnitude });
  }

  return bins;
}

/* ─── Default config ─── */

export function createDefaultWaveformConfig(): WaveformConfig {
  return {
    components: [
      { id: "h1", frequency: 1, amplitude: 1, phase: 0, enabled: true },
      { id: "h2", frequency: 2, amplitude: 0.5, phase: 0, enabled: true },
      { id: "h3", frequency: 3, amplitude: 0.3, phase: 0, enabled: false },
      { id: "h4", frequency: 4, amplitude: 0.2, phase: 0, enabled: false },
      { id: "h5", frequency: 5, amplitude: 0.15, phase: 0, enabled: false },
      { id: "h6", frequency: 6, amplitude: 0.1, phase: 0, enabled: false },
    ],
    damping: 0,
    resonanceFreq: 3,
    resonanceWidth: 1,
    resonanceGain: 1,
    modulationFreq: 0,
    modulationDepth: 0,
    timeStretch: 1,
    noiseAmount: 0,
    waveformType: "sine",
  };
}

/* ─── Presets ─── */

export interface WaveformPreset {
  name: string;
  description: string;
  config: WaveformConfig;
}

export const WAVEFORM_PRESETS: WaveformPreset[] = [
  {
    name: "Pure Tone",
    description: "Single sine wave at 1 Hz",
    config: {
      ...createDefaultWaveformConfig(),
      components: [
        { id: "h1", frequency: 1, amplitude: 1, phase: 0, enabled: true },
        { id: "h2", frequency: 2, amplitude: 0, phase: 0, enabled: false },
        { id: "h3", frequency: 3, amplitude: 0, phase: 0, enabled: false },
        { id: "h4", frequency: 4, amplitude: 0, phase: 0, enabled: false },
        { id: "h5", frequency: 5, amplitude: 0, phase: 0, enabled: false },
        { id: "h6", frequency: 6, amplitude: 0, phase: 0, enabled: false },
      ],
    },
  },
  {
    name: "Musical Chord",
    description: "Major triad: 1 Hz + 1.25 Hz + 1.5 Hz",
    config: {
      ...createDefaultWaveformConfig(),
      components: [
        { id: "h1", frequency: 1, amplitude: 1, phase: 0, enabled: true },
        { id: "h2", frequency: 1.25, amplitude: 0.8, phase: 0, enabled: true },
        { id: "h3", frequency: 1.5, amplitude: 0.8, phase: 0, enabled: true },
        { id: "h4", frequency: 4, amplitude: 0, phase: 0, enabled: false },
        { id: "h5", frequency: 5, amplitude: 0, phase: 0, enabled: false },
        { id: "h6", frequency: 6, amplitude: 0, phase: 0, enabled: false },
      ],
    },
  },
  {
    name: "Resonance Peak",
    description: "Components near resonance frequency with high Q",
    config: {
      ...createDefaultWaveformConfig(),
      resonanceFreq: 3,
      resonanceWidth: 0.3,
      resonanceGain: 4,
      components: [
        { id: "h1", frequency: 2.5, amplitude: 0.5, phase: 0, enabled: true },
        { id: "h2", frequency: 3, amplitude: 0.8, phase: 0, enabled: true },
        { id: "h3", frequency: 3.5, amplitude: 0.5, phase: 0, enabled: true },
        { id: "h4", frequency: 4, amplitude: 0.2, phase: 0, enabled: true },
        { id: "h5", frequency: 5, amplitude: 0, phase: 0, enabled: false },
        { id: "h6", frequency: 6, amplitude: 0, phase: 0, enabled: false },
      ],
    },
  },
  {
    name: "Damped Oscillation",
    description: "Exponentially decaying waveform",
    config: {
      ...createDefaultWaveformConfig(),
      damping: 0.3,
      components: [
        { id: "h1", frequency: 2, amplitude: 1, phase: 0, enabled: true },
        { id: "h2", frequency: 2, amplitude: 0.3, phase: 0.5, enabled: true },
        { id: "h3", frequency: 3, amplitude: 0, phase: 0, enabled: false },
        { id: "h4", frequency: 4, amplitude: 0, phase: 0, enabled: false },
        { id: "h5", frequency: 5, amplitude: 0, phase: 0, enabled: false },
        { id: "h6", frequency: 6, amplitude: 0, phase: 0, enabled: false },
      ],
    },
  },
  {
    name: "AM Radio",
    description: "Amplitude modulated signal",
    config: {
      ...createDefaultWaveformConfig(),
      modulationFreq: 0.5,
      modulationDepth: 0.7,
      components: [
        { id: "h1", frequency: 5, amplitude: 1, phase: 0, enabled: true },
        { id: "h2", frequency: 2, amplitude: 0, phase: 0, enabled: false },
        { id: "h3", frequency: 3, amplitude: 0, phase: 0, enabled: false },
        { id: "h4", frequency: 4, amplitude: 0, phase: 0, enabled: false },
        { id: "h5", frequency: 5, amplitude: 0, phase: 0, enabled: false },
        { id: "h6", frequency: 6, amplitude: 0, phase: 0, enabled: false },
      ],
    },
  },
  {
    name: "Complex Spectrum",
    description: "Rich harmonic content with noise",
    config: {
      ...createDefaultWaveformConfig(),
      noiseAmount: 0.05,
      waveformType: "sine",
      components: [
        { id: "h1", frequency: 1, amplitude: 1, phase: 0, enabled: true },
        { id: "h2", frequency: 2.3, amplitude: 0.6, phase: 0.3, enabled: true },
        { id: "h3", frequency: 3.7, amplitude: 0.4, phase: 0.7, enabled: true },
        { id: "h4", frequency: 5.1, amplitude: 0.25, phase: 1.2, enabled: true },
        { id: "h5", frequency: 7.8, amplitude: 0.15, phase: 2.0, enabled: true },
        { id: "h6", frequency: 10.2, amplitude: 0.1, phase: 0.5, enabled: true },
      ],
    },
  },
  {
    name: "Square Wave Synth",
    description: "Additive square wave from odd harmonics",
    config: {
      ...createDefaultWaveformConfig(),
      waveformType: "sine",
      components: [
        { id: "h1", frequency: 1, amplitude: 1, phase: 0, enabled: true },
        { id: "h2", frequency: 3, amplitude: 0.33, phase: 0, enabled: true },
        { id: "h3", frequency: 5, amplitude: 0.2, phase: 0, enabled: true },
        { id: "h4", frequency: 7, amplitude: 0.14, phase: 0, enabled: true },
        { id: "h5", frequency: 9, amplitude: 0.1, phase: 0, enabled: true },
        { id: "h6", frequency: 11, amplitude: 0.08, phase: 0, enabled: true },
      ],
    },
  },
  {
    name: "Beat Frequencies",
    description: "Two close frequencies creating beats",
    config: {
      ...createDefaultWaveformConfig(),
      components: [
        { id: "h1", frequency: 3, amplitude: 1, phase: 0, enabled: true },
        { id: "h2", frequency: 3.5, amplitude: 1, phase: 0, enabled: true },
        { id: "h3", frequency: 3, amplitude: 0, phase: 0, enabled: false },
        { id: "h4", frequency: 4, amplitude: 0, phase: 0, enabled: false },
        { id: "h5", frequency: 5, amplitude: 0, phase: 0, enabled: false },
        { id: "h6", frequency: 6, amplitude: 0, phase: 0, enabled: false },
      ],
    },
  },
];
