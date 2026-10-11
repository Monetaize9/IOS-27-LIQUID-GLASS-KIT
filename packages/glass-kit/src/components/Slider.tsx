"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { Glass } from "./Glass";
import { cn } from "../lib/cn";
import { clamp, useControllableState } from "../lib/hooks";

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  /** Snap increment. Omit for continuous. */
  step?: number;
  onValueChange?: (value: number) => void;
  /** Fires once when the user releases the thumb. */
  onValueCommit?: (value: number) => void;
  /** Icon or label before the track (e.g. a quiet speaker). */
  leading?: ReactNode;
  /** Icon or label after the track (e.g. a loud speaker). */
  trailing?: ReactNode;
  /** Fill colour. Defaults to accent. */
  tint?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-valuetext"?: string;
}

const THUMB_W = 38;

export function Slider({
  value,
  defaultValue = 0.5,
  min = 0,
  max = 1,
  step,
  onValueChange,
  onValueCommit,
  leading,
  trailing,
  tint,
  disabled,
  className,
  ...aria
}: SliderProps) {
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange);
  const [dragging, setDragging] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);
  const latest = useRef(current);

  const snap = (v: number) => {
    const s = step ? Math.round((v - min) / step) * step + min : v;
    return clamp(Number(s.toFixed(6)), min, max);
  };

  const update = (v: number) => {
    const next = snap(v);
    latest.current = next;
    if (next !== current) setCurrent(next);
  };

  const fromPointer = (clientX: number) => {
    const rect = controlRef.current!.getBoundingClientRect();
    const p = clamp((clientX - rect.left - THUMB_W / 2) / (rect.width - THUMB_W), 0, 1);
    update(min + p * (max - min));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    fromPointer(e.clientX);
  };

  const end = () => {
    if (!dragging) return;
    setDragging(false);
    onValueCommit?.(latest.current);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const unit = step ?? (max - min) / 100;
    const map: Record<string, number> = {
      ArrowRight: unit,
      ArrowUp: unit,
      ArrowLeft: -unit,
      ArrowDown: -unit,
      PageUp: unit * 10,
      PageDown: -unit * 10,
    };
    if (e.key === "Home") update(min);
    else if (e.key === "End") update(max);
    else if (e.key in map) update(current + map[e.key]);
    else return;
    e.preventDefault();
    onValueCommit?.(latest.current);
  };

  const p = max === min ? 0 : (current - min) / (max - min);

  return (
    <div
      className={cn("lg-slider", className)}
      data-dragging={dragging ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      style={{ "--_p": p, ...(tint ? { "--lg-slider-fill": tint } : null) } as CSSProperties}
    >
      {leading && <span className="lg-slider__adornment">{leading}</span>}
      <div
        ref={controlRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={current}
        aria-disabled={disabled || undefined}
        className="lg-slider__control"
        onPointerDown={onPointerDown}
        onPointerMove={(e) => dragging && fromPointer(e.clientX)}
        onPointerUp={end}
        onPointerCancel={end}
        onKeyDown={onKeyDown}
        {...aria}
      >
        <span className="lg-slider__track">
          <span className="lg-slider__fill" />
        </span>
        <Glass as="span" size="small" className="lg-slider__thumb" />
      </div>
      {trailing && <span className="lg-slider__adornment">{trailing}</span>}
    </div>
  );
}
