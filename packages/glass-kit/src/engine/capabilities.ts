/**
 * Only Chromium renders SVG filters inside `backdrop-filter`. Safari and
 * Firefox accept the syntax but drop the whole declaration, so there is no
 * reliable CSS feature test — detect the engine instead.
 *
 * `navigator.userAgentData` exists only in Chromium (desktop and Android),
 * which is exactly the set we want; Chrome on iOS is WebKit and lacks it.
 */
let refractionSupport: boolean | undefined;

interface UADataNavigator extends Navigator {
  userAgentData?: { brands?: { brand: string }[] };
}

export function supportsRefraction(): boolean {
  if (refractionSupport !== undefined) return refractionSupport;
  if (typeof navigator === "undefined" || typeof document === "undefined") return false;

  const forced = document.documentElement.dataset.lgRefraction;
  if (forced === "off") return (refractionSupport = false);

  const brands = (navigator as UADataNavigator).userAgentData?.brands ?? [];
  refractionSupport = brands.some((b) => /Chromium/i.test(b.brand));
  return refractionSupport;
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}
