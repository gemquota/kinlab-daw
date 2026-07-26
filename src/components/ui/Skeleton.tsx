import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SkeletonVariant = "text" | "circular" | "rectangular";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: "h-4 rounded",
  circular: "rounded-full",
  rectangular: "rounded-md",
};

export function Skeleton({
  variant = "text",
  width,
  height,
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden",
        "bg-[var(--surface-tertiary)]",
        variantStyles[variant],
        "[&::after]:absolute [&::after]:inset-0",
        "[&::after]:bg-gradient-to-r [&::after]:from-transparent",
        "[&::after]:via-white/5 [&::after]:to-transparent",
        "[&::after]:animate-[shimmer_1.5s_infinite]",
        className,
      )}
      style={{
        width,
        height,
      }}
      {...props}
    />
  );
}
