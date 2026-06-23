"use client";

import { useState } from "react";
import type { Octets } from "@/lib/subnet";

const NET = "#3b82f6";
const HOST = "#2fcf6b";

const MASKS = [
  { cidr: 8, label: "255.0.0.0  (/8)" },
  { cidr: 16, label: "255.255.0.0  (/16)" },
  { cidr: 24, label: "255.255.255.0  (/24)" },
];

function clampOctet(v: string) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? 0 : Math.max(0, Math.min(255, n));
}

function OctetInputs({ octets, onChange, netCount }: { octets: Octets; onChange: (i: number, v: string) => void; netCount: number }) {
  return (
    <div className="flex items-center gap-1">
      {octets.map((o, i) => (
        <div key={i} className="flex items-center gap-1">
          <input
            type="number" min={0} max={255} value={o}
            onChange={(e) => onChange(i, e.target.value)}
            className="h-9 w-12 rounded-md border text-center font-mono text-sm font-bold focus:outline-none"
            style={{
              color: i < netCount ? NET : HOST,
              borderColor: `color-mix(in oklab, ${i < netCount ? NET : HOST} 40%, transparent)`,
              backgroundColor: `color-mix(in oklab, ${i < netCount ? NET : HOST} 8%, transparent)`,
            }}
          />
          {i < 3 && <span className="font-mono text-xs text-faint">.</span>}
        </div>
      ))}
    </div>
  );
}

export default function SameNetworkChecker() {
  const [a, setA] = useState<Octets>([192, 168, 1, 42]);
  const [b, setB] = useState<Octets>([192, 168, 1, 99]);
  const [maskIdx, setMaskIdx] = useState(2);

  const netCount = MASKS[maskIdx].cidr / 8;
  const netA = a.slice(0, netCount).join(".");
  const netB = b.slice(0, netCount).join(".");
  const same = netA === netB;

  const setOctet = (which: "a" | "b") => (i: number, v: string) => {
    const arr = (which === "a" ? a : b).slice() as Octets;
    arr[i] = clampOctet(v);
    (which === "a" ? setA : setB)(arr);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-faint">Both using mask:</span>
        <select
          value={maskIdx}
          onChange={(e) => setMaskIdx(Number(e.target.value))}
          className="h-9 rounded-md border border-line bg-surface-2 px-2 font-mono text-sm font-bold text-text"
        >
          {MASKS.map((m, i) => (
            <option key={i} value={i}>{m.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="w-16 text-sm text-muted">Device A</span>
          <OctetInputs octets={a} onChange={setOctet("a")} netCount={netCount} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="w-16 text-sm text-muted">Device B</span>
          <OctetInputs octets={b} onChange={setOctet("b")} netCount={netCount} />
        </div>
      </div>

      {/* verdict */}
      <div
        className="mt-5 rounded-lg border p-4 text-center"
        style={{
          borderColor: same ? `color-mix(in oklab, ${HOST} 45%, transparent)` : "color-mix(in oklab, var(--color-partial) 45%, transparent)",
          backgroundColor: same ? `color-mix(in oklab, ${HOST} 9%, transparent)` : "color-mix(in oklab, var(--color-partial) 9%, transparent)",
        }}
      >
        <div className="text-base font-bold" style={{ color: same ? HOST : "var(--color-partial)" }}>
          {same ? "✓ Same network" : "✗ Different networks"}
        </div>
        <p className="mt-1 text-sm text-muted">
          {same ? (
            <>Both networks are <span className="font-mono" style={{ color: NET }}>{netA}</span> — they can talk <span className="text-text">directly</span>.</>
          ) : (
            <>Network <span className="font-mono" style={{ color: NET }}>{netA}</span> vs <span className="font-mono" style={{ color: NET }}>{netB}</span> — traffic must go <span className="text-text">through a router</span>.</>
          )}
        </p>
      </div>

      <p className="mt-3 text-center text-xs leading-relaxed text-faint">
        Apply the mask to both addresses and compare the <span style={{ color: NET }}>network parts</span>.
        Match → same street. Different → the router has to forward between them.
      </p>
    </div>
  );
}
