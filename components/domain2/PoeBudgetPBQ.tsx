"use client";

import { useState, type ReactNode } from "react";

const D2 = "var(--color-d2)";
const PHONE = 7, CAM = 15, AP = 25;

type Sc = { budget: number; phones: number; cams: number; aps: number };

function rnd(min: number, max: number) { return min + Math.floor(Math.random() * (max - min + 1)); }
function gen(): Sc { return { budget: [240, 370, 740][rnd(0, 2)], phones: rnd(2, 10), cams: rnd(1, 8), aps: rnd(1, 8) }; }
const FIRST: Sc = { budget: 370, phones: 6, cams: 4, aps: 5 };

export default function PoeBudgetPBQ() {
  const [sc, setSc] = useState<Sc>(FIRST);
  const [draw, setDraw] = useState("");
  const [fits, setFits] = useState("");
  const [more, setMore] = useState("");
  const [checked, setChecked] = useState(false);

  const total = sc.phones * PHONE + sc.cams * CAM + sc.aps * AP;
  const ok = total <= sc.budget;
  const headroom = Math.max(0, sc.budget - total);
  const moreAps = Math.floor(headroom / AP);

  const drawOk = checked && draw.trim() === String(total);
  const fitsOk = checked && fits === (ok ? "yes" : "no");
  const moreOk = checked && more.trim() === String(moreAps);
  const score = [drawOk, fitsOk, moreOk].filter(Boolean).length;

  function regen() { setSc(gen()); setDraw(""); setFits(""); setMore(""); setChecked(false); }
  const inp = "h-9 w-28 rounded-md border bg-surface-2 px-3 font-mono text-sm text-text";

  return (
    <div>
      <div className="mb-4 rounded-lg border border-line-soft bg-surface/60 p-4 text-sm leading-relaxed text-muted">
        An access switch has a <span className="font-mono font-bold text-text">{sc.budget} W</span> PoE budget. You connect{" "}
        <span className="text-text">{sc.phones}</span> VoIP phones (<span className="font-mono">{PHONE}W</span> each),{" "}
        <span className="text-text">{sc.cams}</span> cameras (<span className="font-mono">{CAM}W</span>), and{" "}
        <span className="text-text">{sc.aps}</span> Wi-Fi APs (<span className="font-mono">{AP}W</span>).
      </div>

      <div className="space-y-3">
        <Row label="(a) Total PoE draw (W)?" ok={drawOk} bad={checked && !drawOk} answer={`${total} W`}>
          <input value={draw} disabled={checked} onChange={(e) => setDraw(e.target.value)} placeholder="watts" className={inp}
            style={{ borderColor: checked ? (drawOk ? "var(--color-good)" : "var(--color-bad)") : "var(--color-line)" }} />
        </Row>
        <Row label="(b) Does it fit the budget?" ok={fitsOk} bad={checked && !fitsOk} answer={ok ? "yes" : "no"}>
          <select value={fits} disabled={checked} onChange={(e) => setFits(e.target.value)} className={inp}
            style={{ borderColor: checked ? (fitsOk ? "var(--color-good)" : "var(--color-bad)") : "var(--color-line)" }}>
            <option value="">?</option><option value="yes">Yes</option><option value="no">No</option>
          </select>
        </Row>
        <Row label="(c) How many more 25 W APs fit?" ok={moreOk} bad={checked && !moreOk} answer={String(moreAps)}>
          <input value={more} disabled={checked} onChange={(e) => setMore(e.target.value)} placeholder="count" className={inp}
            style={{ borderColor: checked ? (moreOk ? "var(--color-good)" : "var(--color-bad)") : "var(--color-line)" }} />
        </Row>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {checked ? <span className="text-sm font-semibold" style={{ color: score === 3 ? "var(--color-good)" : "var(--color-text)" }}>{score} / 3 correct</span> : <span />}
        <button type="button" onClick={() => (checked ? regen() : setChecked(true))}
          className="rounded-lg px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: checked ? "var(--color-surface-3)" : D2 }}>
          {checked ? "New scenario →" : "Check"}
        </button>
      </div>

      {checked && (
        <div className="mt-3 rounded-lg border border-line-soft bg-surface-2/60 p-3 text-xs leading-relaxed text-muted">
          <span className="font-semibold text-accent">Worked:</span> {sc.phones}×{PHONE} + {sc.cams}×{CAM} + {sc.aps}×{AP} ={" "}
          <span className="text-text">{total} W</span>. Budget {sc.budget} W → {ok ? "fits" : "over budget"}. Headroom {headroom} W ÷ 25 W ={" "}
          <span className="text-text">{moreAps}</span> more APs.
        </div>
      )}
    </div>
  );
}

function Row({ label, ok, bad, answer, children }: { label: string; ok: boolean; bad: boolean; answer: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-56 shrink-0 text-sm text-muted">{label}</span>
      {children}
      {bad && <span className="text-xs text-bad">correct: {answer}</span>}
      {ok && <span className="text-xs text-good">✓</span>}
    </div>
  );
}
