"use client";

import { useState } from "react";

const D3 = "var(--color-d3)";

export default function AccessMethods() {
  const [band, setBand] = useState<"in" | "out">("in");
  const [tunnel, setTunnel] = useState<"full" | "split">("full");

  return (
    <div className="space-y-6">
      {/* in-band vs out-of-band */}
      <div>
        <div className="mb-3 flex items-center gap-1 rounded-lg border border-line bg-surface-2 p-1 text-xs font-medium">
          {([["in", "In-band"], ["out", "Out-of-band"]] as const).map(([m, label]) => (
            <button key={m} type="button" onClick={() => setBand(m)} className="flex-1 rounded-md px-3 py-1.5 transition-colors"
              style={{ backgroundColor: band === m ? "var(--color-surface-3)" : "transparent", color: band === m ? "var(--color-text)" : "var(--color-faint)" }}>
              {label} management
            </button>
          ))}
        </div>
        <div className="rounded-lg border border-line-soft bg-surface-2/60 p-3 text-sm leading-relaxed text-muted">
          {band === "in" ? (
            <><span className="font-semibold text-text">In-band:</span> you manage the device <span className="text-text">over the production network</span> — SSH to its normal IP. Simple and cheap, but if that network (or the device&apos;s data plane) goes down, you&apos;re locked out exactly when you need in.</>
          ) : (
            <><span className="font-semibold text-text">Out-of-band:</span> a <span className="text-text">separate path</span> — a console port, dedicated management interface, or cellular modem. It still works when the production network is down, so you can fix outages remotely.</>
          )}
        </div>
      </div>

      {/* full vs split tunnel */}
      <div>
        <div className="mb-3 flex items-center gap-1 rounded-lg border border-line bg-surface-2 p-1 text-xs font-medium">
          {([["full", "Full tunnel"], ["split", "Split tunnel"]] as const).map(([m, label]) => (
            <button key={m} type="button" onClick={() => setTunnel(m)} className="flex-1 rounded-md px-3 py-1.5 transition-colors"
              style={{ backgroundColor: tunnel === m ? "var(--color-surface-3)" : "transparent", color: tunnel === m ? "var(--color-text)" : "var(--color-faint)" }}>
              {label} VPN
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="grid h-12 w-20 place-items-center rounded-md border border-line bg-surface-2 text-center font-semibold text-text">🧑‍💻 Remote user</span>
          <div className="flex-1 text-center">
            <div className="font-mono" style={{ color: D3 }}>VPN ──→ 🏢 corp</div>
            <div className="font-mono text-faint">{tunnel === "full" ? "everything via VPN" : "+ direct ──→ 🌐 internet"}</div>
          </div>
        </div>
        <div className="mt-3 rounded-lg border border-line-soft bg-surface-2/60 p-3 text-sm leading-relaxed text-muted">
          {tunnel === "full" ? (
            <><span className="font-semibold text-text">Full tunnel:</span> <span className="text-text">all</span> traffic goes through the VPN — most secure and inspectable, but slower and it loads the VPN concentrator (even your video streaming detours through corp).</>
          ) : (
            <><span className="font-semibold text-text">Split tunnel:</span> only <span className="text-text">corporate</span> traffic uses the VPN; everything else goes straight to the internet — faster and lighter, but that direct traffic isn&apos;t protected/inspected.</>
          )}
        </div>
      </div>
    </div>
  );
}
