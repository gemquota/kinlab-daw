import { useState } from "react";
import { useDAWStore } from "@/store/daw.store";
import { ALL_GENERATORS, type GeneratedNote } from "@/music/procedural";
import { midiToName } from "@/music/scales";
import { cn } from "@/lib/cn";
import { Dices, RefreshCw } from "lucide-react";

export function ProceduralPanel() {
  const {
    proceduralGenId, setProceduralGen,
    proceduralSeed, setProceduralSeed,
    proceduralDensity, setProceduralDensity,
    proceduralComplexity, setProceduralComplexity,
    bpm, 
  } = useDAWStore();

  const [generatedNotes, setGeneratedNotes] = useState<GeneratedNote[]>([]);
  const [lastGenName, setLastGenName] = useState("");
  const [lastGenDesc, setLastGenDesc] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const gen = ALL_GENERATORS.find((g) => g.id === proceduralGenId) ?? ALL_GENERATORS[0]!;

  function generate() {
    const result = gen.generate({
      bpm,
      bars: 4,
      rootNote: "C",
      octave: 4,
      scaleType: "Major",
      density: proceduralDensity,
      complexity: proceduralComplexity,
      seed: proceduralSeed,
    });
    setGeneratedNotes(result.notes);
    setLastGenName(result.name);
    setLastGenDesc(result.desc);
    setShowPreview(true);
  }

  function randomizeSeed() {
    setProceduralSeed(Math.floor(Math.random() * 10000));
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle bg-surface-secondary shrink-0">
        <div className="flex items-center gap-2">
          <Dices className="w-3.5 h-3.5 text-text-tertiary" />
          <span className="text-xs font-semibold text-text-primary">Procedural Generator</span>
        </div>
        <button
          onClick={generate}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-derivative-position-500/20 text-derivative-position-500 hover:bg-derivative-position-500/30 transition-colors"
        >
          <Dices className="w-3 h-3" />
          Generate
        </button>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-3">
        {/* Algorithm selector */}
        <div>
          <label className="text-[9px] text-text-tertiary uppercase tracking-wider block mb-1.5">Algorithm</label>
          <div className="grid grid-cols-2 gap-1">
            {ALL_GENERATORS.map((g) => (
              <button
                key={g.id}
                onClick={() => setProceduralGen(g.id as any)}
                className={cn(
                  "text-left px-2 py-1.5 rounded-md text-[10px] transition-colors",
                  g.id === proceduralGenId
                    ? "bg-derivative-position-500/15 text-derivative-position-500"
                    : "bg-surface-tertiary text-text-secondary hover:text-text-primary",
                )}
              >
                <div className="font-medium">{g.name}</div>
                <div className="text-[8px] text-text-tertiary">{g.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Parameters */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-text-tertiary">Seed</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-text-secondary font-mono">{proceduralSeed}</span>
              <button onClick={randomizeSeed} className="p-0.5 rounded hover:bg-surface-tertiary text-text-tertiary">
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>
          <input
            type="range" min={0} max={10000} step={1}
            value={proceduralSeed}
            onChange={(e) => setProceduralSeed(parseInt(e.target.value))}
            className="w-full h-1 rounded-full appearance-none bg-surface-tertiary accent-derivative-position-500 cursor-pointer"
          />

          <ParamSlider label="Density" value={proceduralDensity} onChange={setProceduralDensity} />
          <ParamSlider label="Complexity" value={proceduralComplexity} onChange={setProceduralComplexity} />
        </div>

        {/* Generated preview */}
        {showPreview && generatedNotes.length > 0 && (
          <div className="border border-border-subtle rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-surface-secondary">
              <div>
                <div className="text-[10px] font-medium text-text-primary">{lastGenName}</div>
                <div className="text-[8px] text-text-tertiary">{lastGenDesc}</div>
              </div>
              <span className="text-[9px] text-text-tertiary">{generatedNotes.length} notes</span>
            </div>

            {/* Mini piano roll preview */}
            <div className="p-2">
              <MiniPianoRoll notes={generatedNotes} />
            </div>

            {/* Note list */}
            <div className="max-h-32 overflow-auto px-2.5 pb-2 space-y-0.5">
              {generatedNotes.slice(0, 30).map((n, i) => (
                <div key={i} className="flex items-center gap-2 text-[9px] font-mono">
                  <span className="text-text-tertiary w-8">{n.time.toFixed(1)}b</span>
                  <span className="text-text-primary w-8">{midiToName(n.pitch)}</span>
                  <span className="text-text-tertiary w-8">{n.duration.toFixed(2)}</span>
                  <div className="flex-1 h-1 bg-surface-tertiary rounded-full overflow-hidden">
                    <div className="h-full bg-derivative-position-500 rounded-full" style={{ width: `${n.velocity * 100}%` }} />
                  </div>
                </div>
              ))}
              {generatedNotes.length > 30 && (
                <div className="text-[8px] text-text-tertiary text-center">...and {generatedNotes.length - 30} more</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ParamSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[9px] text-text-tertiary">{label}</span>
        <span className="text-[9px] text-text-secondary font-mono">{(value * 100).toFixed(0)}%</span>
      </div>
      <input
        type="range" min={0} max={1} step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 rounded-full appearance-none bg-surface-tertiary accent-derivative-position-500 cursor-pointer"
      />
    </div>
  );
}

function MiniPianoRoll({ notes }: { notes: GeneratedNote[] }) {
  const maxTime = Math.max(...notes.map((n) => n.time + n.duration), 4);
  const pitches = [...new Set(notes.map((n) => n.pitch))].sort((a, b) => a - b);
  const minPitch = pitches[0] ?? 60;
  const maxPitch = pitches[pitches.length - 1] ?? 72;
  const pitchRange = Math.max(maxPitch - minPitch + 1, 12);
  const W = 300;
  const H = 80;

  return (
    <svg width={W} height={H} className="w-full" viewBox={`0 0 ${W} ${H}`}>
      {notes.map((n, i) => {
        const x = (n.time / maxTime) * W;
        const y = H - ((n.pitch - minPitch) / pitchRange) * H;
        const w = Math.max(2, (n.duration / maxTime) * W);
        return (
          <rect
            key={i}
            x={x} y={y - 3} width={w} height={6}
            rx={1}
            fill={`rgba(139,92,246,${0.4 + n.velocity * 0.6})`}
          />
        );
      })}
    </svg>
  );
}
