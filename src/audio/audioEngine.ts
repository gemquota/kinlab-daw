/**
 * Enhanced Web Audio API engine with effects chain.
 * Reverb, delay, chorus, and master limiter.
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let masterAnalyser: AnalyserNode | null = null;
let compressor: DynamicsCompressorNode | null = null;
let reverbNode: ConvolverNode | null = null;
let delayNode: DelayNode | null = null;
let delayFeedback: GainNode | null = null;
let delayMix: GainNode | null = null;
let dryGain: GainNode | null = null;
let reverbGain: GainNode | null = null;
let preGain: GainNode | null = null;

export interface TrackVoice {
  id: string;
  oscillators: OscillatorNode[];
  gainNode: GainNode;
  panNode: StereoPannerNode;
  filterNode: BiquadFilterNode;
  effectsGain: GainNode;
}

const voices: Map<string, TrackVoice> = new Map();

/* ─── Effects state ─── */

export interface EffectsState {
  reverbAmount: number;
  delayTime: number;
  delayFeedback: number;
  delayMix: number;
  filterFreq: number;
  filterQ: number;
}

let currentEffects: EffectsState = {
  reverbAmount: 0.3,
  delayTime: 0.375,
  delayFeedback: 0.35,
  delayMix: 0.2,
  filterFreq: 20000,
  filterQ: 1,
};

export function getEffects(): EffectsState {
  return { ...currentEffects };
}

export function setEffects(patch: Partial<EffectsState>): void {
  const ac = getAudioContext();
  const t = ac.currentTime;
  Object.assign(currentEffects, patch);

  if (reverbGain) reverbGain.gain.setTargetAtTime(currentEffects.reverbAmount, t, 0.05);
  if (dryGain) dryGain.gain.setTargetAtTime(1 - currentEffects.reverbAmount * 0.3, t, 0.05);
  if (delayNode) delayNode.delayTime.setTargetAtTime(currentEffects.delayTime, t, 0.05);
  if (delayFeedback) delayFeedback.gain.setTargetAtTime(currentEffects.delayFeedback, t, 0.05);
  if (delayMix) delayMix.gain.setTargetAtTime(currentEffects.delayMix, t, 0.05);
}

/* ─── Reverb impulse generation ─── */

function createReverbImpulse(ac: AudioContext, duration: number = 2, decay: number = 2): AudioBuffer {
  const sampleRate = ac.sampleRate;
  const length = sampleRate * duration;
  const buffer = ac.createBuffer(2, length, sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return buffer;
}

/* ─── Audio context setup ─── */

export function getAudioContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();

    // Pre-gain
    preGain = ctx.createGain();
    preGain.gain.value = 1;

    // Compressor
    compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 12;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.15;

    // Master gain
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.75;

    // Analyser
    masterAnalyser = ctx.createAnalyser();
    masterAnalyser.fftSize = 2048;
    masterAnalyser.smoothingTimeConstant = 0.85;

    // Reverb
    reverbNode = ctx.createConvolver();
    reverbNode.buffer = createReverbImpulse(ctx, 2.5, 2.5);
    reverbGain = ctx.createGain();
    reverbGain.gain.value = currentEffects.reverbAmount;

    // Dry path
    dryGain = ctx.createGain();
    dryGain.gain.value = 0.85;

    // Delay
    delayNode = ctx.createDelay(2);
    delayNode.delayTime.value = currentEffects.delayTime;
    delayFeedback = ctx.createGain();
    delayFeedback.gain.value = currentEffects.delayFeedback;
    delayMix = ctx.createGain();
    delayMix.gain.value = currentEffects.delayMix;

    // Routing:
    // preGain → compressor → dryGain ─────────────────→ masterGain → masterAnalyser → destination
    //                         ──→ reverbNode → reverbGain ──→ masterGain
    //                         ──→ delayNode → delayFeedback ↩
    //                         ──→ delayMix ──→ masterGain

    preGain.connect(compressor);

    compressor.connect(dryGain);
    compressor.connect(reverbNode!);
    compressor.connect(delayNode!);

    reverbNode!.connect(reverbGain!);
    reverbGain!.connect(masterGain!);

    delayNode!.connect(delayFeedback!);
    delayFeedback!.connect(delayNode!);
    delayNode!.connect(delayMix!);
    delayMix!.connect(masterGain!);

    dryGain!.connect(masterGain!);

    masterGain!.connect(compressor);
    masterAnalyser!.connect(ctx.destination);

    // Fix: masterGain should connect to analyser, not back to compressor
    masterGain!.disconnect(compressor);
    masterGain!.connect(masterAnalyser!);
  }
  return ctx;
}

