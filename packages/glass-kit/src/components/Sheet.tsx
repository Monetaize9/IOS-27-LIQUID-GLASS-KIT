"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Glass } from "./Glass";
import { Portal } from "../lib/Portal";
import { cn } from "../lib/cn";
import { useEscape, usePresence, useScrollLock } from "../lib/hooks";

export type SheetDetent = "medium" | "large";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Heights the sheet can rest at, smallest first. */
  detents?: SheetDetent[];
  title?: ReactNode;
  /** Buttons in the header, e.g. Cancel / Done. */
  leading?: ReactNode;
  trailing?: ReactNode;
  children?: ReactNode;
  className?: string;
}

const EXIT_MS = 320;
const FRACTION: Record<SheetDetent, number> = { medium: 0.52, large: 0.93 };

function subscribeResize(notify: () => void) {
  window.addEventListener("resize", notify);
  return () => window.removeEventListener("resize", notify);
}

/**
 * Bottom sheet with detents. Drag the grabber/header to move between heights;
 * pull down past the smallest detent (or flick) to dismiss.
 */
export function Sheet({
  open,
  onOpenChange,
  detents = ["medium", "large"],
  title,
  leading,
  trailing,
  children,
  className,
}: SheetProps) {
  const mounted = usePresence(open, EXIT_MS);
  const vh = useSyncExternalStore(subscribeResize, () => window.innerHeight, () => 800);
  const sorted = [...detents].sort((a, b) => FRACTION[a] - FRACTION[b]);
  const [detent, setDetent] = useState<SheetDetent>(sorted[0]);
  const [dragY, setDragY] = useState<number | null>(null);
  const drag = useRef<{ startY: number; t: number } | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const titleId = useId();

  const fullHeight = vh * FRACTION[sorted[sorted.length - 1]];
  const offsetFor = (d: SheetDetent) => fullHeight - vh * FRACTION[d];
  const restOffset = offsetFor(detent);

  useScrollLock(open);
  useEscape(open, () => onOpenChange(false));

  // Reset to the smallest detent each time the sheet opens.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setDetent(sorted[0]);
  }

  useEffect(() => {
    if (open) panelRef.current?.focus({ preventScroll: true });
  }, [open]);

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest("button, a, input")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startY: e.clientY, t: performance.now() };
    setDragY(0);
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!drag.current) return;
    let dy = e.clientY - drag.current.startY;
    // Rubber-band when pulling above the tallest detent.
    if (restOffset + dy < 0) dy = -restOffset + (restOffset + dy) * 0.25;
    setDragY(dy);
  };

  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dy = e.clientY - d.startY;
    const velocity = dy / Math.max(1, performance.now() - d.t); // px/ms
    const position = restOffset + dy;
    setDragY(null);

    const smallest = offsetFor(sorted[0]);
    if (position > smallest + 120 || (velocity > 0.9 && detent === sorted[0])) {
      onOpenChange(false);
      return;
    }
    // Project the release a little along the flick, then pick the nearest detent.
    const projected = position + velocity * 180;
    let best = sorted[0];
    for (const candidate of sorted) {
      if (Math.abs(offsetFor(candidate) - projected) < Math.abs(offsetFor(best) - projected)) best = candidate;
    }
    setDetent(best);
  };

  if (!mounted) return null;

  const style = {
    height: fullHeight,
    "--_y": `${restOffset + (dragY ?? 0)}px`,
    // Keeps the end of the content reachable while the sheet rests low.
    "--_rest": `${restOffset}px`,
  } as CSSProperties;

  return (
    <Portal>
      <div className="lg-sheet-root" data-state={open ? "open" : "closed"}>
        <div className="lg-backdrop" onClick={() => onOpenChange(false)} />
        <Glass
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          tabIndex={-1}
          radius={38}
          className={cn("lg-sheet", className)}
          data-dragging={dragY !== null ? "" : undefined}
          data-detent={detent}
          style={style}
        >
          <header
            className="lg-sheet__header"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <span className="lg-sheet__grabber" aria-hidden />
            <div className="lg-sheet__bar">
              <div className="lg-sheet__slot">{leading}</div>
              {title && (
                <h2 id={titleId} className="lg-sheet__title">
                  {title}
                </h2>
              )}
              <div className="lg-sheet__slot lg-sheet__slot--end">{trailing}</div>
            </div>
          </header>
          <div className="lg-sheet__content">{children}</div>
        </Glass>
      </div>
    </Portal>
  );
}
