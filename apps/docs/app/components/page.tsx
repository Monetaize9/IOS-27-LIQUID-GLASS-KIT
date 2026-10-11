"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Alert,
  Button,
  Carousel,
  Glass,
  Menu,
  NavigationBar,
  PageControl,
  Progress,
  Reveal,
  SearchField,
  SegmentedControl,
  Sheet,
  Slider,
  Spinner,
  Stepper,
  TabBar,
  Toggle,
  toast,
} from "liquid-glass-kit";
import {
  ArrowUpDown,
  Bell,
  Bookmark,
  Calendar,
  Camera,
  Check,
  CircleUser,
  Copy,
  Grid2x2,
  Heart,
  List,
  Moon,
  Pencil,
  Plus,
  Search,
  Share,
  Sparkles,
  Sun,
  Trash2,
  Volume1,
  Volume2,
  Wifi,
} from "lucide-react";
import { Wallpaper } from "@/components/Wallpaper";
import { PageSwitcher } from "@/components/PageSwitcher";
import { TintedGlassDemo } from "@/components/TintedGlassDemo";

const SLIDES = [
  { title: "Liquid Glass", sub: "A new material", from: "#0088ff", to: "#6155f5" },
  { title: "Refraction", sub: "Light bends at the edge", from: "#ff2d55", to: "#ff8d28" },
  { title: "Motion", sub: "Springs, not easings", from: "#34c759", to: "#00c3d0" },
  { title: "Transparency", sub: "Clear to tinted", from: "#cb30e0", to: "#ff2d55" },
  { title: "Shapes", sub: "Capsules and concentric corners", from: "#ffcc00", to: "#ff8d28" },
];

