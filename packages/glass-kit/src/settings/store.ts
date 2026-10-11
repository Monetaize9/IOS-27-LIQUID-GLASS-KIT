"use client";

import { useSyncExternalStore } from "react";

/**
 * Site-wide glass appearance — the web counterpart of iOS 27's
 * Settings › Appearance › Liquid Glass. Persisted in localStorage and applied
 * to <html> as CSS variables / data attributes, so every surface follows it.
 */
export type GlassTheme = "light" | "dark" | "system";

export interface GlassSettings {
  /** 0 = fully tinted · 0.5 = default · 1 = ultra clear. */
  transparency: number;
  theme: GlassTheme;
  /** Global multiplier on lens refraction. 0 turns lensing off. */
  refraction: number;
}

export const DEFAULT_SETTINGS: GlassSettings = {
  transparency: 0.5,
  theme: "system",
  refraction: 1,
};

const STORAGE_KEY = "lg-settings";
const listeners = new Set<() => void>();
let state: GlassSettings = DEFAULT_SETTINGS;
let loaded = false;

function apply(s: GlassSettings) {
  const root = document.documentElement;
  root.style.setProperty("--lg-transparency", String(s.transparency));
  if (s.theme === "system") delete root.dataset.theme;
  else root.dataset.theme = s.theme;
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // Storage blocked (private mode) — defaults are fine.
  }
  apply(state);
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getGlassSettings(): GlassSettings {
  load();
  return state;
}

export function setGlassSettings(patch: Partial<GlassSettings>): void {
  load();
  state = { ...state, ...patch };
  apply(state);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Not persisted; still applied for this page view.
  }
  listeners.forEach((l) => l());
}

export function resetGlassSettings(): void {
  setGlassSettings(DEFAULT_SETTINGS);
}

/** Read and update the global glass appearance. */
export function useGlassSettings(): [GlassSettings, (patch: Partial<GlassSettings>) => void] {
  const settings = useSyncExternalStore(
    subscribe,
    () => state,
    () => DEFAULT_SETTINGS,
  );
  return [settings, setGlassSettings];
}

/** Named stops on the iOS 27 transparency slider. */
export const TRANSPARENCY_PRESETS = [
  { label: "Tinted", value: 0 },
  { label: "Frosted", value: 0.25 },
  { label: "Default", value: 0.5 },
  { label: "Clear", value: 0.75 },
  { label: "Ultra Clear", value: 1 },
] as const;
