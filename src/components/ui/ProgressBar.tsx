import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import type { DerivativeOrder } from "@/types";
import { DERIVATIVE_COLORS } from "@/lib/theme/tokens";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  derivativeOrder?: DerivativeOrder;
  indeterminate?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number, max: number) => string;
}

const sizeStyles: Record<string, string> = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2.5",
};

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  function ProgressBar(
    {
      value = 0,
      max = 100,
      derivativeOrder,
      indeterminate = false,
      size = "md",
      label,
      showValue = false,
      formatValue,
      className,
      ...props
    },
    ref,
  ) {
    const clampedValue = Math.min(Math.max(value, 0), max);
    const percent = (clampedValue / max) * 100;

    const derivativeColor =
      derivativeOrder !== undefined
        ? DERIVATIVE_COLORS[derivativeOrder]?.hex
        : undefined;

    const accentColor = derivativeColor ?? "var(--text-accent)";

    const displayText =
      formatValue?.(clampedValue, max) ??
      `${Math.round(percent)}%`;

    const progressId =
      label !== undefined
        ? `progress-${label.toLowerCase().replace(/\s+/g, "-")}`
        : undefined;

    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {(label !== undefined || showValue) && (
          <div className="flex items-center justify-between">
            {label !== undefined && (
              <span
                id={progressId}
                className="text-xs font-medium text-[var(--text-secondary)]"
              >
                {label}
              </span>
            )}
            {showValue && (
              <span
                className="text-xs font-mono tabular-nums text-[var(--text-tertiary)]"
                aria-live="polite"
              >
                {displayText}
              </span>
            )}
          </div>
        )}
        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : clampedValue}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
          aria-labelledby={progressId}
          className={cn(
            "w-full rounded-full overflow-hidden",
            "bg-[var(--surface-tertiary)]",
            sizeStyles[size],
          )}
          {...props}
        >
          {indeterminate ? (
            <div
              className={cn(
                "h-full rounded-full",
                "animate-[indeterminate_1.5s_ease-in-out_infinite]",
              )}
              style={{
                backgroundColor: accentColor,
                width: "40%",
              }}
            />
          ) : (
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${percent}%`,
                backgroundColor: accentColor,
              }}
            />
          )}
        </div>
      </div>
    );
  },
);
