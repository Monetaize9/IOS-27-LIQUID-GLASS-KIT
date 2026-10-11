"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { Glass } from "./Glass";
import { cn } from "../lib/cn";
import { clamp, useControllableState } from "../lib/hooks";

export interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Track colour when on. Defaults to system green. */
  tint?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/** Track 64×28, thumb 39×24 (iOS 26/27 metrics). */
const TRAVEL = 64 - 39 - 4;

export function Toggle({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  tint,
  id,
  className,
  ...aria
}: ToggleProps) {
  const [on, setOn] = useControllableState(checked, defaultChecked, onCheckedChange);
  const [pressed, setPressed] = useState(false);
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const drag = useRef<{ startX: number; base: number; moved: boolean } | null>(null);
  const dragged = useRef(false);

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (disabled || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, base: on ? TRAVEL : 0, moved: false };
    setPressed(true);
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) < 3) return;
    d.moved = true;
    setDragOffset(clamp(d.base + dx, 0, TRAVEL));
  };

  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    setPressed(false);
    if (d?.moved && dragOffset !== null) {
      dragged.current = true;
      const next = dragOffset > TRAVEL / 2;
      if (next !== on) setOn(next);
    }
    setDragOffset(null);
  };

  const x = dragOffset ?? (on ? TRAVEL : 0);

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      className={cn("lg-toggle", className)}
      data-checked={on ? "" : undefined}
      data-pressed={pressed ? "" : undefined}
      data-dragging={dragOffset !== null ? "" : undefined}
      style={{ "--_x": `${x}px`, ...(tint ? { "--lg-toggle-on": tint } : null) } as CSSProperties}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={() => {
        if (dragged.current) {
          dragged.current = false;
          return;
        }
        setOn(!on);
      }}
      {...aria}
    >
      <span className="lg-toggle__track" />
      <Glass as="span" size="small" className="lg-toggle__thumb" />
    </button>
  );
}
