"use client";

import { Glass } from "./Glass";
import { cn } from "../lib/cn";

export interface PageControlProps {
  count: number;
  index: number;
  onIndexChange?: (index: number) => void;
  /** Sit the dots on a glass capsule (for use over images). */
  glass?: boolean;
  className?: string;
}

/** iOS page dots — the current page stretches into a capsule. */
export function PageControl({ count, index, onIndexChange, glass = false, className }: PageControlProps) {
  const dots = Array.from({ length: count }, (_, i) => (
    <button
      key={i}
      type="button"
      aria-label={`Page ${i + 1} of ${count}`}
      aria-current={i === index ? "page" : undefined}
      className="lg-page-control__dot"
      data-active={i === index ? "" : undefined}
      onClick={() => onIndexChange?.(i)}
    />
  ));

  return glass ? (
    <Glass size="small" radius="capsule" className={cn("lg-page-control", className)} data-glass="">
      {dots}
    </Glass>
  ) : (
    <div className={cn("lg-page-control", className)}>{dots}</div>
  );
}
