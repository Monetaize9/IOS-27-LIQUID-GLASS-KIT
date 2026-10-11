"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Glass } from "./Glass";
import { Button, type ButtonProps } from "./Button";
import { Portal } from "../lib/Portal";
import { CheckIcon } from "../lib/icons";
import { cn } from "../lib/cn";
import { useEscape, usePresence } from "../lib/hooks";

export interface MenuAction {
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  /** Shows a leading checkmark (selection menus). */
  checked?: boolean;
  /** Secondary text under the label. */
  description?: string;
}

export type MenuEntry = MenuAction | { separator: true } | { title: string };

export interface MenuProps extends Omit<ButtonProps, "onClick" | "children"> {
  /** Trigger button content. */
  label?: ReactNode;
  items: MenuEntry[];
  align?: "start" | "center" | "end";
  /** Width of the menu panel in px. */
  width?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const EXIT_MS = 180;
const GAP = 8;

export function Menu({
  label,
  items,
  align = "start",
  width = 250,
  open: openProp,
  onOpenChange,
  ...buttonProps
}: MenuProps) {
  const [openInner, setOpenInner] = useState(false);
  const open = openProp ?? openInner;
  const setOpen = (v: boolean) => {
    setOpenInner(v);
    onOpenChange?.(v);
  };
  const mounted = usePresence(open, EXIT_MS);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const [pos, setPos] = useState<CSSProperties>({});
  const id = useId();

  // Position against the trigger; flip above when there's no room below.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const t = triggerRef.current.getBoundingClientRect();
    const panelH = panelRef.current?.offsetHeight ?? 0;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let left = align === "start" ? t.left : align === "end" ? t.right - width : t.left + t.width / 2 - width / 2;
    left = Math.min(Math.max(GAP, left), vw - width - GAP);
    const below = t.bottom + GAP + panelH <= vh - GAP || t.top < panelH + GAP;
    const top = below ? t.bottom + GAP : t.top - GAP - panelH;
    setPos({
      left,
      top,
      width,
      transformOrigin: `${t.left + t.width / 2 - left}px ${below ? -GAP : panelH + GAP}px`,
    });
  }, [open, align, width, mounted]);

  // Focus the first item on open; return focus to the trigger on close.
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() =>
        panelRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled])')?.focus(),
      );
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onDismiss = () => setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("resize", onDismiss);
    window.addEventListener("scroll", onDismiss, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onDismiss);
      window.removeEventListener("scroll", onDismiss);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };
  useEscape(open, () => close());

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const list = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled])') ?? [],
    );
    const index = list.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const delta = e.key === "ArrowDown" ? 1 : -1;
      list[(index + delta + list.length) % list.length]?.focus();
    } else if (e.key === "Tab") {
      close(false);
    }
  };

  return (
    <>
      <Button
        ref={triggerRef}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        {...buttonProps}
        onClick={() => setOpen(!open)}
      >
        {label}
      </Button>
      {mounted && (
        <Portal>
          <Glass
            ref={panelRef}
            id={id}
            role="menu"
            radius={26}
            className="lg-menu"
            data-state={open ? "open" : "closed"}
            style={pos}
            onKeyDown={onKeyDown}
          >
            {items.map((entry, i) => {
              if ("separator" in entry) return <div key={i} role="separator" className="lg-menu__separator" />;
              if ("title" in entry)
                return (
                  <div key={i} className="lg-menu__title">
                    {entry.title}
                  </div>
                );
              return (
                <button
                  key={i}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  aria-disabled={entry.disabled || undefined}
                  className={cn("lg-menu__item", entry.destructive && "lg-menu__item--destructive")}
                  onClick={() => {
                    if (entry.disabled) return;
                    entry.onSelect?.();
                    close();
                  }}
                >
                  <span className="lg-menu__check">{entry.checked && <CheckIcon />}</span>
                  <span className="lg-menu__text">
                    <span>{entry.label}</span>
                    {entry.description && <span className="lg-menu__description">{entry.description}</span>}
                  </span>
                  {entry.icon && <span className="lg-menu__icon">{entry.icon}</span>}
                </button>
              );
            })}
          </Glass>
        </Portal>
      )}
    </>
  );
}
