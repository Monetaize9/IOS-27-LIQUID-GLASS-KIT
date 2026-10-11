"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Button } from "./Button";
import { PageControl } from "./PageControl";
import { ChevronLeftIcon, ChevronRightIcon } from "../lib/icons";
import { cn } from "../lib/cn";
import { prefersReducedMotion } from "../engine/capabilities";

export interface CarouselProps {
  children: ReactNode;
  /** Slide width — any CSS length. 100% = one slide per view. */
  slideWidth?: string;
  /** Gap between slides in px. */
  gap?: number;
  showArrows?: boolean;
  showDots?: boolean;
  /** Auto-advance interval in ms. Paused on hover, focus and drag. */
  autoPlay?: number;
  loop?: boolean;
  /** "scale" shrinks and dims off-centre slides as they scroll. */
  effect?: "none" | "scale";
  onIndexChange?: (index: number) => void;
  className?: string;
  "aria-label"?: string;
}

export function Carousel({
  children,
  slideWidth = "85%",
  gap = 16,
  showArrows = true,
  showDots = true,
  autoPlay,
  loop = false,
  effect = "none",
  onIndexChange,
  className,
  "aria-label": ariaLabel = "Carousel",
}: CarouselProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef<{ startX: number; startScroll: number; moved: boolean; t: number } | null>(null);
  const suppressClick = useRef(false);
  const onIndexChangeRef = useRef(onIndexChange);
  onIndexChangeRef.current = onIndexChange;

  const slideEls = () =>
    Array.from(viewportRef.current?.querySelectorAll<HTMLElement>(":scope > .lg-carousel__slide") ?? []);

  const goTo = useCallback(
    (i: number) => {
      const el = viewportRef.current;
      const target = slideEls()[i];
      if (!el || !target) return;
      const left = target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2;
      el.scrollTo({ left, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    },
    [],
  );

  const step = (delta: number) => {
    let next = index + delta;
    if (loop) next = (next + count) % count;
    goTo(Math.max(0, Math.min(count - 1, next)));
  };

  // Active slide = the one whose centre is closest to the viewport centre.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const center = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        slideEls().forEach((s, i) => {
          const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - center);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setIndex((prev) => {
          if (prev !== best) onIndexChangeRef.current?.(best);
          return best;
        });
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!autoPlay || paused || count < 2 || prefersReducedMotion()) return;
    const timer = window.setInterval(() => {
      const next = index + 1 >= count ? (loop ? 0 : -1) : index + 1;
      if (next >= 0) goTo(next);
    }, autoPlay);
    return () => window.clearInterval(timer);
  }, [autoPlay, paused, index, count, loop, goTo]);

  // Mouse drag-to-scroll (touch and trackpads scroll natively).
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { startX: e.clientX, startScroll: e.currentTarget.scrollLeft, moved: false, t: performance.now() };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.dataset.dragging = "";
    }
    if (d.moved) e.currentTarget.scrollLeft = d.startScroll - dx;
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    delete e.currentTarget.dataset.dragging;
    suppressClick.current = true;
    const dx = e.clientX - d.startX;
    const velocity = dx / Math.max(1, performance.now() - d.t);
    // A quick flick moves one slide even when the drag was short.
    const flick = Math.abs(velocity) > 0.4 ? (dx < 0 ? 1 : -1) : 0;
    goTo(Math.max(0, Math.min(count - 1, index + flick)));
  };
  const onClickCapture = (e: MouseEvent) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section
      className={cn("lg-carousel", className)}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      data-effect={effect}
      style={{ "--lg-carousel-slide": slideWidth, "--lg-carousel-gap": `${gap}px` } as CSSProperties}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        ref={viewportRef}
        className="lg-carousel__viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        tabIndex={0}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="lg-carousel__slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
          >
            {slide}
          </div>
        ))}
      </div>
      {showArrows && count > 1 && (
        <>
          <Button
            shape="circle"
            className="lg-carousel__arrow lg-carousel__arrow--prev"
            icon={<ChevronLeftIcon />}
            aria-label="Previous slide"
            disabled={!loop && index === 0}
            onClick={() => step(-1)}
          />
          <Button
            shape="circle"
            className="lg-carousel__arrow lg-carousel__arrow--next"
            icon={<ChevronRightIcon />}
            aria-label="Next slide"
            disabled={!loop && index === count - 1}
            onClick={() => step(1)}
          />
        </>
      )}
      {showDots && count > 1 && (
        <PageControl glass className="lg-carousel__dots" count={count} index={index} onIndexChange={goTo} />
      )}
    </section>
  );
}
