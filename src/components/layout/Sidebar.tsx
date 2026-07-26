import { useLocation, useNavigate } from "react-router-dom";
import { Waves, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "waveform", label: "Waveform", icon: Waves, path: "/waveform" },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  function handleNav(path: string) {
    navigate(path);
    onClose?.();
  }

  return (
    <nav
      aria-label="Main navigation"
      className="h-full w-64 bg-surface-secondary border-r border-border-subtle flex flex-col py-3"
    >
      {/* Header */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-derivative-position-500 to-derivative-snap-500 flex items-center justify-center text-white font-bold text-sm">
            K
          </div>
          <span className="font-bold text-lg text-text-primary">KinLab</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary md:hidden"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav items */}
      <div className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === "waveform"
            ? location.pathname === "/" || location.pathname.startsWith(item.path)
            : location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.path)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-derivative-position-500/10 text-derivative-position-500"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary",
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 pt-3 border-t border-border-subtle">
        <p className="text-xs text-text-tertiary">v0.1.0</p>
      </div>
    </nav>
  );
}
