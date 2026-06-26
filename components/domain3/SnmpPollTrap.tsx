"use client";

import { useState } from "react";

const D3 = "var(--color-d3)";

export default function SnmpPollTrap() {
  const [mode, setMode] = useState<"poll" | "trap">("poll");
  const poll = mode === "poll";

  return (
    <div>
      <div className="mb-4 flex items-center gap-1 rounded-lg border border-line bg-surface-2 p-1 text-xs font-medium">
        {([["poll", "Polling (the manager asks)"], ["trap", "Traps (the device tells)"]] as const).map(([m, label]) => (
          <button key={m} type="button" onClick={() => setMode(m)} className="flex-1 rounded-md px-3 py-1.5 transition-colors"
            style={{ backgroundColor: mode === m ? "var(--color-surface-3)" : "transparent", color: mode === m ? "var(--color-text)" : "var(--color-faint)" }}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="grid h-16 w-28 place-items-center rounded-lg border border-line bg-surface-2 text-center text-xs font-semibold text-text">📊 SNMP<br />Manager (NMS)</div>
        <div className="flex flex-1 flex-col items-center">
          <span className="font-mono text-xs" style={{ color: D3 }}>{poll ? "GET request →" : "← TRAP"}</span>
          <div className="my-1 h-0.5 w-full" style={{ background: poll ? `linear-gradient(90deg, ${D3}, transparent)` : `linear-gradient(90deg, transparent, ${D3})` }} />
          <span className="font-mono text-[11px] text-faint">{poll ? "← response" : "(on an event)"}</span>
        </div>
        <div className="grid h-16 w-28 place-items-center rounded-lg border border-line bg-surface-2 text-center text-xs font-semibold text-text">🖧 Device<br />(SNMP agent)</div>
      </div>

      <div className="mt-4 rounded-lg border border-line-soft bg-surface-2/60 p-3 text-sm leading-relaxed text-muted">
        {poll ? (
          <><span className="font-semibold text-text">Polling:</span> the manager asks each device for its stats on a <span className="text-text">schedule</span> (UDP 161). Great for routine metrics and baselines — but you only learn about a problem at the next poll.</>
        ) : (
          <><span className="font-semibold text-text">Traps:</span> the device <span className="text-text">pushes</span> an alert the instant something happens (UDP 162) — e.g. an interface going down. Immediate, but unsolicited.</>
        )}
      </div>
      <p className="mt-2 text-xs text-faint">Use <span className="text-muted">SNMPv3</span> for security (auth + encryption); v2c only has plaintext community strings.</p>
    </div>
  );
}
