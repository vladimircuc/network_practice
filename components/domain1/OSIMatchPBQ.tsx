"use client";

import { useState } from "react";
import { OSI_LAYERS } from "@/lib/domain1";

const D1 = "#3b82f6";

const ITEMS = [
  { text: "Browsing a website (HTTP/HTTPS)", layer: 7 },
  { text: "TLS encryption of the data", layer: 6 },
  { text: "Setting up & tearing down the session", layer: 5 },
  { text: "TCP/UDP and port numbers", layer: 4 },
  { text: "IP addresses and routers", layer: 3 },
  { text: "MAC addresses and switches", layer: 2 },
  { text: "Cables, fiber, and raw bits", layer: 1 },
];

export default function OSIMatchPBQ() {
  const [picks, setPicks] = useState<Record<number, number | "">>({});
  const [checked, setChecked] = useState(false);

  const score = ITEMS.filter((it, i) => picks[i] === it.layer).length;

  return (
    <div>
      <p className="mb-3 text-sm text-muted">Assign each activity to the OSI layer it happens at:</p>
      <div className="space-y-2">
        {ITEMS.map((it, i) => {
          const ok = checked && picks[i] === it.layer;
          const bad = checked && picks[i] !== it.layer;
          return (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <span className="flex-1 text-sm text-text">{it.text}</span>
              <select
                value={picks[i] ?? ""}
                disabled={checked}
                onChange={(e) => setPicks((p) => ({ ...p, [i]: e.target.value === "" ? "" : Number(e.target.value) }))}
                className="h-9 rounded-md border bg-surface-2 px-2 text-sm text-text"
                style={{ borderColor: checked ? (ok ? "var(--color-good)" : "var(--color-bad)") : "var(--color-line)" }}
              >
                <option value="">— pick a layer —</option>
                {OSI_LAYERS.map((l) => (
                  <option key={l.num} value={l.num}>{l.num} · {l.name}</option>
                ))}
              </select>
              {bad && (
                <span className="w-full text-right text-xs text-bad sm:w-auto">
                  → Layer {it.layer} ({OSI_LAYERS.find((l) => l.num === it.layer)!.name})
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {checked ? (
          <span className="text-sm font-semibold" style={{ color: score === ITEMS.length ? "var(--color-good)" : "var(--color-text)" }}>
            {score} / {ITEMS.length} correct
          </span>
        ) : <span />}
        <button
          type="button"
          onClick={() => { if (checked) { setPicks({}); setChecked(false); } else setChecked(true); }}
          className="rounded-lg px-5 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: checked ? "var(--color-surface-3)" : D1 }}
        >
          {checked ? "Try again" : "Check"}
        </button>
      </div>
    </div>
  );
}
