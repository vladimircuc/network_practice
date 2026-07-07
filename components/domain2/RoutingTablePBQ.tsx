"use client";

import { useState } from "react";
import { selectRoute, type Route } from "@/lib/domain2";

const D2 = "var(--color-d2)";

type Scenario = { table: Route[]; dests: string[] };

function rnd(n: number) { return Math.floor(Math.random() * n); }

function build(B: number, C: number, D: number, E: number, X: number): Scenario {
  const table: Route[] = [
    { network: "0.0.0.0", cidr: 0, ad: 1, nextHop: "ISP", protocol: "Static default" },
    { network: "10.0.0.0", cidr: 8, ad: 120, nextHop: "R1", protocol: "RIP" },
    { network: `10.${B}.0.0`, cidr: 16, ad: 110, nextHop: "R2", protocol: "OSPF" },
    { network: `10.${B}.${C}.0`, cidr: 24, ad: 1, nextHop: "R3", protocol: "Static" },
    { network: `10.${B}.${D}.0`, cidr: 24, ad: 110, nextHop: "R4", protocol: "OSPF" },
    { network: `10.${B}.${D}.0`, cidr: 24, ad: 90, nextHop: "R5", protocol: "EIGRP" },
  ];
  const dests = [
    `10.${B}.${C}.${10 + rnd(200)}`, // longest /24 -> R3
    `10.${B}.${D}.${10 + rnd(200)}`, // AD tie -> R5
    `10.${B}.${E}.${10 + rnd(200)}`, // /16 -> R2
    `10.${X}.${rnd(255)}.${rnd(255)}`, // /8 -> R1
  ];
  return { table, dests };
}

const FIRST = build(20, 5, 8, 30, 21);

function gen(): Scenario {
  const B = 16 + rnd(200);
  let C = 1 + rnd(250), D = 1 + rnd(250), E = 1 + rnd(250);
  while (D === C) D = 1 + rnd(250);
  while (E === C || E === D) E = 1 + rnd(250);
  const X = B >= 128 ? B - 1 : B + 1; // different 2nd octet -> only /8 matches
  return build(B, C, D, E, X);
}

const HOPS = ["ISP", "R1", "R2", "R3", "R4", "R5"];

export default function RoutingTablePBQ() {
  const [sc, setSc] = useState<Scenario>(FIRST);
  const [picks, setPicks] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const answers = sc.dests.map((d) => selectRoute(sc.table, d)?.nextHop ?? "—");
  const score = answers.filter((a, i) => picks[i] === a).length;
  const allAnswered = sc.dests.every((_, i) => picks[i]);

  function regen() {
    setSc(gen());
    setPicks({});
    setChecked(false);
  }

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Using this routing table, choose the <span className="text-text">next hop</span> each packet takes.
        Remember: <span className="text-text">longest prefix wins</span>, and on a tie the lowest{" "}
        <span className="text-text">administrative distance</span> wins.
      </p>

      <div className="mb-4 overflow-hidden rounded-lg border border-line-soft">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-surface-2 text-faint">
            <tr><th className="px-3 py-2">Network</th><th className="px-3 py-2">AD</th><th className="px-3 py-2">Protocol</th><th className="px-3 py-2">Next hop</th></tr>
          </thead>
          <tbody>
            {sc.table.map((r, i) => (
              <tr key={i} className="border-t border-line-soft">
                <td className="px-3 py-1.5 font-bold text-text">{r.network}/{r.cidr}</td>
                <td className="px-3 py-1.5 text-muted">{r.ad}</td>
                <td className="px-3 py-1.5 text-muted">{r.protocol}</td>
                <td className="px-3 py-1.5" style={{ color: D2 }}>{r.nextHop}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2">
        {sc.dests.map((d, i) => {
          const ok = checked && picks[i] === answers[i];
          const bad = checked && picks[i] !== answers[i];
          return (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <span className="w-40 shrink-0 font-mono text-sm text-text">{d}</span>
              <span className="text-faint">→</span>
              <select
                value={picks[i] ?? ""}
                disabled={checked}
                aria-label={`Next hop for ${d}`}
                onChange={(e) => setPicks((p) => ({ ...p, [i]: e.target.value }))}
                className="h-9 rounded-md border bg-surface-2 px-2 font-mono text-sm text-text"
                style={{ borderColor: checked ? (ok ? "var(--color-good)" : "var(--color-bad)") : "var(--color-line)" }}
              >
                <option value="">next hop?</option>
                {HOPS.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
              {bad && <span className="text-xs text-bad">correct: {answers[i]}</span>}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {checked ? <span className="text-sm font-semibold" style={{ color: score === sc.dests.length ? "var(--color-good)" : "var(--color-text)" }}>{score} / {sc.dests.length} correct</span> : <span className="text-xs text-faint">{allAnswered ? "" : "Answer every row to check."}</span>}
        <button type="button" disabled={!checked && !allAnswered} onClick={() => (checked ? regen() : setChecked(true))}
          className="rounded-lg px-5 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-40" style={{ backgroundColor: checked ? "var(--color-surface-3)" : D2 }}>
          {checked ? "New table →" : "Check"}
        </button>
      </div>

      {checked && (
        <div className="mt-3 rounded-lg border border-line-soft bg-surface-2/60 p-3 text-xs leading-relaxed text-muted">
          <span className="font-semibold text-accent">Why:</span> take each destination by <span className="text-text">longest prefix first, then AD</span>. A matching <span className="text-text">/24</span> always beats the /16 and /8 that also match. When two /24s tie (R4 vs R5), the lower AD wins — <span className="text-text">EIGRP 90 beats OSPF 110 → R5</span>. If only the /16 matches it&apos;s R2; only the /8, R1.
        </div>
      )}
    </div>
  );
}
