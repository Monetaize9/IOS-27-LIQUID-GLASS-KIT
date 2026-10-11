import type { GlassVariant } from "./components/Glass";
import type { BezelProfile } from "./engine/lens-map";

export interface GlassPreset {
  label: string;
  /** When to reach for it — written for humans and AI agents alike. */
  use: string;
  variant: GlassVariant;
  /** Refraction strength multiplier (0 = frosted, no lensing). */
  refraction: number;
  bezel: number;
  thickness: number;
  dispersion: number;
  profile?: BezelProfile;
}

/**
 * Named material looks. Pass `preset="droplet"` to <Glass> (explicit props
 * still override), or spread `GLASS_PRESETS.droplet` into your own state.
 */
export const GLASS_PRESETS = {
  ios: {
    label: "iOS Default",
    use: "Bars, toolbars, cards, sheets. The safe default — matches Apple's regular glass.",
    variant: "regular",
    refraction: 1,
    bezel: 26,
    thickness: 46,
    dispersion: 0,
  },
  subtle: {
    label: "Subtle",
    use: "Dense UI and text-heavy panels where lensing would distract.",
    variant: "regular",
    refraction: 0.45,
    bezel: 16,
    thickness: 24,
    dispersion: 0,
  },
  frosted: {
    label: "Frosted",
    use: "Maximum legibility; no lensing at all. Also what Safari/Firefox show.",
    variant: "regular",
    refraction: 0,
    bezel: 26,
    thickness: 46,
    dispersion: 0,
  },
  droplet: {
    label: "Droplet",
    use: "Floating buttons and hero accents over photos or colourful backgrounds.",
    variant: "clear",
    refraction: 1.3,
    bezel: 36,
    thickness: 64,
    dispersion: 0.1,
  },
  crystal: {
    label: "Crystal",
    use: "Showpiece elements over media — clear glass with a rainbow fringe.",
    variant: "clear",
    refraction: 1.2,
    bezel: 30,
    thickness: 56,
    dispersion: 0.55,
  },
  magnifier: {
    label: "Magnifier",
    use: "Draggable lenses and playful demos. Too strong for everyday chrome.",
    variant: "clear",
    refraction: 2.2,
    bezel: 60,
    thickness: 90,
    dispersion: 0.15,
    profile: "circle",
  },
} satisfies Record<string, GlassPreset>;

export type GlassPresetName = keyof typeof GLASS_PRESETS;

/* ---------------------------------------------------------------------------
   Tinted-glass styles — colour washed into the glass itself. Used by
   <Button variant="tinted-glass" tintStyle="…"> and <Glass tint tintStyle="…">.
   `bezel: 999` means "curve the whole short side" (clamped to half the height),
   which gives the deep, stretched lensing of iOS tinted glass over media.
   ------------------------------------------------------------------------- */
export type TintStyle = "liquid" | "clear" | "frosted" | "vivid" | "deep";

export interface TintStylePreset {
  label: string;
  use: string;
  refraction: number;
  bezel: number;
  thickness: number;
  dispersion: number;
}

export const TINT_STYLES: Record<TintStyle, TintStylePreset> = {
  liquid: {
    label: "Liquid",
    use: "iOS tinted glass over photos/video — crisp content behind, deep lensing. The default.",
    refraction: 1.7,
    bezel: 999,
    thickness: 84,
    dispersion: 0.06,
  },
  clear: {
    label: "Clear",
    use: "Barely-there colour; the most see-through. Busy, high-contrast backgrounds only.",
    refraction: 1.9,
    bezel: 999,
    thickness: 92,
    dispersion: 0.15,
  },
  frosted: {
    label: "Frosted",
    use: "Coloured frosted glass — background blurred out, best legibility.",
    refraction: 0.8,
    bezel: 22,
    thickness: 40,
    dispersion: 0,
  },
  vivid: {
    label: "Vivid",
    use: "Strong, saturated colour with lensing only at the rim. Primary CTAs on plain pages.",
    refraction: 1.2,
    bezel: 999,
    thickness: 60,
    dispersion: 0,
  },
  deep: {
    label: "Deep",
    use: "Darker, richer smoked colour — premium/night look, white text pops.",
    refraction: 1.6,
    bezel: 999,
    thickness: 84,
    dispersion: 0.04,
  },
};
