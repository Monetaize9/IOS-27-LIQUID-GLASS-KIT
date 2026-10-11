"use client";

import type { ReactNode, RefObject } from "react";
import { cn } from "../lib/cn";
import { useScrollY } from "../lib/hooks";

export interface ScrollEdgeProps {
  edge?: "top" | "bottom";
  /** soft = progressive blur fade · hard = iOS 27 uniform bar. */
  variant?: "soft" | "hard";
  /** Height of the effect in px. */
  height?: number;
  visible?: boolean;
  className?: string;
}

/**
 * Scroll edge effect — keeps floating controls legible over scrolling content
 * by diffusing whatever passes beneath the screen edge.
 */
export function ScrollEdge({ edge = "top", variant = "soft", height = 96, visible = true, className }: ScrollEdgeProps) {
  return (
    <div
      aria-hidden
      className={cn("lg-scroll-edge", className)}
      data-edge={edge}
      data-variant={variant}
      data-visible={visible ? "" : undefined}
      style={{ height }}
    >
      {variant === "soft" && (
        <>
          <span className="lg-scroll-edge__layer" data-layer="1" />
          <span className="lg-scroll-edge__layer" data-layer="2" />
          <span className="lg-scroll-edge__layer" data-layer="3" />
        </>
      )}
    </div>
  );
}

export interface NavigationBarProps {
  title: ReactNode;
  /** Show the 34pt large title below the bar; it collapses into the bar on scroll. */
  largeTitle?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  /** Scroll container to watch instead of the window. */
  scrollRef?: RefObject<HTMLElement | null>;
  /** soft = iOS 26 fade · hard = iOS 27 uniform toolbar. */
  edge?: "soft" | "hard";
  /** Fixed to the viewport (default) or sticky inside a container. */
  position?: "fixed" | "sticky";
  className?: string;
}

const COLLAPSE_AT = 44;

export function NavigationBar({
  title,
  largeTitle = false,
  leading,
  trailing,
  scrollRef,
  edge = "soft",
  position = "fixed",
  className,
}: NavigationBarProps) {
  const y = useScrollY(scrollRef);
  const scrolled = y > 4;
  const collapsed = !largeTitle || y > COLLAPSE_AT;

  return (
    <>
      <header
        className={cn("lg-navbar", className)}
        data-position={position}
        data-scrolled={scrolled ? "" : undefined}
        data-collapsed={collapsed ? "" : undefined}
      >
        <ScrollEdge variant={edge} visible={scrolled} height={edge === "hard" ? 64 : 110} className="lg-navbar__edge" />
        <div className="lg-navbar__slot">{leading}</div>
        <div className="lg-navbar__title" aria-hidden={!collapsed}>
          {title}
        </div>
        <div className="lg-navbar__slot lg-navbar__slot--end">{trailing}</div>
      </header>
      {largeTitle && <h1 className="lg-large-title">{title}</h1>}
    </>
  );
}