export function resumeAudio(): Promise<void> {
  const ac = getAudioContext();
  if (ac.state === "suspended") return ac.resume();
  return Promise.resolve();
}

export function setMasterVolume(v: number): void {
  const ac = getAudioContext();
  masterGain?.gain.setTargetAtTime(Math.max(0, Math.min(1, v)), ac.currentTime, 0.01);
}

export function getMasterAnalyser(): AnalyserNode | null {
  return masterAnalyser;
}

export function getCurrentTime(): number {
  return ctx?.currentTime ?? 0;
}

/* ── Track voice management ── */

export interface VoiceParams {
  frequency: number;
  amplitude: number;
  waveformType: OscillatorType | "custom";
  pan: number;
  filterFreq: number;
  filterQ: number;
  detune: number;
}

export function createVoice(trackId: string): TrackVoice {
  destroyVoice(trackId);
  const ac = getAudioContext();

  const effectsGain = ac.createGain();
  effectsGain.gain.value = 0;

  const gainNode = ac.createGain();
  gainNode.gain.value = 0;

  const panNode = ac.createStereoPanner();
  panNode.pan.value = 0;

  const filterNode = ac.createBiquadFilter();
  filterNode.type = "lowpass";
  filterNode.frequency.value = 20000;
  filterNode.Q.value = 1;

  effectsGain.connect(gainNode);
  gainNode.connect(panNode);
  panNode.connect(filterNode);
  filterNode.connect(preGain!);

  const voice: TrackVoice = {
    id: trackId,
    oscillators: [],
    gainNode,
    panNode,
    filterNode,
    effectsGain,
  };

  voices.set(trackId, voice);
  return voice;
}

export function updateVoice(trackId: string, params: VoiceParams): void {
  const voice = voices.get(trackId);
  if (!voice) return;
  const ac = getAudioContext();

  voice.gainNode.gain.setTargetAtTime(params.amplitude, ac.currentTime, 0.01);
  voice.panNode.pan.setTargetAtTime(params.pan, ac.currentTime, 0.01);
  voice.filterNode.frequency.setTargetAtTime(params.filterFreq, ac.currentTime, 0.01);
  voice.filterNode.Q.setTargetAtTime(params.filterQ, ac.currentTime, 0.01);

  const needsRecreate = voice.oscillators.length === 0 ||
    voice.oscillators[0]?.type !== (params.waveformType === "custom" ? "sawtooth" : params.waveformType);

  if (needsRecreate) {
    voice.oscillators.forEach((o) => { try { o.stop(); } catch {} });
    voice.oscillators = [];

    const oscType: OscillatorType = params.waveformType === "custom" ? "sawtooth" : params.waveformType as OscillatorType;
    const osc = ac.createOscillator();
    osc.type = oscType;
    osc.frequency.value = params.frequency;
    osc.detune.value = params.detune;
    osc.connect(voice.effectsGain);
    osc.start();
    voice.oscillators.push(osc);
  } else {
    voice.oscillators[0]?.frequency.setTargetAtTime(params.frequency, ac.currentTime, 0.01);
    voice.oscillators[0]?.detune.setTargetAtTime(params.detune, ac.currentTime, 0.01);
  }
}

export function destroyVoice(trackId: string): void {
  const voice = voices.get(trackId);
  if (!voice) return;
  voice.oscillators.forEach((o) => { try { o.stop(); } catch {} });
  voice.gainNode.disconnect();
  voice.panNode.disconnect();
  voice.filterNode.disconnect();
  voice.effectsGain.disconnect();
  voices.delete(trackId);
}

export function destroyAllVoices(): void {
  for (const [id] of voices) destroyVoice(id);
}

/* ── Analyser helpers ── */

export function getAnalyserData(analyser: AnalyserNode): Uint8Array {
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteTimeDomainData(data);
  return data;
}

export function getFrequencyData(analyser: AnalyserNode): Uint8Array {
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  return data;
}

export function getRMSLevel(analyser: AnalyserNode): number {
  const data = getAnalyserData(analyser);
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const v = (data[i]! - 128) / 128;
    sum += v * v;
  }
  return Math.sqrt(sum / data.length);
}
