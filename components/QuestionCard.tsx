"use client";

import { useEffect, useState, type ReactNode } from "react";
import ObjectiveTag from "./ObjectiveTag";

type Score = "bad" | "partial" | "good";

const SCORES: { key: Score; label: string; color: string }[] = [
  { key: "bad", label: "Blank / wrong", color: "var(--color-bad)" },
  { key: "partial", label: "Partial", color: "var(--color-partial)" },
  { key: "good", label: "Solid", color: "var(--color-good)" },
];

export type QuestionCardProps = {
  /** unique id, e.g. "d1-q3" — used to persist the live score */
  id: string;
  objective: string;
  accent?: string;
  number?: number;
  question: ReactNode;
  answer: ReactNode;
  /** what to listen for when judging partial vs. solid */
  listenFor?: ReactNode;
};

export default function QuestionCard({
  id,
  objective,
  accent,
  number,
  question,
  answer,
  listenFor,
}: QuestionCardProps) {
  const [score, setScore] = useState<Score | null>(null);
  const [revealed, setRevealed] = useState(false);
  const storageKey = `np:score:${id}`;

  useEffect(() => {
    try {
      const s = localStorage.getItem(storageKey) as Score | null;
      if (s === "bad" || s === "partial" || s === "good") setScore(s);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  function choose(s: Score) {
    const next = score === s ? null : s;
    setScore(next);
    try {
      if (next) localStorage.setItem(storageKey, next);
      else localStorage.removeItem(storageKey);
      window.dispatchEvent(
        new CustomEvent("np:score", { detail: { id, objective, score: next } })
      );
    } catch {
      /* ignore */
    }
  }

  const activeColor = score
    ? SCORES.find((s) => s.key === score)!.color
    : undefined;

  return (
    <div
      className="rounded-xl border bg-surface/70 p-4 transition-colors sm:p-5"
      style={{
        borderColor: activeColor
          ? `color-mix(in oklab, ${activeColor} 45%, var(--color-line))`
          : "var(--color-line)",
      }}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {typeof number === "number" && (
            <span className="font-mono text-xs text-faint tabular">
              Q{number}
            </span>
          )}
          <ObjectiveTag id={objective} accent={accent} />
        </div>

        {/* live red / amber / green scoring */}
        <div className="flex items-center gap-1.5" role="group" aria-label="Score this answer">
          {SCORES.map((s) => {
            const active = score === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => choose(s.key)}
                aria-pressed={active}
                aria-label={s.label}
                title={s.label}
                className="h-5 w-5 rounded-full border transition-transform hover:scale-110"
                style={{
                  borderColor: s.color,
                  backgroundColor: active ? s.color : "transparent",
                  boxShadow: active
                    ? `0 0 0 3px color-mix(in oklab, ${s.color} 25%, transparent)`
                    : "none",
                }}
              />
            );
          })}
        </div>
      </div>

      <p className="text-[15px] leading-relaxed text-text">{question}</p>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent/50 hover:text-text"
        >
          <span
            className="inline-block transition-transform"
            style={{ transform: revealed ? "rotate(90deg)" : "none" }}
            aria-hidden
          >
            ▸
          </span>
          {revealed ? "Hide model answer" : "Show model answer"}
        </button>
      </div>

      {revealed && (
        <div className="mt-3 space-y-3 rounded-lg border border-line-soft bg-surface-2/60 p-4 text-sm leading-relaxed text-muted">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">
              Model answer
            </div>
            <div className="text-text/90">{answer}</div>
          </div>
          {listenFor && (
            <div
              className="rounded-md border px-3 py-2"
              style={{
                borderColor: "color-mix(in oklab, var(--color-good) 30%, transparent)",
                backgroundColor: "color-mix(in oklab, var(--color-good) 8%, transparent)",
              }}
            >
              <div className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-good">
                Listen for
              </div>
              <div className="text-muted">{listenFor}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
