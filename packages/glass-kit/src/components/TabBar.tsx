"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Glass } from "./Glass";
import { cn } from "../lib/cn";
import { useControllableState } from "../lib/hooks";
import { useSlidingIndicator } from "../lib/useSlidingIndicator";

export interface TabItem<T extends string> {
  value: T;
  label: string;
  icon: ReactNode;
  /** Number or short text shown as a red badge. */
  badge?: ReactNode;
}

export interface TabBarProps<T extends string> {
  items: TabItem<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  /**
   * iOS 27 "Prominent Tab": a separate trailing capsule (search by default
   * on iOS, but any action can take the slot).
   */
  prominent?: { icon: ReactNode; label: string; onPress?: () => void; active?: boolean };
  /** Pin to the bottom of the viewport, centred. */
  floating?: boolean;
  /** Collapse labels while the page scrolls down; expand on scroll up. */
  minimizeOnScroll?: boolean;
  minimized?: boolean;
  className?: string;
}

export function TabBar<T extends string>({
  items,
  value,
  defaultValue,
  onValueChange,
  prominent,
  floating = false,
  minimizeOnScroll = false,
  minimized: minimizedProp,
  className,
}: TabBarProps<T>) {
  const [current, setCurrent] = useControllableState(
    value,
    defaultValue ?? items[0]?.value,
    onValueChange,
  );
  const groupRef = useRef<HTMLDivElement>(null);
  const activeIndex = Math.max(0, items.findIndex((i) => i.value === current));
  const { indicatorRef, indicatorStyle, pressed, handlers } = useSlidingIndicator(
    groupRef,
    activeIndex,
    (i) => setCurrent(items[i].value),
  );

  const [scrollMinimized, setScrollMinimized] = useState(false);
  useEffect(() => {
    if (!minimizeOnScroll) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setScrollMinimized(y > last && y > 80);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [minimizeOnScroll]);
  const minimized = minimizedProp ?? scrollMinimized;

  return (
    <nav
      className={cn("lg-tabbar", className)}
      data-floating={floating ? "" : undefined}
      data-minimized={minimized ? "" : undefined}
    >
      <Glass radius="capsule" className="lg-tabbar__group">
        <div
          ref={groupRef}
          role="tablist"
          className="lg-tabbar__items"
          data-pressed={pressed ? "" : undefined}
          {...handlers}
        >
          <Glass
            as="span"
            ref={indicatorRef}
            size="small"
            aria-hidden
            className="lg-tabbar__indicator"
            style={indicatorStyle}
          />
          {items.map((item, i) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              data-indicator-item
              data-active={i === activeIndex ? "" : undefined}
              className="lg-tabbar__item"
              onClick={() => setCurrent(item.value)}
            >
              <span className="lg-tabbar__icon">
                {item.icon}
                {item.badge != null && <span className="lg-tabbar__badge">{item.badge}</span>}
              </span>
              <span className="lg-tabbar__label">{item.label}</span>
            </button>
          ))}
        </div>
      </Glass>
      {prominent && (
        <Glass
          as="button"
          type="button"
          radius="capsule"
          interactive
          aria-label={prominent.label}
          data-active={prominent.active ? "" : undefined}
          className="lg-tabbar__prominent"
          onClick={prominent.onPress}
        >
          {prominent.icon}
        </Glass>
      )}
    </nav>
  );
}
