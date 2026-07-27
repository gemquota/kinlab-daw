import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Moon, Sun } from "lucide-react";
import { useThemeStore, useWaveformStore } from "@/store";
import { cn } from "@/lib/cn";

interface Command {
  id: string;
  label: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { toggleTheme, resolvedTheme } = useThemeStore();
  const togglePlayback = useWaveformStore((s) => s.togglePlayback);
  const isPlaying = useWaveformStore((s) => s.isPlaying);
  const setCurrentTime = useWaveformStore((s) => s.setCurrentTime);

  const commands: Command[] = useMemo(
    () => [
      { id: "ws-waveform", label: "Go to Waveform", category: "Navigation", icon: ArrowRight, action: () => navigate("/waveform"), shortcut: "1" },
      { id: "theme-toggle", label: `Switch to ${resolvedTheme === "dark" ? "Light" : "Dark"} Mode`, category: "Appearance", icon: resolvedTheme === "dark" ? Sun : Moon, action: toggleTheme, shortcut: "Mod+Shift+T" },
      { id: "play-pause", label: isPlaying ? "Pause Simulation" : "Play Simulation", category: "Simulation", icon: ArrowRight, action: togglePlayback, shortcut: "Space" },
      { id: "reset-time", label: "Reset Time to Zero", category: "Simulation", icon: ArrowRight, action: () => setCurrentTime(0) },
    ],
    [navigate, toggleTheme, resolvedTheme, isPlaying, togglePlayback, setCurrentTime],
  );

  const filtered = useMemo(() => {
    if (!query) return commands;
    const lower = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(lower) ||
        cmd.category.toLowerCase().includes(lower),
    );
  }, [commands, query]);

  const executeCommand = useCallback(
    (cmd: Command) => {
      cmd.action();
      setIsOpen(false);
      setQuery("");
      setSelectedIndex(0);
    },
    [],
  );

  // Global keyboard listener
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent): void {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setQuery("");
        setSelectedIndex(0);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent): void {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        executeCommand(filtered[selectedIndex]);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, filtered, selectedIndex, executeCommand]);

  if (!isOpen) return null;

  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    (acc[cmd.category] ??= []).push(cmd);
    return acc;
  }, {});

  return (
    <div
      className="fixed inset-0 z-notification flex items-start justify-center pt-[15vh] bg-surface-overlay/50"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-surface-elevated rounded-xl border border-border-subtle shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
          <Search className="w-4 h-4 text-text-tertiary shrink-0" />
          <input
            aria-label="Search commands"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Search commands..."
            className="flex-1 bg-transparent text-body text-text-primary placeholder:text-text-tertiary focus:outline-none"
          />
          <kbd className="text-micro text-text-tertiary bg-surface-tertiary px-1.5 py-0.5 rounded border border-border-subtle">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {Object.entries(grouped).map(([category, cmds]) => (
            <div key={category}>
              <p className="px-4 py-1.5 text-micro font-semibold text-text-tertiary uppercase tracking-wider">
                {category}
              </p>
              {cmds.map((cmd) => {
                const globalIdx = filtered.indexOf(cmd);
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => executeCommand(cmd)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2 text-body text-text-primary hover:bg-surface-tertiary transition-colors",
                      globalIdx === selectedIndex && "bg-surface-tertiary",
                    )}
                  >
                    <Icon className="w-4 h-4 text-text-tertiary" />
                    <span className="flex-1 text-left">{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className="text-micro text-text-tertiary bg-surface-secondary px-1.5 py-0.5 rounded border border-border-subtle">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="px-4 py-8 text-center text-body text-text-tertiary">
              No commands found for "{query}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
