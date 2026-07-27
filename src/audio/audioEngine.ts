/**
 * Web Audio API engine with effects chain.
 * drumSynth → drumGains[type] → compressor → dry/reverb/delay → masterFilter → masterGain → analyser → output
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let masterAnalyser: AnalyserNode | null = null;
let compressor: DynamicsCompressorNode | null = null;
let reverbNode: ConvolverNode | null = null;
let reverbGain: GainNode | null = null;
let delayNode: DelayNode | null = null;
let delayFeedback: GainNode | null = null;
let delayMix: GainNode | null = null;
let dryGain: GainNode | null = null;
let preGain: GainNode | null = null;
let masterFilter: BiquadFilterNode | null = null;

// Per-drum gain nodes — persistent, controlled by store
const drumGainNodes: Map<string, GainNode> = new Map();

export interface TrackVoice {
  id: string;
  oscillators: OscillatorNode[];
  gainNode: GainNode;
  panNode: StereoPannerNode;
  filterNode: BiquadFilterNode;
}

const voices: Map<string, TrackVoice> = new Map();

/* ─── Effects state ─── */

export interface EffectsState {
  reverbAmount: number;
  delayTime: number;
  delayFeedback: number;
  delayMix: number;
}

let currentEffects: EffectsState = {
  reverbAmount: 0.35,
  delayTime: 0.375,
  delayFeedback: 0.3,
  delayMix: 0.18,
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

/* ─── Reverb impulse ─── */

function createReverbImpulse(ac: AudioContext, duration = 2.5, decay = 2.5): AudioBuffer {
  const sr = ac.sampleRate;
  const len = sr * duration;
  const buf = ac.createBuffer(2, len, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

/* ─── Context setup ─── */

/**
 * Returns or creates the singleton AudioContext.
 * Lazily initializes the entire audio graph on first call.
 */
export function getAudioContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();

    preGain = ctx.createGain();
    preGain.gain.value = 1;

    compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 8;
    compressor.ratio.value = 6;
    compressor.attack.value = 0.002;
    compressor.release.value = 0.08;

    // Master filter — lowpass, default open
    masterFilter = ctx.createBiquadFilter();
    masterFilter.type = "lowpass";
    masterFilter.frequency.value = 20000;
    masterFilter.Q.value = 1;

    masterGain = ctx.createGain();
    masterGain.gain.value = 0.75;

    masterAnalyser = ctx.createAnalyser();
    masterAnalyser.fftSize = 2048;
    masterAnalyser.smoothingTimeConstant = 0.85;

    reverbNode = ctx.createConvolver();
    reverbNode.buffer = createReverbImpulse(ctx);
    reverbGain = ctx.createGain();
    reverbGain.gain.value = currentEffects.reverbAmount;

    dryGain = ctx.createGain();
    dryGain.gain.value = 0.85;

    delayNode = ctx.createDelay(2);
    delayNode.delayTime.value = currentEffects.delayTime;
    delayFeedback = ctx.createGain();
    delayFeedback.gain.value = currentEffects.delayFeedback;
    delayMix = ctx.createGain();
    delayMix.gain.value = currentEffects.delayMix;

    // Signal chain:
    // preGain → compressor → dryGain ──────────────────→ masterFilter → masterGain → masterAnalyser → destination
    //                      → reverbNode → reverbGain ──→ masterFilter
    //                      → delayNode → delayFeedback ↩
    //                      → delayNode → delayMix ─────→ masterFilter

    preGain.connect(compressor);

    compressor.connect(dryGain);
    compressor.connect(reverbNode);
    compressor.connect(delayNode);

    reverbNode.connect(reverbGain);
    reverbGain.connect(masterFilter);

    delayNode.connect(delayFeedback);
    delayFeedback.connect(delayNode);
    delayNode.connect(delayMix);
    delayMix.connect(masterFilter);

    dryGain.connect(masterFilter);
    masterFilter.connect(masterGain);
    masterGain.connect(masterAnalyser);
    masterAnalyser.connect(ctx.destination);
  }
  return ctx;
}

/**
 * Resumes the AudioContext after user gesture.
 * Required by browser autoplay policy.
 */
export function resumeAudio(): Promise<void> {
  const ac = getAudioContext();
  if (ac.state === "suspended") return ac.resume();
  return Promise.resolve();
}

/**
 * Sets the master output gain (0–1).
 */
export function setMasterVolume(v: number): void {
  masterGain?.gain.setTargetAtTime(Math.max(0, Math.min(1, v)), getAudioContext().currentTime, 0.01);
}

export function getMasterAnalyser(): AnalyserNode | null {
  return masterAnalyser;
}

export function getMasterNode(): GainNode {
  getAudioContext();
  return masterGain!;
}

/* ─── Per-drum gain nodes ─── */

/**
 * Get or create a gain node for a specific drum type.
 * All triggers for the same drum type route through this node.
 */
export function getDrumGain(type: string): GainNode {
  getAudioContext();
  let gain = drumGainNodes.get(type);
  if (!gain) {
    gain = ctx!.createGain();
    gain.gain.value = 1;
    gain.connect(preGain!);
    drumGainNodes.set(type, gain);
  }
  return gain;
}

/**
 * Set volume for a specific drum type (0–1).
 */
export function setDrumVolume(type: string, volume: number): void {
  const gain = drumGainNodes.get(type);
  if (gain) {
    gain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), getAudioContext().currentTime, 0.01);
  }
}

