/**
 * MIDI-like track: note events with start, duration, velocity, pitch.
 * Used for both recording and programming patterns.
 */

export interface NoteEvent {
  id: string;
  pitch: number;     // MIDI note number
  start: number;     // beat position (fractional)
  duration: number;  // beats
  velocity: number;  // 0..1
  channel: number;   // 0..15
}

export interface MIDITrack {
  id: string;
  name: string;
  notes: NoteEvent[];
  length: number;       // bars
  baseOctave: number;   // display octave
  color: string;
  muted: boolean;
  solo: boolean;
  volume: number;
  pan: number;
  waveformType: OscillatorType | "custom";
  filterFreq: number;
  filterQ: number;
}

let noteCounter = 0;

export function createNote(
  pitch: number,
  start: number,
  duration: number = 0.5,
  velocity: number = 0.8,
  channel: number = 0,
): NoteEvent {
  return {
    id: `note-${Date.now()}-${noteCounter++}`,
    pitch,
    start,
    duration,
    velocity,
    channel,
  };
}

export function createMIDITrack(
  name: string,
  length: number = 8,
  color: string = "#3b82f6",
): MIDITrack {
  return {
    id: `midi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    notes: [],
    length,
    baseOctave: 4,
    color,
    muted: false,
    solo: false,
    volume: 0.7,
    pan: 0,
    waveformType: "sine",
    filterFreq: 20000,
    filterQ: 1,
  };
}

/** Get notes playing at a specific beat position */
export function notesAtBeat(track: MIDITrack, beat: number): NoteEvent[] {
  return track.notes.filter(
    (n) => beat >= n.start && beat < n.start + n.duration,
  );
}

/** Get notes within a beat range */
export function notesInRange(track: MIDITrack, startBeat: number, endBeat: number): NoteEvent[] {
  return track.notes.filter(
    (n) => n.start < endBeat && n.start + n.duration > startBeat,
  );
}

/** Add a note to a track */
export function addNote(track: MIDITrack, note: NoteEvent): MIDITrack {
  return { ...track, notes: [...track.notes, note] };
}

/** Remove a note from a track */
export function removeNote(track: MIDITrack, noteId: string): MIDITrack {
  return { ...track, notes: track.notes.filter((n) => n.id !== noteId) };
}

/** Sort notes by start time */
export function sortNotes(track: MIDITrack): MIDITrack {
  return { ...track, notes: [...track.notes].sort((a, b) => a.start - b.start) };
}

/** Quantize note starts to grid */
export function quantizeNotes(track: MIDITrack, gridSize: number = 0.25): MIDITrack {
  return {
    ...track,
    notes: track.notes.map((n) => ({
      ...n,
      start: Math.round(n.start / gridSize) * gridSize,
    })),
  };
}

/** Transpose all notes */
export function transposeNotes(track: MIDITrack, semitones: number): MIDITrack {
  return {
    ...track,
    notes: track.notes.map((n) => ({
      ...n,
      pitch: Math.max(0, Math.min(127, n.pitch + semitones)),
    })),
  };
}

/** Invert all notes around a pivot */
export function invertNotes(track: MIDITrack, pivot: number = 60): MIDITrack {
  return {
    ...track,
    notes: track.notes.map((n) => ({
      ...n,
      pitch: Math.max(0, Math.min(127, pivot * 2 - n.pitch)),
    })),
  };
}

/** Retrograde (reverse time) */
export function retrogradeNotes(track: MIDITrack): MIDITrack {
  const maxStart = Math.max(...track.notes.map((n) => n.start + n.duration), 0);
  return {
    ...track,
    notes: track.notes.map((n) => ({
      ...n,
      start: maxStart - n.start - n.duration,
    })),
  };
}

/* ─── Preset MIDI patterns ─── */

export interface MIDIPreset {
  name: string;
  description: string;
  track: MIDITrack;
}

export function createScaleMelody(
  scale: number[],
  pattern: number[],
  octave: number = 4,
): MIDITrack {
  const track = createMIDITrack("Scale Melody", 8);
  const baseNote = scale[0]! + octave * 12;
  pattern.forEach((degree, i) => {
    const pitch = baseNote + (scale[degree % scale.length] ?? 0) + Math.floor(degree / scale.length) * 12;
    track.notes.push(createNote(pitch, i * 0.5, 0.5, 0.8));
  });
  return sortNotes(track);
}

export const MIDI_PRESETS: MIDIPreset[] = [
  {
    name: "C Major Scale",
    description: "One-octave C major scale ascending",
    track: (() => {
      const t = createMIDITrack("C Major", 4);
      [0,2,4,5,7,9,11,12].forEach((s, i) => {
        t.notes.push(createNote(60 + s, i * 1, 0.9, 0.8));
      });
      return sortNotes(t);
    })(),
  },
  {
    name: "Blues Lick",
    description: "Classic blues pentatonic lick",
    track: (() => {
      const t = createMIDITrack("Blues", 4);
      const notes = [60, 63, 65, 66, 67, 70, 67, 66, 65, 63, 60, 58];
      notes.forEach((p, i) => {
        t.notes.push(createNote(p, i * 0.5, 0.45, 0.7 + Math.random() * 0.2));
      });
      return sortNotes(t);
    })(),
  },
  {
    name: "Arp Pattern",
    description: "Eighth-note arpeggio",
    track: (() => {
      const t = createMIDITrack("Arp", 4);
      [60, 64, 67, 72, 67, 64, 60, 64, 67, 72, 76, 72, 67, 64, 60, 55].forEach((p, i) => {
        t.notes.push(createNote(p, i * 0.5, 0.4, 0.75));
      });
      return sortNotes(t);
    })(),
  },
  {
    name: "Chord Stabs",
    description: "Quarter-note chord stabs",
    track: (() => {
      const t = createMIDITrack("Stabs", 8);
      const chords = [[60,64,67], [65,69,72], [67,71,74], [60,64,67]];
      chords.forEach((chord, bar) => {
        chord.forEach((p) => {
          t.notes.push(createNote(p, bar * 4, 0.5, 0.85));
        });
      });
      return sortNotes(t);
    })(),
  },
  {
    name: "Bass Groove",
    description: "Funky bass line",
    track: (() => {
      const t = createMIDITrack("Bass", 4, "#3b82f6");
      const pattern = [
        [36, 0, 0.75], [36, 1, 0.25], [43, 1.5, 0.5],
        [36, 2, 0.75], [48, 2.75, 0.25], [43, 3, 0.5], [36, 3.5, 0.5],
      ];
      pattern.forEach(([p, s, d]) => {
        t.notes.push(createNote(p as number, s as number, d as number, 0.9));
      });
      return sortNotes(t);
    })(),
  },
  {
    name: "Jazz Walking",
    description: "Walking bass line in quarter notes",
    track: (() => {
      const t = createMIDITrack("Walking", 8, "#eab308");
      [36, 38, 40, 41, 43, 41, 40, 38, 36, 33, 35, 36, 38, 40, 41, 43].forEach((p, i) => {
        t.notes.push(createNote(p, i, 0.9, 0.7 + Math.random() * 0.2));
      });
      return sortNotes(t);
    })(),
  },
  {
    name: "Ambient Pad",
    description: "Slow evolving pad chords",
    track: (() => {
      const t = createMIDITrack("Pad", 16, "#a855f7");
      [[60,64,67,72], [65,69,72,77], [67,71,74,79], [60,64,67,72]].forEach((chord, bar) => {
        chord.forEach((p) => {
          t.notes.push(createNote(p, bar * 4, 3.5, 0.5));
        });
      });
      return sortNotes(t);
    })(),
  },
  {
    name: "Pentatonic Solo",
    description: "Pentatonic improvisation",
    track: (() => {
      const t = createMIDITrack("Solo", 8, "#ef4444");
      const penta = [72, 74, 76, 79, 81, 79, 76, 74, 72, 74, 76, 79, 84, 81, 79, 76,
                     74, 72, 74, 76, 79, 76, 74, 72, 69, 72, 74, 76, 79, 81, 84, 86];
      penta.forEach((p, i) => {
        t.notes.push(createNote(p, i * 0.5, 0.4 + Math.random() * 0.2, 0.6 + Math.random() * 0.3));
      });
      return sortNotes(t);
    })(),
  },
  {
    name: "Minimal Sequence",
    description: "Repeating two-note motif",
    track: (() => {
      const t = createMIDITrack("Minimal", 4, "#14b8a6");
      for (let i = 0; i < 16; i++) {
        const p = i % 2 === 0 ? 60 : 63;
        t.notes.push(createNote(p, i * 0.25, 0.2, 0.7 + (i % 4 === 0 ? 0.2 : 0)));
      }
      return sortNotes(t);
    })(),
  },
];
