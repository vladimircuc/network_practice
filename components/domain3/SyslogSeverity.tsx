"use client";

import { useState } from "react";
import { SYSLOG, SYSLOG_MNEMONIC } from "@/lib/domain3";

function colorFor(level: number) {
  if (level <= 2) return "var(--color-bad)";
  if (level <= 4) return "var(--color-partial)";
  return "var(--color-faint)";
}

export default function SyslogSeverity() {
  const [sel, setSel] = useState(3);

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Syslog rates every message <span className="text-text">0 (worst) to 7 (noise)</span> — counter-intuitively, a{" "}
        <span className="text-text">lower</span> number is more urgent. Click one:
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          {SYSLOG.map((s) => {
            const active = s.level === sel;
            const c = colorFor(s.level);
            return (
              <button key={s.level} type="button" onClick={() => setSel(s.level)}
                className="flex w-full items-center gap-2 rounded-md border px-3 py-1.5 text-left transition-colors"
                style={{ borderColor: active ? c : "var(--color-line-soft)", backgroundColor: active ? `color-mix(in oklab, ${c} 12%, transparent)` : "var(--color-surface)" }}>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded font-mono text-sm font-bold" style={{ color: c, backgroundColor: `color-mix(in oklab, ${c} 16%, transparent)` }}>{s.level}</span>
                <span className="text-sm font-medium text-text">{s.name}</span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-col justify-center rounded-lg border border-line-soft bg-surface-2/60 p-4">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold" style={{ color: colorFor(sel) }}>{sel}</span>
            <span className="font-semibold text-text">{SYSLOG[sel].name}</span>
          </div>
          <p className="mt-1 text-sm text-muted">{SYSLOG[sel].meaning}</p>
          <div className="mt-2 rounded-md border border-line-soft bg-surface px-3 py-2 text-xs text-muted">
            <span className="text-faint">e.g. </span>{SYSLOG[sel].example}
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-line-soft bg-surface-2/60 px-3 py-2 text-xs leading-relaxed text-muted">
        <span className="font-semibold text-text">Deciding fast:</span> <span className="text-text">0–2</span> = already down or about to be (panic, no failover, dead hardware). <span className="text-text">3</span> = something <em>broke</em> (a link/process failed). <span className="text-text">4</span> = <em>heading toward</em> broken (high CPU, disk filling). <span className="text-text">5</span> = a normal state change worth logging (link up, config saved). <span className="text-text">6–7</span> = routine info &amp; debug noise.
      </div>
      <p className="mt-3 text-center text-xs text-faint">Mnemonic (0→7): <span className="text-muted">{SYSLOG_MNEMONIC}</span></p>
    </div>
  );
}
