"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOMAINS } from "@/lib/domains";

export default function TabNav() {
  const pathname = usePathname();

  type Tab = {
    href: string;
    label: string;
    num: number | null;
    badge?: string;
    accent: string;
  };

  const tabs: Tab[] = [
    { href: "/", label: "Overview", num: null, accent: "var(--color-accent)" },
  ];
  for (const d of DOMAINS) {
    tabs.push({ href: `/${d.slug}`, label: d.short, num: d.num, accent: d.accent });
    if (d.num === 1) {
      // standalone IP & Subnetting lab sits right after Domain 1
      tabs.push({
        href: "/ip-subnetting",
        label: "IP & Subnetting",
        num: null,
        badge: "/",
        accent: "var(--color-lab)",
      });
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 py-3">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent/15 font-mono text-sm font-bold text-accent">
            N+
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-text sm:inline">
            Network+ Prep
          </span>
        </Link>

        <nav className="flex flex-1 items-stretch gap-0.5 overflow-x-auto py-2">
          {tabs.map((t) => {
            const active =
              t.href === "/" ? pathname === "/" : pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? "page" : undefined}
                className="group relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                style={{ color: active ? t.accent : "var(--color-muted)" }}
              >
                {(t.num !== null || t.badge) && (
                  <span
                    className="grid h-5 w-5 place-items-center rounded font-mono text-[11px] font-bold tabular"
                    style={{
                      color: t.accent,
                      backgroundColor: `color-mix(in oklab, ${t.accent} ${active ? 22 : 12}%, transparent)`,
                    }}
                  >
                    {t.num ?? t.badge}
                  </span>
                )}
                <span className={active ? "" : "group-hover:text-text"}>
                  {t.label}
                </span>
                {active && (
                  <span
                    className="absolute inset-x-2 -bottom-[9px] h-0.5 rounded-full"
                    style={{ backgroundColor: t.accent }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
