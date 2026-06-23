"use client";

import { useState } from "react";
import {
  octetsToInt, toBinary32, describe, networkInt, broadcastInt, type Octets,
} from "@/lib/subnet";

const NET = "#3b82f6";
const HOST = "#2fcf6b";

function clampOctet(v: string): number {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(255, n));
}

function BitRow({ value, cidr, label, color }: { value: number; cidr: number; label: string; color: string }) {
  const bits = toBinary32(value);
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-right text-[11px] text-faint">{label}</span>
      <div className="flex flex-wrap gap-x-1.5 gap-y-1">
        {[0, 1, 2, 3].map((oct) => (
          <div key={oct} className="flex items-center gap-0.5">
            {bits.slice(oct * 8, oct * 8 + 8).split("").map((bit, i) => {
              const gi = oct * 8 + i;
              const isNet = gi < cidr;
              return (
                <span
                  key={gi}
                  className="grid h-5 w-3.5 place-items-center font-mono text-[10px] font-semibold"
                  style={{
                    color: bit === "1" ? "#06121f" : `color-mix(in oklab, ${isNet ? NET : HOST} 55%, var(--color-faint))`,
                    backgroundColor: bit === "1" ? (isNet ? NET : color) : "transparent",
                    borderRadius: 2,
                  }}
                >
                  {bit}
                </span>
              );
            })}
            {oct < 3 && <span className="text-[10px] text-faint">.</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SubnetVisualizer() {
  const [octets, setOctets] = useState<Octets>([192, 168, 10, 37]);
  const [cidr, setCidr] = useState(26);

  const ipInt = octetsToInt(octets);
  const d = describe(ipInt, cidr);

  function setOctet(i: number, v: string) {
    const next = octets.slice() as Octets;
    next[i] = clampOctet(v);
    setOctets(next);
  }

  const results: { label: string; value: string; color?: string; hint?: string }[] = [
    { label: "Network", value: d.network, color: NET, hint: "host bits → all 0" },
    { label: "Broadcast", value: d.broadcast, color: HOST, hint: "host bits → all 1" },
    { label: "First host", value: d.firstUsable, hint: "network + 1" },
    { label: "Last host", value: d.lastUsable, hint: "broadcast − 1" },
    { label: "Subnet mask", value: d.mask },
    { label: "Usable hosts", value: d.usableHosts.toLocaleString(), color: HOST, hint: "2ⁿ − 2" },
  ];

  return (
    <div>
      {/* inputs */}
      <div className="mb-5 flex flex-wrap items-end justify-center gap-3">
        <div>
          <div className="mb-1 text-center text-[11px] text-faint">IP address</div>
          <div className="flex items-center gap-1">
            {octets.map((o, i) => (
              <div key={i} className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={o}
                  onChange={(e) => setOctet(i, e.target.value)}
                  className="h-11 w-16 rounded-md border border-line bg-surface-2 text-center font-mono text-lg font-bold text-text focus:border-accent"
                />
                {i < 3 && <span className="font-mono text-faint">.</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="w-44">
          <div className="mb-1 text-center text-[11px] text-faint">
            Prefix <span className="font-mono font-bold text-text">/{cidr}</span>
          </div>
          <input
            type="range"
            min={1}
            max={32}
            value={cidr}
            onChange={(e) => setCidr(Number(e.target.value))}
            className="w-full accent-[#3b82f6]"
            aria-label="CIDR prefix"
          />
        </div>
      </div>

      {/* results grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {results.map((r) => (
          <div key={r.label} className="rounded-lg border border-line-soft bg-surface/50 px-3 py-2">
            <div className="text-[11px] text-faint">{r.label}</div>
            <div className="font-mono text-base font-bold" style={{ color: r.color ?? "var(--color-text)" }}>
              {r.value}
            </div>
            {r.hint && <div className="text-[10px] text-faint">{r.hint}</div>}
          </div>
        ))}
      </div>

      {/* binary breakdown */}
      <div className="mt-5 overflow-x-auto rounded-lg border border-line-soft bg-surface/40 p-3">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-faint">
          Binary — first {cidr} bits are network, last {32 - cidr} are host
        </div>
        <div className="space-y-1">
          <BitRow value={ipInt} cidr={cidr} label="Your IP" color={HOST} />
          <BitRow value={networkInt(ipInt, cidr)} cidr={cidr} label="Network" color={HOST} />
          <BitRow value={broadcastInt(ipInt, cidr)} cidr={cidr} label="Broadcast" color={HOST} />
        </div>
      </div>
    </div>
  );
}
