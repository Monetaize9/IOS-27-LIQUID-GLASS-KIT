"use client";

import { Slider } from "./Slider";
import { SegmentedControl } from "./SegmentedControl";
import { Toggle } from "./Toggle";
import { cn } from "../lib/cn";
import { TRANSPARENCY_PRESETS, useGlassSettings, type GlassTheme } from "../settings/store";

/**
 * The iOS 27 Liquid Glass slider: drag from Tinted (opaque, darker chrome)
 * to Clear (maximum see-through). Every glass surface on the site follows.
 */
export function TransparencySlider({ className }: { className?: string }) {
  const [settings, set] = useGlassSettings();
  const preset = TRANSPARENCY_PRESETS.reduce((best, p) =>
    Math.abs(p.value - settings.transparency) < Math.abs(best.value - settings.transparency) ? p : best,
  );
  return (
    <div className={cn("lg-transparency", className)}>
      <Slider
        aria-label="Liquid Glass transparency"
        aria-valuetext={preset.label}
        min={0}
        max={1}
        step={0.01}
        value={settings.transparency}
        onValueChange={(transparency) => set({ transparency })}
        leading={<span className="lg-transparency__end">Tinted</span>}
        trailing={<span className="lg-transparency__end">Clear</span>}
      />
      <div className="lg-transparency__ticks" aria-hidden>
        {TRANSPARENCY_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            tabIndex={-1}
            data-active={p === preset ? "" : undefined}
            onClick={() => set({ transparency: p.value })}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Drop-in appearance settings: transparency, light/dark, refraction. */
export function GlassAppearancePanel({ className }: { className?: string }) {
  const [settings, set] = useGlassSettings();
  return (
    <div className={cn("lg-appearance", className)}>
      <section className="lg-appearance__section">
        <h3 className="lg-appearance__heading">Liquid Glass</h3>
        <TransparencySlider />
      </section>
      <section className="lg-appearance__section">
        <h3 className="lg-appearance__heading">Appearance</h3>
        <SegmentedControl<GlassTheme>
          block
          aria-label="Appearance"
          value={settings.theme}
          onValueChange={(theme) => set({ theme })}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "system", label: "Automatic" },
          ]}
        />
      </section>
      <section className="lg-appearance__row">
        <span>
          <span className="lg-appearance__label">Refraction</span>
          <span className="lg-appearance__hint">Bend light at glass edges</span>
        </span>
        <Toggle
          aria-label="Refraction"
          checked={settings.refraction > 0}
          onCheckedChange={(on) => set({ refraction: on ? 1 : 0 })}
        />
      </section>
    </div>
  );
}
