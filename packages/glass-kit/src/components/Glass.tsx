"use client";

import {
  useRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type PointerEvent,
  type Ref,
} from "react";
import { useLens } from "../engine/useLens";
import type { BezelProfile } from "../engine/lens-map";
import { cn } from "../lib/cn";
import { mergeRefs } from "../lib/mergeRefs";
import { useGlassSettings } from "../settings/store";
import {
  GLASS_PRESETS,
  TINT_STYLES,
  type GlassPreset,
  type GlassPresetName,
  type TintStyle,
  type TintStylePreset,
} from "../presets";

export type GlassVariant = "regular" | "clear" | "identity";
export type GlassSize = "large" | "small";

export interface GlassProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  ref?: Ref<HTMLElement>;
  /** Forwarded when rendering `as="button"`. */
  type?: "button" | "submit" | "reset";
  /** Named look (see GLASS_PRESETS). Explicit props below override it. */
  preset?: GlassPresetName;
  /** regular = default chrome · clear = over media only · identity = no glass. */
  variant?: GlassVariant;
  /** large = bars, cards, sheets · small = standalone controls. */
  size?: GlassSize;
  /** Corner radius in px, or "capsule". Keep in sync with any radius you set via CSS. */
  radius?: number | "capsule";
  /** Lens refraction: false disables, a number scales strength (default 1). */
  refraction?: boolean | number;
  /** Curved edge width in px. */
  bezel?: number;
  /** Glass thickness in px. */
  thickness?: number;
  /** Index of refraction. */
  ior?: number;
  /** Chromatic dispersion at the edge, 0–1. */
  dispersion?: number;
  profile?: BezelProfile;
  /** Accent tint (any CSS colour) — renders as prominent glass. */
  tint?: string | boolean;
  /**
   * With `tint`: render translucent tinted glass instead of solid prominent
   * glass. liquid (default look of iOS tinted glass) · clear · frosted · vivid · deep.
   */
  tintStyle?: TintStyle;
  /** Adds press scale, pointer glow and hover response. */
  interactive?: boolean;
  disabled?: boolean;
}

const SIZE_DEFAULTS: Record<GlassSize, { radius: number | "capsule"; bezel: number; thickness: number }> = {
  large: { radius: 34, bezel: 26, thickness: 46 },
  small: { radius: "capsule", bezel: 16, thickness: 32 },
};

export function Glass({
  as: Tag = "div",
  ref,
  preset,
  variant: variantProp,
  size = "large",
  radius,
  refraction: refractionProp,
  bezel: bezelProp,
  thickness: thicknessProp,
  ior = 1.5,
  dispersion: dispersionProp,
  profile: profileProp,
  tint,
  tintStyle,
  interactive = false,
  disabled = false,
  className,
  style,
  children,
  onPointerDown,
  onPointerMove,
  ...rest
}: GlassProps) {
  const localRef = useRef<HTMLElement | null>(null);
  const p: Partial<GlassPreset> = preset ? GLASS_PRESETS[preset] : {};
  const ts: Partial<TintStylePreset> = tint && tintStyle ? TINT_STYLES[tintStyle] : {};
  const variant = variantProp ?? p.variant ?? "regular";
  const refraction = refractionProp ?? p.refraction ?? ts.refraction ?? true;
  const bezel = bezelProp ?? p.bezel ?? ts.bezel;
  const thickness = thicknessProp ?? p.thickness ?? ts.thickness;
  const dispersion = dispersionProp ?? p.dispersion ?? ts.dispersion ?? 0;
  const profile = profileProp ?? p.profile;
  const defaults = SIZE_DEFAULTS[size];
  const resolvedRadius = radius ?? defaults.radius;
  const [settings] = useGlassSettings();
  const strength = (refraction === false ? 0 : refraction === true ? 1 : refraction) * settings.refraction;

  const lens = useLens(localRef, {
    enabled: variant !== "identity" && strength > 0,
    radius: resolvedRadius,
    bezel: bezel ?? defaults.bezel,
    thickness: thickness ?? defaults.thickness,
    ior,
    strength,
    dispersion,
    profile,
  });

  const vars: Record<string, string> = {};
  if (radius !== undefined) {
    vars["--_radius"] = radius === "capsule" ? "9999px" : `${radius}px`;
  }
  if (typeof tint === "string") vars["--lg-glass-tint"] = tint;

  const backdrop = lens.url
    ? `blur(var(--_blur)) ${lens.url} saturate(var(--lg-glass-saturate))`
    : undefined;

  const mergedStyle: CSSProperties = {
    ...(vars as CSSProperties),
    ...(backdrop ? { backdropFilter: backdrop, WebkitBackdropFilter: backdrop } : null),
    ...style,
  };

  const setGlow = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--_glow-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--_glow-y", `${e.clientY - rect.top}px`);
  };

  const interactionProps = interactive
    ? {
        onPointerDown: (e: PointerEvent<HTMLElement>) => {
          onPointerDown?.(e as never);
          if (disabled) return;
          setGlow(e);
          const el = e.currentTarget;
          el.setAttribute("data-pressed", "");
          const release = () => {
            el.removeAttribute("data-pressed");
            window.removeEventListener("pointerup", release);
            window.removeEventListener("pointercancel", release);
          };
          window.addEventListener("pointerup", release);
          window.addEventListener("pointercancel", release);
        },
        onPointerMove: (e: PointerEvent<HTMLElement>) => {
          onPointerMove?.(e as never);
          setGlow(e);
        },
      }
    : { onPointerDown, onPointerMove };

  return (
    <Tag
      ref={mergeRefs(localRef, ref)}
      className={cn("lg-glass", className)}
      data-variant={variant === "regular" ? undefined : variant}
      data-size={size === "large" ? undefined : size}
      data-tinted={tint ? "" : undefined}
      data-tint-mode={tint && tintStyle ? "glass" : undefined}
      data-tint-style={tint && tintStyle ? tintStyle : undefined}
      data-interactive={interactive ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      disabled={Tag === "button" ? disabled : undefined}
      aria-disabled={disabled && Tag !== "button" ? true : undefined}
      data-refraction={lens.url ? "" : undefined}
      style={mergedStyle}
      {...interactionProps}
      {...rest}
    >
      {lens.defs}
      {children}
    </Tag>
  );
}
