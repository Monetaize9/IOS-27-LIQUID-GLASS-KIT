"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "../lib/cn";

export interface RevealProps {
  as?: ElementType;
  children: ReactNode;
  /** Entrance style. */
  effect?: "rise" | "fade" | "scale" | "blur";
  /** Delay in ms — stagger siblings with increasing values. */
  delay?: number;
  /** Animate again every time it re-enters the viewport. */
  repeat?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Springs content in as it scrolls into view. */
export function Reveal({
  as: Tag = "div",
  children,
  effect = "rise",
  delay = 0,
  repeat = false,
  className,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          setVisible(false);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [repeat]);

  return (
    <Tag
      ref={ref}
      className={cn("lg-reveal", className)}
      data-effect={effect}
      data-visible={visible ? "" : undefined}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
