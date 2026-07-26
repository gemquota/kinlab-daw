import { useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const PATH_LABELS: Record<string, string> = {
  waveform: "Waveform",
};

export function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-caption text-text-tertiary">
      <span className="text-text-secondary">KinLab</span>
      {segments.map((segment, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="w-3 h-3" />
          <span className={i === segments.length - 1 ? "text-text-primary font-medium" : ""}>
            {PATH_LABELS[segment] ?? segment}
          </span>
        </span>
      ))}
    </nav>
  );
}
