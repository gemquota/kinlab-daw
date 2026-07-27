/**
 * Gesture-to-Audio interaction manager.
 *
 * Maps multi-touch gestures to audio parameters:
 *   1-finger tap        -> trigger current instrument
 *   1-finger drag H     -> cycle instruments
 *   1-finger drag V     -> FX amount (dry -> wet)
 *   2-finger tap        -> toggle FX on/off
 *   2-finger drag H     -> sweep FX frequency
 *   2-finger drag V     -> FX mix
 *   3-finger drag H     -> cycle FX types
 *   3-finger drag V     -> cycle arp patterns
 */

import { triggerDrum, type DrumType } from "./drumSynth";
import {
  setMasterFilterFreq,
  setMasterFilterQ,
  setMasterFilterType,
  setDistortion,
  setEffects,
  getAudioContext,
} from "./audioEngine";
import {
  setGestureCallbacks,
  type GestureEvent,
} from "./gestureEngine";
import { ARP_PATTERNS } from "@/music/arpeggios";

/* ---- Instrument list ---- */

const INSTRUMENTS: DrumType[] = ["kick", "hat", "clap", "bass", "perc", "tom", "crash"];

/* ---- FX types ---- */

export type FxType = "lowpass" | "highpass" | "bandpass" | "distortion" | "reverb" | "delay";
const FX_TYPES: FxType[] = ["lowpass", "highpass", "bandpass", "distortion", "reverb", "delay"];

/* ---- Arp patterns ---- */

const ARP_NAMES = ARP_PATTERNS.map((p) => p.id);

/* ---- State ---- */

export interface GestureState {
  currentInstrument: number;
  currentFxType: number;
  fxAmount: number;
  fxFrequency: number;
  fxMix: number;
  fxEnabled: boolean;
  currentArpPattern: number;
  active: boolean;
}

const state: GestureState = {
  currentInstrument: 0,
  currentFxType: 0,
  fxAmount: 0.5,
  fxFrequency: 2000,
  fxMix: 0.3,
  fxEnabled: false,
  currentArpPattern: 0,
  active: false,
};

let dragAccum = 0;
const CYCLE_THRESHOLD = 40;

/* ---- Public API ---- */

export function initGestureAudio(): void {
  setGestureCallbacks({
    onGesture: handleGesture,
    onTap: handleTap,
  });
}

export function handleTap(fingerCount: number): void {
  const ac = getAudioContext();
  if (!ac || ac.state === "suspended") return;

  if (fingerCount === 1) {
    const type = INSTRUMENTS[state.currentInstrument]!;
    triggerDrum(type);
    state.active = true;
  } else if (fingerCount === 2) {
    state.fxEnabled = !state.fxEnabled;
    applyFx();
    state.active = true;
  }
}

function handleGesture(event: GestureEvent): void {
  const ac = getAudioContext();
  if (!ac || ac.state === "suspended") return;

  state.active = true;

  switch (event.type) {
    case "drag": {
      if (event.direction === "horizontal") {
        // 1-finger horizontal drag: cycle instruments
        dragAccum += event.rawDeltaX;
        if (Math.abs(dragAccum) > CYCLE_THRESHOLD) {
          const dir = dragAccum > 0 ? 1 : -1;
          state.currentInstrument = (state.currentInstrument + dir + INSTRUMENTS.length) % INSTRUMENTS.length;
          triggerDrum(INSTRUMENTS[state.currentInstrument]!);
          dragAccum = 0;
        }
      } else {
        // 1-finger vertical drag: FX amount (up = dry, down = wet)
        state.fxAmount = Math.max(0, Math.min(1, state.fxAmount - event.deltaY * 0.5));
        applyFx();
      }
      break;
    }

    case "two-finger-drag": {
      if (event.direction === "horizontal") {
        // 2-finger H: sweep FX frequency
        const minFreq = 80;
        const maxFreq = 20000;
        state.fxFrequency = minFreq * Math.pow(maxFreq / minFreq, 0.5 + event.deltaX * 0.5);
        applyFx();
      } else {
        // 2-finger V: FX mix
        state.fxMix = Math.max(0, Math.min(1, state.fxMix - event.deltaY * 0.5));
        applyFx();
      }
      break;
    }

    case "three-finger-drag": {
      if (event.direction === "horizontal") {
        // 3-finger H: cycle FX type
        dragAccum += event.rawDeltaX;
        if (Math.abs(dragAccum) > CYCLE_THRESHOLD) {
          const dir = dragAccum > 0 ? 1 : -1;
          state.currentFxType = (state.currentFxType + dir + FX_TYPES.length) % FX_TYPES.length;
          state.fxEnabled = true;
          applyFx();
          dragAccum = 0;
        }
      } else {
        // 3-finger V: cycle arp patterns
        dragAccum += event.rawDeltaY;
        if (Math.abs(dragAccum) > CYCLE_THRESHOLD) {
          const dir = dragAccum > 0 ? 1 : -1;
          state.currentArpPattern = (state.currentArpPattern + dir + ARP_NAMES.length) % ARP_NAMES.length;
          dragAccum = 0;
        }
      }
      break;
    }
  }
}

function applyFx(): void {
  const fxType = FX_TYPES[state.currentFxType]!;

  switch (fxType) {
    case "lowpass":
    case "highpass":
    case "bandpass":
      setMasterFilterType(fxType);
      setMasterFilterFreq(state.fxFrequency);
      setMasterFilterQ(1 + state.fxAmount * 15);
      setDistortion(0);
      break;
    case "distortion":
      setDistortion(state.fxAmount);
      break;
    case "reverb":
      setEffects({ reverbAmount: state.fxAmount });
      break;
    case "delay":
      setEffects({ delayMix: state.fxMix });
      break;
  }
}

/* ---- Overlay info for visuals ---- */

export function getGestureOverlay(): {
  instrument: string;
  fx: string;
  arp: string;
  fxEnabled: boolean;
  active: boolean;
} {
  return {
    instrument: INSTRUMENTS[state.currentInstrument]!.toUpperCase(),
    fx: FX_TYPES[state.currentFxType]!.toUpperCase(),
    arp: ARP_NAMES[state.currentArpPattern] ?? "none",
    fxEnabled: state.fxEnabled,
    active: state.active,
  };
}

export function getGestureState(): Readonly<GestureState> {
  return state;
}

export function resetInteraction(): void {
  state.currentInstrument = 0;
  state.currentFxType = 0;
  state.fxAmount = 0.5;
  state.fxFrequency = 2000;
  state.fxMix = 0.3;
  state.fxEnabled = false;
  state.currentArpPattern = 0;
  state.active = false;
  dragAccum = 0;
}

/* Keep old exports for backward compatibility */
export function updateInteraction(): void {}
export function applyInteractionToAudio(): void {}
export function getInteractionState() {
  return { intensity: state.active ? 0.5 : 0, normX: 0.5, normY: 0.5, holding: state.active, lastTouch: performance.now(), velocity: 0 };
}
