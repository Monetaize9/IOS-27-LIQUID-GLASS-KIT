import type { CSSProperties } from "react";
import { cn } from "../lib/cn";

export interface ProgressProps {
  /** 0–1. Omit for an indeterminate bar. */
  value?: number;
  tint?: string;
  className?: string;
  "aria-label"?: string;
}

/** 4pt determinate / indeterminate bar (iOS 27 metrics). */
export function Progress({ value, tint, className, "aria-label": ariaLabel = "Progress" }: ProgressProps) {
  const determinate = value !== undefined;
  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={determinate ? Math.round(value * 100) : undefined}
      className={cn("lg-progress", className)}
      data-indeterminate={determinate ? undefined : ""}
      style={{ "--_p": determinate ? Math.min(1, Math.max(0, value)) : 0.3, ...(tint ? { "--lg-progress-fill": tint } : null) } as CSSProperties}
    >
      <span className="lg-progress__fill" />
    </div>
  );
}

export interface SpinnerProps {
  size?: number;
  className?: string;
  "aria-label"?: string;
}

/** iOS activity indicator — eight fading spokes. */
export function Spinner({ size = 20, className, "aria-label": ariaLabel = "Loading" }: SpinnerProps) {
  return (
    <span
      role="progressbar"
      aria-label={ariaLabel}
      className={cn("lg-spinner", className)}
      style={{ width: size, height: size }}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} style={{ "--_i": i } as CSSProperties} />
      ))}
    </span>
  );
}
