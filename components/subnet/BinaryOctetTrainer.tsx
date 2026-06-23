"use client";

import { useState } from "react";

const PLACES = [128, 64, 32, 16, 8, 4, 2, 1];
const NET = "#3b82f6";
const GOOD = "var(--color-good)";

export default function BinaryOctetTrainer() {
  const [bits, setBits] = useState<number[]>([1, 0, 1, 0, 1, 0, 0, 0]); // 168
  const [mode, setMode] = useState<"explore" | "practice">("explore");
  const [target, setTarget] = useState(173);
  const [streak, setStreak] = useState(0);
  const [justGot, setJustGot] = useState(false);

  const value = bits.reduce((sum, b, i) => sum + (b ? PLACES[i] : 0), 0);
  const solved = mode === "practice" && value === target;

  function toggle(i: number) {
    const next = bits.slice();
    next[i] = next[i] ? 0 : 1;
    setBits(next);
    if (mode === "practice") {
      const v = next.reduce((s, b, j) => s + (b ? PLACES[j] : 0), 0);
      if (v === target) {
        setStreak((s) => s + 1);
        setJustGot(true);
      }
    }
  }

  function newTarget() {
    setTarget(Math.floor(Math.random() * 256));
    setBits([0, 0, 0, 0, 0, 0, 0, 0]);
    setJustGot(false);
  }

  const activeAddends = bits
    .map((b, i) => (b ? PLACES[i] : null))
    .filter((x): x is number => x !== null);

  return (
    <div>
      {/* mode toggle */}
      <div className="mb-4 flex items-center gap-1 rounded-lg border border-line bg-surface-2 p-1 text-xs font-medium">
        {(["explore", "practice"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setJustGot(false);
              if (m === "practice") setStreak(0);
            }}
            className="flex-1 rounded-md px-3 py-1.5 capitalize transition-colors"
            style={{
              backgroundColor: mode === m ? "var(--color-surface-3)" : "transparent",
              color: mode === m ? "var(--color-text)" : "var(--color-faint)",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === "practice" && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line-soft bg-surface/60 px-4 py-3">
          <div>
            <span className="text-xs text-faint">Build this number in binary:</span>
            <div className="font-mono text-3xl font-bold" style={{ color: NET }}>
              {target}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-faint">
              streak <span className="font-bold text-good">{streak}</span>
            </span>
            <button
              type="button"
              onClick={newTarget}
              className="rounded-md border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted hover:text-text"
            >
              New number
            </button>
          </div>
        </div>
      )}

      {/* place-value headers + bit toggles */}
      <div className="flex justify-center gap-1 sm:gap-2">
        {PLACES.map((p, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="mb-1 font-mono text-[10px] text-faint sm:text-xs">{p}</span>
            <button
              type="button"
              onClick={() => toggle(i)}
              className="grid h-11 w-9 place-items-center rounded-md border font-mono text-lg font-bold transition-all sm:h-12 sm:w-11"
              style={{
                color: bits[i] ? "#0a0e16" : "var(--color-faint)",
                borderColor: bits[i]
                  ? NET
                  : "var(--color-line)",
                backgroundColor: bits[i]
                  ? NET
                  : "var(--color-surface-2)",
              }}
            >
              {bits[i]}
            </button>
          </div>
        ))}
      </div>

      {/* readout */}
      <div className="mt-5 text-center">
        <div className="font-mono text-sm text-muted">
          {activeAddends.length ? activeAddends.join(" + ") : "0"} ={" "}
          <span
            className="text-2xl font-bold"
            style={{ color: solved ? GOOD : "var(--color-text)" }}
          >
            {value}
          </span>
        </div>
        {mode === "practice" && solved && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold text-good" style={{ backgroundColor: "color-mix(in oklab, var(--color-good) 14%, transparent)" }}>
            ✓ Correct! That&apos;s {target} in binary.
            <button type="button" onClick={newTarget} className="underline underline-offset-2">
              next
            </button>
          </div>
        )}
        {mode === "explore" && (
          <div className="mt-1 font-mono text-xs text-faint">
            binary {bits.join("")}
          </div>
        )}
      </div>
    </div>
  );
}
