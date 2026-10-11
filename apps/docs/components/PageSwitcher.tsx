"use client";

import { usePathname, useRouter } from "next/navigation";
import { Menu, type ButtonProps } from "liquid-glass-kit";
import { ChevronDown, FlaskConical, LayoutGrid, Settings, Sparkles } from "lucide-react";

const PAGES = [
  { href: "/", label: "Playground", icon: <Sparkles /> },
  { href: "/components", label: "Components", icon: <LayoutGrid /> },
  { href: "/settings", label: "Settings", icon: <Settings /> },
  { href: "/lab", label: "Lensing Lab", icon: <FlaskConical /> },
];

/** Glass pull-down that jumps between the docs pages. */
export function PageSwitcher({ align = "center", ...props }: { align?: "start" | "center" | "end" } & Partial<ButtonProps>) {
  const pathname = usePathname();
  const router = useRouter();
  const current = PAGES.find((p) => p.href === pathname) ?? PAGES[0];

  return (
    <Menu
      align={align}
      size="small"
      width={230}
      icon={<ChevronDown />}
      iconPosition="trailing"
      label={current.label}
      items={[
        { title: "Liquid Glass Kit" },
        ...PAGES.map((p) => ({
          label: p.label,
          icon: p.icon,
          checked: p.href === pathname,
          onSelect: () => router.push(p.href),
        })),
      ]}
      {...props}
    />
  );
}
