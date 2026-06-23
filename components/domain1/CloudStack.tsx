"use client";

import { useState } from "react";

const D1 = "#3b82f6";

const LAYERS = [
  "Applications", "Data", "Runtime", "Middleware", "OS",
  "Virtualization", "Servers", "Storage", "Networking",
];

// how many of the top layers YOU manage
const MODELS = [
  { key: "onprem", label: "On-Prem", you: 9, blurb: "It is all yours — the building, the oven, the ingredients." },
  { key: "iaas", label: "IaaS", you: 5, blurb: "Provider gives you the hardware & virtualization; you run the OS on up. (e.g. AWS EC2)" },
  { key: "paas", label: "PaaS", you: 2, blurb: "Provider runs the platform; you just bring your app and data. (e.g. App Engine)" },
  { key: "saas", label: "SaaS", you: 0, blurb: "Provider runs everything; you just log in and use it. (e.g. Gmail)" },
] as const;

export default function CloudStack() {
  const [sel, setSel] = useState(1); // IaaS

  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-muted">
        The cloud models differ by <span className="text-text">how much you manage vs. the provider</span>.
        Think pizza: make it at home (on-prem), take-and-bake, delivery, or dine-out (SaaS).
      </p>

      {/* model picker */}
      <div className="mb-4 grid grid-cols-4 gap-1 rounded-lg border border-line bg-surface-2 p-1 text-xs font-medium">
        {MODELS.map((m, i) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setSel(i)}
            className="rounded-md px-2 py-1.5 transition-colors"
            style={{
              backgroundColor: sel === i ? "var(--color-surface-3)" : "transparent",
              color: sel === i ? "var(--color-text)" : "var(--color-faint)",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* the stack */}
        <div className="space-y-1">
          {LAYERS.map((layer, i) => {
            const you = i < MODELS[sel].you;
            return (
              <div
                key={layer}
                className="flex items-center justify-between rounded-md border px-3 py-1.5 text-sm"
                style={{
                  borderColor: you ? `color-mix(in oklab, ${D1} 35%, transparent)` : "var(--color-line-soft)",
                  backgroundColor: you ? `color-mix(in oklab, ${D1} 12%, transparent)` : "var(--color-surface)",
                  color: you ? "var(--color-text)" : "var(--color-faint)",
                }}
              >
                {layer}
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: you ? D1 : "var(--color-faint)" }}>
                  {you ? "you" : "provider"}
                </span>
              </div>
            );
          })}
        </div>

        {/* explanation */}
        <div className="flex flex-col justify-center rounded-lg border border-line-soft bg-surface-2/50 p-4">
          <div className="text-lg font-bold text-text">{MODELS[sel].label}</div>
          <p className="mt-1 text-sm leading-relaxed text-muted">{MODELS[sel].blurb}</p>
          <div className="mt-3 flex gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: D1 }} />
              <span className="text-muted">you manage</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-line bg-surface" />
              <span className="text-muted">provider manages</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
