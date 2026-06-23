"use client";

import { useState } from "react";
import { octetBinary, type Octets } from "@/lib/subnet";

const NET = "#3b82f6";

const EXAMPLES: Octets[] = [
  [192, 168, 1, 10],
  [10, 0, 5, 23],
  [172, 16, 254, 1],
  [8, 8, 8, 8],
];

export default function IpAnatomy() {
  const [idx, setIdx] = useState(0);
  const octets = EXAMPLES[idx];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">
          One IPv4 address is just{" "}
          <span className="font-semibold text-text">32 bits</span> — split into{" "}
          <span className="font-semibold text-text">4 octets</span> of 8 bits each,
          written in decimal so humans can read it.
        </p>
        <button
          type="button"
          onClick={() => setIdx((i) => (i + 1) % EXAMPLES.length)}
          className="shrink-0 rounded-md border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted hover:text-text"
        >
          Another example →
        </button>
      </div>

      {/* the dotted-decimal address */}
      <div className="flex items-end justify-center gap-2 sm:gap-4">
        {octets.map((o, i) => (
          <div key={i} className="flex items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center">
              <div
                className="grid h-14 w-16 place-items-center rounded-lg border font-mono text-2xl font-bold sm:w-20"
                style={{
                  color: NET,
                  borderColor: `color-mix(in oklab, ${NET} 40%, transparent)`,
                  backgroundColor: `color-mix(in oklab, ${NET} 10%, transparent)`,
                }}
              >
                {o}
              </div>
              {/* the 8 bits */}
              <div className="mt-2 flex gap-0.5">
                {octetBinary(o)
                  .split("")
                  .map((bit, b) => (
                    <span
                      key={b}
                      className="grid h-5 w-4 place-items-center rounded-sm font-mono text-[11px] font-semibold"
                      style={{
                        color: bit === "1" ? "#0a0e16" : "var(--color-faint)",
                        backgroundColor:
                          bit === "1"
                            ? NET
                            : "color-mix(in oklab, var(--color-faint) 18%, transparent)",
                      }}
                    >
                      {bit}
                    </span>
                  ))}
              </div>
              <div className="mt-1 text-[10px] text-faint">8 bits</div>
            </div>
            {i < 3 && (
              <span className="pb-12 font-mono text-2xl font-bold text-faint">.</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 text-center text-xs text-faint">
        4 octets × 8 bits ={" "}
        <span className="font-semibold text-muted">32 bits total</span> · each octet
        holds 0–255 (that&apos;s 2⁸ = 256 possible values)
      </div>
    </div>
  );
}
