import { useWaveformStore } from "@/store";

export function StatusBar() {
  const { currentTime, isPlaying, speed } = useWaveformStore();

  return (
    <footer
      role="contentinfo"
      aria-label="Status bar"
      className="h-[var(--statusbar-height)] bg-surface-secondary border-t border-border-subtle flex items-center px-3 text-xs text-text-tertiary gap-3 shrink-0 overflow-x-auto"
    >
      <StatusItem label="t" value={currentTime.toFixed(2)} />
      <StatusItem
        label="state"
        value={isPlaying ? "▶ Playing" : "⏸ Paused"}
      />
      <span className="hidden sm:inline">
        <StatusItem label="speed" value={`${speed}×`} />
      </span>
      <div className="flex-1" />
      <span className="hidden sm:inline text-text-tertiary">KinLab v0.1.0</span>
    </footer>
  );
}

function StatusItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <span className="flex items-center gap-1 whitespace-nowrap">
      <span className="text-text-tertiary">{label}:</span>
      {color && (
        <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: color }} />
      )}
      <span className="font-mono text-text-secondary">{value}</span>
    </span>
  );
}
