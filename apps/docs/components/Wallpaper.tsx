export type WallpaperKind = "aurora" | "sunset" | "stripes" | "mono";

const WALLPAPERS: Record<WallpaperKind, string> = {
  aurora: [
    "radial-gradient(60% 50% at 15% 20%, #ff5f6d 0%, transparent 60%)",
    "radial-gradient(50% 60% at 85% 15%, #6a5cff 0%, transparent 60%)",
    "radial-gradient(55% 55% at 70% 85%, #00c3d0 0%, transparent 60%)",
    "radial-gradient(45% 45% at 20% 85%, #ffcc00 0%, transparent 60%)",
    "linear-gradient(160deg, #1b1f6b, #5b1f6b 50%, #0d4f6b)",
  ].join(", "),
  sunset: [
    "radial-gradient(70% 60% at 50% 110%, #ff8d28 0%, transparent 70%)",
    "radial-gradient(50% 50% at 10% 10%, #ff2d55 0%, transparent 60%)",
    "radial-gradient(60% 50% at 90% 30%, #cb30e0 0%, transparent 60%)",
    "linear-gradient(180deg, #2a1052, #8a1d4b 60%, #ff8d28)",
  ].join(", "),
  stripes: [
    "repeating-linear-gradient(45deg, rgb(255 255 255 / 0.9) 0 14px, rgb(0 0 0 / 0) 14px 28px)",
    "linear-gradient(120deg, #0088ff, #cb30e0 50%, #ff8d28)",
  ].join(", "),
  mono: "linear-gradient(180deg, #f2f2f7, #d1d1d6)",
};

export function Wallpaper({ kind }: { kind: WallpaperKind }) {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 transition-[background] duration-500"
      style={{ background: WALLPAPERS[kind] }}
    />
  );
}
