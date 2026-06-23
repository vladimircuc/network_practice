"use client";

import { useMemo, useState } from "react";
import {
  octetsToInt, networkInt, intToIp, type Octets,
} from "@/lib/subnet";

const NET = "#3b82f6";

function clampOctet(v: string): number {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? 0 : Math.max(0, Math.min(255, n));
}

export default function SubnetSplitter() {
  const [octets, setOctets] = useState<Octets>([192, 168, 1, 0]);
  const [baseCidr, setBaseCidr] = useState(24);
  const [newCidr, setNewCidr] = useState(26);

  const safeNew = Math.max(baseCidr, Math.min(30, newCidr));
  const baseNet = networkInt(octetsToInt(octets), baseCidr);
  const block = Math.pow(2, 32 - safeNew);
  const count = Math.pow(2, safeNew - baseCidr);

  const subnets = useMemo(() => {
    const cap = Math.min(count, 64);
    return Array.from({ length: cap }, (_, k) => {
      const net = baseNet + k * block;
      const bc = net + block - 1;
      return {
        k,
        network: intToIp(net),
        first: intToIp(net + 1),
        last: intToIp(bc - 1),
        broadcast: intToIp(bc),
      };
    });
  }, [baseNet, block, count]);

  function setOctet(i: number, v: string) {
    const next = octets.slice() as Octets;
    next[i] = clampOctet(v);
    setOctets(next);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-center gap-4">
        <div>
          <div className="mb-1 text-[11px] text-faint">Base network</div>
          <div className="flex items-center gap-1">
            {octets.map((o, i) => (
              <div key={i} className="flex items-center gap-1">
                <input
                  type="number" min={0} max={255} value={o}
                  onChange={(e) => setOctet(i, e.target.value)}
                  className="h-9 w-12 rounded-md border border-line bg-surface-2 text-center font-mono text-sm font-bold text-text focus:border-accent"
                />
                {i < 3 && <span className="font-mono text-faint">.</span>}
              </div>
            ))}
            <select
              value={baseCidr}
              onChange={(e) => setBaseCidr(Number(e.target.value))}
              className="ml-1 h-9 rounded-md border border-line bg-surface-2 px-2 font-mono text-sm font-bold text-text"
            >
              {[8, 16, 20, 22, 23, 24, 25, 26].map((c) => (
                <option key={c} value={c}>/{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-center">
          <div className="mb-1 text-[11px] text-faint">Split into</div>
          <select
            value={safeNew}
            onChange={(e) => setNewCidr(Number(e.target.value))}
            className="h-9 rounded-md border border-line bg-surface-2 px-3 font-mono text-sm font-bold text-text"
          >
            {Array.from({ length: 30 - baseCidr + 1 }, (_, i) => baseCidr + i).map((c) => (
              <option key={c} value={c}>/{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm">
        <span className="text-muted">
          <span className="font-bold text-text">{count.toLocaleString()}</span> subnets
        </span>
        <span className="text-muted">
          block size <span className="font-mono font-bold text-text">{block.toLocaleString()}</span> addresses each
        </span>
      </div>

      {/* visual bar */}
      <div className="mb-4 flex h-8 w-full overflow-hidden rounded-md border border-line">
        {Array.from({ length: Math.min(count, 64) }, (_, k) => (
          <div
            key={k}
            className="flex items-center justify-center border-r border-bg/40 text-[9px] font-bold text-white/80 last:border-r-0"
            style={{
              width: `${100 / Math.min(count, 64)}%`,
              backgroundColor: `color-mix(in oklab, ${NET} ${k % 2 ? 55 : 75}%, black)`,
            }}
          >
            {count <= 16 ? k + 1 : ""}
          </div>
        ))}
      </div>

      {/* list */}
      <div className="max-h-64 overflow-y-auto rounded-lg border border-line-soft">
        <table className="w-full text-left font-mono text-xs">
          <thead className="sticky top-0 bg-surface-2 text-faint">
            <tr>
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">Network</th>
              <th className="px-3 py-2 font-medium">Usable range</th>
              <th className="px-3 py-2 font-medium">Broadcast</th>
            </tr>
          </thead>
          <tbody>
            {subnets.map((s) => (
              <tr key={s.k} className="border-t border-line-soft">
                <td className="px-3 py-1.5 text-faint">{s.k + 1}</td>
                <td className="px-3 py-1.5 font-semibold" style={{ color: NET }}>{s.network}/{safeNew}</td>
                <td className="px-3 py-1.5 text-muted">{s.first} – {s.last}</td>
                <td className="px-3 py-1.5 text-muted">{s.broadcast}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {count > 64 && (
        <p className="mt-2 text-center text-[11px] text-faint">
          Showing first 64 of {count.toLocaleString()} subnets.
        </p>
      )}
    </div>
  );
}
