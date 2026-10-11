"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
} from "react";
import { prefersReducedMotion } from "../engine/capabilities";
import { clamp } from "./hooks";

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Positions a selection indicator under the active item of a group, slides it
 * on a spring with a liquid squash, and lets the user grab it and drag it to
 * another item — the iOS 26/27 segmented control and tab bar behaviour.
 *
 * Items are the container's descendants matching `[data-indicator-item]`.
 */
export function useSlidingIndicator(
  containerRef: RefObject<HTMLElement | null>,
  activeIndex: number,
  onSelect: (index: number) => void,
) {
  const indicatorRef = useRef<HTMLElement | null>(null);
  const [box, setBox] = useState<Box | null>(null);
  const [dragX, setDragX] = useState<number | null>(null);
  const [pressed, setPressed] = useState(false);
  const firstRun = useRef(true);
  const drag = useRef<{ startX: number; startLeft: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const items = useCallback(
    () =>
      Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>("[data-indicator-item]") ?? [],
      ),
    [containerRef],
  );

  const measure = useCallback(() => {
    const el = items()[activeIndex];
    if (!el) return setBox(null);
    setBox({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
  }, [activeIndex, items]);

  useLayoutEffect(() => {
    measure();
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (!prefersReducedMotion()) {
      indicatorRef.current?.animate(
        [{ scale: "1 1" }, { scale: "1.16 0.88", offset: 0.35 }, { scale: "1 1" }],
        { duration: 520, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
      );
    }
  }, [measure]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    items().forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [containerRef, items, measure]);

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (!box || e.button !== 0) return;
    const rect = containerRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < box.x || x > box.x + box.w) return;
    drag.current = { startX: e.clientX, startLeft: box.x, moved: false };
    setPressed(true);
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || !box) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (!d.moved) return;
    const list = items();
    const last = list[list.length - 1];
    const max = last ? last.offsetLeft + last.offsetWidth - box.w : box.x;
    const min = list[0]?.offsetLeft ?? 0;
    setDragX(clamp(d.startLeft + dx, min, max));
  };

  const endDrag = () => {
    const d = drag.current;
    drag.current = null;
    setPressed(false);
    if (d?.moved && box && dragX !== null) {
      const center = dragX + box.w / 2;
      let best = activeIndex;
      let bestDist = Infinity;
      items().forEach((item, i) => {
        const dist = Math.abs(item.offsetLeft + item.offsetWidth / 2 - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      suppressClick.current = true;
      if (best !== activeIndex) onSelect(best);
    }
    setDragX(null);
  };

  const onClickCapture = (e: MouseEvent<HTMLElement>) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const indicatorStyle: CSSProperties = box
    ? {
        width: box.w,
        height: box.h,
        transform: `translate(${dragX ?? box.x}px, ${box.y}px)`,
        transition: dragX !== null ? "none" : undefined,
      }
    : { opacity: 0 };

  return {
    indicatorRef,
    indicatorStyle,
    pressed,
    dragging: dragX !== null,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onClickCapture,
    },
  };
}
