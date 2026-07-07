"use client";

import { useState, type ReactNode } from "react";

const D3 = "var(--color-d3)";

type Sc = { start: number; end: number; exclFrom: number; exclTo: number; reservations: number; options: string[] };

const RELAY = "Configure an IP helper (DHCP relay) on the router";
const DISTRACTORS = ["Shorten the DHCP lease time", "Add a second default gateway", "Enable jumbo frames on the switch"];

function rnd(a: number, b: number) { return a + Math.floor(Math.random() * (b - a + 1)); }
function shuffle<T>(x: T[]): T[] { const r = x.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

function gen(): Sc {
  const start = rnd(20, 60);
  const end = Math.min(250, start + rnd(40, 120));
  const exclFrom = rnd(start, end - 10);
  const exclTo = Math.min(end, exclFrom + rnd(2, 8));
  return { start, end, exclFrom, exclTo, reservations: rnd(1, 4), options: shuffle([RELAY, ...DISTRACTORS]) };
}
const FIRST: Sc = { start: 50, end: 150, exclFrom: 50, exclTo: 55, reservations: 2, options: ["Add a second default gateway", RELAY, "Enable jumbo frames on the switch", "Shorten the DHCP lease time"] };

export default function DhcpScopePBQ() {
  const [sc, setSc] = useState<Sc>(FIRST);
  const [pool, setPool] = useState("");
  const [avail, setAvail] = useState("");
  const [mc, setMc] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const poolSize = sc.end - sc.start + 1;
  const excl = sc.exclTo - sc.exclFrom + 1;
  const usable = poolSize - excl - sc.reservations;

  const poolOk = checked && pool.trim() === String(poolSize);
  const availOk = checked && avail.trim() === String(usable);
  const mcOk = checked && mc === RELAY;
  const score = [poolOk, availOk, mcOk].filter(Boolean).length;

  function regen() { setSc(gen()); setPool(""); setAvail(""); setMc(null); setChecked(false); }
  const inp = "h-9 w-28 rounded-md border bg-surface-2 px-3 font-mono text-sm text-text";

  return (
    <div>
      <div className="mb-4 rounded-lg border border-line-soft bg-surface/60 p-4 text-sm leading-relaxed text-muted">
        DHCP scope <span className="font-mono text-text">192.168.1.{sc.start} – 192.168.1.{sc.end}</span>.
        Excluded range <span className="font-mono text-text">.{sc.exclFrom}–.{sc.exclTo}</span>.
        <span className="text-text"> {sc.reservations}</span> address reservation{sc.reservations > 1 ? "s" : ""} configured.
      </div>

      <div className="space-y-3">
        <Row label="(a) Total addresses in the pool?" ok={poolOk} bad={checked && !poolOk} answer={String(poolSize)}>
          <input value={pool} disabled={checked} aria-label="Total addresses in the pool" onChange={(e) => setPool(e.target.value)} placeholder="count" className={inp} style={{ borderColor: checked ? (poolOk ? "var(--color-good)" : "var(--color-bad)") : "var(--color-line)" }} />
        </Row>
        <Row label="(b) Dynamic leases still available?" ok={availOk} bad={checked && !availOk} answer={String(usable)}>
          <input value={avail} disabled={checked} aria-label="Dynamic leases still available" onChange={(e) => setAvail(e.target.value)} placeholder="count" className={inp} style={{ borderColor: checked ? (availOk ? "var(--color-good)" : "var(--color-bad)") : "var(--color-line)" }} />
        </Row>
      </div>

      <p className="mb-2 mt-4 text-sm text-muted">(c) Clients on the <span className="text-text">same</span> subnet get IPs, but clients on a <span className="text-text">remote</span> subnet get nothing. What&apos;s needed?</p>
      <div className="space-y-1.5">
        {sc.options.map((opt, i) => {
          const isAns = opt === RELAY, picked = mc === opt;
          let border = "var(--color-line)";
          if (checked) { if (isAns) border = "var(--color-good)"; else if (picked) border = "var(--color-bad)"; }
          return (
            <button key={i} type="button" disabled={checked} onClick={() => setMc(opt)}
              className="flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm"
              style={{ borderColor: border, backgroundColor: picked ? "color-mix(in oklab, var(--color-d3) 10%, transparent)" : "transparent", color: "var(--color-muted)" }}>
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px]" style={{ borderColor: picked ? D3 : "var(--color-line)" }}>{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {checked ? <span className="text-sm font-semibold" style={{ color: score === 3 ? "var(--color-good)" : "var(--color-text)" }}>{score} / 3 correct</span> : <span />}
        <button type="button" onClick={() => (checked ? regen() : setChecked(true))} className="rounded-lg px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: checked ? "var(--color-surface-3)" : D3 }}>
          {checked ? "New scope →" : "Check"}
        </button>
      </div>

      {checked && (
        <div className="mt-3 rounded-lg border border-line-soft bg-surface-2/60 p-3 text-xs leading-relaxed text-muted">
          <span className="font-semibold text-accent">Worked:</span> pool = {sc.end} − {sc.start} + 1 = <span className="text-text">{poolSize}</span>; minus {excl} excluded and {sc.reservations} reserved = <span className="text-text">{usable}</span>. Remote clients need a relay because DHCP Discover is a broadcast that routers don&apos;t forward — an <span className="text-text">IP helper</span> relays it to the server.
        </div>
      )}
    </div>
  );
}

function Row({ label, ok, bad, answer, children }: { label: string; ok: boolean; bad: boolean; answer: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-60 shrink-0 text-sm text-muted">{label}</span>
      {children}
      {bad && <span className="text-xs text-bad">correct: {answer}</span>}
      {ok && <span className="text-xs text-good">✓</span>}
    </div>
  );
}
