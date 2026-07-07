"use client";

import { useState } from "react";

const D2 = "var(--color-d2)";

const PORTS = [
  { id: "Gi0/1", role: "Reception PC — Data", want: "10" },
  { id: "Gi0/2", role: "Finance PC — Finance", want: "20" },
  { id: "Gi0/3", role: "Lobby VoIP phone — Voice", want: "40" },
  { id: "Gi0/4", role: "Uplink to distribution switch (must carry all VLANs)", want: "trunk" },
];
const OPTS = [
  ["10", "VLAN 10 (access)"], ["20", "VLAN 20 (access)"], ["30", "VLAN 30 (access)"],
  ["40", "VLAN 40 (access)"], ["trunk", "Trunk (802.1Q)"],
];
const MC = [
  "Put both devices into the native VLAN",
  "Add a router or Layer 3 switch to route between the VLANs",
  "Disable Spanning Tree on the trunk",
  "Swap the uplink for a crossover cable",
];
const MC_ANSWER = 1;

export default function VlanPBQ() {
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [mc, setMc] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const portScore = PORTS.filter((p) => picks[p.id] === p.want).length;
  const mcOk = checked && mc === MC_ANSWER;
  const score = portScore + (mcOk ? 1 : 0);

  function reset() { setPicks({}); setMc(null); setChecked(false); }

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        <span className="text-text">Part 1 —</span> configure each switchport for its role:
      </p>
      <div className="space-y-2">
        {PORTS.map((p) => {
          const ok = checked && picks[p.id] === p.want;
          const bad = checked && picks[p.id] !== p.want;
          return (
            <div key={p.id} className="flex flex-wrap items-center gap-2">
              <span className="w-12 shrink-0 font-mono text-sm font-bold text-text">{p.id}</span>
              <span className="flex-1 text-sm text-muted">{p.role}</span>
              <select value={picks[p.id] ?? ""} disabled={checked} aria-label={`VLAN for ${p.id} — ${p.role}`} onChange={(e) => setPicks((x) => ({ ...x, [p.id]: e.target.value }))}
                className="h-9 rounded-md border bg-surface-2 px-2 text-sm text-text"
                style={{ borderColor: checked ? (ok ? "var(--color-good)" : "var(--color-bad)") : "var(--color-line)" }}>
                <option value="">configure…</option>
                {OPTS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
              </select>
              {bad && <span className="text-xs text-bad">→ {p.want === "trunk" ? "Trunk" : "VLAN " + p.want}</span>}
            </div>
          );
        })}
      </div>

      <p className="mb-2 mt-5 text-sm text-muted">
        <span className="text-text">Part 2 —</span> Everything above is correct and the trunk is up, but the Finance PC
        (VLAN 20) still can&apos;t reach the Reception PC (VLAN 10). What&apos;s required?
      </p>
      <div className="space-y-1.5">
        {MC.map((opt, i) => {
          const isAns = i === MC_ANSWER;
          const picked = mc === i;
          let border = "var(--color-line)";
          if (checked) { if (isAns) border = "var(--color-good)"; else if (picked) border = "var(--color-bad)"; }
          return (
            <button key={i} type="button" disabled={checked} onClick={() => setMc(i)}
              className="flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors"
              style={{ borderColor: border, backgroundColor: picked ? "color-mix(in oklab, var(--color-d2) 10%, transparent)" : "transparent", color: "var(--color-muted)" }}>
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px]" style={{ borderColor: picked ? D2 : "var(--color-line)" }}>{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {checked ? <span className="text-sm font-semibold" style={{ color: score === 5 ? "var(--color-good)" : "var(--color-text)" }}>{score} / 5 correct</span> : <span />}
        <button type="button" onClick={() => (checked ? reset() : setChecked(true))}
          className="rounded-lg px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: checked ? "var(--color-surface-3)" : D2 }}>
          {checked ? "Reset" : "Submit"}
        </button>
      </div>

      {checked && (
        <div className="mt-3 space-y-2 rounded-lg border border-line-soft bg-surface-2/60 p-3 text-xs leading-relaxed text-muted">
          <div>
            <span className="font-semibold text-accent">Why:</span> VLANs are separate broadcast domains. A trunk carries
            them between switches, but it does <span className="text-text">not</span> route between them — you need a router or
            Layer 3 switch (router-on-a-stick or an SVI per VLAN) for VLAN 20 to reach VLAN 10.
          </div>
          <div>
            <span className="font-semibold text-accent">On Gi0/3:</span> a standalone lobby phone can sit in a single voice
            VLAN as shown. But a phone port that <span className="text-text">also</span> feeds a daisy-chained PC carries two
            VLANs at once — an <span className="text-text">untagged data VLAN</span> plus a <span className="text-text">tagged
            802.1Q voice VLAN</span> — so it is not a plain access port.
          </div>
        </div>
      )}
    </div>
  );
}
