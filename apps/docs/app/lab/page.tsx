"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Glass, type GlassVariant } from "liquid-glass-kit";

/** Visual tuning bench: oversized glass shapes over high-frequency content. */
function Lab() {
  const q = useSearchParams();
  const variant = (q.get("variant") as GlassVariant) ?? "clear";
  const strength = Number(q.get("strength") ?? 1);
  const bezel = Number(q.get("bezel") ?? 20);
  const thickness = Number(q.get("thickness") ?? 26);
  const dispersion = Number(q.get("dispersion") ?? 0);
  const theme = q.get("theme") ?? "light";
  const lens = { variant, refraction: strength, bezel, thickness, dispersion };

  return (
    <div data-theme={theme} className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(90deg, #111 0 2px, transparent 2px 24px), repeating-linear-gradient(0deg, #111 0 2px, transparent 2px 24px), linear-gradient(120deg, #0088ff, #cb30e0 50%, #ff8d28)",
        }}
      />
      <p className="absolute top-[300px] left-10 max-w-3xl text-5xl leading-tight font-black text-white">
        The quick brown fox jumps over the lazy dog. Liquid Glass lensing test.
      </p>
      <Glass {...lens} radius="capsule" className="absolute top-12 left-12 h-[140px] w-[460px]" />
      <Glass {...lens} className="absolute top-[260px] left-[140px] h-[300px] w-[520px]" />
      <Glass {...lens} size="small" className="absolute top-14 left-[560px] size-[120px]" />
      <Glass {...lens} size="small" className="absolute top-[600px] left-12 size-[64px]" />
      <Glass {...lens} radius="capsule" className="absolute top-[600px] left-[140px] h-[64px] w-[300px]" />
    </div>
  );
}

export default function LabPage() {
  return (
    <Suspense>
      <Lab />
    </Suspense>
  );
}
