import { useState } from "react";
import { useDAWStore } from "@/store/daw.store";
import {
  INSTRUMENT_PRESETS, SCALE_PRESETS, ARP_PRESETS, CONFIG_PRESETS,
  SONG_PRESETS, SEQ_PRESETS, MIDI_TRACK_PRESETS,
} from "@/music/presets";
import { buildScale } from "@/music/scales";
import { createPattern } from "@/sequencer/stepSequencer";
import { cn } from "@/lib/cn";
import { Library, Music, Waves, Grid3x3, FileText, Sliders, Mic, Guitar } from "lucide-react";

type PresetCategory = "Songs" | "Instruments" | "Configs" | "Sequences" | "MIDI" | "Scales" | "Arps";

const CATEGORIES: { id: PresetCategory; icon: React.ReactNode; label: string }[] = [
  { id: "Songs", icon: <FileText className="w-3 h-3" />, label: "Songs" },
  { id: "Instruments", icon: <Guitar className="w-3 h-3" />, label: "Instruments" },
  { id: "Configs", icon: <Sliders className="w-3 h-3" />, label: "Configs" },
  { id: "Sequences", icon: <Grid3x3 className="w-3 h-3" />, label: "Sequences" },
  { id: "MIDI", icon: <Music className="w-3 h-3" />, label: "MIDI" },
  { id: "Scales", icon: <Waves className="w-3 h-3" />, label: "Scales" },
  { id: "Arps", icon: <Mic className="w-3 h-3" />, label: "Arps" },
];

export function PresetBrowser() {
  const [activeCategory, setActiveCategory] = useState<PresetCategory>("Instruments");
  const store = useDAWStore();

  function loadSong(preset: typeof SONG_PRESETS[0]) {
    store.setBpm(preset.bpm);
    store.setLoopPoints(0, preset.bars * 4);
    // Clear and rebuild tracks from song pattern
    const tracks = preset.tracks.map((t, i) => ({
      id: `song-${Date.now()}-${i}`,
      name: t.name,
      muted: false, solo: false,
      volume: t.volume, pan: t.pan,
      waveformType: t.waveformType,
      frequency: t.frequency,
      amplitude: 0.5, detune: 0,
      filterFreq: 8000, filterQ: 1,
      color: t.color,
    }));
    // Replace tracks
    useDAWStore.setState({ tracks } as never);
  }

  function loadInstrument(preset: typeof INSTRUMENT_PRESETS[0]) {
    const activeId = store.activeTrackId;
    if (activeId) {
      store.updateTrack(activeId, preset.track);
    } else {
      store.addTrack({ name: preset.name, ...preset.track });
    }
  }

  function loadConfig(preset: typeof CONFIG_PRESETS[0]) {
    store.setMasterVolume(preset.masterVolume);
    store.setBpm(preset.bpm);
    const tracks = preset.tracks.map((t, i) => ({
      id: `cfg-${Date.now()}-${i}`,
      name: t.name ?? `Track ${i + 1}`,
      muted: false, solo: false,
      volume: t.volume ?? 0.7, pan: t.pan ?? 0,
      waveformType: t.waveformType ?? "sine",
      frequency: t.frequency ?? 440,
      amplitude: t.amplitude ?? 0.5, detune: t.detune ?? 0,
      filterFreq: t.filterFreq ?? 20000, filterQ: t.filterQ ?? 1,
      color: t.color ?? "#3b82f6",
    }));
    useDAWStore.setState({ tracks } as never);
  }

  function loadSequence(preset: typeof SEQ_PRESETS[0]) {
    const pat = createPattern(preset.name, 16, preset.basePitch);
    preset.steps.forEach(([idx, pitch]) => {
      if (idx < 16) pat.steps[idx] = { ...pat.steps[idx]!, active: true, pitch };
    });
    pat.swing = preset.swing;
    store.setSequencerPattern(pat);
    store.toggleSequencerActive();
  }

  function loadArp(preset: typeof ARP_PRESETS[0]) {
    store.setArpConfig(preset.config);
    store.setArpNotes(preset.notes);
    store.toggleArpActive();
  }

  function loadMIDI(preset: typeof MIDI_TRACK_PRESETS[0]) {
    store.addMidiTrack({ name: preset.track.name, length: preset.track.length, color: preset.track.color });
  }

  function loadScale(preset: typeof SCALE_PRESETS[0]) {
    const scale = buildScale(preset.root, preset.scaleType, preset.octave);
    // Update first track frequency to root of scale
    if (store.tracks[0]) {
      store.updateTrack(store.tracks[0].id, { frequency: scale.frequencies[0] ?? 440 });
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border-subtle bg-surface-secondary shrink-0">
        <Library className="w-3.5 h-3.5 text-text-tertiary" />
        <span className="text-xs font-semibold text-text-primary">Preset Browser</span>
      </div>

      {/* Category tabs */}
      <div className="flex gap-0.5 px-2 py-1.5 border-b border-border-subtle overflow-x-auto shrink-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded text-[9px] font-medium transition-colors whitespace-nowrap shrink-0",
              activeCategory === cat.id
                ? "bg-derivative-position-500/15 text-derivative-position-500"
                : "text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary",
            )}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Preset list */}
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {activeCategory === "Songs" && SONG_PRESETS.map((p) => (
          <PresetCard key={p.name} name={p.name} category={p.category} desc={p.description}
            onClick={() => loadSong(p)} />
        ))}
        {activeCategory === "Instruments" && INSTRUMENT_PRESETS.map((p) => (
          <PresetCard key={p.name} name={p.name} category={p.category} desc={p.description}
            onClick={() => loadInstrument(p)} />
        ))}
        {activeCategory === "Configs" && CONFIG_PRESETS.map((p) => (
          <PresetCard key={p.name} name={p.name} category={p.category} desc={p.description}
            onClick={() => loadConfig(p)} />
        ))}
        {activeCategory === "Sequences" && SEQ_PRESETS.map((p) => (
          <PresetCard key={p.name} name={p.name} category={p.category} desc={p.description}
            onClick={() => loadSequence(p)} />
        ))}
        {activeCategory === "MIDI" && MIDI_TRACK_PRESETS.map((p) => (
          <PresetCard key={p.name} name={p.name} category={p.category} desc={p.description}
            onClick={() => loadMIDI(p)} />
        ))}
        {activeCategory === "Scales" && SCALE_PRESETS.map((p) => (
          <PresetCard key={p.name} name={p.name} category={p.category} desc={p.description}
            onClick={() => loadScale(p)} />
        ))}
        {activeCategory === "Arps" && ARP_PRESETS.map((p) => (
          <PresetCard key={p.name} name={p.name} category={p.category} desc={p.description}
            onClick={() => loadArp(p)} />
        ))}
      </div>
    </div>
  );
}

function PresetCard({ name, category, desc, onClick }: {
  name: string; category: string; desc: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-2.5 py-2 rounded-lg bg-surface-primary hover:bg-surface-secondary border border-border-subtle transition-colors group"
    >
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-medium text-text-primary group-hover:text-derivative-position-500 transition-colors">{name}</div>
        <span className="text-[8px] text-text-tertiary px-1.5 py-0.5 rounded bg-surface-tertiary">{category}</span>
      </div>
      <div className="text-[9px] text-text-tertiary mt-0.5">{desc}</div>
    </button>
  );
}
