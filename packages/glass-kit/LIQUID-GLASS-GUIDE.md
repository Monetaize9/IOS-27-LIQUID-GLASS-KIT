# Liquid Glass Kit — Guide for AI agents

> **You are an AI coding agent asked to "upgrade a website with the Liquid Glass Kit".**
> Read this whole file first. It is the source of truth: the rules, the component
> catalog, and a step-by-step upgrade procedure. Follow it instead of inventing
> your own glass styles.

The kit reproduces Apple's iOS 27 Liquid Glass for React 19 / Next.js (App Router)
/ Tailwind CSS 4 / TypeScript. Package name: `liquid-glass-kit`.

---

## 1. Golden rules (read before writing any code)

1. **Glass is for the floating control layer, not content.** Use it on nav bars,
   tab bars, toolbars, floating buttons, menus, sheets, alerts, toasts. Do NOT
   turn article text, long lists, tables, forms bodies or whole page backgrounds
   into glass.
2. **Never stack glass on glass.** A glass button goes inside a plain container or
   directly on content, not inside another `<Glass>` (exception: the kit's own
   composite components like `TabBar`, which handle this internally).
3. **Glass needs something behind it.** Over a flat white page it is invisible.
   Give hero sections and key areas colour, imagery or gradients so the glass
   has content to refract.
4. **One prominent action per view.** `variant="prominent"` (accent-filled glass)
   is for the primary action only — Save, Buy, Send. Everything else is
   `variant="glass"` (default) or `plain`.
5. **Upgrade, don't rewrite.** Keep the site's routes, data fetching, copy, SEO,
   analytics and business logic exactly as they are. Swap presentational
   elements for kit components one area at a time.
6. **Use the kit's components and tokens; never hand-roll glass CSS.** No custom
   `backdrop-filter` recipes — use `<Glass>` or a component built on it.
7. **Respect accessibility.** Keep labels, `aria-*`, focus order and keyboard
   behaviour. Icon-only buttons need `aria-label`. The kit already honours
   reduced motion / reduced transparency / increased contrast.
8. **Use presets, not random numbers.** Pick a `preset` (section 4) instead of
   tuning `bezel` / `thickness` / `refraction` by hand.

---

## 2. Install & setup (once per site)

```ts
// next.config.ts
const nextConfig = { transpilePackages: ["liquid-glass-kit"] };
```

