import { Menu, Sun, Moon, PanelRightOpen, HelpCircle } from "lucide-react";
import { useThemeStore } from "@/store";
import { useHelpStore } from "@/components/common/HelpModal";

interface TopToolbarProps {
  onMenuToggle: () => void;
  onInspectorToggle: () => void;
}

export function TopToolbar({ onMenuToggle, onInspectorToggle }: TopToolbarProps) {
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const openHelp = useHelpStore((s) => s.openHelp);

  return (
    <header
      role="toolbar"
      aria-label="Application toolbar"
      className="h-[var(--toolbar-height)] bg-surface-secondary border-b border-border-subtle flex items-center px-3 gap-2 z-50 shrink-0"
    >
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-tertiary md:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop logo */}
      <div className="hidden md:flex items-center gap-2 mr-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-derivative-position-500 to-derivative-snap-500 flex items-center justify-center text-white font-bold text-xs">
          K
        </div>
      </div>

      {/* Workspace title */}
      <h1 className="text-sm font-semibold text-text-primary truncate">
        Waveform
      </h1>

      <div className="flex-1" />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
        aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      >
        {resolvedTheme === "dark" ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </button>

      {/* Inspector toggle */}
      <button
        onClick={onInspectorToggle}
        className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
        aria-label="Toggle inspector panel"
      >
        <PanelRightOpen className="w-4 h-4" />
      </button>

      {/* Help button */}
      <button
        onClick={openHelp}
        className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
        aria-label="Open help and guided tour"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
    </header>
  );
}
