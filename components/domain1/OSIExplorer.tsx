"use client";

import { useState } from "react";
import { OSI_LAYERS, OSI_MNEMONIC } from "@/lib/domain1";

const D1 = "#3b82f6";

const ENCAP = [
  { layer: "L7 Application", pdu: "Data", parts: ["Data"] },
  { layer: "L4 Transport", pdu: "Segment", parts: ["TCP", "Data"] },
  { layer: "L3 Network", pdu: "Packet", parts: ["IP", "TCP", "Data"] },
  { layer: "L2 Data Link", pdu: "Frame", parts: ["Eth", "IP", "TCP", "Data", "FCS"] },
  { layer: "L1 Physical", pdu: "Bits", parts: ["010101…"] },
];

export default function OSIExplorer() {
  const [sel, setSel] = useState(3); // Network layer (index of L4? array is 7..1) -> let's pick Transport
  const [mode, setMode] = useState<"layers" | "encap">("layers");

  return (
    <div>
      <div className="mb-4 flex items-center gap-1 rounded-lg border border-line bg-surface-2 p-1 text-xs font-medium">
        {([["layers", "Explore the 7 layers"], ["encap", "How data is wrapped"]] as const).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className="flex-1 rounded-md px-3 py-1.5 transition-colors"
            style={{
              backgroundColor: mode === m ? "var(--color-surface-3)" : "transparent",
              color: mode === m ? "var(--color-text)" : "var(--color-faint)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "layers" ? (
        <>
          <div className="space-y-1">
            {OSI_LAYERS.map((l, i) => {
              const active = i === sel;
              return (
                <button
                  key={l.num}
                  type="button"
                  onClick={() => setSel(i)}
                  className="flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors"
                  style={{
                    borderColor: active ? D1 : "var(--color-line-soft)",
                    backgroundColor: active ? `color-mix(in oklab, ${D1} 12%, transparent)` : "var(--color-surface)",
                  }}
                >
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-md font-mono text-sm font-bold"
                    style={{ color: D1, backgroundColor: `color-mix(in oklab, ${D1} 16%, transparent)` }}
                  >
                    {l.num}
                  </span>
                  <span className="w-24 shrink-0 text-sm font-semibold text-text">{l.name}</span>
                  <span className="hidden flex-1 text-xs text-muted sm:block">{l.fn}</span>
                  <span className="shrink-0 rounded-full bg-surface-3 px-2 py-0.5 font-mono text-[10px] text-muted">{l.pdu}</span>
                </button>
              );
            })}
          </div>

          {/* detail panel */}
          <div className="mt-3 rounded-lg border border-line-soft bg-surface-2/60 p-4">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm font-bold" style={{ color: D1 }}>Layer {OSI_LAYERS[sel].num}</span>
              <span className="font-semibold text-text">{OSI_LAYERS[sel].name}</span>
              <span className="ml-auto font-mono text-[11px] text-faint">PDU: {OSI_LAYERS[sel].pdu}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{OSI_LAYERS[sel].plain}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-faint">Examples</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {OSI_LAYERS[sel].protocols.map((p) => (
                    <span key={p} className="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-[11px] text-accent-2">{p}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-faint">Devices here</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {OSI_LAYERS[sel].devices.length ? OSI_LAYERS[sel].devices.map((d) => (
                    <span key={d} className="rounded bg-surface-3 px-1.5 py-0.5 text-[11px] text-muted">{d}</span>
                  )) : <span className="text-[11px] text-faint">—</span>}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-faint">
            Remember the order (7→1): <span className="font-medium text-muted">{OSI_MNEMONIC}</span>
          </p>
        </>
      ) : (
        <div>
          <p className="mb-4 text-sm leading-relaxed text-muted">
            As your data heads <span className="text-text">down</span> the stack to be sent, each layer wraps
            it in its own header (<span className="text-text">encapsulation</span>). The receiver unwraps it on
            the way <span className="text-text">up</span> (decapsulation). Watch the data (green) get wrapped:
          </p>
          <div className="space-y-1.5">
            {ENCAP.map((row) => (
              <div key={row.layer} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs text-muted">{row.layer}</span>
                <div className="flex flex-1 overflow-hidden rounded-md border border-line-soft">
                  {row.parts.map((p, i) => {
                    const isData = p === "Data" || p.startsWith("0101");
                    return (
                      <span
                        key={i}
                        className="border-r border-bg/40 px-2 py-1.5 font-mono text-[11px] font-semibold last:border-r-0"
                        style={{
                          flex: isData ? "1 1 auto" : "0 0 auto",
                          color: isData ? "#06121f" : D1,
                          backgroundColor: isData ? "var(--color-good)" : `color-mix(in oklab, ${D1} 18%, transparent)`,
                          textAlign: "center",
                        }}
                      >
                        {p}
                      </span>
                    );
                  })}
                </div>
                <span className="w-20 shrink-0 text-right font-mono text-[11px] text-faint">{row.pdu}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-faint">
            Same data, renamed at each layer: <span className="font-mono text-muted">Data → Segment → Packet → Frame → Bits</span>.
          </p>
        </div>
      )}
    </div>
  );
}
