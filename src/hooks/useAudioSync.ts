import { useEffect, useRef, useCallback } from "react";
import { useDAWStore } from "@/store/daw.store";
import {
  resumeAudio, setMasterVolume,
  createVoice, updateVoice, destroyAllVoices,
  getAudioContext,
} from "@/audio/audioEngine";

/**
 * Syncs DAW store → Web Audio engine.
 * Creates voices once per track, then updates params each frame.
 * Never destroys/recreates oscillators unless waveform type changes.
 */
export function useAudioSync() {
  const rafRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);
  const createdTracksRef = useRef<Set<string>>(new Set());

  const tick = useCallback(() => {
    const { playing, currentTime, loopEnabled, loopStart, loopEnd, tracks, masterVolume } = useDAWStore.getState();
    const now = performance.now() / 1000;

    // Always keep audio context alive
    getAudioContext();

    if (!playing) {
      lastTickRef.current = 0;
      // Still update voice params even when paused (so changes take effect)
      const hasSolo = tracks.some((t) => t.solo);
      for (const track of tracks) {
        ensureVoice(track.id);
        const effectiveVol = hasSolo
          ? (track.solo ? track.volume : 0)
          : (track.muted ? 0 : track.volume);
        updateVoice(track.id, {
          frequency: track.frequency,
          amplitude: effectiveVol * masterVolume * track.amplitude * (playing ? 1 : 0),
          waveformType: track.waveformType,
          pan: track.pan,
          filterFreq: track.filterFreq,
          filterQ: track.filterQ,
          detune: track.detune,
        });
      }
      setMasterVolume(masterVolume);
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

    const hasSolo = tracks.some((t) => t.solo);

    // Ensure all track voices exist, then update
    for (const track of tracks) {
      ensureVoice(track.id);
      const effectiveVol = hasSolo
        ? (track.solo ? track.volume : 0)
        : (track.muted ? 0 : track.volume);
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

  function ensureVoice(trackId: string) {
    if (!createdTracksRef.current.has(trackId)) {
      createVoice(trackId);
      createdTracksRef.current.add(trackId);
    }
  }

  useEffect(() => {
    lastTickRef.current = 0;
    createdTracksRef.current.clear();
    rafRef.current = requestAnimationFrame(tick);

    // Resume audio on first user interaction
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

  useEffect(() => {
    return () => {
      destroyAllVoices();
      createdTracksRef.current.clear();
    };
  }, []);
}
