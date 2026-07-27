import { useEffect, useRef, useCallback } from "react";
import { useDAWStore } from "@/store/daw.store";
import { resumeAudio, setMasterVolume, setDrumVolume, setDrumMute, setEffects, setMasterFilterFreq, getAudioContext } from "@/audio/audioEngine";
import { triggerDrum, type DrumType } from "@/audio/drumSynth";
import { FILTHY_TECHNO, getHitsOnStep, type PatternDef } from "@/audio/technoSequencer";

/**
 * Techno sequencer audio sync.
 * Drives the 16th-note grid, triggers drums, applies mixer/effects state.
 */
export function useAudioSync() {
  const rafRef = useRef<number>(0);
  const lastStepTimeRef = useRef<number>(0);
  const currentStepRef = useRef<number>(0);

  const tickRef = useRef<() => void>(() => {});
  const tick = useCallback(() => {
    const state = useDAWStore.getState();
    const { playing, bpm, masterVolume } = state;

    if (!playing) {
      rafRef.current = requestAnimationFrame(tickRef.current);
      return;
    }

    const ac = getAudioContext();
    const now = ac.currentTime;

    const sixteenthDuration = (60 / bpm) / 4;

    if (now - lastStepTimeRef.current >= sixteenthDuration) {
      lastStepTimeRef.current = now;
      const step = currentStepRef.current;

      const pattern: PatternDef = state.activePattern ?? FILTHY_TECHNO;
      const hits = getHitsOnStep(pattern, step);

      for (const hit of hits) {
        triggerDrum(hit.type as DrumType, now);
      }

      currentStepRef.current = (step + 1) % 16;
      useDAWStore.setState({ currentStep: currentStepRef.current } as never);
    }

    // Sync master volume
    setMasterVolume(masterVolume);

    // Sync per-drum volumes and mutes
    const drumTypes: DrumType[] = ["kick", "hat", "hatOpen", "clap", "bass", "perc", "tom", "crash"];
    for (const type of drumTypes) {
      setDrumVolume(type, state.drumVolumes[type] ?? 1);
      setDrumMute(type, state.drumMutes[type] ?? false);
    }

    // Sync effects
    setEffects({
      reverbAmount: state.reverb,
      delayMix: state.delayMix,
    });

    // Sync master filter
    setMasterFilterFreq(state.filterCutoff);

    rafRef.current = requestAnimationFrame(tickRef.current);
  }, []);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  useEffect(() => {
    currentStepRef.current = 0;
    lastStepTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);

    const handler = () => { resumeAudio(); };
    document.addEventListener("click", handler, { once: true });
    document.addEventListener("keydown", handler, { once: true });
    document.addEventListener("touchstart", handler, { once: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("click", handler);
      document.removeEventListener("keydown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [tick]);
}
