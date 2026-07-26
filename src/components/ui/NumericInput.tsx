import { forwardRef, useCallback, useState, useRef, type KeyboardEvent } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface NumericInputProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  id?: string;
  placeholder?: string;
}

export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  function NumericInput(
    {
      value: controlledValue,
      defaultValue = 0,
      onChange,
      min = -Infinity,
      max = Infinity,
      step = 1,
      label,
      unit,
      disabled = false,
      readOnly = false,
      className,
      id: idProp,
      placeholder,
    },
    ref,
  ) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [textValue, setTextValue] = useState(
      controlledValue !== undefined ? String(controlledValue) : String(defaultValue),
    );
    const inputRef = useRef<HTMLInputElement>(null);

    const currentValue = controlledValue ?? internalValue;

    const id =
      idProp ??
      (label
        ? `num-${label.toLowerCase().replace(/\s+/g, "-")}`
        : undefined);

    const clamp = useCallback(
      (v: number) => Math.min(max, Math.max(min, v)),
      [min, max],
    );

    const commitValue = useCallback(
      (raw: string) => {
        const parsed = Number.parseFloat(raw);
        if (Number.isNaN(parsed)) {
          setTextValue(String(controlledValue ?? internalValue));
          return;
        }
        const clamped = clamp(parsed);
        setInternalValue(clamped);
        setTextValue(String(clamped));
        onChange?.(clamped);
      },
      [controlledValue, internalValue, clamp, onChange],
    );

    const increment = useCallback(() => {
      if (readOnly) return;
      const next = clamp(currentValue + step);
      setInternalValue(next);
      setTextValue(String(next));
      onChange?.(next);
    }, [readOnly, currentValue, step, clamp, onChange]);

    const decrement = useCallback(() => {
      if (readOnly) return;
      const next = clamp(currentValue - step);
      setInternalValue(next);
      setTextValue(String(next));
      onChange?.(next);
    }, [readOnly, currentValue, step, clamp, onChange]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (readOnly) return;
        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            increment();
            break;
          case "ArrowDown":
            e.preventDefault();
            decrement();
            break;
        }
      },
      [readOnly, increment, decrement],
    );

    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {label !== undefined && (
          <label
            htmlFor={id}
            className="text-xs font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "inline-flex items-center",
            "rounded-md border border-[var(--border-default)]",
            "bg-[var(--surface-secondary)]",
            "focus-within:border-[var(--text-accent)] focus-within:ring-1 focus-within:ring-[var(--text-accent)]",
            "transition-colors duration-150",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <input
            ref={(node) => {
              (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            type="text"
            inputMode="decimal"
            id={id}
            value={textValue}
            onChange={(e) => {
              setTextValue(e.target.value);
              const parsed = Number.parseFloat(e.target.value);
              if (!Number.isNaN(parsed)) {
                const clamped = clamp(parsed);
                setInternalValue(clamped);
                onChange?.(clamped);
              }
            }}
            onBlur={(e) => commitValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            aria-label={label ?? "Numeric value"}
            aria-valuemin={min}
            aria-valuemax={max === Infinity ? undefined : max}
            aria-valuenow={currentValue}
            aria-valuetext={unit ? `${currentValue} ${unit}` : String(currentValue)}
            className={cn(
              "flex-1 min-w-0 px-2.5 py-1.5 text-sm font-mono tabular-nums",
              "bg-transparent text-[var(--text-primary)]",
              "outline-none",
              "placeholder:text-[var(--text-tertiary)]",
            )}
          />
          {unit !== undefined && (
            <span className="pr-1 text-xs text-[var(--text-tertiary)] select-none">
              {unit}
            </span>
          )}
          <div className="flex flex-col border-l border-[var(--border-default)]">
            <button
              type="button"
              onClick={increment}
              disabled={disabled || readOnly}
              aria-label="Increment"
              className={cn(
                "flex items-center justify-center px-1",
                "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
                "hover:bg-[var(--surface-tertiary)]",
                "transition-colors duration-100",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "rounded-tr-md",
              )}
            >
              <ChevronUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={decrement}
              disabled={disabled || readOnly}
              aria-label="Decrement"
              className={cn(
                "flex items-center justify-center px-1",
                "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
                "hover:bg-[var(--surface-tertiary)]",
                "transition-colors duration-100",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "rounded-br-md border-t border-[var(--border-default)]",
              )}
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    );
  },
);
