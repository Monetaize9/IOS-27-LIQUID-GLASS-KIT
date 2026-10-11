"use client";

import { useState, type ReactNode } from "react";
import {
  Button,
  Glass,
  NavigationBar,
  SegmentedControl,
  Slider,
  Toggle,
  TransparencySlider,
  resetGlassSettings,
  toast,
  useGlassSettings,
} from "liquid-glass-kit";
import { ChevronLeft, Ellipsis, Heart, House, Library, Moon, Radio, RotateCcw, Search, Sun, SunMoon } from "lucide-react";
import { useRouter } from "next/navigation";

/** iOS 27 › Settings › Appearance › Liquid Glass, with a live preview. */
export default function SettingsPage() {
  const router = useRouter();
  const [settings, set] = useGlassSettings();
  const [previewTab, setPreviewTab] = useState(0);

  return (
    <div className="min-h-screen bg-[var(--lg-bg-grouped)] pb-24 text-[var(--lg-label)]">
      <NavigationBar
        largeTitle
        title="Appearance"
        edge="hard"
        leading={<Button shape="circle" icon={<ChevronLeft />} aria-label="Back" onClick={() => router.push("/")} />}
        trailing={
          <Button
            shape="circle"
            icon={<RotateCcw />}
            aria-label="Reset"
            onClick={() => {
              resetGlassSettings();
              toast("Reset to defaults");
            }}
          />
        }
      />

      <main className="mx-auto flex max-w-xl flex-col gap-7 px-4">
        {/* ---------- Live preview ---------- */}
        <div
          className="relative h-[300px] overflow-hidden rounded-[34px] shadow-xl"
          style={{
            background:
              "radial-gradient(60% 60% at 20% 20%, #ff5f6d, transparent 60%), radial-gradient(60% 60% at 85% 30%, #6a5cff, transparent 60%), radial-gradient(60% 60% at 60% 95%, #00c3d0, transparent 60%), linear-gradient(160deg, #1b1f6b, #5b1f6b 50%, #0d4f6b)",
          }}
        >
          <div className="absolute inset-x-6 top-[88px] text-white">
            <div className="text-3xl leading-tight font-bold">Good Evening</div>
            <div className="mt-1 text-[15px] opacity-85">Drag the slider and watch every surface change.</div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {["#ff383c", "#ffcc00", "#34c759", "#0088ff"].map((c) => (
                <div key={c} className="h-12 rounded-2xl" style={{ background: c }} />
              ))}
            </div>
          </div>
          <div className="absolute inset-x-4 top-4 flex items-center justify-between">
            <Glass as="span" size="small" className="grid size-11 place-items-center">
              <ChevronLeft className="size-5" />
            </Glass>
            <Glass as="span" radius="capsule" className="flex items-center gap-4 px-4 py-2.5">
              <Heart className="size-5" />
              <Ellipsis className="size-5" />
            </Glass>
          </div>
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
            <Glass radius="capsule" className="flex p-1">
              {[House, Radio, Library].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPreviewTab(i)}
                  className="grid h-11 w-16 place-items-center rounded-full transition-colors"
                  style={{
                    background: previewTab === i ? "var(--lg-tab-selected)" : undefined,
                    color: previewTab === i ? "var(--lg-accent)" : undefined,
                  }}
                >
                  <Icon className="size-5" />
                </button>
              ))}
            </Glass>
            <Glass as="span" radius="capsule" className="grid size-[52px] place-items-center">
              <Search className="size-5" />
            </Glass>
          </div>
        </div>

        <Group title="Liquid Glass" footer="Choose how transparent glass controls appear. Tinted increases contrast and darkens the material; Clear lets more of the content behind show through.">
          <div className="px-4 py-4">
            <TransparencySlider />
          </div>
        </Group>

        <Group title="Appearance">
          <div className="grid grid-cols-3 gap-2 px-4 py-4">
            {(
              [
                { value: "light", label: "Light", icon: <Sun /> },
                { value: "dark", label: "Dark", icon: <Moon /> },
                { value: "system", label: "Automatic", icon: <SunMoon /> },
              ] as const
            ).map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => set({ theme: o.value })}
                className="flex flex-col items-center gap-2 rounded-2xl py-3 text-[15px] transition-colors [&>svg]:size-7"
                style={{
                  background: settings.theme === o.value ? "color-mix(in srgb, var(--lg-accent) 14%, transparent)" : "var(--lg-fill-tertiary)",
                  color: settings.theme === o.value ? "var(--lg-accent)" : undefined,
                  fontWeight: settings.theme === o.value ? 600 : 400,
                }}
              >
                {o.icon}
                {o.label}
              </button>
            ))}
          </div>
        </Group>

        <Group title="Refraction" footer="Lensing bends content at the edges of glass. Full refraction runs in Chrome, Edge and Arc; other browsers show frosted glass.">
          <Row label="Refraction">
            <Toggle
              aria-label="Refraction"
              checked={settings.refraction > 0}
              onCheckedChange={(on) => set({ refraction: on ? 1 : 0 })}
            />
          </Row>
          <div className="px-4 pt-1 pb-3">
            <Slider
              aria-label="Refraction strength"
              min={0}
              max={2.5}
              step={0.05}
              value={settings.refraction}
              onValueChange={(refraction) => set({ refraction })}
              leading={<span className="text-[13px] opacity-60">Flat</span>}
              trailing={<span className="text-[13px] opacity-60">Deep</span>}
            />
          </div>
        </Group>

        <Group title="Presets">
          <div className="px-4 py-4">
            <SegmentedControl
              block
              aria-label="Preset"
              value={
                settings.transparency === 0 ? "tinted" : settings.transparency === 1 ? "clear" : settings.transparency === 0.5 ? "default" : "custom"
              }
              onValueChange={(v) => {
                if (v === "tinted") set({ transparency: 0 });
                if (v === "default") set({ transparency: 0.5 });
                if (v === "clear") set({ transparency: 1 });
              }}
              options={[
                { value: "tinted", label: "Tinted" },
                { value: "default", label: "Default" },
                { value: "clear", label: "Clear" },
                { value: "custom", label: "Custom" },
              ]}
            />
          </div>
        </Group>
      </main>
    </div>
  );
}

function Group({ title, footer, children }: { title: string; footer?: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 px-4 text-[13px] uppercase tracking-wide text-[var(--lg-label-secondary)]">{title}</h2>
      <div className="overflow-hidden rounded-[26px] bg-[var(--lg-bg-grouped-cell)]">{children}</div>
      {footer && <p className="mt-2 px-4 text-[13px] leading-[18px] text-[var(--lg-label-secondary)]">{footer}</p>}
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-[52px] items-center justify-between gap-3 px-4 py-2">
      <span className="text-[17px]">{label}</span>
      {children}
    </div>
  );
}
