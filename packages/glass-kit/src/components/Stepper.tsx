"use client";

import { Glass } from "./Glass";
import { MinusIcon, PlusIcon } from "../lib/icons";
import { cn } from "../lib/cn";
import { clamp, useControllableState } from "../lib/hooks";

export interface StepperProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  className?: string;
  "aria-label"?: string;
}

export function Stepper({
  value,
  defaultValue = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  onValueChange,
  className,
  "aria-label": ariaLabel = "Value",
}: StepperProps) {
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange);
  const change = (delta: number) => setCurrent(clamp(current + delta, min, max));

  return (
    <Glass
      radius="capsule"
      role="group"
      aria-label={ariaLabel}
      className={cn("lg-stepper", className)}
    >
      <button
        type="button"
        className="lg-stepper__button"
        aria-label={`Decrease ${ariaLabel}`}
        disabled={current <= min}
        onClick={() => change(-step)}
      >
        <MinusIcon />
      </button>
      <span className="lg-stepper__divider" aria-hidden />
      <button
        type="button"
        className="lg-stepper__button"
        aria-label={`Increase ${ariaLabel}`}
        disabled={current >= max}
        onClick={() => change(step)}
      >
        <PlusIcon />
      </button>
    </Glass>
  );
}
