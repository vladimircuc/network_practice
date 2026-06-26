"use client";

import { useState } from "react";

const D2 = "var(--color-d2)";
const PUBLIC = "203.0.113.5";
const HOSTS = ["192.168.1.10", "192.168.1.11", "192.168.1.12", "192.168.1.20"];
const SITES = ["lookup.com:443", "mail.com:993", "video.com:443", "api.io:443"];

type Row = { host: string; iPort: number; ePort: number; site: string };

const INITIAL: Row[] = [
  { host: "192.168.1.10", iPort: 50321, ePort: 50321, site: "lookup.com:443" },
  { host: "192.168.1.11", iPort: 49180, ePort: 49180, site: "mail.com:993" },
];

export default function NatPat() {
  const [rows, setRows] = useState<Row[]>(INITIAL);

  function add() {
    const host = HOSTS[Math.floor(Math.random() * HOSTS.length)];
    const iPort = 49152 + Math.floor(Math.random() * 16000);
    // PAT keeps the source port unless it's already taken on the public side
    const taken = new Set(rows.map((r) => r.ePort));
    let ePort = iPort;
    while (taken.has(ePort)) ePort = 49152 + Math.floor(Math.random() * 16000);
    const site = SITES[Math.floor(Math.random() * SITES.length)];
    setRows((r) => [...r, { host, iPort, ePort, site }].slice(-7));
  }

  return (
    <div>
      <p className="mb-3 text-sm leading-relaxed text-muted">
        <span className="text-text">PAT</span> (the NAT your home router does) lets a whole private network
        share <span className="font-mono" style={{ color: D2 }}>{PUBLIC}</span> by tracking{" "}
        <span className="text-text">port numbers</span>. Each connection gets a row in the translation table:
      </p>

      <div className="overflow-hidden rounded-lg border border-line-soft">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-surface-2 text-faint">
            <tr>
              <th className="px-3 py-2">Inside (private)</th>
              <th className="px-3 py-2"></th>
              <th className="px-3 py-2">Outside (public)</th>
              <th className="px-3 py-2">Destination</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-line-soft">
                <td className="px-3 py-1.5 text-text">{r.host}:{r.iPort}</td>
                <td className="px-3 py-1.5 text-faint">→</td>
                <td className="px-3 py-1.5" style={{ color: D2 }}>{PUBLIC}:{r.ePort}</td>
                <td className="px-3 py-1.5 text-muted">{r.site}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-faint">
          Replies to <span className="font-mono">{PUBLIC}:port</span> get sent back to the right inside host using this table.
        </p>
        <button type="button" onClick={add}
          className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: D2 }}>
          + New connection
        </button>
      </div>
    </div>
  );
}
