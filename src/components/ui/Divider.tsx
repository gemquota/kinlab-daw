import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation;
  label?: string;
  decorative?: boolean;
}

export function Divider({
  orientation = "horizontal",
  label,
  decorative = true,
  className,
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        aria-hidden={decorative || label === undefined ? "true" : undefined}
        className={cn(
          "w-px self-stretch bg-[var(--border-subtle)]",
          className,
        )}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-label={label}
        className={cn(
          "flex items-center gap-3",
          className,
        )}
        {...props}
      >
        <div className="flex-1 h-px bg-[var(--border-subtle)]" />
        <span className="text-xs text-[var(--text-tertiary)] select-none shrink-0">
          {label}
        </span>
        <div className="flex-1 h-px bg-[var(--border-subtle)]" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-hidden={decorative ? "true" : undefined}
      className={cn(
        "h-px bg-[var(--border-subtle)]",
        className,
      )}
      {...props}
    />
  );
}
