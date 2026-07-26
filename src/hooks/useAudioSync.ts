import { useEffect, useRef, useCallback } from "react";
import { useDAWStore } from "@/store/daw.store";
import { resumeAudio, setMasterVolume, getAudioContext } from "@/audio/audioEngine";
import { triggerDrum, type DrumType } from "@/audio/drumSynth";
import { FILTHY_TECHNO, getHitsOnStep, type PatternDef } from "@/audio/technoSequencer";

/**
 * Techno sequencer audio sync.
 * Triggers drum hits on a 16th-note grid using the Web Audio drum synth.
 */

export function useAudioSync() {
  const rafRef = useRef<number>(0);
  const lastStepTimeRef = useRef<number>(0);
  const currentStepRef = useRef<number>(0);

  const tick = useCallback(() => {
    const { playing, bpm, masterVolume } = useDAWStore.getState();
    const ac = getAudioContext();

    if (!playing) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const now = ac.currentTime;

    // 16th note duration = (60 / bpm) / 4
    const sixteenthDuration = (60 / bpm) / 4;

    // Check if we need to advance
    if (now - lastStepTimeRef.current >= sixteenthDuration) {
      lastStepTimeRef.current = now;
      const step = currentStepRef.current;

      // Get hits for this step from the active pattern
      const pattern: PatternDef = useDAWStore.getState().activePattern ?? FILTHY_TECHNO;
      const hits = getHitsOnStep(pattern, step);

      for (const hit of hits) {
        const hitTime = now; // trigger immediately
        triggerDrum(hit.type as DrumType, hitTime);
      }

      // Advance step
      currentStepRef.current = (step + 1) % 16;

      // Update DAW store step position
      useDAWStore.setState({ currentStep: currentStepRef.current } as never);
    }

    setMasterVolume(masterVolume);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

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
