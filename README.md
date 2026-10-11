# iOS 27 Liquid Glass Kit

Apple's iOS 27 **Liquid Glass** for the web — a drop-in UI kit for **React 19 / Next.js 16 / Tailwind CSS 4 / TypeScript**.

- **Real refraction** — content behind glass bends at the edges (full effect in Chromium; Safari/Firefox get frosted glass automatically)
- **iOS 27 transparency slider** — Tinted ↔ Clear, site-wide, remembered
- **20+ components** — Button (incl. tinted glass), Toggle, Slider, Segmented control, Tab bar, Menu, Carousel, Sheet, Alert, Toast, Navigation bar, Search, Stepper, Progress and more
- **Presets** — named looks (`ios`, `subtle`, `frosted`, `droplet`, `crystal`, `magnifier`) and tinted-glass styles (`liquid`, `clear`, `frosted`, `vivid`, `deep`)
- **Spring motion**, light/dark, accessibility (reduced motion/transparency, increased contrast)

## For AI coding tools

Point your AI IDE at **[`packages/glass-kit/LIQUID-GLASS-GUIDE.md`](packages/glass-kit/LIQUID-GLASS-GUIDE.md)** — rules, component catalog, presets and a step-by-step procedure for upgrading an existing site without breaking it.

> "Follow LIQUID-GLASS-GUIDE.md and upgrade my website with the Liquid Glass Kit. Show me the plan before changing code."

## Run the demo

```bash
npm install
npm run dev        # http://localhost:3000
```

Pages: `/` playground · `/components` every component · `/settings` iOS-style appearance · `/lab` lensing bench.

## Use in your site

```ts
// next.config.ts
export default { transpilePackages: ["liquid-glass-kit"] };
```

```tsx
// app/layout.tsx
import { Toaster } from "liquid-glass-kit";
import "liquid-glass-kit/styles.css";
// <body>{children}<Toaster /></body>
```

```tsx
import { Button, Glass } from "liquid-glass-kit";

<Button variant="prominent">Buy</Button>
<Button variant="tinted-glass" tint="#2f7cf6">Watch more</Button>
<Glass preset="droplet" className="p-4">…</Glass>
```

## Layout

```
packages/glass-kit/   the kit (src/, LIQUID-GLASS-GUIDE.md)
apps/docs/            demo site (Next.js)
```

Material values are calibrated from Apple's published iOS 27 design kit measurements via
[seunghan91/ios27-design-system](https://github.com/seunghan91/ios27-design-system) (MIT).
Not affiliated with or endorsed by Apple. Apple, iOS and Liquid Glass are trademarks of Apple Inc.
