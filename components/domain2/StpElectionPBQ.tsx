"use client";

import { useState } from "react";
import { electTriangle, type StpSwitch } from "@/lib/domain2";

const D2 = "var(--color-d2)";
const PRIS = [4096, 8192, 16384, 32768];
const IDS = ["SW1", "SW2", "SW3"];

function hx() { return Math.floor(Math.random() * 256).toString(16).padStart(2, "0").toUpperCase(); }
function rndMac() { return `00:1B:${hx()}:${hx()}:${hx()}:${hx()}`; }

function gen(): StpSwitch[] {
  const equal = Math.random() < 0.5; // force a MAC tiebreak half the time
  const base = PRIS[Math.floor(Math.random() * PRIS.length)];
  return IDS.map((id) => ({ id, priority: equal ? base : PRIS[Math.floor(Math.random() * PRIS.length)], mac: rndMac() }));
}

const FIRST: StpSwitch[] = [
  { id: "SW1", priority: 32768, mac: "00:1B:2C:0A:4F:11" },
  { id: "SW2", priority: 8192, mac: "00:1B:2C:0A:4F:22" },
  { id: "SW3", priority: 32768, mac: "00:1B:2C:0A:4F:09" },
];

export default function StpElectionPBQ() {
  const [sw, setSw] = useState<StpSwitch[]>(FIRST);
  const [root, setRoot] = useState("");
  const [blocked, setBlocked] = useState("");
  const [checked, setChecked] = useState(false);

  const ans = electTriangle(sw);
  const rootOk = checked && root === ans.rootId;
  const blkOk = checked && blocked === ans.blockedSwitchId;

  function regen() { setSw(gen()); setRoot(""); setBlocked(""); setChecked(false); }

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Three switches are cabled in a triangle (all links equal cost). Using their bridge IDs, determine the
        <span className="text-text"> root bridge</span> and which switch ends up <span className="text-text">blocking</span> a port.
      </p>

      <div className="mb-4 grid grid-cols-3 gap-2">
        {sw.map((s) => (
          <div key={s.id} className="rounded-lg border border-line-soft bg-surface/50 p-3 text-center">
            <div className="font-mono text-sm font-bold text-text">{s.id}</div>
            <div className="mt-1 text-[11px] text-faint">priority</div>
            <div className="font-mono text-sm" style={{ color: D2 }}>{s.priority}</div>
            <div className="mt-1 text-[11px] text-faint">MAC</div>
            <div className="font-mono text-[10px] text-muted">{s.mac}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Pick label="Root bridge" value={root} onChange={setRoot} options={IDS} ok={rootOk} bad={checked && !rootOk} answer={ans.rootId} checked={checked} />
        <Pick label="Switch with a blocked port" value={blocked} onChange={setBlocked} options={IDS} ok={blkOk} bad={checked && !blkOk} answer={ans.blockedSwitchId} checked={checked} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {checked ? <span className="text-sm font-semibold" style={{ color: rootOk && blkOk ? "var(--color-good)" : "var(--color-text)" }}>{(rootOk ? 1 : 0) + (blkOk ? 1 : 0)} / 2 correct</span> : <span />}
        <button type="button" onClick={() => (checked ? regen() : setChecked(true))}
          className="rounded-lg px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: checked ? "var(--color-surface-3)" : D2 }}>
          {checked ? "New switches →" : "Check"}
        </button>
      </div>

      {checked && (
        <div className="mt-3 rounded-lg border border-line-soft bg-surface-2/60 p-3 text-xs leading-relaxed text-muted">
          <span className="font-semibold text-accent">Why:</span> compare bridge IDs = priority first, then MAC.{" "}
          <span className="text-text">{ans.rootId}</span> has the best (lowest) bridge ID → root. Between the other two, the one with the
          worse bridge ID (<span className="text-text">{ans.blockedSwitchId}</span>) blocks its port to break the loop; the root&apos;s ports
          and the better switch&apos;s port stay forwarding.
        </div>
      )}
    </div>
  );
}

function Pick({ label, value, onChange, options, ok, bad, answer, checked }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
  ok: boolean; bad: boolean; answer: string; checked: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-56 shrink-0 text-sm text-muted">{label}</span>
      <select value={value} disabled={checked} onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border bg-surface-2 px-2 font-mono text-sm text-text"
        style={{ borderColor: checked ? (ok ? "var(--color-good)" : "var(--color-bad)") : "var(--color-line)" }}>
        <option value="">choose…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {bad && <span className="text-xs text-bad">correct: {answer}</span>}
    </div>
  );
}
