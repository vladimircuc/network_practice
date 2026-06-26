"use client";

import { useState } from "react";

type Port = 10 | 20 | 30 | "trunk";
const CYCLE: Port[] = [10, 20, 30, "trunk"];
const COLOR: Record<string, string> = {
  "10": "#ef4444",
  "20": "#3b82f6",
  "30": "#2fcf6b",
  trunk: "#a855f7",
};

export default function VlanTrunkLab() {
  const [ports, setPorts] = useState<Port[]>([10, 10, 20, 20, 30, "trunk"]);
  const [a, setA] = useState(0);
  const [b, setB] = useState(2);

  function cycle(i: number) {
    setPorts((p) => {
      const next = p.slice();
      const cur = CYCLE.indexOf(next[i]);
      next[i] = CYCLE[(cur + 1) % CYCLE.length];
      return next;
    });
  }

  const pa = ports[a], pb = ports[b];
  let verdict: { text: string; color: string };
  if (pa === "trunk" || pb === "trunk") {
    verdict = { text: "A trunk port is a switch-to-switch link (it carries all VLANs, tagged) — not where you plug an endpoint.", color: "var(--color-partial)" };
  } else if (pa === pb) {
    verdict = { text: `Both ports are in VLAN ${pa} — same broadcast domain, so they talk directly.`, color: "var(--color-good)" };
  } else {
    verdict = { text: `VLAN ${pa} and VLAN ${pb} are separate broadcast domains — they can only reach each other through a router or Layer 3 switch (inter-VLAN routing).`, color: "var(--color-bad)" };
  }

  return (
    <div>
      <p className="mb-3 text-sm text-muted">Click a port to change its VLAN (or make it a trunk). Then pick two ports to test:</p>

      {/* switch */}
      <div className="rounded-lg border border-line-soft bg-surface/40 p-3">
        <div className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-faint">Switch</div>
        <div className="flex justify-center gap-2">
          {ports.map((p, i) => (
            <button key={i} type="button" onClick={() => cycle(i)}
              className="flex flex-col items-center gap-1">
              <span className="grid h-10 w-12 place-items-center rounded-md border-2 font-mono text-xs font-bold"
                style={{ borderColor: COLOR[String(p)], color: COLOR[String(p)], backgroundColor: `color-mix(in oklab, ${COLOR[String(p)]} 12%, transparent)` }}>
                {p === "trunk" ? "TRK" : p}
              </span>
              <span className="text-[10px] text-faint">Gi0/{i + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* checker */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted">Can</span>
        <PortPick value={a} onChange={setA} count={ports.length} />
        <span className="text-muted">reach</span>
        <PortPick value={b} onChange={setB} count={ports.length} />
        <span className="text-muted">?</span>
      </div>
      <div className="mt-3 rounded-lg border px-4 py-3 text-sm" style={{ borderColor: `color-mix(in oklab, ${verdict.color} 40%, transparent)`, backgroundColor: `color-mix(in oklab, ${verdict.color} 8%, transparent)`, color: "var(--color-muted)" }}>
        {verdict.text}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-faint">
        <span className="text-muted">Access port</span> = belongs to one VLAN (an endpoint). <span className="text-muted">Trunk</span> = carries many
        VLANs between switches using <span className="text-muted">802.1Q tags</span>; the one untagged VLAN on a trunk is the <span className="text-muted">native VLAN</span>.
      </p>
    </div>
  );
}

function PortPick({ value, onChange, count }: { value: number; onChange: (n: number) => void; count: number }) {
  return (
    <select value={value} onChange={(e) => onChange(Number(e.target.value))}
      className="h-8 rounded-md border border-line bg-surface-2 px-2 font-mono text-xs text-text">
      {Array.from({ length: count }, (_, i) => <option key={i} value={i}>Gi0/{i + 1}</option>)}
    </select>
  );
}