export default function ComponentsPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [alert, setAlert] = useState<null | "simple" | "destructive" | "stacked">(null);
  const [sort, setSort] = useState("date");
  const [view, setView] = useState("grid");
  const [tab, setTab] = useState("listen");
  const [page, setPage] = useState(0);
  const [qty, setQty] = useState(2);
  const [volume, setVolume] = useState(0.6);
  const [progress, setProgress] = useState(0.35);

  useEffect(() => {
    const t = window.setInterval(() => setProgress((p) => (p >= 1 ? 0 : p + 0.05)), 400);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="relative min-h-screen pb-40">
      <Wallpaper kind="aurora" />

      <NavigationBar
        largeTitle
        title="Components"
        leading={<PageSwitcher align="start" />}
        trailing={
          <Menu
            shape="circle"
            align="end"
            aria-label="Sort"
            icon={<ArrowUpDown />}
            items={[
              { title: "Sort By" },
              { label: "Date", checked: sort === "date", onSelect: () => setSort("date") },
              { label: "Name", checked: sort === "name", onSelect: () => setSort("name") },
              { label: "Size", checked: sort === "size", onSelect: () => setSort("size") },
              { separator: true },
              { label: "Show Hidden", description: "Including system files", onSelect: () => toast("Showing hidden files") },
            ]}
          />
        }
      />

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 text-[var(--lg-label)]">
        <p className="-mt-1 px-1 text-[17px] text-white/85">
          Every control, live. Press and drag — thumbs turn into glass lenses, indicators slide on springs.
        </p>

        {/* ---------------- Buttons ---------------- */}
        <Section title="Buttons" note="glass · prominent · tinted · filled · plain — small, medium, large — capsule, rounded, circle">
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => toast("Glass")}>Glass</Button>
            <Button variant="prominent" onClick={() => toast("Prominent")}>Prominent</Button>
            <Button variant="tinted" onClick={() => toast("Tinted")}>Tinted</Button>
            <Button variant="filled" onClick={() => toast("Filled")}>Filled</Button>
            <Button variant="plain" onClick={() => toast("Plain")}>Plain</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
            <Button variant="prominent" size="large" icon={<Plus />}>New Item</Button>
            <Button shape="rounded" icon={<Pencil />}>Rounded</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button shape="circle" size="small" icon={<Heart />} aria-label="Like" onClick={() => toast("Liked")} />
            <Button shape="circle" icon={<Share />} aria-label="Share" onClick={() => toast("Shared")} />
            <Button shape="circle" size="large" icon={<Camera />} aria-label="Camera" onClick={() => toast("Camera")} />
            <Button shape="circle" variant="prominent" icon={<Plus />} aria-label="Add" onClick={() => toast("Added")} />
            <Button shape="circle" variant="prominent" tint="var(--lg-pink)" icon={<Heart />} aria-label="Love" onClick={() => toast("Loved")} />
            <Button variant="prominent" tint="var(--lg-green)" icon={<Check />}>Confirm</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Section>

        {/* ---------------- Tinted glass ---------------- */}
        <Section title="Tinted glass buttons" note="Pick a style and a colour — content behind stays visible and bends through" bleed>
          <TintedGlassDemo />
        </Section>

        {/* ---------------- Menus ---------------- */}
        <Section title="Menu buttons" note="Morphs out of its button · arrow keys, Esc, click-outside">
          <div className="flex flex-wrap items-center gap-3">
            <Menu
              label="Actions"
              items={[
                { label: "Copy", icon: <Copy />, onSelect: () => toast("Copied") },
                { label: "Bookmark", icon: <Bookmark />, onSelect: () => toast("Bookmarked") },
                { label: "Share…", icon: <Share />, onSelect: () => toast("Shared") },
                { separator: true },
                { label: "Delete", icon: <Trash2 />, destructive: true, onSelect: () => setAlert("destructive") },
              ]}
            />
            <Menu
              label={view === "grid" ? "Grid" : "List"}
              icon={view === "grid" ? <Grid2x2 /> : <List />}
              variant="tinted"
              items={[
                { title: "View as" },
                { label: "Grid", icon: <Grid2x2 />, checked: view === "grid", onSelect: () => setView("grid") },
                { label: "List", icon: <List />, checked: view === "list", onSelect: () => setView("list") },
              ]}
            />
            <Menu
              shape="circle"
              variant="prominent"
              icon={<Plus />}
              aria-label="Create"
              items={[
                { label: "New Event", icon: <Calendar />, description: "Add to your calendar", onSelect: () => toast("Event created") },
                { label: "New Reminder", icon: <Bell />, onSelect: () => toast("Reminder created") },
                { label: "New Contact", icon: <CircleUser />, disabled: true },
              ]}
            />
          </div>
        </Section>

        {/* ---------------- Toggles / sliders / steppers ---------------- */}
        <Section title="Toggles, sliders & steppers" note="Press or drag a thumb — it lifts into a lens">
          <Rows>
            <ListRow icon={<Wifi />} tint="var(--lg-blue)" label="Wi-Fi">
              <Toggle aria-label="Wi-Fi" defaultChecked onCheckedChange={(on) => toast(on ? "Wi-Fi on" : "Wi-Fi off")} />
            </ListRow>
            <ListRow icon={<Moon />} tint="var(--lg-indigo)" label="Focus">
              <Toggle aria-label="Focus" tint="var(--lg-indigo)" />
            </ListRow>
            <ListRow icon={<Bell />} tint="var(--lg-red)" label="Disabled">
              <Toggle aria-label="Disabled" disabled />
            </ListRow>
            <ListRow icon={<Sparkles />} tint="var(--lg-orange)" label={`Quantity: ${qty}`}>
              <Stepper aria-label="Quantity" min={0} max={10} value={qty} onValueChange={setQty} />
            </ListRow>
          </Rows>
          <Slider
            aria-label="Volume"
            value={volume}
            onValueChange={setVolume}
            leading={<Volume1 className="size-5" />}
            trailing={<Volume2 className="size-5" />}
          />
          <Slider
            aria-label="Brightness"
            defaultValue={0.4}
            tint="var(--lg-orange)"
            leading={<Sun className="size-4" />}
            trailing={<Sun className="size-6" />}
          />
          <Slider aria-label="Stepped" defaultValue={3} min={0} max={10} step={1} tint="var(--lg-green)" />
        </Section>

        {/* ---------------- Segmented ---------------- */}
        <Section title="Segmented controls" note="Tap a segment or drag the selection">
          <SegmentedControl
            aria-label="Range"
            options={[
              { value: "d", label: "Day" },
              { value: "w", label: "Week" },
              { value: "m", label: "Month" },
              { value: "y", label: "Year" },
            ]}
            defaultValue="w"
          />
          <SegmentedControl
            block
            size="large"
            aria-label="Mode"
            options={[
              { value: "light", label: "Light", icon: <Sun /> },
              { value: "dark", label: "Dark", icon: <Moon /> },
            ]}
            defaultValue="light"
          />
        </Section>

        {/* ---------------- Search ---------------- */}
        <Section title="Search field">
          <SearchField placeholder="Search components" onSubmit={(q) => toast(`Searching “${q}”`, { icon: <Search /> })} />
        </Section>

        {/* ---------------- Carousel ---------------- */}
        <Section title="Carousel" note="Swipe, drag with the mouse, use arrows or dots — autoplays, scales off-centre slides" bleed>
          <Carousel effect="scale" autoPlay={4000} loop aria-label="Feature highlights">
            {SLIDES.map((s) => (
              <div
                key={s.title}
                className="flex aspect-[16/10] flex-col justify-end rounded-[28px] p-6 text-white shadow-xl select-none"
                style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}
              >
                <div className="text-3xl font-bold">{s.title}</div>
                <div className="text-lg opacity-85">{s.sub}</div>
              </div>
            ))}
          </Carousel>
          <div className="flex items-center justify-between px-4">
            <span className="text-[15px] opacity-70">Standalone page control</span>
            <PageControl count={5} index={page} onIndexChange={setPage} />
          </div>
        </Section>

        {/* ---------------- Sheets / alerts / toasts ---------------- */}
        <Section title="Sheets, alerts & toasts" note="Drag the sheet between half and full height, or pull it down to dismiss">
          <div className="flex flex-wrap gap-3">
            <Button variant="prominent" onClick={() => setSheetOpen(true)}>Open Sheet</Button>
            <Button onClick={() => setAlert("simple")}>Alert</Button>
            <Button onClick={() => setAlert("destructive")}>Destructive Alert</Button>
            <Button onClick={() => setAlert("stacked")}>Stacked Actions</Button>
            <Button onClick={() => toast("Message sent", { icon: <Check className="text-[var(--lg-green)]" />, description: "Delivered just now" })}>
              Toast
            </Button>
            <Button
              onClick={() =>
                toast("Photo deleted", {
                  icon: <Trash2 />,
                  action: { label: "Undo", onPress: () => toast("Restored") },
                  duration: 5000,
                })
              }
            >
              Toast with Undo
            </Button>
          </div>
        </Section>

        {/* ---------------- Progress ---------------- */}
        <Section title="Progress">
          <Progress value={progress} aria-label="Download" />
          <Progress aria-label="Loading" tint="var(--lg-green)" />
          <div className="flex items-center gap-4">
            <Spinner />
            <Spinner size={32} />
            <span className="text-[15px] opacity-70">Loading…</span>
          </div>
        </Section>

        {/* ---------------- Tab bar ---------------- */}
        <Section title="Tab bar" note="The floating bar below — drag the selection, scroll to minimize, search is the iOS 27 Prominent Tab">
          <p className="text-[15px] opacity-70">Selected: {tab}</p>
        </Section>

        <Section title="Scroll reveal" note="These cards spring in as they enter the viewport">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(["rise", "scale", "blur", "fade"] as const).map((effect, i) => (
              <Reveal key={effect} effect={effect} delay={i * 90} repeat>
                <div className="grid aspect-square place-items-center rounded-3xl bg-[var(--lg-fill-tertiary)] text-[15px] font-semibold capitalize">
                  {effect}
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      </main>

      <TabBar
        floating
        minimizeOnScroll
        value={tab}
        onValueChange={setTab}
        items={[
          { value: "listen", label: "Listen Now", icon: <Sparkles /> },
          { value: "browse", label: "Browse", icon: <Grid2x2 /> },
          { value: "library", label: "Library", icon: <List />, badge: 2 },
        ]}
        prominent={{ icon: <Search />, label: "Search", onPress: () => toast("Search", { icon: <Search /> }) }}
      />

      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="New Event"
        leading={<Button size="small" onClick={() => setSheetOpen(false)}>Cancel</Button>}
        trailing={
          <Button
            size="small"
            variant="prominent"
            onClick={() => {
              setSheetOpen(false);
              toast("Event added", { icon: <Calendar /> });
            }}
          >
            Add
          </Button>
        }
      >
        <div className="flex flex-col gap-4 pt-2">
          <SearchField placeholder="Title" />
          <Rows>
            <ListRow icon={<Calendar />} tint="var(--lg-red)" label="All-day">
              <Toggle aria-label="All-day" />
            </ListRow>
            <ListRow icon={<Bell />} tint="var(--lg-orange)" label="Alert">
              <Toggle aria-label="Alert" defaultChecked />
            </ListRow>
          </Rows>
          <SegmentedControl
            block
            aria-label="Repeat"
            options={[
              { value: "never", label: "Never" },
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
            ]}
          />
          {Array.from({ length: 8 }, (_, i) => (
            <p key={i} className="text-[15px] leading-relaxed opacity-70">
              Sheets rest at medium and large detents. Drag the header up to expand, down to collapse,
              and flick down to dismiss. Content scrolls independently.
            </p>
          ))}
        </div>
      </Sheet>

      <Alert
        open={alert === "simple"}
        onOpenChange={() => setAlert(null)}
        title="Allow Notifications?"
        message="Liquid Glass Kit would like to send you notifications about new components."
        actions={[
          { label: "Don’t Allow", role: "cancel" },
          { label: "Allow", primary: true, onPress: () => toast("Notifications on", { icon: <Bell /> }) },
        ]}
      />
      <Alert
        open={alert === "destructive"}
        onOpenChange={() => setAlert(null)}
        title="Delete this item?"
        message="This can’t be undone."
        actions={[
          { label: "Cancel", role: "cancel" },
          { label: "Delete", role: "destructive", primary: true, onPress: () => toast("Deleted", { icon: <Trash2 /> }) },
        ]}
      />
      <Alert
        open={alert === "stacked"}
        onOpenChange={() => setAlert(null)}
        title="Save changes?"
        message="You have unsaved edits to this page."
        actions={[
          { label: "Save", primary: true, onPress: () => toast("Saved") },
          { label: "Discard", role: "destructive" },
          { label: "Cancel", role: "cancel" },
        ]}
      />
    </div>
  );
}

function Section({ title, note, bleed, children }: { title: string; note?: string; bleed?: boolean; children: ReactNode }) {
  return (
    <Reveal>
      <Glass className={`flex flex-col gap-4 ${bleed ? "px-0 py-5" : "p-5"}`}>
        <header className={bleed ? "px-5" : undefined}>
          <h2 className="text-[20px] font-semibold tracking-tight">{title}</h2>
          {note && <p className="text-[13px] opacity-60">{note}</p>}
        </header>
        {children}
      </Glass>
    </Reveal>
  );
}

function Rows({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y divide-[var(--lg-separator)] overflow-hidden rounded-[20px] bg-[var(--lg-fill-tertiary)]">{children}</div>;
}

function ListRow({ icon, tint, label, children }: { icon: ReactNode; tint: string; label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-[52px] items-center gap-3 px-4 py-2">
      <span className="grid size-[30px] place-items-center rounded-[8px] text-white [&>svg]:size-[18px]" style={{ background: tint }}>
        {icon}
      </span>
      <span className="flex-1 text-[17px]">{label}</span>
      {children}
    </div>
  );
}
