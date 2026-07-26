import { useEffect, useRef, useCallback } from "react";
import { useDAWStore } from "@/store/daw.store";
import {
  resumeAudio, setMasterVolume,
  createVoice, updateVoice, destroyAllVoices,
} from "@/audio/audioEngine";

/**
 * Syncs the DAW store state with the Web Audio engine.
 * Creates/destroys voices per track, applies volume/pan/filter,
 * and runs the main playback loop.
 */
export function useAudioSync() {
  const rafRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);
  const prevTrackIdsRef = useRef<string[]>([]);

  const tick = useCallback(() => {
    const { playing, currentTime, loopEnabled, loopStart, loopEnd, tracks, masterVolume } = useDAWStore.getState();
    const now = performance.now() / 1000;

    if (!playing) {
      lastTickRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const dt = lastTickRef.current > 0 ? now - lastTickRef.current : 0;
    lastTickRef.current = now;

    let newTime = currentTime + dt;
    if (loopEnabled && newTime >= loopEnd) {
      newTime = loopStart + (newTime - loopEnd) % (loopEnd - loopStart);
    }
    useDAWStore.setState({ currentTime: newTime } as never);

    const trackIds = tracks.map((t) => t.id);
    const hasSolo = tracks.some((t) => t.solo);

    // Destroy removed tracks
    for (const id of prevTrackIdsRef.current) {
      if (!trackIds.includes(id)) {
        // voice cleanup handled by audio engine
      }
    }
    prevTrackIdsRef.current = trackIds;

    // Update/create voices
    for (const track of tracks) {
      const effectiveVol = hasSolo
        ? (track.solo ? track.volume : 0)
        : (track.muted ? 0 : track.volume);

      createVoice(track.id);
      updateVoice(track.id, {
        frequency: track.frequency,
        amplitude: effectiveVol * masterVolume * track.amplitude,
        waveformType: track.waveformType,
        pan: track.pan,
        filterFreq: track.filterFreq,
        filterQ: track.filterQ,
        detune: track.detune,
      });
    }

    setMasterVolume(masterVolume);

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    lastTickRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);

    const handler = () => { resumeAudio(); };
    document.addEventListener("click", handler, { once: true });
    document.addEventListener("keydown", handler, { once: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("click", handler);
      document.removeEventListener("keydown", handler);
    };
  }, [tick]);

  useEffect(() => {
    return () => destroyAllVoices();
  }, []);
}
