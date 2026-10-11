"use client";

import { useRef, useState, type PointerEvent } from "react";
import {
  Button,
  GLASS_PRESETS,
  Glass,
  Menu,
  SearchField,
  SegmentedControl,
  Sheet,
  Slider,
  TabBar,
  TransparencySlider,
  toast,
  useGlassSettings,
  type GlassPresetName,
  type GlassVariant,
} from "liquid-glass-kit";
import {
  Check,
  ChevronLeft,
  Disc3,
  Ellipsis,
  Heart,
  House,
  Library,
  ListPlus,
  Music2,
  Pause,
  Play,
  Radio,
  Search,
  Share,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { Wallpaper, type WallpaperKind } from "@/components/Wallpaper";
import { PageSwitcher } from "@/components/PageSwitcher";

/* ---------- Lens shapes ---------- */
const SHAPES = {
  circle: { label: "Circle", w: 170, h: 170, r: "capsule" },
  capsule: { label: "Capsule", w: 270, h: 110, r: "capsule" },
  square: { label: "Square", w: 170, h: 170, r: 14 },
  squircle: { label: "Squircle", w: 170, h: 170, r: 48 },
  rectangle: { label: "Rect", w: 300, h: 180, r: 28 },
  pill: { label: "Tall", w: 110, h: 240, r: "capsule" },
} as const;
type ShapeKey = keyof typeof SHAPES;

interface LabState {
  strength: number;
  bezel: number;
  thickness: number;
  dispersion: number;
  variant: GlassVariant;
  wallpaper: WallpaperKind;
  shape: ShapeKey;
  scale: number;
}

const TILE_COLORS = ["#ff383c", "#ff8d28", "#ffcc00", "#34c759", "#00c3d0", "#0088ff", "#6155f5", "#cb30e0"];
const TABS = [
  { value: "home", label: "Home", icon: <House /> },
  { value: "new", label: "New", icon: <Music2 />, badge: 3 },
  { value: "radio", label: "Radio", icon: <Radio /> },
  { value: "library", label: "Library", icon: <Library /> },
];

export default function Playground() {
  const [lab, setLab] = useState<LabState>({
    strength: 1,
    bezel: 26,
    thickness: 46,
    dispersion: 0,
    variant: "regular",
    wallpaper: "aurora",
    shape: "circle",
    scale: 1,
  });
  const set = <K extends keyof LabState>(key: K, value: LabState[K]) =>
    setLab((prev) => ({ ...prev, [key]: value }));

  const [tab, setTab] = useState("home");
  const [liked, setLiked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);

  const lens = {
    variant: lab.variant,
    refraction: lab.strength,
    bezel: lab.bezel,
    thickness: lab.thickness,
    dispersion: lab.dispersion,
  };

  return (
    <div className="relative min-h-screen">
      <Wallpaper kind={lab.wallpaper} />

      {/* ---------- Scrolling content under the glass ---------- */}
      <main className="mx-auto max-w-2xl px-6 pt-28 pb-56 text-white">
        <p className="text-sm font-semibold tracking-widest uppercase opacity-80">Liquid Glass Kit</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight drop-shadow-sm sm:text-6xl">
          {tab === "home" ? "Glass that bends light." : TABS.find((t) => t.value === tab)?.label}
        </h1>
        <p className="mt-4 max-w-lg text-lg opacity-90">
          Drag the lens, press the controls, and scroll — the tab bar minimizes as you go. Open the
          sliders button to change the lens shape and the material.
        </p>

        <div className="mt-10 grid grid-cols-4 gap-3">
          {TILE_COLORS.map((c, i) => (
            <div
              key={c}
              className="flex aspect-square items-end rounded-3xl p-3 text-sm font-semibold shadow-lg"
              style={{ background: `linear-gradient(140deg, ${c}, ${TILE_COLORS[(i + 3) % 8]})` }}
            >
              {["Photos", "Music", "Maps", "Notes", "Weather", "Mail", "Files", "Camera"][i]}
            </div>
          ))}
        </div>

        {Array.from({ length: 6 }, (_, i) => (
          <section key={i} className="mt-12">
            <h2 className="text-3xl font-bold">Chapter {i + 1}</h2>
            <p className="mt-3 text-lg leading-relaxed opacity-90">
              Liquid Glass is a translucent material that reflects and refracts its surroundings while
              dynamically transforming to bring greater focus to content. Controls float above the
              interface, and the lensing at their edges keeps them legible without hiding what sits
              underneath.
            </p>
            <div className="mt-5 flex gap-3">
              {TILE_COLORS.slice(i % 4, (i % 4) + 4).map((c) => (
                <div key={c} className="h-24 flex-1 rounded-2xl" style={{ background: c }} />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* ---------- Floating top toolbar ---------- */}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-30 flex items-center justify-between gap-2 px-4">
        <Button
          shape="circle"
          className="pointer-events-auto"
          icon={<ChevronLeft />}
          aria-label="Back"
          onClick={() => toast("Back", { icon: <ChevronLeft /> })}
        />
        <div className="pointer-events-auto">
          <PageSwitcher />
        </div>
        <Glass {...lens} radius="capsule" className="pointer-events-auto flex items-center gap-0.5 p-1">
          <IconButton label="Share" onClick={() => toast("Link copied", { icon: <Check className="text-[var(--lg-green)]" /> })}>
            <Share />
          </IconButton>
          <IconButton
            label="Like"
            onClick={() => {
              setLiked(!liked);
              toast(liked ? "Removed from Favorites" : "Added to Favorites", {
                icon: <Heart className="fill-[var(--lg-pink)] text-[var(--lg-pink)]" />,
              });
            }}
          >
            <Heart style={liked ? { fill: "var(--lg-pink)", color: "var(--lg-pink)" } : undefined} />
          </IconButton>
          <Menu
            variant="plain"
            shape="circle"
            size="medium"
            align="end"
            aria-label="More"
            icon={<Ellipsis />}
            className="text-[var(--lg-label)]"
            items={[
              { label: "Add to Playlist", icon: <ListPlus />, onSelect: () => toast("Added to Playlist") },
              { label: "Go to Album", icon: <Disc3 />, onSelect: () => toast("Opening album…") },
              { label: "Share Song…", icon: <Share />, onSelect: () => toast("Link copied") },
              { separator: true },
              {
                label: "Delete from Library",
                icon: <Trash2 />,
                destructive: true,
                onSelect: () => toast("Deleted", { icon: <Trash2 className="text-[var(--lg-red)]" /> }),
              },
            ]}
          />
          <IconButton label="Glass controls" onClick={() => setControlsOpen(true)} className="lg:hidden">
            <SlidersHorizontal />
          </IconButton>
        </Glass>
      </div>

      {/* ---------- Now-playing card ---------- */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[104px] z-20 flex justify-center px-4 lg:justify-start lg:pl-[max(1rem,calc(50vw-36rem))]">
        <Glass {...lens} className="pointer-events-auto flex w-full max-w-sm items-center gap-3 p-3 pr-4">
          <div className="size-12 shrink-0 rounded-xl bg-[linear-gradient(135deg,#ff2d55,#ff8d28)]" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-semibold">Glass Hearts</div>
            <div className="truncate text-[13px] opacity-60">The Refractions</div>
          </div>
          <IconButton label="Previous" onClick={() => toast("Previous track")}>
            <SkipBack className="fill-current" />
          </IconButton>
          <IconButton label={playing ? "Pause" : "Play"} onClick={() => setPlaying(!playing)}>
            {playing ? <Pause className="fill-current" /> : <Play className="fill-current" />}
          </IconButton>
          <IconButton label="Next" onClick={() => toast("Next track")}>
            <SkipForward className="fill-current" />
          </IconButton>
        </Glass>
      </div>

      {searchOpen && (
        <div className="fixed inset-x-4 bottom-[180px] z-30 mx-auto max-w-md">
          <SearchField autoFocus placeholder="Artists, Songs, Lyrics" onSubmit={(q) => toast(`Searching “${q}”`)} />
        </div>
      )}

      {/* ---------- iOS 27 tab bar: main group + prominent tab ---------- */}
      <TabBar
        floating
        minimizeOnScroll
        items={TABS}
        value={tab}
        onValueChange={setTab}
        prominent={{ icon: <Search />, label: "Search", active: searchOpen, onPress: () => setSearchOpen(!searchOpen) }}
      />

      <DraggableLens lens={lens} shape={lab.shape} scale={lab.scale} />

      {/* Desktop: docked panel · Mobile: sheet */}
      <Glass className="fixed top-20 right-5 z-30 hidden max-h-[calc(100vh-7rem)] w-80 overflow-y-auto p-5 lg:block" refraction={0.6}>
        <Controls lab={lab} set={set} />
      </Glass>
      <Sheet
        open={controlsOpen}
        onOpenChange={setControlsOpen}
        title="Glass Controls"
        trailing={
          <Button size="small" variant="prominent" onClick={() => setControlsOpen(false)}>
            Done
          </Button>
        }
      >
        <Controls lab={lab} set={set} />
      </Sheet>
    </div>
  );
}

function IconButton({
  label,
  children,
  onClick,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`grid size-10 place-items-center rounded-full transition-[background,transform] hover:bg-[var(--lg-fill-tertiary)] active:scale-90 [&>svg]:size-5 ${className}`}
    >
      {children}
    </button>
  );
}

function Controls({
  lab,
  set,
}: {
  lab: LabState;
  set: <K extends keyof LabState>(key: K, value: LabState[K]) => void;
}) {
  const [settings, setSettings] = useGlassSettings();
  return (
    <div className="flex flex-col gap-5 text-[13px]">
      <Group title="Liquid Glass (iOS 27)">
        <TransparencySlider />
        <SegmentedControl
          block
          size="small"
          aria-label="Appearance"
          value={settings.theme}
          onValueChange={(theme) => setSettings({ theme })}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "system", label: "Auto" },
          ]}
        />
      </Group>

      <Group title="Lens shape">
        <div className="grid grid-cols-3 gap-1.5">
          {(Object.keys(SHAPES) as ShapeKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => set("shape", k)}
              className="flex flex-col items-center gap-1 rounded-xl py-2 transition-colors"
              style={{ background: lab.shape === k ? "var(--lg-fill-secondary)" : "var(--lg-fill-tertiary)" }}
            >
              <ShapeIcon shape={k} active={lab.shape === k} />
              <span className="font-medium">{SHAPES[k].label}</span>
            </button>
          ))}
        </div>
        <Row label="Size" value={`${Math.round(lab.scale * 100)}%`}>
          <Slider aria-label="Lens size" min={0.5} max={1.8} step={0.05} value={lab.scale} onValueChange={(v) => set("scale", v)} />
        </Row>
      </Group>

      <Group title="Material">
        <div className="grid grid-cols-3 gap-1.5">
          {(Object.keys(GLASS_PRESETS) as GlassPresetName[]).map((name) => {
            const p = GLASS_PRESETS[name];
            const active =
              lab.variant === p.variant &&
              lab.strength === p.refraction &&
              lab.bezel === p.bezel &&
              lab.thickness === p.thickness &&
              lab.dispersion === p.dispersion;
            return (
              <button
                key={name}
                type="button"
                title={p.use}
                onClick={() => {
                  set("variant", p.variant);
                  set("strength", p.refraction);
                  set("bezel", p.bezel);
                  set("thickness", p.thickness);
                  set("dispersion", p.dispersion);
                }}
                className="rounded-xl px-1 py-2 font-medium transition-colors"
                style={{
                  background: active ? "color-mix(in srgb, var(--lg-accent) 18%, transparent)" : "var(--lg-fill-tertiary)",
                  color: active ? "var(--lg-accent)" : undefined,
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <SegmentedControl
          block
          size="small"
          aria-label="Variant"
          value={lab.variant}
          onValueChange={(v) => set("variant", v)}
          options={[
            { value: "regular", label: "Regular" },
            { value: "clear", label: "Clear" },
          ]}
        />
        <Row label="Refraction" value={lab.strength.toFixed(1)}>
          <Slider aria-label="Refraction" min={0} max={3} step={0.1} value={lab.strength} onValueChange={(v) => set("strength", v)} />
        </Row>
        <Row label="Bezel" value={lab.bezel}>
          <Slider aria-label="Bezel" min={4} max={60} step={1} value={lab.bezel} onValueChange={(v) => set("bezel", v)} />
        </Row>
        <Row label="Thickness" value={lab.thickness}>
          <Slider aria-label="Thickness" min={4} max={90} step={1} value={lab.thickness} onValueChange={(v) => set("thickness", v)} />
        </Row>
        <Row label="Dispersion" value={lab.dispersion.toFixed(2)}>
          <Slider aria-label="Dispersion" min={0} max={1} step={0.05} value={lab.dispersion} onValueChange={(v) => set("dispersion", v)} />
        </Row>
      </Group>

      <Group title="Wallpaper">
        <SegmentedControl
          block
          size="small"
          aria-label="Wallpaper"
          value={lab.wallpaper}
          onValueChange={(v) => set("wallpaper", v)}
          options={[
            { value: "aurora", label: "Aurora" },
            { value: "sunset", label: "Sunset" },
            { value: "stripes", label: "Stripes" },
            { value: "mono", label: "Mono" },
          ]}
        />
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[13px] font-semibold tracking-wide uppercase opacity-60">{title}</h3>
      {children}
    </section>
  );
}

function Row({ label, value, children }: { label: string; value: string | number; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="flex justify-between">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums opacity-60">{value}</span>
      </span>
      {children}
    </div>
  );
}

function ShapeIcon({ shape, active }: { shape: ShapeKey; active: boolean }) {
  const s = SHAPES[shape];
  const k = 26 / Math.max(s.w, s.h);
  const w = s.w * k;
  const h = s.h * k;
  const r = s.r === "capsule" ? Math.min(w, h) / 2 : s.r * k;
  return (
    <span
      className="block border-2"
      style={{
        width: w,
        height: h,
        borderRadius: r,
        borderColor: active ? "var(--lg-accent)" : "currentColor",
        opacity: active ? 1 : 0.6,
      }}
    />
  );
}

/** A loose glass lens: drag it across the content to watch it refract. */
function DraggableLens({
  lens,
  shape,
  scale,
}: {
  lens: Record<string, unknown>;
  shape: ShapeKey;
  scale: number;
}) {
  const [pos, setPos] = useState({ x: 220, y: 300 });
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const s = SHAPES[shape];
  const w = Math.round(s.w * scale);
  const h = Math.round(s.h * scale);
  const radius = s.r === "capsule" ? "capsule" : Math.round(s.r * scale);

  const down = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
  };
  const move = (e: PointerEvent<HTMLElement>) => {
    if (drag.current) setPos({ x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy });
  };
  const up = () => (drag.current = null);

  return (
    <Glass
      {...lens}
      size="small"
      radius={radius}
      interactive
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      className="fixed z-10 grid cursor-grab place-items-center text-[13px] font-semibold active:cursor-grabbing"
      style={{
        left: pos.x,
        top: pos.y,
        width: w,
        height: h,
        touchAction: "none",
        transition:
          "width .45s var(--lg-spring-snappy), height .45s var(--lg-spring-snappy), border-radius .45s var(--lg-spring-snappy), transform .3s",
      }}
    >
      <span className="opacity-60">drag me</span>
    </Glass>
  );
}
