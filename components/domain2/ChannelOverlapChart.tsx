"use client";

import { useState } from "react";
import { channelsOverlap, CHANNELS_24 } from "@/lib/domain2";

const COLORS = ["#3b82f6", "#f5a623", "#2fcf6b"];

export default function ChannelOverlapChart() {
  const [chans, setChans] = useState<number[]>([1, 3, 6]); // AP1, AP2, AP3

  // pairwise overlap
  const overlaps: boolean[] = chans.map((c, i) =>
    chans.some((d, j) => i !== j && channelsOverlap(c, d))
  );
  const anyOverlap = overlaps.some(Boolean);

  // x position for a channel center (channels 1..11 -> 6%..94%)
  const xOf = (ch: number) => 6 + ((ch - 1) / 10) * 88;

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        On 2.4 GHz each channel is ~22 MHz wide, so neighbors bleed into each other. Set three APs and watch
        for overlap — only <span className="font-semibold text-text">1, 6, and 11</span> stay clear of one another.
      </p>

      {/* spectrum */}
      <div className="relative h-28 rounded-lg border border-line-soft bg-surface/40">
        {/* channel ticks */}
        {CHANNELS_24.map((ch) => (
          <div key={ch} className="absolute bottom-1 -translate-x-1/2 text-[10px] text-faint" style={{ left: `${xOf(ch)}%` }}>{ch}</div>
        ))}
        {/* AP bands */}
        {chans.map((ch, i) => (
          <div key={i}
            className="absolute top-2 h-16 -translate-x-1/2 rounded-md"
            style={{
              left: `${xOf(ch)}%`,
              width: "20%",
              backgroundColor: `color-mix(in oklab, ${COLORS[i]} ${overlaps[i] ? 38 : 26}%, transparent)`,
              border: `1.5px solid ${overlaps[i] ? "var(--color-bad)" : COLORS[i]}`,
            }}
          >
            <div className="mt-1 text-center text-[10px] font-bold" style={{ color: COLORS[i] }}>AP{i + 1}</div>
          </div>
        ))}
      </div>

      {/* controls */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {chans.map((ch, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: COLORS[i] }}>AP{i + 1}</span>
            <select value={ch} aria-label={`AP${i + 1} channel`} onChange={(e) => setChans((c) => c.map((v, j) => j === i ? Number(e.target.value) : v))}
              className="h-8 flex-1 rounded-md border border-line bg-surface-2 px-2 font-mono text-xs text-text">
              {CHANNELS_24.map((c) => <option key={c} value={c}>Ch {c}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-lg border px-4 py-2 text-sm"
        style={{ borderColor: `color-mix(in oklab, ${anyOverlap ? "var(--color-bad)" : "var(--color-good)"} 40%, transparent)`, backgroundColor: `color-mix(in oklab, ${anyOverlap ? "var(--color-bad)" : "var(--color-good)"} 8%, transparent)`, color: "var(--color-muted)" }}>
        {anyOverlap
          ? "⚠ Overlap detected — these APs will interfere. Try 1 / 6 / 11."
          : "✓ No overlap — these channels coexist cleanly."}
      </div>
    </div>
  );
}
