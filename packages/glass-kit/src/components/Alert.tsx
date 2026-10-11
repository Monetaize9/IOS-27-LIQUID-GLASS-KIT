"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Glass } from "./Glass";
import { Portal } from "../lib/Portal";
import { cn } from "../lib/cn";
import { useEscape, usePresence, useScrollLock } from "../lib/hooks";

export interface AlertAction {
  label: string;
  /** cancel = bold, default for Escape · destructive = red. */
  role?: "default" | "cancel" | "destructive";
  /** The highlighted (accent) action. */
  primary?: boolean;
  onPress?: () => void;
}

export interface AlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  message?: ReactNode;
  actions?: AlertAction[];
  /** Extra content between message and actions, e.g. a text field. */
  children?: ReactNode;
  className?: string;
}

const EXIT_MS = 160;

export function Alert({
  open,
  onOpenChange,
  title,
  message,
  actions = [{ label: "OK", primary: true }],
  children,
  className,
}: AlertProps) {
  const mounted = usePresence(open, EXIT_MS);
  const panelRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const messageId = useId();

  const run = (action?: AlertAction) => {
    action?.onPress?.();
    onOpenChange(false);
  };

  useScrollLock(open);
  useEscape(open, () => run(actions.find((a) => a.role === "cancel")));

  useEffect(() => {
    if (!open) return;
    const buttons = panelRef.current?.querySelectorAll<HTMLButtonElement>(".lg-alert__action");
    (panelRef.current?.querySelector<HTMLButtonElement>("[data-primary]") ?? buttons?.[0])?.focus();
  }, [open]);

  if (!mounted) return null;
  const stacked = actions.length > 2;

  return (
    <Portal>
      <div className="lg-alert-root" data-state={open ? "open" : "closed"}>
        <div className="lg-backdrop" />
        <Glass
          ref={panelRef}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={message ? messageId : undefined}
          radius={34}
          className={cn("lg-alert", className)}
        >
          <h2 id={titleId} className="lg-alert__title">
            {title}
          </h2>
          {message && (
            <p id={messageId} className="lg-alert__message">
              {message}
            </p>
          )}
          {children}
          <div className="lg-alert__actions" data-stacked={stacked ? "" : undefined}>
            {actions.map((a) => (
              <button
                key={a.label}
                type="button"
                className="lg-alert__action"
                data-role={a.role ?? "default"}
                data-primary={a.primary ? "" : undefined}
                onClick={() => run(a)}
              >
                {a.label}
              </button>
            ))}
          </div>
        </Glass>
      </div>
    </Portal>
  );
}
