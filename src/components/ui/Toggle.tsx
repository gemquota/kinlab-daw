import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ToggleSize = "sm" | "md" | "lg";

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  description?: string;
  size?: ToggleSize;
}

const trackSizes: Record<ToggleSize, string> = {
  sm: "w-8 h-4",
  md: "w-10 h-5",
  lg: "w-12 h-6",
};

const thumbSizes: Record<ToggleSize, string> = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

function peerCheckedTranslate(size: ToggleSize): string {
  const map: Record<ToggleSize, string> = {
    sm: "peer-checked:translate-x-4",
    md: "peer-checked:translate-x-5",
    lg: "peer-checked:translate-x-6",
  };
  return map[size];
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  function Toggle(
    { label, description, size = "md", className, disabled, id: idProp, ...props },
    ref,
  ) {
    const id = idProp ?? (label !== undefined ? `toggle-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
      <label
        className={cn(
          "inline-flex items-center gap-3 cursor-pointer select-none",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        htmlFor={id}
      >
        <span className="relative inline-flex shrink-0">
          <input
            ref={ref}
            type="checkbox"
            role="switch"
            aria-checked={props.checked ?? props.defaultChecked ?? false}
            id={id}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <span
            aria-hidden="true"
            className={cn(
              "rounded-full transition-colors duration-200",
              "bg-[var(--surface-tertiary)] border border-[var(--border-default)]",
              "peer-checked:bg-[var(--text-accent)] peer-checked:border-[var(--text-accent)]",
              "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--text-accent)]",
              "peer-disabled:opacity-50",
              trackSizes[size],
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-1/2 left-0.5 -translate-y-1/2 rounded-full",
              "bg-white shadow-sm transition-transform duration-200",
              thumbSizes[size],
              peerCheckedTranslate(size),
            )}
          />
        </span>
        {(label !== undefined || description !== undefined) && (
          <span className="flex flex-col gap-0.5">
            {label !== undefined && (
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {label}
              </span>
            )}
            {description !== undefined && (
              <span className="text-xs text-[var(--text-tertiary)]">
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    );
  },
);
