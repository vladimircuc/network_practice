"use client";

import { useState } from "react";

const UNITS = [
  { name: "Patch panel", u: 1, color: "#64748b", desc: "Terminates and labels the cable runs coming from wall jacks, so you patch devices in cleanly instead of running long cables." },
  { name: "Core switch (PoE)", u: 1, color: "#a855f7", desc: "Main Layer 2/3 switch; also delivers Power over Ethernet to APs, phones, and cameras." },
  { name: "Access switch", u: 1, color: "#a855f7", desc: "Extra switch ports for end devices, uplinked to the core." },
  { name: "Firewall / router", u: 1, color: "#fb5e7e", desc: "The edge to the WAN/internet — routing plus the security policy." },
  { name: "Server", u: 2, color: "#3b82f6", desc: "Compute/storage. Larger boxes take multiple rack units (this one is 2U)." },
  { name: "UPS", u: 2, color: "#2fcf6b", desc: "Battery backup — rides through short outages and protects gear from surges/sags. Sized to the rack's power load." },
  { name: "PDU", u: 1, color: "#f5a623", desc: "Power distribution unit — the rack's power strip; distributes conditioned power to every device." },
];

export default function RackDiagram() {
  const [sel, setSel] = useState(1);

  return (
    <div className="grid items-start gap-4 sm:grid-cols-2">
      {/* the rack */}
      <div className="mx-auto w-full max-w-[220px] rounded-lg border-2 border-line bg-surface/40 p-2">
        <div className="mb-1 text-center text-[10px] font-semibold uppercase tracking-wider text-faint">42U Rack</div>
        <div className="space-y-1">
          {UNITS.map((x, i) => (
            <button key={i} type="button" onClick={() => setSel(i)}
              className="flex w-full items-center justify-between rounded px-2 text-left font-mono text-[11px] font-semibold transition-colors"
              style={{
                height: `${x.u * 22}px`,
                color: "#0a0e16",
                backgroundColor: sel === i ? x.color : `color-mix(in oklab, ${x.color} 70%, black)`,
                outline: sel === i ? `2px solid ${x.color}` : "none",
              }}>
              <span className="truncate">{x.name}</span>
              <span className="opacity-70">{x.u}U</span>
            </button>
          ))}
        </div>
      </div>

      {/* description + context */}
      <div>
        <div className="rounded-lg border border-line-soft bg-surface-2/60 p-4">
          <div className="font-semibold text-text">{UNITS[sel].name}</div>
          <p className="mt-1 text-sm leading-relaxed text-muted">{UNITS[sel].desc}</p>
        </div>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="rounded-lg border border-line-soft bg-surface/40 px-3 py-2">
            <dt className="font-semibold text-text">MDF vs IDF</dt>
            <dd className="mt-0.5 text-muted">The <span className="text-text">MDF</span> is the building&apos;s main equipment room (where the ISP and core live). Each floor/area has an <span className="text-text">IDF</span> that connects back to the MDF over a backbone.</dd>
          </div>
          <div className="rounded-lg border border-line-soft bg-surface/40 px-3 py-2">
            <dt className="font-semibold text-text">Airflow</dt>
            <dd className="mt-0.5 text-muted">Mind <span className="text-text">port-side exhaust/intake</span> — line up hot and cold aisles so switches don&apos;t cook each other.</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
