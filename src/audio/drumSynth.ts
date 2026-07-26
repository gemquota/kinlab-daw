import { getAudioContext, getMasterNode } from "@/audio/audioEngine";

/**
 * Filthy techno drum synthesis engine.
 * All audio routes through master chain (compressor → reverb → delay → analyser → output).
 */

/* ── Shared helpers ── */

function makeDistortionCurve(amount: number): any {
  const n = 44100;
  const curve = new Float32Array(n);
  const deg = Math.PI / 180;
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

function makeNoiseBuffer(ac: AudioContext, duration: number): AudioBuffer {
  const len = Math.floor(ac.sampleRate * duration);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

function getMaster(): GainNode {
  return getMasterNode();
}

/* ── Kick — deep, punchy, distorted ── */
export function triggerKick(when?: number): void {
  const ac = getAudioContext();
  const t = when ?? ac.currentTime;
  const master = getMaster();

  // Body: sine with pitch envelope
  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150 + 600, t);
  osc.frequency.exponentialRampToValueAtTime(45, t + 0.012);

  const body = ac.createGain();
  body.gain.setValueAtTime(1, t);
  body.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

  // Distortion for filth
  const dist = ac.createWaveShaper();
  dist.curve = makeDistortionCurve(80);
  dist.oversample = "4x";

  // Click layer
  const click = ac.createOscillator();
  click.type = "square";
  click.frequency.setValueAtTime(1500, t);
  click.frequency.exponentialRampToValueAtTime(60, t + 0.006);
  const clickG = ac.createGain();
  clickG.gain.setValueAtTime(0.6, t);
  clickG.gain.exponentialRampToValueAtTime(0.001, t + 0.012);

  // Sub layer
  const sub = ac.createOscillator();
  sub.type = "sine";
  sub.frequency.value = 27.5;
  const subG = ac.createGain();
  subG.gain.setValueAtTime(0.4, t);
  subG.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

  // Low-pass to tighten
  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(3000, t);
  lp.frequency.exponentialRampToValueAtTime(120, t + 0.15);
  lp.Q.value = 1.5;

  osc.connect(dist);
  dist.connect(lp);
  lp.connect(body);
  body.connect(master);

  click.connect(clickG);
  clickG.connect(master);

  sub.connect(subG);
  subG.connect(master);

  const end = t + 0.35;
  osc.start(t); osc.stop(end);
  click.start(t); click.stop(t + 0.03);
  sub.start(t); sub.stop(end);
}

/* ── Hi-Hat — metallic, crisp ── */
export function triggerHat(open = false, when?: number): void {
  const ac = getAudioContext();
  const t = when ?? ac.currentTime;
  const master = getMaster();
  const decay = open ? 0.3 : 0.04;

  const noise = makeNoiseBuffer(ac, 0.15);
  const src = ac.createBufferSource();
  src.buffer = noise;

  // Resonant metallic filter
  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = open ? 5500 : 10000;
  bp.Q.value = open ? 1.5 : 6;

  // Highpass to remove mud
  const hp = ac.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 6000;

  // Metallic resonance
  const res = ac.createBiquadFilter();
  res.type = "bandpass";
  res.frequency.value = open ? 8000 : 14000;
  res.Q.value = 20;
  const resG = ac.createGain();
  resG.gain.value = 0.08;

  // Saturation
  const sat = ac.createWaveShaper();
  sat.curve = makeDistortionCurve(30);

  const env = ac.createGain();
  env.gain.setValueAtTime(open ? 0.2 : 0.25, t);
  env.gain.exponentialRampToValueAtTime(0.001, t + decay);

  src.connect(bp);
  bp.connect(hp);
  hp.connect(env);
  src.connect(res);
  res.connect(resG);
  resG.connect(env);
  env.connect(sat);
  sat.connect(master);

  src.start(t);
  src.stop(t + decay + 0.05);
}

/* ── Clap — filtered noise burst ── */
export function triggerClap(when?: number): void {
  const ac = getAudioContext();
  const t = when ?? ac.currentTime;
  const master = getMaster();

  const noise = makeNoiseBuffer(ac, 0.25);
  const src = ac.createBufferSource();
  src.buffer = noise;

  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2200;
  bp.Q.value = 3;

  // Clap envelope with multi-stage
  const env = ac.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.55, t + 0.002);
  env.gain.linearRampToValueAtTime(0.35, t + 0.008);
  env.gain.linearRampToValueAtTime(0.5, t + 0.012);
  env.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

  // Body tone
  const osc = ac.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = 160;
  const tEnv = ac.createGain();
  tEnv.gain.setValueAtTime(0.2, t);
  tEnv.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

  src.connect(bp);
  bp.connect(env);
  env.connect(master);
  osc.connect(tEnv);
  tEnv.connect(master);

  src.start(t); src.stop(t + 0.25);
  osc.start(t); osc.stop(t + 0.12);
}

