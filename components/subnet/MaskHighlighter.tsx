"use client";

import { useState } from "react";
import type { Octets } from "@/lib/subnet";

const NET = "#3b82f6";
const HOST = "#2fcf6b";

const MASKS = [
  { cidr: 8, mask: [255, 0, 0, 0], label: "255.0.0.0  (/8)" },
  { cidr: 16, mask: [255, 255, 0, 0], label: "255.255.0.0  (/16)" },
  { cidr: 24, mask: [255, 255, 255, 0], label: "255.255.255.0  (/24)" },
];

function clampOctet(v: string) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? 0 : Math.max(0, Math.min(255, n));
}

export default function MaskHighlighter() {
  const [octets, setOctets] = useState<Octets>([192, 168, 1, 42]);
  const [maskIdx, setMaskIdx] = useState(2); // /24

  const mask = MASKS[maskIdx];
  const netCount = mask.cidr / 8; // whole-octet masks only

  function setOctet(i: number, v: string) {
    const next = octets.slice() as Octets;
    next[i] = clampOctet(v);
    setOctets(next);
  }

  const networkPart = octets.slice(0, netCount).join(".");
  const hostPart = octets.slice(netCount).join(".");

  return (
    <div>
      {/* mask picker */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-faint">Subnet mask:</span>
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

      {/* IP with highlighted octets */}
      <div className="flex items-center justify-center gap-1">
        {octets.map((o, i) => {
          const isNet = i < netCount;
          return (
            <div key={i} className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={255}
                value={o}
                onChange={(e) => setOctet(i, e.target.value)}
                className="h-12 w-16 rounded-md border text-center font-mono text-xl font-bold focus:outline-none"
                style={{
                  color: isNet ? NET : HOST,
                  borderColor: `color-mix(in oklab, ${isNet ? NET : HOST} 45%, transparent)`,
                  backgroundColor: `color-mix(in oklab, ${isNet ? NET : HOST} 9%, transparent)`,
                }}
              />
              {i < 3 && <span className="font-mono text-faint">.</span>}
            </div>
          );
        })}
      </div>

      {/* the mask beneath, colored to match */}
      <div className="mt-2 flex items-center justify-center gap-1">
        {mask.mask.map((m, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="grid w-16 place-items-center font-mono text-xs" style={{ color: m === 255 ? NET : HOST }}>
              {m === 255 ? "network" : "device"}
            </span>
            {i < 3 && <span className="font-mono text-transparent">.</span>}
          </div>
        ))}
      </div>

      {/* readout */}
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-line-soft bg-surface/50 p-3 text-center">
          <div className="text-xs text-faint">Network (the street)</div>
          <div className="font-mono text-lg font-bold" style={{ color: NET }}>{networkPart}</div>
        </div>
        <div className="rounded-lg border border-line-soft bg-surface/50 p-3 text-center">
          <div className="text-xs text-faint">Host (the house)</div>
          <div className="font-mono text-lg font-bold" style={{ color: HOST }}>{hostPart}</div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs leading-relaxed text-faint">
        Each <span className="font-mono" style={{ color: NET }}>255</span> means &ldquo;this number is part
        of the network.&rdquo; Each <span className="font-mono" style={{ color: HOST }}>0</span> means
        &ldquo;this number is the device.&rdquo; That is the mask&rsquo;s whole job.
      </p>
    </div>
  );
}
