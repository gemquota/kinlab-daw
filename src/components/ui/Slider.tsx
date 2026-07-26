import { forwardRef, useCallback, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import type { DerivativeOrder } from "@/types";

export interface SliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange" | "min" | "max" | "step"
  > {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  derivativeOrder?: DerivativeOrder;
  logarithmic?: boolean;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  label?: string;
}

function derivativeColor(order?: DerivativeOrder): string {
  if (order === undefined) return "var(--text-accent)";
  return `var(--color-derivative-${order})`;
}

function linearToLog(value: number, min: number, max: number): number {
  if (min <= 0) min = 0.001;
  const logMin = Math.log(min);
  const logMax = Math.log(max);
  const t = (value - min) / (max - min);
  return Math.exp(logMin + t * (logMax - logMin));
}

function logToLinear(value: number, min: number, max: number): number {
  if (min <= 0) min = 0.001;
  const logMin = Math.log(min);
  const logMax = Math.log(max);
  const t = (Math.log(value) - logMin) / (logMax - logMin);
  return min + t * (max - min);
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  function Slider(
    {
      min = 0,
      max = 100,
      step = 1,
      value: controlledValue,
      defaultValue = min,
      onChange,
      derivativeOrder,
      logarithmic = false,
      showValue = true,
      formatValue,
      label,
      className,
      disabled,
      id: idProp,
      ...props
    },
    ref,
  ) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = controlledValue ?? internalValue;

    const id = idProp ?? (label ? `slider-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = Number.parseFloat(e.target.value);
        const resolved = logarithmic
          ? linearToLog(raw, min, max)
          : raw;
        const clamped = Math.round(resolved / step) * step;
        setInternalValue(clamped);
        onChange?.(clamped);
      },
      [logarithmic, min, max, step, onChange],
    );

    const displayValue = formatValue?.(value) ?? String(Math.round(value * 100) / 100);
    const accentColor = derivativeColor(derivativeOrder);

    const percent = logarithmic
      ? logToLinear(value, min, max)
      : ((value - min) / (max - min)) * 100;

    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {(label !== undefined || showValue) && (
          <div className="flex items-center justify-between">
            {label !== undefined && (
              <label
                htmlFor={id}
                className="text-xs font-medium text-[var(--text-secondary)]"
              >
                {label}
              </label>
            )}
            {showValue && (
              <span
                className="text-xs font-mono tabular-nums text-[var(--text-tertiary)]"
                aria-live="polite"
              >
                {displayValue}
              </span>
            )}
          </div>
        )}
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="range"
            id={id}
            min={min}
            max={max}
            step={logarithmic ? "any" : step}
            value={logarithmic ? logToLinear(value, min, max) : value}
            onChange={handleChange}
            disabled={disabled}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={displayValue}
            className={cn(
              "w-full h-1.5 rounded-full appearance-none cursor-pointer",
              "bg-[var(--surface-tertiary)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-accent)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "[&::-webkit-slider-thumb]:appearance-none",
              "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4",
              "[&::-webkit-slider-thumb]:rounded-full",
              "[&::-webkit-slider-thumb]:border-2",
              "[&::-webkit-slider-thumb]:border-white",
              "[&::-webkit-slider-thumb]:shadow-md",
              "[&::-webkit-slider-thumb]:cursor-pointer",
              "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4",
              "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2",
              "[&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md",
              "[&::-moz-range-thumb]:cursor-pointer",
            )}
            style={{
              background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${percent}%, var(--surface-tertiary) ${percent}%, var(--surface-tertiary) 100%)`,
              ["--tw-thumb-bg" as string]: accentColor,
            }}
            {...props}
          />
        </div>
      </div>
    );
  },
);