/* ── Bass stab — saw + LP filter sweep ── */
export function triggerBass(freq = 55, when?: number): void {
  const ac = getAudioContext();
  const t = when ?? ac.currentTime;
  const master = getMaster();

  const osc = ac.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = freq;

  // Aggressive filter sweep
  const filter = ac.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(freq * 2 + 3000, t);
  filter.frequency.exponentialRampToValueAtTime(180, t + 0.08);
  filter.Q.value = 12;

  // Slight distortion
  const sat = ac.createWaveShaper();
  sat.curve = makeDistortionCurve(40);

  const amp = ac.createGain();
  amp.gain.setValueAtTime(0.5, t);
  amp.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

  osc.connect(filter);
  filter.connect(sat);
  sat.connect(amp);
  amp.connect(master);

  osc.start(t);
  osc.stop(t + 0.2);
}

/* ── Perc — metallic blip ── */
export function triggerPerc(when?: number): void {
  const ac = getAudioContext();
  const t = when ?? ac.currentTime;
  const master = getMaster();

  const osc = ac.createOscillator();
  osc.type = "square";
  osc.frequency.value = 1400;

  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2800;
  bp.Q.value = 22;

  const env = ac.createGain();
  env.gain.setValueAtTime(0.18, t);
  env.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

  osc.connect(bp);
  bp.connect(env);
  env.connect(master);

  osc.start(t);
  osc.stop(t + 0.04);
}

/* ── Tom — pitched drum ── */
export function triggerTom(freq = 120, when?: number): void {
  const ac = getAudioContext();
  const t = when ?? ac.currentTime;
  const master = getMaster();

  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq * 3, t);
  osc.frequency.exponentialRampToValueAtTime(freq, t + 0.015);

  const env = ac.createGain();
  env.gain.setValueAtTime(0.6, t);
  env.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

  const lp = ac.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(2000, t);
  lp.frequency.exponentialRampToValueAtTime(200, t + 0.2);

  osc.connect(lp);
  lp.connect(env);
  env.connect(master);

  osc.start(t);
  osc.stop(t + 0.3);
}

/* ── Crash — long noise wash ── */
export function triggerCrash(when?: number): void {
  const ac = getAudioContext();
  const t = when ?? ac.currentTime;
  const master = getMaster();

  const noise = makeNoiseBuffer(ac, 1.5);
  const src = ac.createBufferSource();
  src.buffer = noise;

  const hp = ac.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 3000;

  const env = ac.createGain();
  env.gain.setValueAtTime(0.25, t);
  env.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

  src.connect(hp);
  hp.connect(env);
  env.connect(master);

  src.start(t);
  src.stop(t + 1.5);
}

/* ── Unified drum trigger ── */
export type DrumType = "kick" | "hat" | "hatOpen" | "clap" | "bass" | "perc" | "tom" | "crash";

export function triggerDrum(type: DrumType, when?: number): void {
  switch (type) {
    case "kick": triggerKick(when); break;
    case "hat": triggerHat(false, when); break;
    case "hatOpen": triggerHat(true, when); break;
    case "clap": triggerClap(when); break;
    case "bass": triggerBass(55, when); break;
    case "perc": triggerPerc(when); break;
    case "tom": triggerTom(120, when); break;
    case "crash": triggerCrash(when); break;
  }
}
