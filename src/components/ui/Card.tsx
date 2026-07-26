import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardElevation = "none" | "sm" | "md" | "lg" | "xl";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: CardElevation;
  glass?: boolean;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const elevationStyles: Record<CardElevation, string> = {
  none: "",
  sm: "shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
  md: "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_2px_4px_-2px_rgba(0,0,0,0.05)]",
  lg: "shadow-[0_10px_15px_-3px_rgba(0,0,0,0.08),0_4px_6px_-4px_rgba(0,0,0,0.04)]",
  xl: "shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.04)]",
};

const paddingStyles: Record<string, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  function Card(
    {
      elevation = "sm",
      glass = false,
      hover = false,
      padding = "md",
      className,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-[var(--border-subtle)]",
          glass
            ? "bg-[var(--glass-bg)] backdrop-blur-xl border-[var(--glass-border)]"
            : "bg-[var(--surface-elevated)]",
          elevationStyles[elevation],
          paddingStyles[padding],
          hover &&
            "transition-all duration-200 hover:border-[var(--border-default)] hover:shadow-md",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

/* ─── Card sub-components ─── */

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1 pb-3", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ className, children, ...props }, ref) {
    return (
      <h3
        ref={ref}
        className={cn(
          "text-base font-semibold text-[var(--text-primary)]",
          className,
        )}
        {...props}
      >
        {children}
      </h3>
    );
  },
);

export interface CardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(function CardDescription({ className, children, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cn(
        "text-sm text-[var(--text-tertiary)]",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
});

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  function CardContent({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={cn(className)} {...props}>
        {children}
      </div>
    );
  },
);

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
