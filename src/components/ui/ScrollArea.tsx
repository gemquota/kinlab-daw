import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal" | "both";
  maxHeight?: string | number;
  maxWidth?: string | number;
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollArea(
    {
      orientation = "vertical",
      maxHeight,
      maxWidth,
      className,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role="region"
        aria-orientation={orientation === "both" ? undefined : orientation}
        tabIndex={0}
        className={cn(
          "overflow-auto",
          "scrollbar-thin",
          "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-thumb]:bg-[var(--border-default)]",
          "[&::-webkit-scrollbar-thumb]:hover:bg-[var(--border-strong)]",
          "dark:[&::-webkit-scrollbar-thumb]:bg-[var(--border-strong)]",
          "[&::-moz-scrollbar-thumb]:rounded-full",
          "[&::-moz-scrollbar-thumb]:bg-[var(--border-default)]",
          "[&::-moz-scrollbar-thumb]:hover:bg-[var(--border-strong)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-accent)]",
          className,
        )}
        style={{
          maxHeight: maxHeight,
          maxWidth: maxWidth,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
