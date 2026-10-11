"use client";

import { useEffect, useId, useState, type ReactNode, type RefObject } from "react";
import { supportsRefraction } from "./capabilities";
import { createLensMap, type BezelProfile, type LensMap } from "./lens-map";

export interface LensConfig {
  /** Disable to fall back to the frosted (blur-only) material. */
  enabled?: boolean;
  /** Corner radius in px, or "capsule" for a fully rounded short side. */
  radius?: number | "capsule";
  /** Curved edge width in px. */
  bezel?: number;
  /** Glass thickness in px — larger bends more. */
  thickness?: number;
  /** Index of refraction. */
  ior?: number;
  /** Multiplier on the physical displacement. 0 = flat glass. */
  strength?: number;
  /** Chromatic dispersion at the bezel, 0–1. Costs two extra passes. */
  dispersion?: number;
  profile?: BezelProfile;
}

export interface LensResult {
  /** CSS `url(#id)` to splice into backdrop-filter, or null while unavailable. */
  url: string | null;
  /** SVG filter definition — render it anywhere inside the surface. */
  defs: ReactNode;
}

/** Map regeneration is debounced while a surface is actively resizing. */
const SETTLE_MS = 120;

export function useLens(ref: RefObject<HTMLElement | null>, config: LensConfig): LensResult {
  const {
    enabled = true,
    radius = 34,
    bezel = 18,
    thickness = 22,
    ior = 1.5,
    strength = 1,
    dispersion = 0,
    profile = "squircle",
  } = config;

  const rawId = useId();
  const id = `lg-lens-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [map, setMap] = useState<LensMap | null>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(supportsRefraction());
  }, []);

  const active = enabled && supported && strength > 0;

  useEffect(() => {
    const el = ref.current;
    if (!active || !el) return;
    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.borderBoxSize?.[0];
      const w = box ? box.inlineSize : el.offsetWidth;
      const h = box ? box.blockSize : el.offsetHeight;
      setSize((prev) =>
        prev && Math.abs(prev.w - w) < 0.5 && Math.abs(prev.h - h) < 0.5 ? prev : { w, h },
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [active, ref]);

  useEffect(() => {
    if (!active || !size || size.w < 2 || size.h < 2) return;
    const build = () => {
      const r = radius === "capsule" ? Math.min(size.w, size.h) / 2 : radius;
      setMap(createLensMap({ width: size.w, height: size.h, radius: r, bezel, thickness, ior, profile }));
    };
    // First map immediately; later ones once the size settles. The previous
    // map is stretched to the new size in the meantime.
    if (!map) {
      build();
      return;
    }
    const timer = window.setTimeout(build, SETTLE_MS);
    return () => window.clearTimeout(timer);
    // `map` is intentionally excluded: it only gates the first build.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, size, radius, bezel, thickness, ior, profile]);

  if (!active || !size || !map) return { url: null, defs: null };

  const scale = map.scale * strength;
  const d = Math.min(Math.max(dispersion, 0), 1) * 0.35;
  const region = { x: 0, y: 0, width: size.w, height: size.h };

  const defs = (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}
    >
      <filter
        id={id}
        {...region}
        filterUnits="userSpaceOnUse"
        primitiveUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feImage href={map.href} {...region} preserveAspectRatio="none" result="lens" />
        {d === 0 ? (
          <feDisplacementMap
            in="SourceGraphic"
            in2="lens"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        ) : (
          <>
            <feDisplacementMap in="SourceGraphic" in2="lens" scale={scale * (1 + d)} xChannelSelector="R" yChannelSelector="G" result="dr" />
            <feColorMatrix in="dr" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feDisplacementMap in="SourceGraphic" in2="lens" scale={scale} xChannelSelector="R" yChannelSelector="G" result="dg" />
            <feColorMatrix in="dg" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feDisplacementMap in="SourceGraphic" in2="lens" scale={scale * (1 - d)} xChannelSelector="R" yChannelSelector="G" result="db" />
            <feColorMatrix in="db" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
            <feBlend in="r" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b" mode="screen" />
          </>
        )}
      </filter>
    </svg>
  );

  return { url: `url(#${id})`, defs };
}
