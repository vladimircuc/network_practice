"use client";

import { useState } from "react";

const D3 = "var(--color-d3)";
const TYPES = ["A", "AAAA", "CNAME", "MX", "TXT", "PTR", "NS"];

const REQS = [
  { text: "Point the website to IPv4 address 198.51.100.5", answer: "A" },
  { text: "Point the website to IPv6 address 2001:db8::5", answer: "AAAA" },
  { text: "Make 'www' an alias of acme.com", answer: "CNAME" },
  { text: "Deliver the domain's email to a mail server", answer: "MX" },
  { text: "Publish an SPF anti-spam policy", answer: "TXT" },
  { text: "Reverse-resolve 198.51.100.5 back to a hostname", answer: "PTR" },
  { text: "Delegate which servers are authoritative for the zone", answer: "NS" },
];

function shuffle<T>(x: T[]): T[] { const r = x.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }
const FIRST = [REQS[0], REQS[2], REQS[3], REQS[4], REQS[5]];

export default function DnsRecordsPBQ() {
  const [reqs, setReqs] = useState(FIRST);
  const [picks, setPicks] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const score = reqs.filter((r, i) => picks[i] === r.answer).length;

  function regen() { setReqs(shuffle(REQS).slice(0, 5)); setPicks({}); setChecked(false); }

  return (
    <div>
      <p className="mb-3 text-sm text-muted">Pick the DNS record type that does each job:</p>
      <div className="space-y-2">
        {reqs.map((r, i) => {
          const ok = checked && picks[i] === r.answer;
          const bad = checked && picks[i] !== r.answer;
          return (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <span className="flex-1 text-sm text-text">{r.text}</span>
              <select value={picks[i] ?? ""} disabled={checked} onChange={(e) => setPicks((p) => ({ ...p, [i]: e.target.value }))}
                className="h-9 w-28 rounded-md border bg-surface-2 px-2 font-mono text-sm text-text"
                style={{ borderColor: checked ? (ok ? "var(--color-good)" : "var(--color-bad)") : "var(--color-line)" }}>
                <option value="">type…</option>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {bad && <span className="text-xs text-bad">→ {r.answer}</span>}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {checked ? <span className="text-sm font-semibold" style={{ color: score === reqs.length ? "var(--color-good)" : "var(--color-text)" }}>{score} / {reqs.length} correct</span> : <span />}
        <button type="button" onClick={() => (checked ? regen() : setChecked(true))} className="rounded-lg px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: checked ? "var(--color-surface-3)" : D3 }}>
          {checked ? "New set →" : "Check"}
        </button>
      </div>

      {checked && (
        <div className="mt-3 rounded-lg border border-line-soft bg-surface-2/60 p-3 text-xs leading-relaxed text-muted">
          <span className="font-semibold text-accent">Remember:</span> A = IPv4, AAAA = IPv6, CNAME = alias, MX = mail (with priority), TXT = SPF/DKIM/verification, PTR = reverse, NS = delegation. If <span className="text-text">mail bounces but the site loads</span>, suspect the <span className="text-text">MX</span> record.
        </div>
      )}
    </div>
  );
}