/**
 * Mute/unmute a specific drum type.
 */
export function setDrumMute(type: string, muted: boolean): void {
  const gain = drumGainNodes.get(type);
  if (gain) {
    gain.gain.setTargetAtTime(muted ? 0 : 1, getAudioContext().currentTime, 0.01);
  }
}

/**
 * Set master filter cutoff frequency.
 */
export function setMasterFilterFreq(freq: number): void {
  if (masterFilter) {
    masterFilter.frequency.setTargetAtTime(freq, getAudioContext().currentTime, 0.02);
  }
}

/**
 * Set master filter resonance (Q).
 */
export function setMasterFilterQ(q: number): void {
  if (masterFilter) {
    masterFilter.Q.setTargetAtTime(q, getAudioContext().currentTime, 0.02);
  }
}

/* ── Track voices (legacy, for potential future use) ── */

export interface VoiceParams {
  frequency: number;
  amplitude: number;
  waveformType: OscillatorType | "custom";
  pan: number;
  filterFreq: number;
  filterQ: number;
  detune: number;
}

/**
 * Creates a polyphonic voice for a track with oscillator, gain, pan, and filter.
 */
export function createVoice(trackId: string): TrackVoice {
  destroyVoice(trackId);
  const ac = getAudioContext();

  const gainNode = ac.createGain();
  gainNode.gain.value = 0;

  const panNode = ac.createStereoPanner();
  panNode.pan.value = 0;

  const filterNode = ac.createBiquadFilter();
  filterNode.type = "lowpass";
  filterNode.frequency.value = 20000;
  filterNode.Q.value = 1;

  gainNode.connect(panNode);
  panNode.connect(filterNode);
  filterNode.connect(preGain!);

  const voice: TrackVoice = { id: trackId, oscillators: [], gainNode, panNode, filterNode };
  voices.set(trackId, voice);
  return voice;
}

export function updateVoice(trackId: string, params: VoiceParams): void {
  const voice = voices.get(trackId);
  if (!voice) return;
  const ac = getAudioContext();
  const t = ac.currentTime;

  voice.gainNode.gain.setTargetAtTime(params.amplitude, t, 0.01);
  voice.panNode.pan.setTargetAtTime(params.pan, t, 0.01);
  voice.filterNode.frequency.setTargetAtTime(params.filterFreq, t, 0.01);
  voice.filterNode.Q.setTargetAtTime(params.filterQ, t, 0.01);

  const targetOscType: OscillatorType = params.waveformType === "custom" ? "sawtooth" : params.waveformType as OscillatorType;
  const needsRecreate = voice.oscillators.length === 0 || voice.oscillators[0]!.type !== targetOscType;

  if (needsRecreate) {
    voice.oscillators.forEach((o) => { try { o.stop(); } catch (_) { /* already stopped */ } });
    voice.oscillators = [];

    const osc = ac.createOscillator();
    osc.type = targetOscType;
    osc.frequency.value = params.frequency;
    osc.detune.value = params.detune;
    osc.connect(voice.gainNode);
    osc.start();
    voice.oscillators.push(osc);
  } else {
    voice.oscillators[0]!.frequency.setTargetAtTime(params.frequency, t, 0.01);
    voice.oscillators[0]!.detune.setTargetAtTime(params.detune, t, 0.01);
  }
}

export function destroyVoice(trackId: string): void {
  const voice = voices.get(trackId);
  if (!voice) return;
  voice.oscillators.forEach((o) => { try { o.stop(); } catch (_) { /* already stopped */ } });
  voice.gainNode.disconnect();
  voice.panNode.disconnect();
  voice.filterNode.disconnect();
  voices.delete(trackId);
}

/**
 * Destroys all active voices and disconnects nodes.
 */
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
