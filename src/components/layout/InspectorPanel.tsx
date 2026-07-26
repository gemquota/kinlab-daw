import { getDerivative } from "@/data/derivatives.data";
import { formatNumber } from "@/utils/format";
import { X } from "lucide-react";

interface InspectorPanelProps {
  onClose?: () => void;
}

export function InspectorPanel({ onClose }: InspectorPanelProps) {
  const derivative = getDerivative(0);

  return (
    <aside
      aria-label="Inspector panel"
      className="h-full w-72 bg-surface-secondary border-l border-border-subtle overflow-y-auto"
    >
      <div className="p-4 space-y-5">
        {/* Close button (mobile) */}
        <div className="flex items-center justify-between md:hidden">
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
            Inspector
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-text-tertiary hover:text-text-primary"
            aria-label="Close inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Derivative */}
        <section>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
            Derivative Reference
          </h3>
          <div className="bg-surface-tertiary rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: derivative.visualization.hexColor }}
              />
              <span className="text-sm font-semibold text-text-primary">
                {derivative.name}
              </span>
              <span className="text-xs text-text-tertiary ml-auto">
                Order {derivative.order}
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              {derivative.physical.interpretation}
            </p>
          </div>
        </section>

        {/* Notation */}
        <section>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
            Notation
          </h3>
          <div className="space-y-1 text-xs">
            <NotationRow label="Symbol" value={derivative.math.notation.symbol} />
            <NotationRow label="Leibniz" value={derivative.math.notation.leibniz} />
            <NotationRow label="Newton" value={derivative.math.notation.newton} />
            <NotationRow label="Lagrange" value={derivative.math.notation.lagrange} />
          </div>
        </section>

        {/* Units */}
        <section>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
            Physical Properties
          </h3>
          <div className="space-y-1 text-xs">
            <NotationRow label="SI Unit" value={derivative.physical.siUnit.label} />
            <NotationRow label="Dimension" value={derivative.physical.dimension.display} />
            <NotationRow label="Taylor" value={derivative.math.taylorExpression} />
            <NotationRow label="Factorial" value={formatNumber(derivative.math.factorialScale, 0)} />
          </div>
        </section>
      </div>
    </aside>
  );
}

function NotationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-border-subtle last:border-0">
      <span className="text-text-tertiary">{label}</span>
      <span className="font-mono text-text-primary truncate ml-2">{value}</span>
    </div>
  );
}
