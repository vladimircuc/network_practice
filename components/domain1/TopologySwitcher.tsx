"use client";

import { useState, type ReactNode } from "react";

const D1 = "#3b82f6";
const LINE = "color-mix(in oklab, #3b82f6 45%, transparent)";

function circlePts(n: number, cx: number, cy: number, r: number): [number, number][] {
  return Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
}

function Node({ x, y, r = 8 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={D1} stroke="#06121f" strokeWidth={1.5} />;
}

function Star() {
  const outer = circlePts(6, 100, 70, 52);
  return (
    <>
      {outer.map(([x, y], i) => <line key={i} x1={100} y1={70} x2={x} y2={y} stroke={LINE} strokeWidth={2} />)}
      <circle cx={100} cy={70} r={12} fill={D1} stroke="#06121f" strokeWidth={1.5} />
      {outer.map(([x, y], i) => <Node key={i} x={x} y={y} />)}
    </>
  );
}
function Ring() {
  const p = circlePts(6, 100, 70, 50);
  return (
    <>
      {p.map(([x, y], i) => {
        const [nx, ny] = p[(i + 1) % p.length];
        return <line key={i} x1={x} y1={y} x2={nx} y2={ny} stroke={LINE} strokeWidth={2} />;
      })}
      {p.map(([x, y], i) => <Node key={i} x={x} y={y} />)}
    </>
  );
}
function Mesh() {
  const p = circlePts(5, 100, 70, 50);
  const lines: ReactNode[] = [];
  for (let i = 0; i < p.length; i++)
    for (let j = i + 1; j < p.length; j++)
      lines.push(<line key={`${i}-${j}`} x1={p[i][0]} y1={p[i][1]} x2={p[j][0]} y2={p[j][1]} stroke={LINE} strokeWidth={1.5} />);
  return <>{lines}{p.map(([x, y], i) => <Node key={i} x={x} y={y} />)}</>;
}
function Bus() {
  const xs = [40, 70, 100, 130, 160];
  return (
    <>
      <line x1={20} y1={70} x2={180} y2={70} stroke={LINE} strokeWidth={3} />
      {xs.map((x, i) => {
        const up = i % 2 === 0;
        const ny = up ? 40 : 100;
        return (
          <g key={i}>
            <line x1={x} y1={70} x2={x} y2={ny} stroke={LINE} strokeWidth={2} />
            <Node x={x} y={ny} />
          </g>
        );
      })}
    </>
  );
}

const TOPOS = [
  { key: "star", name: "Star", draw: <Star />, desc: "Every device connects to a central switch.", pro: "Easy to manage; one cable fault only affects one device.", con: "The central switch is a single point of failure." },
  { key: "mesh", name: "Mesh", draw: <Mesh />, desc: "Every device links directly to every other.", pro: "Extremely resilient — many redundant paths.", con: "Lots of cabling/cost; hard to scale." },
  { key: "bus", name: "Bus", draw: <Bus />, desc: "All devices share one backbone cable.", pro: "Cheap, simple, little cabling.", con: "One backbone break downs everyone; collisions. (legacy)" },
  { key: "ring", name: "Ring", draw: <Ring />, desc: "Each device connects to two neighbors in a loop.", pro: "Predictable performance; dual-ring adds redundancy.", con: "A break can disrupt the loop; harder to reconfigure." },
] as const;

export default function TopologySwitcher() {
  const [sel, setSel] = useState(0);
  const t = TOPOS[sel];

  return (
    <div>
      <div className="mb-4 grid grid-cols-4 gap-1 rounded-lg border border-line bg-surface-2 p-1 text-xs font-medium">
        {TOPOS.map((topo, i) => (
          <button
            key={topo.key}
            type="button"
            onClick={() => setSel(i)}
            className="rounded-md px-2 py-1.5 transition-colors"
            style={{ backgroundColor: sel === i ? "var(--color-surface-3)" : "transparent", color: sel === i ? "var(--color-text)" : "var(--color-faint)" }}
          >
            {topo.name}
          </button>
        ))}
      </div>

      <div className="grid items-center gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-line-soft bg-surface/40 p-2">
          <svg viewBox="0 0 200 140" className="w-full">
            {t.draw}
          </svg>
        </div>
        <div>
          <div className="text-lg font-bold text-text">{t.name}</div>
          <p className="mt-1 text-sm leading-relaxed text-muted">{t.desc}</p>
          <div className="mt-3 space-y-1.5 text-sm">
            <div className="flex gap-2"><span className="text-good">▲</span><span className="text-muted">{t.pro}</span></div>
            <div className="flex gap-2"><span className="text-bad">▼</span><span className="text-muted">{t.con}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
