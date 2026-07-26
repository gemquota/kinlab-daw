import { useState, useCallback } from "react";
import { useVisualStore } from "@/store/visual.store";
import { type VisualMode, type ParamDef, VISUAL_MODES, getModeInfo } from "@/visual/visualParams";
import { cn } from "@/lib/cn";

interface VisualDrawerProps {
  visualMode: VisualMode;
  onModeChange: (m: VisualMode) => void;
}

export function VisualDrawer({ visualMode, onModeChange }: VisualDrawerProps) {
  const [expanded, setExpanded] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const modeInfo = getModeInfo(visualMode);

  const toggleGroup = useCallback((label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
      <div className="pointer-events-auto">
        {/* Drawer handle / mode tabs */}
        <div className="flex items-center gap-2 px-4 pb-2">
          {/* Toggle button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-[10px] font-medium tracking-wider transition-all duration-300 border",
              expanded
                ? "bg-white/10 text-white/80 border-white/[0.1]"
                : "bg-black/30 text-white/30 border-white/[0.04] hover:text-white/50",
            )}
          >
            {expanded ? "▼ VISUALS" : "▲ VISUALS"}
          </button>

          {/* Quick mode pills */}
          <div className="flex gap-1 overflow-x-auto">
            {VISUAL_MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => onModeChange(m.id)}
                className={cn(
                  "px-2 py-1 rounded-lg text-[9px] font-medium transition-all duration-200 whitespace-nowrap shrink-0",
                  visualMode === m.id
                    ? "bg-white/10 text-white"
                    : "text-white/25 hover:text-white/50 hover:bg-white/[0.04]",
                )}
              >
                <span className="mr-0.5">{m.icon}</span>
                <span className="hidden sm:inline">{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Expanded parameter panel */}
        {expanded && (
          <div className="mx-4 mb-4 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-black/60 overflow-hidden animate-slide-in-up">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-sm">{modeInfo.icon}</span>
                <span className="text-[11px] text-white/70 font-medium">{modeInfo.name}</span>
                <span className="text-[9px] text-white/25">{modeInfo.desc}</span>
              </div>
              <ResetButton />
            </div>

            {/* Parameter groups */}
            <div className="max-h-[40vh] overflow-y-auto p-3 space-y-1">
              {modeInfo.paramGroups.map((group) => (
                <ParamGroup
                  key={group.label}
                  group={group}
                  isOpen={openGroups[group.label] !== false}
                  onToggle={() => toggleGroup(group.label)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Parameter Group (collapsible) ── */
function ParamGroup({
  group, isOpen, onToggle,
}: {
  group: { label: string; params: ParamDef[] };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-medium text-white/40 hover:text-white/60 transition-colors"
      >
        <span className="tracking-wider uppercase">{group.label}</span>
        <span className="text-white/20 text-[8px]">{isOpen ? "▼" : "▶"}</span>
      </button>
      {isOpen && (
        <div className="px-3 pb-3 space-y-2.5">
          {group.params.map((param) => (
            <ParamSlider key={param.key} param={param} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Individual Parameter Slider ── */
function ParamSlider({ param }: { param: ParamDef }) {
  const value = useVisualStore((s: any) => s.params[param.key] as number);
  const setParam = useVisualStore((s: any) => s.setParam);

  const displayValue = param.format
    ? param.format(value)
    : param.step >= 1
      ? value.toFixed(0)
      : value.toFixed(2);

  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[9px] text-white/30">{param.label}</span>
        <span className="text-[9px] text-white/50 font-mono w-10 text-right">{displayValue}</span>
      </div>
      <input
        type="range"
        min={param.min}
        max={param.max}
        step={param.step}
        value={value}
        onChange={(e) => setParam(param.key, parseFloat(e.target.value) as never)}
        className="w-full h-[2px] rounded-full appearance-none bg-white/[0.08] cursor-pointer"
      />
    </div>
  );
}

/* ── Reset Button ── */
function ResetButton() {
  const resetParams = useVisualStore((s: any) => s.resetParams);
  return (
    <button
      onClick={resetParams}
      className="text-[9px] text-white/20 hover:text-white/50 transition-colors px-2 py-0.5 rounded hover:bg-white/[0.04]"
    >
      Reset
    </button>
  );
}
