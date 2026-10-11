"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Controlled when `value` is defined, uncontrolled otherwise. */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (value: T) => void] {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const set = useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChangeRef.current?.(next);
    },
    [controlled],
  );
  return [current, set];
}

const noopSubscribe = () => () => {};

/** True after hydration — safe gate for portals and browser-only APIs. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * Keeps an element mounted for `exitMs` after `open` turns false so an exit
 * animation can run. Returns whether to render.
 */
export function usePresence(open: boolean, exitMs: number): boolean {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  useEffect(() => {
    if (open || !mounted) return;
    const timer = window.setTimeout(() => setMounted(false), exitMs);
    return () => window.clearTimeout(timer);
  }, [open, mounted, exitMs]);
  return mounted;
}

/** Locks page scroll while `active`. */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [active]);
}

/** Calls `handler` on Escape while `active`. */
export function useEscape(active: boolean, handler: () => void): void {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") ref.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);
}

/** Scroll position of the window, or of a scroll container when given. */
export function useScrollY(container?: React.RefObject<HTMLElement | null>): number {
  return useSyncExternalStore(
    (notify) => {
      const target: HTMLElement | Window = container?.current ?? window;
      target.addEventListener("scroll", notify, { passive: true });
      return () => target.removeEventListener("scroll", notify);
    },
    () => (container?.current ? container.current.scrollTop : window.scrollY),
    () => 0,
  );
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
