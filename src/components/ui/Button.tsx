import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-[var(--text-accent)] text-[var(--text-inverse)]",
    "hover:opacity-90 active:opacity-80",
    "shadow-sm",
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
    "shadow-sm",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-7 px-2.5 text-xs gap-1.5 rounded",
  md: "h-9 px-3.5 text-sm gap-2 rounded-md",
  lg: "h-11 px-5 text-base gap-2.5 rounded-lg",
};

const iconOnlySizeStyles: Record<ButtonSize, string> = {
  sm: "h-7 w-7 rounded",
  md: "h-9 w-9 rounded-md",
  lg: "h-11 w-11 rounded-lg",
};

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
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
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) {
    const isIconOnly = icon !== undefined && !children;
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        className={cn(
          "inline-flex items-center justify-center font-medium",
          "transition-all duration-150 ease-in-out",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-accent)]",
          "disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          isIconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <LoadingSpinner className="shrink-0" />
        ) : (
          icon !== undefined && iconPosition === "left" && (
            <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
          )
        )}
        {children && <span>{children}</span>}
        {!loading && icon !== undefined && iconPosition === "right" && (
          <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
        )}
      </button>
    );
  },
);
