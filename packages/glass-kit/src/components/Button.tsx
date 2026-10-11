"use client";

import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { Glass } from "./Glass";
import { cn } from "../lib/cn";
import type { TintStyle } from "../presets";

export type ButtonVariant = "glass" | "prominent" | "tinted-glass" | "tinted" | "filled" | "plain";
export type ButtonSize = "small" | "medium" | "large";
export type ButtonShape = "capsule" | "circle" | "rounded";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  /**
   * glass = Liquid Glass (.glass) · prominent = accent glass (.glassProminent)
   * tinted-glass = translucent colour-washed glass; content shows and bends through
   * tinted = accent-tinted fill · filled = solid accent · plain = text only
   */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** circle = icon-only round button. */
  shape?: ButtonShape;
  icon?: ReactNode;
  iconPosition?: "leading" | "trailing";
  /** Accent colour override (any CSS colour). */
  tint?: string;
  /** Look of `variant="tinted-glass"`: liquid (default) · clear · frosted · vivid · deep. */
  tintStyle?: TintStyle;
}

const RADIUS: Record<ButtonSize, number> = { small: 12, medium: 14, large: 16 };

export function Button({
  ref,
  variant = "glass",
  size = "medium",
  shape = "capsule",
  icon,
  iconPosition = "leading",
  tint,
  tintStyle = "liquid",
  className,
  children,
  disabled,
  style,
  type = "button",
  ...rest
}: ButtonProps) {
  const content = (
    <>
      {icon && iconPosition === "leading" && <span className="lg-button__icon">{icon}</span>}
      {children != null && shape !== "circle" && <span className="lg-button__label">{children}</span>}
      {icon && iconPosition === "trailing" && <span className="lg-button__icon">{icon}</span>}
    </>
  );

  const shared = {
    "data-button-size": size,
    "data-shape": shape,
    "aria-label": shape === "circle" && typeof children === "string" ? children : rest["aria-label"],
    type,
  };

  if (variant === "glass" || variant === "prominent" || variant === "tinted-glass") {
    return (
      <Glass
        as="button"
        ref={ref as Ref<HTMLElement>}
        size="small"
        interactive
        disabled={disabled}
        radius={shape === "rounded" ? RADIUS[size] : "capsule"}
        tint={variant === "glass" ? undefined : (tint ?? true)}
        tintStyle={variant === "tinted-glass" ? tintStyle : undefined}
        className={cn("lg-button", className)}
        style={style}
        {...rest}
        {...shared}
      >
        {content}
      </Glass>
    );
  }

  return (
    <button
      ref={ref}
      className={cn("lg-button", className)}
      data-variant={variant}
      disabled={disabled}
      style={tint ? { ...style, ["--lg-accent" as string]: tint } : style}
      {...rest}
      {...shared}
    >
      {content}
    </button>
  );
}
