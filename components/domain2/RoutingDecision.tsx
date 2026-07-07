"use client";

import { useState } from "react";
import { selectRoute, type Route } from "@/lib/domain2";
import { ipToInt, networkInt } from "@/lib/subnet";

const D2 = "var(--color-d2)";

const TABLE: Route[] = [
  { network: "0.0.0.0", cidr: 0, ad: 1, nextHop: "203.0.113.1", protocol: "Static default" },
  { network: "10.0.0.0", cidr: 8, ad: 120, nextHop: "10.0.0.1", protocol: "RIP" },
  { network: "10.10.0.0", cidr: 16, ad: 110, nextHop: "10.0.0.2", protocol: "OSPF" },
  { network: "10.10.5.0", cidr: 24, ad: 1, nextHop: "10.0.0.3", protocol: "Static" },
  { network: "10.10.8.0", cidr: 24, ad: 110, nextHop: "10.0.0.4", protocol: "OSPF" },
  { network: "10.10.8.0", cidr: 24, ad: 90, nextHop: "10.0.0.5", protocol: "EIGRP" },
];

// 10.10.8.x → two /24s tie, so administrative distance decides (EIGRP 90 beats OSPF 110)
const EXAMPLES = ["10.10.5.20", "10.10.8.15", "10.10.9.4", "10.55.1.1", "8.8.8.8"];

export default function RoutingDecision() {
  const [ip, setIp] = useState("10.10.5.20");
  const winner = selectRoute(TABLE, ip);

  let dest = 0;
  try { dest = ipToInt(ip); } catch { dest = -1; }
  const matches = TABLE.filter((r) => dest >= 0 && networkInt(dest, r.cidr) === ipToInt(r.network));

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted">Packet destined for</span>
        <input
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="h-9 w-40 rounded-md border border-line bg-surface-2 px-3 font-mono text-sm font-bold text-text focus:border-accent"
        />
        <div className="flex gap-1">
          {EXAMPLES.map((ex) => (
            <button key={ex} type="button" onClick={() => setIp(ex)}
              className="rounded border border-line bg-surface-2 px-2 py-1 font-mono text-[11px] text-muted hover:text-text">{ex}</button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-line-soft">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-surface-2 text-faint">
            <tr><th className="px-3 py-2">Destination</th><th className="px-3 py-2">AD</th><th className="px-3 py-2">Protocol</th><th className="px-3 py-2">Next hop</th></tr>
          </thead>
          <tbody>
            {TABLE.map((r, i) => {
              const isMatch = matches.includes(r);
              const isWinner = winner === r;
              return (
                <tr key={i} className="border-t border-line-soft"
                  style={{ backgroundColor: isWinner ? "color-mix(in oklab, var(--color-d2) 16%, transparent)" : isMatch ? "color-mix(in oklab, var(--color-d2) 6%, transparent)" : "transparent" }}>
                  <td className="px-3 py-1.5 font-bold" style={{ color: isMatch ? D2 : "var(--color-muted)" }}>
                    {r.network}/{r.cidr}{isWinner && " ✓"}
                  </td>
                  <td className="px-3 py-1.5 text-muted">{r.ad}</td>
                  <td className="px-3 py-1.5 text-muted">{r.protocol}</td>
                  <td className="px-3 py-1.5 text-muted">{r.nextHop}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 rounded-lg border border-line-soft bg-surface-2/60 p-3 text-sm text-muted">
        {winner ? (
          <>
            Of the <span className="text-text">{matches.length}</span> matching route{matches.length !== 1 && "s"}, the router picks{" "}
            <span className="font-mono font-bold" style={{ color: D2 }}>{winner.network}/{winner.cidr}</span> →
            next hop <span className="font-mono text-text">{winner.nextHop}</span>.{" "}
            {matches.length > 1 ? (
              <>It wins by <span className="text-text">longest prefix match</span> (the most specific /{winner.cidr}){matches.filter((m) => m.cidr === winner.cidr).length > 1 ? <>, then — because two /{winner.cidr} routes tie — by lowest <span className="text-text">administrative distance</span> ({winner.ad}, {winner.protocol}, beating the higher-AD match).</> : "."}</>
            ) : winner.cidr === 0 ? (
              <>That&apos;s the <span className="text-text">default route</span> (<span className="text-text">gateway of last resort</span>) — chosen because no more-specific route matches.</>
            ) : (
              <>It&apos;s the only route that matches.</>
            )}
          </>
        ) : <span className="text-faint">Enter a valid IPv4 address.</span>}
      </div>
    </div>
  );
}
