import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Tooltip } from "./Tooltip";

type IconButtonShape = "circular" | "square";
type IconButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  tooltip?: string;
  tooltipPlacement?: "top" | "bottom" | "left" | "right";
  shape?: IconButtonShape;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
}

const variantStyles: Record<IconButtonVariant, string> = {
  primary: [
    "bg-[var(--text-accent)] text-[var(--text-inverse)]",
    "hover:opacity-90 active:opacity-80",
  ].join(" "),
  secondary: [
    "bg-[var(--surface-secondary)] text-[var(--text-primary)]",
    "border border-[var(--border-default)]",
    "hover:bg-[var(--surface-tertiary)] active:bg-[var(--border-subtle)]",
  ].join(" "),
  ghost: [
    "bg-transparent text-[var(--text-secondary)]",
    "hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]",
    "active:bg-[var(--surface-tertiary)]",
  ].join(" "),
  danger: [
    "bg-[var(--feedback-error)] text-white",
    "hover:opacity-90 active:opacity-80",
  ].join(" "),
};

const sizeStyles: Record<IconButtonSize, string> = {
  sm: "h-7 w-7 rounded",
  md: "h-9 w-9 rounded-md",
  lg: "h-11 w-11 rounded-lg",
};

const shapeStyles: Record<IconButtonShape, string> = {
  circular: "!rounded-full",
  square: "",
};

const iconSizes: Record<IconButtonSize, string> = {
  sm: "[&>svg]:h-3.5 [&>svg]:w-3.5",
  md: "[&>svg]:h-4 [&>svg]:w-4",
  lg: "[&>svg]:h-5 [&>svg]:w-5",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      icon,
      tooltip,
      tooltipPlacement = "top",
      shape = "circular",
      variant = "ghost",
      size = "md",
      loading = false,
      className,
      disabled,
      ...props
    },
    ref,
  ) {
    const isDisabled = disabled || loading;

    const button = (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        aria-label={tooltip}
        className={cn(
          "inline-flex items-center justify-center",
          "transition-all duration-150 ease-in-out",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-accent)]",
          "disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          shapeStyles[shape],
          iconSizes[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          icon
        )}
      </button>
    );

    if (tooltip) {
      return (
        <Tooltip content={tooltip} placement={tooltipPlacement}>
          {button}
        </Tooltip>
      );
    }

    return button;
  },
);
