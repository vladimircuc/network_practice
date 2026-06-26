"use client";

import { useState } from "react";

const D3 = "var(--color-d3)";

const SITE_SCENARIOS = [
  { text: "must be back online within ~15 minutes; budget is no concern", site: "Hot" },
  { text: "a few hours of downtime is acceptable on a moderate budget", site: "Warm" },
  { text: "several days of downtime is fine — minimize cost above all", site: "Cold" },
];
const SITES = ["Cold", "Warm", "Hot"];
const METRICS = [
  { abbr: "RPO", q: "the maximum data you can afford to lose" },
  { abbr: "RTO", q: "the maximum downtime you can tolerate" },
  { abbr: "MTTR", q: "the average time to repair a failed device" },
  { abbr: "MTBF", q: "the average uptime between failures" },
];

function rnd(a: number, b: number) { return a + Math.floor(Math.random() * (b - a + 1)); }
function shuffle<T>(x: T[]): T[] { const r = x.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

type Sc = { siteIdx: number; n: number; t: number; metricIdx: number; metricOpts: string[] };
function gen(): Sc {
  const n = [2, 3, 4, 6][rnd(0, 3)];
  let t = rnd(1, 23);
  while (t % n === 0) t = rnd(1, 23);
  return { siteIdx: rnd(0, 2), n, t, metricIdx: rnd(0, 3), metricOpts: shuffle(METRICS.map((m) => m.abbr)) };
}
const FIRST: Sc = { siteIdx: 0, n: 4, t: 6, metricIdx: 2, metricOpts: ["RPO", "MTTR", "MTBF", "RTO"] };

export default function DrObjectivesPBQ() {
  const [sc, setSc] = useState<Sc>(FIRST);
  const [site, setSite] = useState("");
  const [rpo, setRpo] = useState("");
  const [metric, setMetric] = useState("");
  const [checked, setChecked] = useState(false);

  const correctSite = SITE_SCENARIOS[sc.siteIdx].site;
  const correctRpo = sc.t % sc.n;
  const correctMetric = METRICS[sc.metricIdx].abbr;
  const siteOk = checked && site === correctSite;
  const rpoOk = checked && rpo.trim() === String(correctRpo);
  const metricOk = checked && metric === correctMetric;
  const score = [siteOk, rpoOk, metricOk].filter(Boolean).length;
  const clock = `${String(sc.t).padStart(2, "0")}:00`;

  function regen() { setSc(gen()); setSite(""); setRpo(""); setMetric(""); setChecked(false); }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-1 text-sm text-muted">(a) A site that <span className="text-text">{SITE_SCENARIOS[sc.siteIdx].text}</span> → which recovery site?</p>
        <div className="flex gap-1 rounded-lg border border-line bg-surface-2 p-1 text-xs font-medium">
          {SITES.map((s) => (
            <button key={s} type="button" disabled={checked} onClick={() => setSite(s)} className="flex-1 rounded-md px-2 py-1.5 transition-colors"
              style={{ backgroundColor: site === s ? "var(--color-surface-3)" : "transparent", color: site === s ? "var(--color-text)" : "var(--color-faint)", outline: checked && s === correctSite ? "1px solid var(--color-good)" : "none" }}>{s}</button>
          ))}
        </div>
        {checked && !siteOk && <span className="text-xs text-bad">correct: {correctSite}</span>}
      </div>

      <div>
        <p className="mb-1 text-sm text-muted">(b) Backups run every <span className="text-text">{sc.n} hours</span> on the hour. The server fails at <span className="font-mono text-text">{clock}</span>. Worst-case data loss (RPO), in hours?</p>
        <input value={rpo} disabled={checked} onChange={(e) => setRpo(e.target.value)} placeholder="hours" className="h-9 w-28 rounded-md border bg-surface-2 px-3 font-mono text-sm text-text"
          style={{ borderColor: checked ? (rpoOk ? "var(--color-good)" : "var(--color-bad)") : "var(--color-line)" }} />
        {checked && !rpoOk && <span className="ml-2 text-xs text-bad">correct: {correctRpo} h</span>}
      </div>

      <div>
        <p className="mb-1 text-sm text-muted">(c) Which metric is <span className="text-text">{METRICS[sc.metricIdx].q}</span>?</p>
        <div className="flex flex-wrap gap-1.5">
          {sc.metricOpts.map((m) => (
            <button key={m} type="button" disabled={checked} onClick={() => setMetric(m)} className="rounded-md border px-3 py-1.5 font-mono text-sm transition-colors"
              style={{ borderColor: checked ? (m === correctMetric ? "var(--color-good)" : m === metric ? "var(--color-bad)" : "var(--color-line)") : metric === m ? D3 : "var(--color-line)", color: "var(--color-muted)" }}>{m}</button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        {checked ? <span className="text-sm font-semibold" style={{ color: score === 3 ? "var(--color-good)" : "var(--color-text)" }}>{score} / 3 correct</span> : <span />}
        <button type="button" onClick={() => (checked ? regen() : setChecked(true))} className="rounded-lg px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: checked ? "var(--color-surface-3)" : D3 }}>
          {checked ? "New scenario →" : "Check"}
        </button>
      </div>

      {checked && (
        <div className="rounded-lg border border-line-soft bg-surface-2/60 p-3 text-xs leading-relaxed text-muted">
          <span className="font-semibold text-accent">Worked:</span> last backup before {clock} was at {String(Math.floor(sc.t / sc.n) * sc.n).padStart(2, "0")}:00, so up to <span className="text-text">{correctRpo} h</span> of data is lost (RPO). Hotter site = shorter RTO at higher cost.
        </div>
      )}
    </div>
  );
}
