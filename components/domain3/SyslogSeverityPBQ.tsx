"use client";

import { useState } from "react";
import { SYSLOG } from "@/lib/domain3";

const D3 = "var(--color-d3)";

const POOL = [
  { text: "Kernel panic — the device has halted", level: 0 },
  { text: "Primary WAN link down, no failover available", level: 1 },
  { text: "Power supply 1 has failed", level: 2 },
  { text: "OSPF neighbor went down on Gi0/1", level: 3 },
  { text: "CPU utilization sustained at 92%", level: 4 },
  { text: "Interface Gi0/2 changed state to up", level: 5 },
  { text: "Scheduled SNMP poll completed", level: 6 },
  { text: "Verbose packet-by-packet debug trace", level: 7 },
  { text: "Disk space warning: 88% used", level: 4 },
  { text: "Configuration saved to startup-config", level: 5 },
];

function shuffle<T>(x: T[]): T[] { const r = x.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }
const FIRST = [POOL[0], POOL[3], POOL[6], POOL[1], POOL[4]];

export default function SyslogSeverityPBQ() {
  const [items, setItems] = useState(FIRST);
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);

  const score = items.filter((it, i) => picks[i] === it.level).length;
  function regen() { setItems(shuffle(POOL).slice(0, 5)); setPicks({}); setChecked(false); }

  return (
    <div>
      <p className="mb-3 text-sm text-muted">Assign each log message its syslog severity (0 = most urgent, 7 = noise):</p>
      <div className="space-y-2">
        {items.map((it, i) => {
          const ok = checked && picks[i] === it.level;
          const bad = checked && picks[i] !== it.level;
          return (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <span className="flex-1 text-sm text-text">{it.text}</span>
              <select value={picks[i] ?? ""} disabled={checked} onChange={(e) => setPicks((p) => ({ ...p, [i]: Number(e.target.value) }))}
                className="h-9 rounded-md border bg-surface-2 px-2 text-sm text-text"
                style={{ borderColor: checked ? (ok ? "var(--color-good)" : "var(--color-bad)") : "var(--color-line)" }}>
                <option value="">severity…</option>
                {SYSLOG.map((s) => <option key={s.level} value={s.level}>{s.level} · {s.name}</option>)}
              </select>
              {bad && <span className="text-xs text-bad">→ {it.level} {SYSLOG[it.level].name}</span>}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {checked ? <span className="text-sm font-semibold" style={{ color: score === items.length ? "var(--color-good)" : "var(--color-text)" }}>{score} / {items.length} correct</span> : <span />}
        <button type="button" onClick={() => (checked ? regen() : setChecked(true))} className="rounded-lg px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: checked ? "var(--color-surface-3)" : D3 }}>
          {checked ? "New logs →" : "Check"}
        </button>
      </div>
    </div>
  );
}
