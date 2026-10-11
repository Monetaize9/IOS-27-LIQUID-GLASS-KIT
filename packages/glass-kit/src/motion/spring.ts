/**
 * Damped springs, parameterised like SwiftUI: `response` is the undamped
 * period in seconds, `damping` the damping ratio (1 = no overshoot).
 */
export interface SpringConfig {
  response: number;
  damping: number;
}

export const springs = {
  smooth: { response: 0.55, damping: 1 },
  snappy: { response: 0.3, damping: 0.8 },
  bouncy: { response: 0.5, damping: 0.65 },
  gentle: { response: 0.55, damping: 0.825 },
} satisfies Record<string, SpringConfig>;

/** Normalised step response x(t): 0 → 1. */
export function springValue({ response, damping }: SpringConfig, t: number): number {
  const w0 = (2 * Math.PI) / response;
  if (damping < 1) {
    const wd = w0 * Math.sqrt(1 - damping * damping);
    return (
      1 -
      Math.exp(-damping * w0 * t) * (Math.cos(wd * t) + ((damping * w0) / wd) * Math.sin(wd * t))
    );
  }
  return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
}

/** Time (s) for the response to settle within 0.1% of its target. */
export function springDuration(config: SpringConfig): number {
  for (let t = 0; t < 5; t += 0.001) {
    if (Math.abs(1 - springValue(config, t)) < 0.001 && Math.abs(1 - springValue(config, t + 0.05)) < 0.001) {
      return t;
    }
  }
  return 5;
}

/** CSS `linear()` easing + duration that reproduce the spring. */
export function springEasing(config: SpringConfig, points = 32): { easing: string; duration: number } {
  const duration = springDuration(config);
  const values: string[] = [];
  for (let i = 0; i < points; i++) {
    values.push(springValue(config, (duration * i) / points).toFixed(4).replace(/\.?0+$/, ""));
  }
  values.push("1");
  return { easing: `linear(${values.join(", ")})`, duration };
}
