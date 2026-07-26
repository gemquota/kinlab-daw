/**
 * Web Audio API engine for KinLab DAW.
 * Manages audio context, master output, and real-time synthesis.
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let masterAnalyser: AnalyserNode | null = null;
let compressor: DynamicsCompressorNode | null = null;

export interface TrackVoice {
  id: string;
  oscillators: OscillatorNode[];
  gainNode: GainNode;
  panNode: StereoPannerNode;
  filterNode: BiquadFilterNode;
}

const voices: Map<string, TrackVoice> = new Map();

export function getAudioContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 12;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;

    masterGain = ctx.createGain();
    masterGain.gain.value = 0.8;

    masterAnalyser = ctx.createAnalyser();
    masterAnalyser.fftSize = 2048;
    masterAnalyser.smoothingTimeConstant = 0.8;

    masterGain.connect(compressor);
    compressor.connect(masterAnalyser);
    masterAnalyser.connect(ctx.destination);
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
  pan: number;       // -1..1
  filterFreq: number; // Hz
  filterQ: number;
  detune: number;    // cents
}

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
  filterNode.connect(masterGain!);

  const voice: TrackVoice = {
    id: trackId,
    oscillators: [],
    gainNode,
    panNode,
    filterNode,
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

  // Update oscillators if count changed or need recreation
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
    osc.connect(voice.gainNode);
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

/* ── Audio meter (RMS) ── */

export function getRMSLevel(analyser: AnalyserNode): number {
  const data = getAnalyserData(analyser);
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const v = (data[i]! - 128) / 128;
    sum += v * v;
  }
  return Math.sqrt(sum / data.length);
}
