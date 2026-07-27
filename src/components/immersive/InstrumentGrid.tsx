import { useState, useCallback, useRef, useEffect } from "react";
import { resumeAudio } from "@/audio/audioEngine";
import { triggerDrum, type DrumType } from "@/audio/drumSynth";
import { usePadGridStore, type PadConfig } from "@/store/padGrid.store";
import { cn } from "@/lib/cn";

const DRUM_TYPES: { type: DrumType; label: string }[] = [
  { type: "kick", label: "Kick" },
  { type: "hat", label: "Hat" },
  { type: "hatOpen", label: "Hat Open" },
  { type: "clap", label: "Clap" },
  { type: "bass", label: "Bass" },
  { type: "perc", label: "Perc" },
  { type: "tom", label: "Tom" },
  { type: "crash", label: "Crash" },
];

const PAD_COLORS = [
  "#3b82f6", "#22c55e", "#f97316", "#eab308",
  "#ef4444", "#a855f7", "#06b6d4", "#10b981",
  "#ec4899", "#8b5cf6", "#14b8a6", "#f43f5e",
];

export function InstrumentGrid() {
  const { pads, movePad, setPadVolume, togglePadMute, editingPadId, setEditingPad } = usePadGridStore();
  const [activePads, setActivePads] = useState<Set<string>>(new Set());
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const extraLongPressTimer = useRef<number | null>(null);
  const isDragging = useRef(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  const handlePadDown = useCallback((pad: PadConfig, e: React.PointerEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    isDragging.current = false;
    
    // Long press to start drag (300ms)
    longPressTimer.current = window.setTimeout(() => {
      if (!isDragging.current) {
        isDragging.current = true;
        setDragIndex(pads.findIndex((p) => p.id === pad.id));
      }
    }, 300);
    
    // Extra long press to edit (800ms)
    extraLongPressTimer.current = window.setTimeout(() => {
      if (isDragging.current) {
        setEditingPad(pad.id);
      }
    }, 800);
  }, [pads, setEditingPad]);

  const handlePadMove = useCallback((_pad: PadConfig, index: number, e: React.PointerEvent) => {
    if (!dragStartPos.current) return;
    
    const dx = Math.abs(e.clientX - dragStartPos.current.x);
    const dy = Math.abs(e.clientY - dragStartPos.current.y);
    
    // If moved more than 10px, start drag reorder
    if ((dx > 10 || dy > 10) && !isDragging.current) {
      isDragging.current = true;
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      setDragIndex(index);
    }
    
    if (isDragging.current) {
      // Find which pad we're over
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const padElement = element?.closest("[data-pad-index]");
      if (padElement) {
        const overIdx = parseInt(padElement.getAttribute("data-pad-index") || "0");
        setDragOverIndex(overIdx);
      }
    }
  }, []);

  const handlePadUp = useCallback((_pad: PadConfig, _index: number, _e: React.PointerEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (extraLongPressTimer.current) {
      clearTimeout(extraLongPressTimer.current);
      extraLongPressTimer.current = null;
    }
    
    if (isDragging.current && dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      movePad(dragIndex, dragOverIndex);
    } else if (!isDragging.current) {
      // Trigger sound
      resumeAudio();
      triggerDrum(_pad.type);
      setActivePads((prev) => new Set(prev).add(_pad.id));
      setTimeout(() => {
        setActivePads((prev) => {
          const next = new Set(prev);
          next.delete(_pad.id);
          return next;
        });
      }, 150);
    }
    
    setDragIndex(null);
    setDragOverIndex(null);
    dragStartPos.current = null;
    isDragging.current = false;
  }, [dragIndex, dragOverIndex, movePad]);

  // Keyboard bindings
  useEffect(() => {
    const keyMap: Record<string, PadConfig> = {};
    pads.forEach((pad) => {
      if (pad.keyBinding) {
        keyMap[pad.keyBinding.toLowerCase()] = pad;
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const pad = keyMap[e.key.toLowerCase()];
      if (pad) {
        resumeAudio();
        triggerDrum(pad.type);
        setActivePads((prev) => new Set(prev).add(pad.id));
        setTimeout(() => {
          setActivePads((prev) => {
            const next = new Set(prev);
            next.delete(pad.id);
            return next;
          });
        }, 150);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pads]);

  const editingPad = editingPadId ? pads.find((p) => p.id === editingPadId) : null;

  return (
    <div className="w-[480px] px-5 py-4 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/70">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] text-white/50 font-medium tracking-widest uppercase">Instrument Pads</span>
        <span className="text-[9px] text-white/30 font-mono">Tap · Drag to reorder · Hold to edit</span>
      </div>
      
      {/* Pad Grid - 4 columns, bigger pads */}
      <div className="grid grid-cols-4 gap-3">
        {pads.map((pad, index) => {
          const isActive = activePads.has(pad.id);
          const isDragTarget = dragOverIndex === index;
          const isDragSource = dragIndex === index;
          
          return (
            <div
              key={pad.id}
              data-pad-index={index}
              className={cn(
                "relative flex flex-col gap-1.5",
                isDragTarget && "ring-2 ring-white/30 rounded-2xl"
              )}
            >
              <button
                onPointerDown={(e) => handlePadDown(pad, e)}
                onPointerMove={(e) => handlePadMove(pad, index, e)}
                onPointerUp={(e) => handlePadUp(pad, index, e)}
                onPointerCancel={() => {
                  setDragIndex(null);
                  setDragOverIndex(null);
                  dragStartPos.current = null;
                  isDragging.current = false;
                }}
                className={cn(
                  "w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-75",
                  "border shadow-lg select-none touch-none",
                  isActive 
                    ? "scale-95 brightness-150 border-white/30" 
                    : "border-white/[0.08] hover:bg-white/[0.05]",
                  isDragSource && "opacity-50 scale-95",
                  pad.muted && "opacity-30"
                )}
                style={{
                  backgroundColor: isActive 
                    ? pad.color 
                    : `${pad.color}15`,
                  boxShadow: isActive 
                    ? `0 0 30px ${pad.color}90, inset 0 0 15px ${pad.color}50`
                    : `0 4px 20px ${pad.color}15`,
                }}
                aria-label={`Trigger ${pad.label}`}
              >
                <span className="text-[12px] font-bold text-white/90 leading-none">{pad.label}</span>
                {pad.keyBinding && (
                  <span className="text-[10px] text-white/40 font-mono mt-1.5 px-2 py-0.5 rounded-md bg-black/30">{pad.keyBinding}</span>
                )}
              </button>
              
              {/* Volume/Mute controls */}
              <div className="flex items-center gap-1.5 px-1">
                <button
                  onClick={() => togglePadMute(pad.id)}
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold transition-colors shrink-0",
                    pad.muted ? "bg-red-500/80 text-white" : "bg-white/10 text-white/40 hover:bg-white/20"
                  )}
                  aria-label={`Mute ${pad.label}`}
                >
                  M
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={pad.volume}
                  onChange={(e) => setPadVolume(pad.id, parseFloat(e.target.value))}
                  className="flex-1 h-1.5 appearance-none bg-white/10 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white/70"
                  aria-label={`${pad.label} volume`}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Keyboard hint */}
      <div className="mt-4 text-center">
        <span className="text-[9px] text-white/30 font-mono">
          Keys: {pads.filter((p) => p.keyBinding).map((p) => p.keyBinding).join(" ")}
        </span>
      </div>

      {/* Edit Modal */}
      {editingPad && (
        <PadEditModal pad={editingPad} onClose={() => setEditingPad(null)} />
      )}
    </div>
  );
}

function PadEditModal({ pad, onClose }: { pad: PadConfig; onClose: () => void }) {
  const { updatePad, removePad } = usePadGridStore();
  const [label, setLabel] = useState(pad.label);
  const [color, setColor] = useState(pad.color);
  const [keyBinding, setKeyBinding] = useState(pad.keyBinding || "");
  const [type, setType] = useState(pad.type);

  const handleSave = useCallback(() => {
    updatePad(pad.id, { label, color, keyBinding: keyBinding || undefined, type });
    onClose();
  }, [pad.id, label, color, keyBinding, type, updatePad, onClose]);

  const handleDelete = useCallback(() => {
    removePad(pad.id);
    onClose();
  }, [pad.id, removePad, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-[340px] px-6 py-5 rounded-2xl bg-black/80 border border-white/[0.1] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <span className="text-[12px] text-white/60 font-medium tracking-widest uppercase">Edit Pad</span>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 text-xl">×</button>
        </div>

        {/* Label */}
        <div className="mb-4">
          <label className="text-[10px] text-white/40 font-medium tracking-wider block mb-1.5">LABEL</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={8}
            className="w-full px-3 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/80 text-sm focus:outline-none focus:border-white/20"
          />
        </div>

        {/* Key Binding */}
        <div className="mb-4">
          <label className="text-[10px] text-white/40 font-medium tracking-wider block mb-1.5">KEY BINDING</label>
          <input
            type="text"
            value={keyBinding}
            onChange={(e) => setKeyBinding(e.target.value.slice(-1))}
            maxLength={1}
            className="w-full px-3 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/80 text-sm focus:outline-none focus:border-white/20 uppercase text-center"
          />
        </div>

        {/* Drum Type */}
        <div className="mb-4">
          <label className="text-[10px] text-white/40 font-medium tracking-wider block mb-1.5">SOUND</label>
          <div className="grid grid-cols-4 gap-1.5">
            {DRUM_TYPES.map((dt) => (
              <button
                key={dt.type}
                onClick={() => setType(dt.type)}
                className={cn(
                  "px-2 py-2 rounded-lg text-[10px] font-medium transition-all",
                  type === dt.type
                    ? "bg-white/15 text-white"
                    : "bg-white/[0.03] text-white/40 hover:bg-white/[0.06]"
                )}
              >
                {dt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="mb-5">
          <label className="text-[10px] text-white/40 font-medium tracking-wider block mb-1.5">COLOR</label>
          <div className="flex flex-wrap gap-2">
            {PAD_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  "w-7 h-7 rounded-full transition-all",
                  color === c ? "ring-2 ring-white/50 scale-110" : "hover:scale-110"
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-500/20 text-red-400 text-[11px] font-medium hover:bg-red-500/30 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 text-white/70 text-[11px] font-medium hover:bg-white/15 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