```tsx
// app/layout.tsx  (root layout)
import { Toaster } from "liquid-glass-kit";
import "liquid-glass-kit/styles.css";   // before or after your globals.css — both work
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

All interactive components are client components (`"use client"` inside the kit).
You can render them from server components; pass only serialisable props, or
wrap event handlers in a small client component.

Tailwind classes passed via `className` always override kit styles (the kit sits
in `@layer components`).

---

## 3. Design tokens (CSS variables)

Use these instead of hard-coded colours so light/dark and the transparency
slider keep working.

| Purpose | Variables |
|---|---|
| Accent & system colours | `--lg-accent`, `--lg-red`, `--lg-orange`, `--lg-yellow`, `--lg-green`, `--lg-mint`, `--lg-teal`, `--lg-cyan`, `--lg-blue`, `--lg-indigo`, `--lg-purple`, `--lg-pink`, `--lg-brown`, `--lg-gray` |
| Text | `--lg-label`, `--lg-label-secondary`, `--lg-label-tertiary`, `--lg-label-on-accent` |
| Backgrounds | `--lg-bg`, `--lg-bg-secondary`, `--lg-bg-grouped`, `--lg-bg-grouped-cell` |
| Fills & lines | `--lg-fill`, `--lg-fill-secondary`, `--lg-fill-tertiary`, `--lg-separator` |
| Radii | `--lg-radius-sm` 10 · `--lg-radius-md` 13 · `--lg-radius-lg` 20 · `--lg-radius-xl` 26 · `--lg-radius-glass` 34 · `--lg-radius-sheet` 38 · `--lg-radius-pill` |
| Type (CSS `font` shorthand) | `--lg-text-large-title`, `--lg-text-title1..3`, `--lg-text-headline`, `--lg-text-body`, `--lg-text-callout`, `--lg-text-subheadline`, `--lg-text-footnote`, `--lg-text-caption1..2` |
| Motion | `--lg-spring-snappy` / `-duration`, `--lg-spring-smooth`, `--lg-spring-bouncy`, `--lg-spring-gentle`, `--lg-ease-out`, `--lg-ease-standard` |
| Transparency (iOS 27 slider) | `--lg-transparency` 0 (tinted) → 1 (ultra clear), default 0.5 |

Tailwind example: `className="text-[var(--lg-label-secondary)] rounded-[var(--lg-radius-xl)]"`.

Theme: set `data-theme="light" | "dark"` on `<html>` (or let `useGlassSettings`
do it). Without it the kit follows the OS.

---

## 4. Presets — named looks

`<Glass preset="…">` (explicit props still override). Exported as `GLASS_PRESETS`.

| Preset | Look | Use for |
|---|---|---|
| `ios` | Apple regular glass (default) | Bars, toolbars, cards, sheets — the safe choice |
| `subtle` | Light lensing | Dense UI, text-heavy panels |
| `frosted` | No lensing, pure blur | Maximum legibility |
| `droplet` | Clear, thick lens | Floating buttons/accents over photos or colour |
| `crystal` | Clear + rainbow fringe | Showpiece elements over media |
| `magnifier` | Very strong lens | Demos, draggable lenses — not everyday chrome |

**Transparency presets** (site-wide, via `setGlassSettings({ transparency })` or the
`<TransparencySlider />`): Tinted 0 · Frosted 0.25 · Default 0.5 · Clear 0.75 · Ultra Clear 1.

**Tinted-glass styles** (`<Button variant="tinted-glass" tintStyle="…" tint="#2f7cf6">`, also
`<Glass tint="…" tintStyle="…">`). Exported as `TINT_STYLES`.

| tintStyle | Look | Use for |
|---|---|---|
| `liquid` | Crisp backdrop, deep lensing, medium colour (iOS tinted glass) | CTAs over photos/video — default |
| `clear` | Faint colour, strongest lensing | Busy, high-contrast media only |
| `frosted` | Coloured frosted glass, background blurred | Best legibility |
| `vivid` | Strong saturated colour, lensing at the rim | Primary CTA on plainer backgrounds |
| `deep` | Darker smoked colour | Premium / night look |

**Choosing:** default to `ios`. Over photos/video/colourful heroes → `droplet`.
Lots of text on the glass → `subtle` or `frosted`. If unsure → `ios`.

---

## 5. Component catalog

Import everything from `"liquid-glass-kit"`.

### Material
- **`<Glass>`** — the base surface. Props: `as` (element), `preset`,
  `variant` `"regular" | "clear" | "identity"`, `size` `"large" | "small"`,
  `radius` (px or `"capsule"` — keep in sync with any CSS radius),
  `refraction` (bool or strength), `bezel`, `thickness`, `dispersion`,
  `tint` (CSS colour → accent glass), `interactive` (press/hover response),
  `disabled`, plus normal HTML attributes. Use for custom floating panels.
  `"clear"` only over media/colour. `"identity"` = no glass, same layout.

### Controls
- **`<Button>`** — `variant` `"glass"` (default) `| "prominent" | "tinted-glass" | "tinted" | "filled" | "plain"`
  (`tinted-glass` = translucent coloured glass for CTAs over photos/video; colour via `tint`, look via
  `tintStyle` `"liquid"` (default) `| "clear" | "frosted" | "vivid" | "deep"` — see section 4),
  `size` `"small" | "medium" | "large"` (34/44/52px), `shape` `"capsule" | "rounded" | "circle"`,
  `icon`, `iconPosition`, `tint`. Circle buttons need `aria-label`.
- **`<Toggle>`** — iOS switch. `checked` / `defaultChecked`, `onCheckedChange`, `tint`, `aria-label`.
- **`<Slider>`** — `value` / `defaultValue`, `min`, `max`, `step`, `onValueChange`, `onValueCommit`, `leading`, `trailing`, `tint`, `aria-label`.
- **`<SegmentedControl>`** — `options=[{ value, label?, icon? }]`, `value` / `defaultValue`, `onValueChange`, `size`, `block` (full width).
- **`<Stepper>`** — `value` / `defaultValue`, `min`, `max`, `step`, `onValueChange`.
- **`<SearchField>`** — `value` / `defaultValue`, `onValueChange`, `onSubmit(value)`, `placeholder`.
- **`<Menu>`** — pull-down menu; renders its own trigger `Button` (accepts all Button props) plus
  `label`, `items`, `align` `"start" | "center" | "end"`, `width`.
  Items: `{ label, icon?, onSelect?, destructive?, disabled?, checked?, description? }`,
  `{ separator: true }`, `{ title: "Section" }`.

### Navigation
- **`<TabBar>`** — `items=[{ value, label, icon, badge? }]`, `value` / `defaultValue`, `onValueChange`,
  `prominent={{ icon, label, onPress, active? }}` (iOS 27 separate search/action capsule),
  `floating` (fixed bottom), `minimizeOnScroll`. Mobile-first; on desktop prefer a top nav.
- **`<NavigationBar>`** — `title`, `largeTitle`, `leading`, `trailing`, `edge` `"soft" | "hard"`, `position` `"fixed" | "sticky"`, `scrollRef`.
  Fixed by default: add top padding to the page or use `largeTitle` (renders the big title in flow).
- **`<ScrollEdge>`** — blur/fade where content scrolls under a bar: `edge` `"top" | "bottom"`, `variant`, `height`, `visible`.
- **`<Carousel>`** — children are slides. `slideWidth` (CSS length, default `"85%"`), `gap`, `showArrows`, `showDots`, `autoPlay` (ms), `loop`, `effect` `"none" | "scale"`.
- **`<PageControl>`** — dots: `count`, `index`, `onIndexChange`, `glass`.

### Presentation & feedback
- **`<Sheet>`** — bottom sheet: `open`, `onOpenChange`, `detents` (`["medium","large"]`), `title`, `leading`, `trailing`, children.
- **`<Alert>`** — `open`, `onOpenChange`, `title`, `message`, `actions=[{ label, role?: "default"|"cancel"|"destructive", primary?, onPress? }]`.
- **`toast(title, { icon?, description?, duration?, action?: { label, onPress } })`** — needs `<Toaster />` in the layout once.
- **`<Progress value={0..1} />`** (omit `value` = indeterminate), **`<Spinner size />`**.
- **`<Reveal effect="rise"|"fade"|"scale"|"blur" delay={ms} repeat>`** — springs content in on scroll. Use on marketing sections, staggered by ~80ms.

### Appearance
- **`<TransparencySlider />`**, **`<GlassAppearancePanel />`** — drop-in settings UI.
- **`useGlassSettings()`** → `[settings, set]`; `settings = { transparency, theme: "light"|"dark"|"system", refraction }`. Persisted in localStorage.

---

## 6. Upgrade recipes — old element → kit

| Existing element | Replace with |
|---|---|
| Sticky/fixed site header | `<Glass radius="capsule">` floating bar with `top-4` inset, nav links inside; or `<NavigationBar>` |
| Primary CTA button | `<Button variant="prominent" size="large">` |
| CTA over a photo/video/hero ("Watch more", "Shop now") | `<Button variant="tinted-glass" size="large">` (optionally `tint`) |
| Secondary buttons | `<Button>` (glass) or `variant="tinted"` |
| Text links styled as buttons | `<Button variant="plain">` |
| Icon buttons (share, close, menu) | `<Button shape="circle" icon={…} aria-label="…">` |
| Dropdown / kebab menu | `<Menu>` |
| Checkbox for on/off settings | `<Toggle>` |
| Range input | `<Slider>` |
| Tabs / radio button group (2–5 options) | `<SegmentedControl>` |
| Search input | `<SearchField>` |
| Modal dialog with a form/content | `<Sheet>` |
| Confirm dialog (yes/no) | `<Alert>` |
| Notification / snackbar | `toast()` |
| Image slider / testimonials | `<Carousel effect="scale">` |
| Mobile bottom nav | `<TabBar floating>` |
| Loading states | `<Spinner>` / `<Progress>` |
| Feature cards on a colourful section | `<Glass>` cards (preset `ios`), wrapped in `<Reveal>` |
| Plain marketing sections | Keep as content; add `<Reveal>` for entrance motion |

---

## 7. Upgrade procedure (follow in order)

1. **Audit.** List the site's pages and the UI elements on them. Map each to a
   recipe in section 6. Note anything with no match — leave it alone.
2. **Setup.** Do section 2. Build and confirm nothing changed visually yet.
3. **Backgrounds first.** Give hero / key sections colour, imagery or gradients
   so glass has something to refract. Keep brand colours.
4. **Chrome.** Header/nav → floating glass. Mobile nav → `TabBar` if appropriate.
5. **Actions.** Buttons → `Button` (one `prominent` per view). Dropdowns → `Menu`.
6. **Inputs.** Toggles, sliders, segmented, search.
7. **Overlays.** Modals → `Sheet` / `Alert`; snackbars → `toast()`.
8. **Motion.** `Reveal` on sections; `Carousel` for sliders.
9. **Verify after every step:** builds, type-checks, light + dark mode, mobile
   width, keyboard navigation, and text contrast on glass. Fix before moving on.

Do one area per commit/step so changes stay reviewable and reversible.

---

## 8. Don'ts

- Don't write custom `backdrop-filter`, `blur()` or glass gradients — use `<Glass>`.
- Don't put `<Glass>` inside `<Glass>`.
- Don't use `variant="clear"` over plain white/black — it disappears.
- Don't make every button prominent.
- Don't apply `opacity`, `filter` or `mask` to an ancestor of glass — browsers then
  cut the glass off from what's behind it and it looks flat.
- Don't change routes, data loading, copy, SEO metadata or tracking while restyling.
- Don't remove accessibility attributes or focus styles.

---

## 9. Browser support

Full refraction (lensing) runs in Chromium browsers (Chrome, Edge, Arc, Brave,
Opera). Safari and Firefox automatically get frosted glass with the same tint,
rim and shadows. No action needed — never add browser checks yourself.

## 10. Reference

Live demos of every component: `apps/docs` in the kit repo
(`/` playground, `/components`, `/settings`, `/lab`).
