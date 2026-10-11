/**
 * Lens map generator — the core of the refraction effect.
 *
 * A glass surface is modelled as a slab with a curved bezel around its edge.
 * For every pixel inside the bezel we compute how far a vertical view ray is
 * bent (Snell's law) and encode that offset into an RGBA displacement map that
 * an SVG <feDisplacementMap> consumes: R = x offset, G = y offset, 128 = none.
 *
 * Offsets point inward, so the bezel shows magnified content pulled from the
 * interior — the "lensing" edge that defines Liquid Glass. The flat interior
 * is left undistorted, as on device.
 */

export type BezelProfile = "squircle" | "circle" | "linear";

export interface LensOptions {
  /** Element width in CSS px. */
  width: number;
  /** Element height in CSS px. */
  height: number;
  /** Corner radius in CSS px (clamped to half the short side). */
  radius: number;
  /** Width of the curved edge zone in CSS px. */
  bezel: number;
  /** Glass height at the top of the bezel in CSS px — drives offset size. */
  thickness: number;
  /** Index of refraction. Glass ≈ 1.5. */
  ior: number;
  /** Shape of the bezel cross-section. */
  profile?: BezelProfile;
}

export interface LensMap {
  /** PNG data URL for <feImage href>. */
  href: string;
  /** feDisplacementMap scale that maps the encoded range back to px. */
  scale: number;
  width: number;
  height: number;
}

const PROFILE_SAMPLES = 256;

/** Surface height h(t) and slope h'(t) for t ∈ (0, 1], t = 0 at the outer edge. */
function profileAt(profile: BezelProfile, t: number): [number, number] {
  const u = 1 - t;
  switch (profile) {
    case "circle": {
      const h = Math.sqrt(Math.max(0, 1 - u * u));
      return [h, u / Math.max(h, 1e-4)];
    }
    case "linear":
      return [t, 1];
    case "squircle":
    default: {
      const inner = Math.max(1e-6, 1 - u ** 4);
      return [inner ** 0.25, u ** 3 / inner ** 0.75];
    }
  }
}

/**
 * Lateral displacement (px) across the bezel, sampled from the outer edge
 * inward. Each sample: ray hits the slope, refracts, travels down through the
 * glass column and lands offset from where it entered.
 */
function displacementProfile(
  bezel: number,
  thickness: number,
  ior: number,
  profile: BezelProfile,
): { samples: Float32Array; max: number } {
  const samples = new Float32Array(PROFILE_SAMPLES);
  let max = 0;
  for (let i = 0; i < PROFILE_SAMPLES; i++) {
    const t = (i + 0.5) / PROFILE_SAMPLES;
    const [h, dh] = profileAt(profile, t);
    const slope = (thickness * dh) / bezel;
    const incidence = Math.atan(slope);
    const refracted = Math.asin(Math.sin(incidence) / ior);
    const d = thickness * h * Math.tan(incidence - refracted);
    samples[i] = d;
    if (d > max) max = d;
  }
  return { samples, max };
}

const cache = new Map<string, LensMap>();
const CACHE_LIMIT = 64;

function cacheKey(o: Required<LensOptions>): string {
  return [o.width, o.height, o.radius, o.bezel, o.thickness, o.ior, o.profile].join("|");
}

export function createLensMap(options: LensOptions): LensMap | null {
  if (typeof document === "undefined") return null;

  const width = Math.max(1, Math.round(options.width));
  const height = Math.max(1, Math.round(options.height));
  const radius = Math.min(Math.max(0, options.radius), width / 2, height / 2);
  const bezel = Math.max(1, Math.min(options.bezel, width / 2, height / 2));
  const resolved: Required<LensOptions> = {
    width,
    height,
    radius: Math.round(radius * 10) / 10,
    bezel: Math.round(bezel * 10) / 10,
    thickness: options.thickness,
    ior: options.ior,
    profile: options.profile ?? "squircle",
  };

  const key = cacheKey(resolved);
  const hit = cache.get(key);
  if (hit) return hit;

  const { samples, max } = displacementProfile(
    resolved.bezel,
    resolved.thickness,
    resolved.ior,
    resolved.profile,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const image = ctx.createImageData(width, height);
  const data = image.data;
  const hw = width / 2;
  const hh = height / 2;
  const r = resolved.radius;
  const innerW = hw - r;
  const innerH = hh - r;

  for (let y = 0; y < height; y++) {
    const py = y + 0.5 - hh;
    const ay = Math.abs(py);
    for (let x = 0; x < width; x++) {
      const px = x + 0.5 - hw;
      const ax = Math.abs(px);
      const i = (y * width + x) * 4;

      // Signed distance to the rounded rect; negative inside.
      const qx = ax - innerW;
      const qy = ay - innerH;
      const ox = Math.max(qx, 0);
      const oy = Math.max(qy, 0);
      const outside = Math.hypot(ox, oy);
      const dist = outside + Math.min(Math.max(qx, qy), 0) - r;
      const depth = -dist; // distance inward from the edge

      let vx = 0;
      let vy = 0;
      if (depth > 0 && depth < resolved.bezel && max > 0) {
        // Outward normal of the nearest edge.
        let nx: number;
        let ny: number;
        if (qx > 0 && qy > 0) {
          nx = ox / outside;
          ny = oy / outside;
        } else if (qx > qy) {
          nx = 1;
          ny = 0;
        } else {
          nx = 0;
          ny = 1;
        }
        nx *= Math.sign(px) || 1;
        ny *= Math.sign(py) || 1;

        const s = Math.min(
          PROFILE_SAMPLES - 1,
          Math.floor((depth / resolved.bezel) * PROFILE_SAMPLES),
        );
        const magnitude = samples[s] / max;
        vx = -nx * magnitude;
        vy = -ny * magnitude;
      }

      data[i] = 128 + vx * 127;
      data[i + 1] = 128 + vy * 127;
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
  const map: LensMap = {
    href: canvas.toDataURL("image/png"),
    // offset = scale · (C − 0.5) and C − 0.5 ≈ v / 2, so scale = 2·max.
    scale: max * 2,
    width,
    height,
  };

  if (cache.size >= CACHE_LIMIT) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, map);
  return map;
}
