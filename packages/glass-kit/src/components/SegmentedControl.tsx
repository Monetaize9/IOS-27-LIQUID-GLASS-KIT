"use client";

import { useRef, type ReactNode } from "react";
import { Glass } from "./Glass";
import { cn } from "../lib/cn";
import { useControllableState } from "../lib/hooks";
import { useSlidingIndicator } from "../lib/useSlidingIndicator";

export interface SegmentOption<T extends string> {
  value: T;
  label?: ReactNode;
  icon?: ReactNode;
  "aria-label"?: string;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  size?: "small" | "medium" | "large";
  /** Stretch segments to fill the container width. */
  block?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  defaultValue,
  onValueChange,
  size = "medium",
  block = false,
  className,
  "aria-label": ariaLabel,
}: SegmentedControlProps<T>) {
  const [current, setCurrent] = useControllableState(
    value,
    defaultValue ?? options[0]?.value,
    onValueChange,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const activeIndex = Math.max(0, options.findIndex((o) => o.value === current));
  const { indicatorRef, indicatorStyle, pressed, handlers } = useSlidingIndicator(
    containerRef,
    activeIndex,
    (i) => setCurrent(options[i].value),
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (activeIndex + delta + options.length) % options.length;
    setCurrent(options[next].value);
    containerRef.current?.querySelectorAll<HTMLElement>("[data-indicator-item]")[next]?.focus();
  };

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("lg-segmented", className)}
      data-size={size}
      data-block={block ? "" : undefined}
      data-pressed={pressed ? "" : undefined}
      onKeyDown={onKeyDown}
      {...handlers}
    >
      <Glass
        as="span"
        ref={indicatorRef}
        size="small"
        aria-hidden
        className="lg-segmented__indicator"
        style={indicatorStyle}
      />
      {options.map((o, i) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={i === activeIndex}
          aria-label={o["aria-label"]}
          tabIndex={i === activeIndex ? 0 : -1}
          data-indicator-item
          data-active={i === activeIndex ? "" : undefined}
          className="lg-segmented__item"
          onClick={() => setCurrent(o.value)}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}
