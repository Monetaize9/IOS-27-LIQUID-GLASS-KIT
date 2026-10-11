"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { Glass } from "./Glass";
import { Portal } from "../lib/Portal";
import { cn } from "../lib/cn";

/**
 * Imperative banners: call `toast("Saved")` anywhere, render <Toaster /> once
 * (e.g. in the root layout).
 */
export interface ToastOptions {
  icon?: ReactNode;
  description?: ReactNode;
  /** ms before auto-dismiss. Default 2600. */
  duration?: number;
  action?: { label: string; onPress: () => void };
}

interface ToastRecord extends ToastOptions {
  id: number;
  title: ReactNode;
  leaving: boolean;
}

const EXIT_MS = 260;
let toasts: ToastRecord[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function toast(title: ReactNode, options: ToastOptions = {}): number {
  const id = nextId++;
  toasts = [...toasts, { id, title, leaving: false, ...options }].slice(-3);
  emit();
  return id;
}

export function dismissToast(id: number): void {
  if (!toasts.some((t) => t.id === id && !t.leaving)) return;
  toasts = toasts.map((t) => (t.id === id ? { ...t, leaving: true } : t));
  emit();
  window.setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, EXIT_MS);
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

const empty: ToastRecord[] = [];

export function Toaster({ position = "top" }: { position?: "top" | "bottom" }) {
  const list = useSyncExternalStore(
    subscribe,
    () => toasts,
    () => empty,
  );
  return (
    <Portal>
      <div className="lg-toaster" data-position={position} role="status" aria-live="polite">
        {list.map((t) => (
          <ToastItem key={t.id} record={t} />
        ))}
      </div>
    </Portal>
  );
}

function ToastItem({ record }: { record: ToastRecord }) {
  useEffect(() => {
    const timer = window.setTimeout(() => dismissToast(record.id), record.duration ?? 2600);
    return () => window.clearTimeout(timer);
  }, [record.id, record.duration]);

  return (
    <Glass
      radius="capsule"
      className={cn("lg-toast")}
      data-state={record.leaving ? "closed" : "open"}
      onClick={() => dismissToast(record.id)}
    >
      {record.icon && <span className="lg-toast__icon">{record.icon}</span>}
      <span className="lg-toast__text">
        <span className="lg-toast__title">{record.title}</span>
        {record.description && <span className="lg-toast__description">{record.description}</span>}
      </span>
      {record.action && (
        <button
          type="button"
          className="lg-toast__action"
          onClick={(e) => {
            e.stopPropagation();
            record.action!.onPress();
            dismissToast(record.id);
          }}
        >
          {record.action.label}
        </button>
      )}
    </Glass>
  );
}
