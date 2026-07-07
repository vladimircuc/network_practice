"use client";

import { useState } from "react";
import { DORA } from "@/lib/domain3";

const D3 = "var(--color-d3)";

export default function DoraAnimation() {
  const [step, setStep] = useState(0); // how many of the 4 steps are revealed

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="grid h-14 w-24 place-items-center rounded-lg border border-line bg-surface-2 text-sm font-semibold text-text">💻 Client</div>
        <div className="flex flex-1 flex-col items-center text-[11px] text-faint">
          <span>DHCP exchange</span>
          <span className="font-mono">D · O · R · A</span>
        </div>
        <div className="grid h-14 w-24 place-items-center rounded-lg border border-line bg-surface-2 text-sm font-semibold text-text">🖥️ Server</div>
      </div>

      <ol className="space-y-2">
        {DORA.map((s, i) => {
          const shown = i < step;
          return (
            <li key={s.letter} className="rounded-lg border px-3 py-2 transition-all"
              style={{
                borderColor: shown ? `color-mix(in oklab, ${D3} 35%, var(--color-line))` : "var(--color-line-soft)",
                backgroundColor: shown ? `color-mix(in oklab, ${D3} 7%, transparent)` : "var(--color-surface)",
                opacity: shown ? 1 : 0.4,
              }}>
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold" style={{ color: D3, backgroundColor: `color-mix(in oklab, ${D3} 16%, transparent)` }}>{s.letter}</span>
                <span className="text-sm font-semibold text-text">{s.name}</span>
                <span className="ml-auto font-mono text-[11px] text-faint">{s.from}</span>
              </div>
              {shown && <p className="mt-1 pl-8 text-xs leading-relaxed text-muted">{s.desc}</p>}
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex justify-center gap-2">
        {step < DORA.length ? (
          <button type="button" onClick={() => setStep((s) => s + 1)} className="rounded-lg px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: D3 }}>
            {step === 0 ? "Start the exchange" : "Next step →"}
          </button>
        ) : (
          <button type="button" onClick={() => setStep(0)} className="rounded-lg border border-line bg-surface-2 px-5 py-2 text-sm font-semibold text-text">Replay</button>
        )}
      </div>
      {step >= DORA.length && <p className="mt-2 text-center text-xs text-faint">The client now holds the lease; before it expires it renews (just R + A) directly with the server.</p>}
    </div>
  );
}
