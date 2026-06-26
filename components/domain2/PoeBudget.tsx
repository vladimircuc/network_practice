"use client";

import { useState } from "react";

const D2 = "var(--color-d2)";
const BUDGET = 370; // typical mid-range switch PoE budget (W)

const PALETTE = [
  { name: "VoIP phone", watts: 7 },
  { name: "PTZ camera", watts: 15 },
  { name: "Wi-Fi AP (PoE+)", watts: 25 },
  { name: "Wi-Fi 6 AP (PoE++)", watts: 51 },
];

export default function PoeBudget() {
  const [items, setItems] = useState<number[]>([2, 2, 0, 0, 1]);

  const used = items.reduce((s, i) => s + PALETTE[i].watts, 0);
  const pct = Math.min(100, (used / BUDGET) * 100);
  const over = used > BUDGET;

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        A switch only has so many watts to hand out. Add devices and watch the budget — go over and the last
        devices to power on simply <span className="text-text">won&apos;t get power</span>.
      </p>

      <div className="mb-1 flex justify-between text-sm">
        <span className="text-muted">Used</span>
        <span className="font-mono font-bold" style={{ color: over ? "var(--color-bad)" : "var(--color-text)" }}>
          {used} W / {BUDGET} W
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-surface-3">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: over ? "var(--color-bad)" : D2 }} />
      </div>
      {over && <p className="mt-1 text-xs text-bad">⚠ Over budget by {used - BUDGET} W — drop a device or use a higher-capacity switch.</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {PALETTE.map((d, i) => (
          <button key={i} type="button" onClick={() => setItems((it) => [...it, i])}
            className="rounded-lg border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted hover:text-text">
            + {d.name} <span className="font-mono text-faint">({d.watts}W)</span>
          </button>
        ))}
        {items.length > 0 && (
          <button type="button" onClick={() => setItems([])}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-faint hover:text-bad">clear</button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {items.map((i, k) => (
          <span key={k} className="inline-flex items-center gap-1 rounded-md border border-line-soft bg-surface px-2 py-1 text-xs text-muted">
            {PALETTE[i].name}
            <button type="button" onClick={() => setItems((it) => it.filter((_, j) => j !== k))} className="text-faint hover:text-bad">✕</button>
          </span>
        ))}
        {items.length === 0 && <span className="text-xs text-faint">No devices — add some above.</span>}
      </div>
    </div>
  );
}
