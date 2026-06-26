"use client";

import { useState } from "react";
import { electTriangle, type StpSwitch } from "@/lib/domain2";

const D2 = "var(--color-d2)";
const PRIORITIES = [4096, 8192, 16384, 32768];
const POS: Record<string, [number, number]> = { A: [150, 36], B: [60, 150], C: [240, 150] };
const MAC: Record<string, string> = { A: "00:1A:..:0A", B: "00:1A:..:0B", C: "00:1A:..:0C" };

export default function StpVisualizer() {
  const [pri, setPri] = useState<Record<string, number>>({ A: 32768, B: 32768, C: 32768 });

  const switches: StpSwitch[] = ["A", "B", "C"].map((id) => ({
    id, priority: pri[id], mac: `00:00:00:00:00:0${id}`,
  }));
  const { rootId, blockedSwitchId } = electTriangle(switches);
  const otherNonRoot = ["A", "B", "C"].find((id) => id !== rootId && id !== blockedSwitchId)!;

  // blocked port sits on blockedSwitch, on the link to the other non-root switch
  const [bx, by] = POS[blockedSwitchId];
  const [ox, oy] = POS[otherNonRoot];
  const blkX = bx + (ox - bx) * 0.3;
  const blkY = by + (oy - by) * 0.3;

  const links: [string, string][] = [["A", "B"], ["A", "C"], ["B", "C"]];

  return (
    <div className="grid items-center gap-4 sm:grid-cols-2">
      <div>
        <svg viewBox="0 0 300 190" className="w-full">
          {links.map(([x, y], i) => (
            <line key={i} x1={POS[x][0]} y1={POS[x][1]} x2={POS[y][0]} y2={POS[y][1]}
              stroke="color-mix(in oklab, #a855f7 45%, transparent)" strokeWidth={2} />
          ))}
          {/* blocked port marker */}
          <g>
            <circle cx={blkX} cy={blkY} r={9} fill="var(--color-bad)" />
            <text x={blkX} y={blkY + 3.5} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#fff">✕</text>
          </g>
          {["A", "B", "C"].map((id) => {
            const [x, y] = POS[id];
            const isRoot = id === rootId;
            return (
              <g key={id}>
                <circle cx={x} cy={y} r={20}
                  fill={isRoot ? "var(--color-d2)" : "var(--color-surface-3)"}
                  stroke={isRoot ? "var(--color-d2)" : "var(--color-line)"} strokeWidth={2} />
                <text x={x} y={y + 5} textAnchor="middle" fontSize={15} fontWeight="bold" fill={isRoot ? "#fff" : "var(--color-text)"}>{id}</text>
                {isRoot && <text x={x} y={y - 28} textAnchor="middle" fontSize={14}>👑</text>}
              </g>
            );
          })}
        </svg>
      </div>

      <div>
        <div className="space-y-2">
          {["A", "B", "C"].map((id) => (
            <div key={id} className="flex items-center gap-2 text-sm">
              <span className="grid h-6 w-6 place-items-center rounded font-mono text-xs font-bold"
                style={{ color: id === rootId ? "var(--color-d2)" : "var(--color-muted)", backgroundColor: "var(--color-surface-3)" }}>{id}</span>
              <span className="text-xs text-faint">priority</span>
              <select value={pri[id]} onChange={(e) => setPri((p) => ({ ...p, [id]: Number(e.target.value) }))}
                className="h-8 rounded-md border border-line bg-surface-2 px-2 font-mono text-xs text-text">
                {PRIORITIES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              <span className="font-mono text-[11px] text-faint">{MAC[id]}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg border border-line-soft bg-surface-2/60 p-3 text-sm text-muted">
          <span className="font-semibold" style={{ color: D2 }}>{rootId}</span> is the <span className="text-text">root bridge</span> (best bridge ID).
          Switch <span className="font-semibold text-bad">{blockedSwitchId}</span> blocks its port toward {otherNonRoot} to break the loop.
        </div>
        <p className="mt-2 text-xs text-faint">Lowest priority wins; ties break on the lowest MAC. All three priorities equal → lowest MAC (A) becomes root.</p>
      </div>
    </div>
  );
}
