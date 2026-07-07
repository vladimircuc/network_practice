"use client";

import { useState } from "react";

const D2 = "var(--color-d2)";
const OPTS = [1, 6, 11];
const CH_COLOR: Record<number, string> = { 1: "#3b82f6", 6: "#f5a623", 11: "#2fcf6b" };

// AP positions (5 APs) + which APs overlap in coverage (edges, 0-indexed)
const POS: [number, number][] = [[150, 30], [60, 95], [240, 95], [200, 175], [100, 175]];
const EDGES: [number, number][] = [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 0]];

export default function ChannelPlanningPBQ() {
  const [chans, setChans] = useState<number[]>([1, 1, 1, 1, 1]);
  const [checked, setChecked] = useState(false);
  const [showSol, setShowSol] = useState(false);

  const conflicts = EDGES.filter(([a, b]) => chans[a] === chans[b]);
  const solved = conflicts.length === 0;
  const conflictNodes = new Set(conflicts.flat());

  function reset() { setChans([1, 1, 1, 1, 1]); setChecked(false); setShowSol(false); }

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Five APs; a line means their coverage <span className="text-text">overlaps</span>. Assign 2.4 GHz channels
        so no two overlapping APs share one — you only have the non-overlapping trio <span className="text-text">1, 6, 11</span>.
      </p>

      <div className="grid items-start gap-4 sm:grid-cols-2">
        <svg viewBox="0 0 300 210" className="w-full rounded-lg border border-line-soft bg-surface/40">
          {EDGES.map(([a, b], i) => {
            const bad = checked && chans[a] === chans[b];
            return <line key={i} x1={POS[a][0]} y1={POS[a][1]} x2={POS[b][0]} y2={POS[b][1]}
              stroke={bad ? "var(--color-bad)" : "var(--color-line)"} strokeWidth={bad ? 3 : 2} />;
          })}
          {POS.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={20} fill={CH_COLOR[chans[i]]} stroke={checked && conflictNodes.has(i) ? "var(--color-bad)" : "#06121f"} strokeWidth={checked && conflictNodes.has(i) ? 3 : 1.5} />
              <text x={x} y={y - 1} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#06121f">AP{i + 1}</text>
              <text x={x} y={y + 10} textAnchor="middle" fontSize={9} fill="#06121f">ch {chans[i]}</text>
            </g>
          ))}
        </svg>

        <div>
          <div className="grid grid-cols-2 gap-2">
            {chans.map((ch, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted">AP{i + 1}</span>
                <select value={ch} disabled={checked} aria-label={`AP${i + 1} channel`} onChange={(e) => setChans((c) => c.map((v, j) => j === i ? Number(e.target.value) : v))}
                  className="h-8 flex-1 rounded-md border border-line bg-surface-2 px-2 font-mono text-xs text-text">
                  {OPTS.map((o) => <option key={o} value={o}>Ch {o}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => (checked ? reset() : setChecked(true))}
              className="rounded-lg px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: checked ? "var(--color-surface-3)" : D2 }}>
              {checked ? "Reset" : "Check"}
            </button>
            {checked && !solved && (
              <button type="button" onClick={() => setShowSol((s) => !s)} className="rounded-lg border border-line bg-surface-2 px-4 py-2 text-sm text-muted hover:text-text">
                {showSol ? "Hide" : "Show"} a solution
              </button>
            )}
          </div>

          {checked && (
            <div className="mt-3 rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: `color-mix(in oklab, ${solved ? "var(--color-good)" : "var(--color-bad)"} 40%, transparent)`, backgroundColor: `color-mix(in oklab, ${solved ? "var(--color-good)" : "var(--color-bad)"} 8%, transparent)`, color: "var(--color-muted)" }}>
              {solved ? "✓ Clean plan — no overlapping APs share a channel." : `✗ ${conflicts.length} overlapping pair${conflicts.length > 1 ? "s" : ""} still share a channel (shown in red).`}
            </div>
          )}
          {showSol && <p className="mt-2 font-mono text-xs text-faint">One valid answer: AP1=1, AP2=6, AP3=11, AP4=6, AP5=11 (the AP1-AP2-AP3 triangle forces all three channels).</p>}
        </div>
      </div>
    </div>
  );
}
