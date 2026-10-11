"use client";

import { useState } from "react";
import { Button, SegmentedControl, TINT_STYLES, toast, type TintStyle } from "liquid-glass-kit";
import { ChevronRight, Heart, Play, Plus } from "lucide-react";

const COLORS = [
  { name: "Blue", value: "#2f7cf6" },
  { name: "Sky", value: "#00a2ff" },
  { name: "Indigo", value: "#5b4ff5" },
  { name: "Pink", value: "#ff2d6f" },
  { name: "Red", value: "#ff3b30" },
  { name: "Orange", value: "#ff8a00" },
  { name: "Green", value: "#22b357" },
  { name: "Graphite", value: "#3a3a40" },
];

/** Pick a tinted-glass style and colour and see it over high-contrast media. */
export function TintedGlassDemo() {
  const [style, setStyle] = useState<TintStyle>("liquid");
  const [color, setColor] = useState(COLORS[0].value);

  return (
    <div className="flex flex-col gap-4 px-5">
      <SegmentedControl<TintStyle>
        block
        aria-label="Tinted glass style"
        value={style}
        onValueChange={setStyle}
        options={(Object.keys(TINT_STYLES) as TintStyle[]).map((k) => ({ value: k, label: TINT_STYLES[k].label }))}
      />
      <p className="-mt-1 text-[13px] opacity-70">{TINT_STYLES[style].use}</p>

      <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Tint colour">
        {COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            role="radio"
            aria-checked={color === c.value}
            aria-label={c.name}
            title={c.name}
            onClick={() => setColor(c.value)}
            className="size-8 rounded-full transition-transform active:scale-90"
            style={{
              background: c.value,
              boxShadow: color === c.value ? `0 0 0 2px var(--lg-bg), 0 0 0 4px ${c.value}` : "inset 0 0 0 1px rgb(255 255 255 / .25)",
            }}
          />
        ))}
      </div>

      {/* Media-like backdrop: high-contrast shapes for the lens to bend. */}
      <div className="relative overflow-hidden rounded-[28px]" style={{ background: "linear-gradient(180deg, #a9d3ff, #5d9ee8)" }}>
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-30px] left-[22%] h-[150px] w-[260px] rounded-[0_0_140px_140px] bg-[#0b0b0f] shadow-[inset_-18px_-10px_30px_rgb(255_255_255/.12)]" />
          <div className="absolute top-[-40px] left-[8%] h-[160px] w-[90px] rotate-[18deg] rounded-[40px] border-[10px] border-[#d9dbe0] border-r-[#6d7078]" />
          <div className="absolute top-[-20px] right-[10%] h-[130px] w-[110px] -rotate-[20deg] rounded-[50px] border-[12px] border-[#1a1a1f] border-l-[#c8cbd2]" />
          <div className="absolute top-[60px] left-[46%] h-[260px] w-[16px] rotate-[8deg] rounded-full bg-[#121216]" />
          <div className="absolute top-[110px] left-[30%] h-[200px] w-[10px] -rotate-[25deg] rounded-full bg-[#2a2a30]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(95deg,transparent_0_70px,rgb(255_255_255/.35)_70px_73px)]" />
          <div className="absolute right-[18%] bottom-[18px] size-[60px] rounded-full bg-[conic-gradient(#ff3b30,#ffcc00,#34c759,#00c3d0,#5b4ff5,#ff2d6f,#ff3b30)] opacity-80 blur-[2px]" />
        </div>

        <div className="relative flex flex-col gap-4 p-5 pt-24">
          <Button
            variant="tinted-glass"
            tintStyle={style}
            tint={color}
            size="large"
            className="h-[64px] w-full justify-between px-7 text-[20px] font-bold"
            icon={<ChevronRight strokeWidth={3} />}
            iconPosition="trailing"
            onClick={() => toast("Watch more")}
          >
            Watch more
          </Button>
          <div className="flex flex-wrap gap-3">
            <Button variant="tinted-glass" tintStyle={style} tint={color} icon={<Play className="fill-current" />}>
              Play
            </Button>
            <Button variant="tinted-glass" tintStyle={style} tint={color}>
              Shop now
            </Button>
            <Button variant="tinted-glass" tintStyle={style} tint={color} size="small" icon={<Heart />}>
              Like
            </Button>
            <Button variant="tinted-glass" tintStyle={style} tint={color} shape="circle" icon={<Plus />} aria-label="Add" />
          </div>
        </div>
      </div>

      <code className="block overflow-x-auto rounded-2xl bg-[var(--lg-fill-tertiary)] px-4 py-3 text-[12px] whitespace-pre opacity-80">
        {`<Button variant="tinted-glass" tintStyle="${style}" tint="${color}">\n  Watch more\n</Button>`}
      </code>
    </div>
  );
}
