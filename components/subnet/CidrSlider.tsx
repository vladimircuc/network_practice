"use client";

import { useState } from "react";
import { maskIp, usableHosts, totalAddresses, wildcardIp } from "@/lib/subnet";

const NET = "#3b82f6";
const HOST = "#2fcf6b";

export default function CidrSlider() {
  const [cidr, setCidr] = useState(24);

  const maskBits = Array.from({ length: 32 }, (_, i) => (i < cidr ? "net" : "host"));

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs text-faint">Prefix length</span>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-4xl font-bold text-text">/{cidr}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-faint">Subnet mask</span>
          <div className="font-mono text-2xl font-bold" style={{ color: NET }}>
            {maskIp(cidr)}
          </div>
        </div>
      </div>

      {/* slider */}
      <input
        type="range"
        min={0}
        max={32}
        value={cidr}
        onChange={(e) => setCidr(Number(e.target.value))}
        className="w-full accent-[#3b82f6]"
        aria-label="CIDR prefix length"
      />

      {/* 32-bit grid */}
      <div className="mt-5 flex flex-wrap justify-center gap-x-2 gap-y-2">
        {[0, 1, 2, 3].map((oct) => (
          <div key={oct} className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {maskBits.slice(oct * 8, oct * 8 + 8).map((kind, i) => {
                const globalI = oct * 8 + i;
                return (
                  <span
                    key={globalI}
                    className="grid h-6 w-4 place-items-center rounded-sm font-mono text-[10px] font-bold transition-colors sm:w-5"
                    style={{
                      color: "#06121f",
                      backgroundColor: kind === "net" ? NET : HOST,
                    }}
                    title={`bit ${globalI + 1}: ${kind === "net" ? "network" : "host"}`}
                  >
                    {kind === "net" ? "1" : "0"}
                  </span>
                );
              })}
            </div>
            {oct < 3 && <span className="font-mono text-faint">.</span>}
          </div>
        ))}
      </div>

      {/* legend */}
      <div className="mt-3 flex justify-center gap-5 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: NET }} />
          <span className="text-muted">{cidr} network bits</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: HOST }} />
          <span className="text-muted">{32 - cidr} host bits</span>
        </span>
      </div>

      {/* outcomes */}
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg border border-line-soft bg-surface/50 p-3">
          <div className="text-xs text-faint">Total addresses</div>
          <div className="font-mono text-lg font-bold text-text">
            2<sup>{32 - cidr}</sup>
          </div>
          <div className="font-mono text-xs text-muted">
            {totalAddresses(cidr).toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border border-line-soft bg-surface/50 p-3">
          <div className="text-xs text-faint">Usable hosts</div>
          <div className="font-mono text-lg font-bold" style={{ color: HOST }}>
            {usableHosts(cidr).toLocaleString()}
          </div>
          <div className="text-[10px] text-faint">2ⁿ − 2</div>
        </div>
        <div className="rounded-lg border border-line-soft bg-surface/50 p-3">
          <div className="text-xs text-faint">Wildcard mask</div>
          <div className="font-mono text-base font-bold" style={{ color: HOST }}>
            {wildcardIp(cidr)}
          </div>
          <div className="text-[10px] text-faint">inverse of the mask</div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-faint">
        The slash is literally a <span className="text-muted">count of network bits</span>.
        Slide it right → more network bits → smaller subnets, fewer hosts each. Slide left →
        bigger subnets, more hosts.
      </p>
    </div>
  );
}
