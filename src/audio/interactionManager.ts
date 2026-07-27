/**
 * InteractionManager — maps canvas interactions (mouse/touch) to audio parameters.
 *
 * Each interaction type has configurable intensity and target parameters.
 * This creates the feedback loop: user touches visuals → audio changes → visuals react.
 */

import {
  setMasterFilterFreq,
  setMasterFilterQ,
  setDrumVolume,
  setEffects,
  getAudioContext,
} from "./audioEngine";
import { useDAWStore } from "@/store/daw.store";

/* ─── Interaction state ─── */

interface InteractionState {
  /** 0-1 how much the user is interacting right now */
  intensity: number;
  /** Smoothed X position (0 = left edge, 1 = right edge) */
  normX: number;
  /** Smoothed Y position (0 = top, 1 = bottom) */
  normY: number;
  /** Whether user is currently pressing/holding */
  holding: boolean;
  /** Timestamp of last interaction */
  lastTouch: number;
  /** Smoothed interaction velocity */
  velocity: number;
}

const state: InteractionState = {
  intensity: 0,
  normX: 0.5,
  normY: 0.5,
  holding: false,
  lastTouch: 0,
  velocity: 0,
};

/* ─── Configurable mapping targets ─── */

export interface InteractionMapping {
  /** Map X position → filter cutoff frequency (Hz) */
  filterFromX: boolean;
  /** Map Y position → reverb amount (0-1) */
  reverbFromY: boolean;
  /** Map Y position → delay mix (0-1) */
  delayFromY: boolean;
  /** Map intensity → master filter resonance */
  resonanceFromIntensity: boolean;
  /** Map hold pressure → per-drum volume boost */
  volumeFromHold: boolean;
  /** Smoothing factor (0 = instant, 1 = very slow) */
  smoothing: number;
}

const DEFAULT_MAPPING: InteractionMapping = {
  filterFromX: true,
  reverbFromY: true,
  delayFromY: false,
  resonanceFromIntensity: true,
  volumeFromHold: true,
  smoothing: 0.12,
};

let mapping = { ...DEFAULT_MAPPING };
let smoothedFilterFreq = 20000;
let smoothedReverb = 0.35;
let smoothedDelay = 0.18;
let smoothedResonance = 1;
let smoothedVolumes: Record<string, number> = {};

/* ─── Public API ─── */

export function updateInteraction(
  mouseX: number,
  mouseY: number,
  canvasWidth: number,
  canvasHeight: number,
  mouseDown: boolean,
): void {
  const now = performance.now();
  const dt = Math.min(now - state.lastTouch, 100) / 1000;
  state.lastTouch = now;

  // Normalized positions
  const targetX = canvasWidth > 0 ? mouseX / canvasWidth : 0.5;
  const targetY = canvasHeight > 0 ? mouseY / canvasHeight : 0.5;

  // Smooth
  const s = mapping.smoothing;
  state.normX += (targetX - state.normX) * (1 - s);
  state.normY += (targetY - state.normY) * (1 - s);

  // Intensity
  const targetIntensity = mouseDown ? 1 : 0.1;
  state.intensity += (targetIntensity - state.intensity) * 0.15;

  // Velocity (how fast position changed)
  const dx = targetX - state.normX;
  const dy = targetY - state.normY;
  const targetVel = Math.sqrt(dx * dx + dy * dy) / Math.max(dt, 0.001);
  state.velocity += (Math.min(targetVel, 5) - state.velocity) * 0.2;

  state.holding = mouseDown;
}

export function applyInteractionToAudio(): void {
  const ac = getAudioContext();
  if (!ac || ac.state === "suspended") return;

  // Filter cutoff from X position (50Hz - 20000Hz)
  if (mapping.filterFromX) {
    const minFreq = 80;
    const maxFreq = 20000;
    // Non-linear: left = bass-heavy (low cutoff), right = bright (high cutoff)
    const freq = minFreq * Math.pow(maxFreq / minFreq, state.normX);
    smoothedFilterFreq += (freq - smoothedFilterFreq) * 0.15;
    setMasterFilterFreq(smoothedFilterFreq);
  }

  // Reverb from Y position (top = dry, bottom = wet)
  if (mapping.reverbFromY) {
    const targetReverb = state.normY * 0.8;
    smoothedReverb += (targetReverb - smoothedReverb) * 0.1;
    setEffects({ reverbAmount: smoothedReverb });
  }

  // Delay from Y position (alternative mapping)
  if (mapping.delayFromY) {
    const targetDelay = state.normY * 0.5;
    smoothedDelay += (targetDelay - smoothedDelay) * 0.1;
    setEffects({ delayMix: smoothedDelay });
  }

  // Resonance from interaction intensity
  if (mapping.resonanceFromIntensity) {
    const targetQ = 1 + state.intensity * 15;
    smoothedResonance += (targetQ - smoothedResonance) * 0.12;
    setMasterFilterQ(smoothedResonance);
  }

  // Volume boost on hold — boost kick when clicking in lower half
  if (mapping.volumeFromHold && state.holding) {
    const boost = 0.3 + state.intensity * 0.7;
    const drumTypes = ["kick", "hat", "clap", "bass", "perc", "tom", "crash"] as const;

    // Map Y position to different drum emphasis
    for (const type of drumTypes) {
      let targetVol = useDAWStore.getState().drumVolumes[type] ?? 1;
      // Bottom half = kick/bass emphasis, top = hat/perc emphasis
      if (state.normY > 0.5) {
        if (type === "kick" || type === "bass") targetVol = Math.min(1, targetVol * (1 + boost * 0.5));
        if (type === "hat" || type === "perc") targetVol = Math.max(0.1, targetVol * (1 - boost * 0.3));
      } else {
        if (type === "hat" || type === "perc") targetVol = Math.min(1, targetVol * (1 + boost * 0.5));
        if (type === "kick" || type === "bass") targetVol = Math.max(0.1, targetVol * (1 - boost * 0.3));
      }
      smoothedVolumes[type] = (smoothedVolumes[type] ?? targetVol) + (targetVol - (smoothedVolumes[type] ?? targetVol)) * 0.15;
      setDrumVolume(type, smoothedVolumes[type]!);
    }
  } else if (!state.holding) {
    // Gradually restore default volumes when not holding
    const defaults: Record<string, number> = {
      kick: 1, hat: 0.85, hatOpen: 0.7, clap: 0.8, bass: 0.9, perc: 0.6, tom: 0.7, crash: 0.5,
    };
    for (const [type, defaultVol] of Object.entries(defaults)) {
      const current = smoothedVolumes[type] ?? defaultVol;
      if (Math.abs(current - defaultVol) > 0.01) {
        smoothedVolumes[type] = current + (defaultVol - current) * 0.05;
        setDrumVolume(type, smoothedVolumes[type]!);
      }
    }
  }


}

export function getInteractionState(): Readonly<InteractionState> {
  return state;
}

export function setInteractionMapping(patch: Partial<InteractionMapping>): void {
  Object.assign(mapping, patch);
}

export function resetInteraction(): void {
  state.intensity = 0;
  state.normX = 0.5;
  state.normY = 0.5;
  state.holding = false;
  state.velocity = 0;
  smoothedFilterFreq = 20000;
  smoothedReverb = 0.35;
  smoothedDelay = 0.18;
  smoothedResonance = 1;
  smoothedVolumes = {};
}
