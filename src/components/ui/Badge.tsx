import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";
import type { DerivativeOrder } from "@/types";
import { DERIVATIVE_COLORS } from "@/lib/theme/tokens";

type BadgeVariant = "filled" | "outlined" | "soft";
type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  derivativeOrder?: DerivativeOrder;
  dot?: boolean;
  /** Status shortcut: color override without derivative context */
  status?: "success" | "warning" | "error" | "info" | "neutral";
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  success: { bg: "var(--feedback-success)", text: "white", border: "var(--feedback-success)" },
  warning: { bg: "var(--feedback-warning)", text: "var(--text-primary)", border: "var(--feedback-warning)" },
  error: { bg: "var(--feedback-error)", text: "white", border: "var(--feedback-error)" },
  info: { bg: "var(--feedback-info)", text: "white", border: "var(--feedback-info)" },
  neutral: { bg: "var(--surface-tertiary)", text: "var(--text-secondary)", border: "var(--border-default)" },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2 py-0.5 text-xs",
  lg: "px-2.5 py-1 text-sm",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(
    {
      variant = "soft",
      size = "md",
      derivativeOrder,
      dot = false,
      status,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const derivativeColor =
      derivativeOrder !== undefined
        ? DERIVATIVE_COLORS[derivativeOrder]
        : undefined;

    const accentHex = derivativeColor?.hex ?? "var(--text-accent)";

    const sc = status !== undefined ? statusColors[status] : undefined;

    let style: React.CSSProperties = {};

    if (sc !== undefined) {
      if (variant === "filled") {
        style = { backgroundColor: sc.bg, color: sc.text };
      } else if (variant === "outlined") {
        style = { color: sc.bg, borderColor: sc.border };
      } else {
        style = { backgroundColor: `${sc.bg}22`, color: sc.bg };
      }
    } else if (derivativeColor !== undefined) {
      if (variant === "filled") {
        style = { backgroundColor: accentHex, color: "white" };
      } else if (variant === "outlined") {
        style = { color: accentHex, borderColor: accentHex };
      } else {
        style = { backgroundColor: `${accentHex}22`, color: accentHex };
      }
    }

    const variantClasses =
      variant === "outlined"
        ? "border"
        : "";

    return (
      <span
        ref={ref}
        role="status"
        className={cn(
          "inline-flex items-center gap-1 font-medium rounded-full whitespace-nowrap",
          "transition-colors duration-150",
          sizeStyles[size],
          variantClasses,
          status === undefined && derivativeOrder === undefined &&
            (variant === "filled"
              ? "bg-[var(--text-accent)] text-[var(--text-inverse)]"
              : variant === "outlined"
                ? "border border-[var(--border-default)] text-[var(--text-secondary)]"
                : "bg-[var(--text-accent)]/10 text-[var(--text-accent)]"),
          className,
        )}
        style={style}
        {...props}
      >
        {dot && (
          <span
            aria-hidden="true"
            className={cn("h-1.5 w-1.5 rounded-full", variant === "outlined" ? "border" : "")}
            style={{ backgroundColor: variant === "outlined" ? accentHex : "currentColor" }}
          />
        )}
        {children}
      </span>
    );
  },
);
