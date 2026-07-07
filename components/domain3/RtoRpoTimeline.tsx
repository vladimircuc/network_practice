"use client";

import { useState } from "react";

const RPO_COLOR = "#f5a623";
const RTO_COLOR = "#3b82f6";

const SITES = [
  { key: "cold", label: "Cold site", rtoH: 48 },
  { key: "warm", label: "Warm site", rtoH: 8 },
  { key: "hot", label: "Hot site", rtoH: 0.25 },
];

function fmt(h: number) {
  if (h < 1) return `${Math.round(h * 60)} min`;
  if (h < 24) return `${h} h`;
  return `${h / 24} day${h / 24 > 1 ? "s" : ""}`;
}

export default function RtoRpoTimeline() {
  const [backupH, setBackupH] = useState(6); // backup interval -> worst-case RPO
  const [site, setSite] = useState(1); // warm

  const rpo = backupH;
  const rto = SITES[site].rtoH;
  // one shared scale (≈48 h → 45%) so equal durations render at equal widths
  const K = 45 / 48;
  const rpoPct = Math.min(45, Math.max(7, rpo * K));
  const rtoPct = Math.min(45, Math.max(7, rto * K));
  const total = rpoPct + rtoPct;
  const failLeft = (rpoPct / total) * 100;

  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-muted">
        At the moment of failure, two clocks matter: how much <span style={{ color: RPO_COLOR }}>data you lose</span>{" "}
        (back to your last backup) and how long you&apos;re <span style={{ color: RTO_COLOR }}>down</span> (until you&apos;re
        running again). Both bars share one time scale, so their lengths compare directly.
      </p>

      {/* timeline — RPO measures back to the last backup, RTO forward to recovery */}
      <div className="relative mx-auto" style={{ width: `${total}%`, minWidth: 260 }}>
        {/* failure marker sits on the boundary between the two bars */}
        <div className="relative mb-1 h-4">
          <span className="absolute -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold text-bad" style={{ left: `${failLeft}%` }}>✕ failure</span>
        </div>
        <div className="flex items-stretch">
          <div className="flex flex-col items-end justify-center rounded-l-md border border-r-0 border-line-soft px-2 py-3 text-right" style={{ width: `${failLeft}%`, backgroundColor: `color-mix(in oklab, ${RPO_COLOR} 14%, transparent)` }}>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: RPO_COLOR }}>RPO</span>
            <span className="font-mono text-sm font-bold text-text">{fmt(rpo)}</span>
            <span className="text-[10px] text-faint">data lost</span>
          </div>
          <div className="z-10 w-0.5 shrink-0 bg-bad" />
          <div className="flex flex-1 flex-col items-start justify-center rounded-r-md border border-l-0 border-line-soft px-2 py-3" style={{ backgroundColor: `color-mix(in oklab, ${RTO_COLOR} 14%, transparent)` }}>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: RTO_COLOR }}>RTO</span>
            <span className="font-mono text-sm font-bold text-text">{fmt(rto)}</span>
            <span className="text-[10px] text-faint">downtime</span>
          </div>
        </div>
        {/* edge labels under their true positions */}
        <div className="mt-1 flex justify-between text-[10px] text-faint">
          <span>↤ last backup</span>
          <span>recovered ↦</span>
        </div>
      </div>

      {/* controls */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex justify-between text-xs"><span className="text-muted">Backup every</span><span className="font-mono font-bold" style={{ color: RPO_COLOR }}>{fmt(backupH)}</span></div>
          <input type="range" min={1} max={24} value={backupH} aria-label="Backup interval in hours" onChange={(e) => setBackupH(Number(e.target.value))} className="w-full" style={{ accentColor: RPO_COLOR }} />
          <p className="mt-1 text-[11px] text-faint">More frequent backups → smaller RPO (less data lost).</p>
        </div>
        <div>
          <div className="mb-1 text-xs text-muted">Recovery site</div>
          <div className="flex gap-1 rounded-lg border border-line bg-surface-2 p-1 text-xs font-medium">
            {SITES.map((s, i) => (
              <button key={s.key} type="button" onClick={() => setSite(i)} className="flex-1 rounded-md px-2 py-1.5 transition-colors"
                style={{ backgroundColor: site === i ? "var(--color-surface-3)" : "transparent", color: site === i ? "var(--color-text)" : "var(--color-faint)" }}>
                {s.label}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-faint">A hotter site → smaller RTO (back online faster, higher cost).</p>
        </div>
      </div>
    </div>
  );
}
