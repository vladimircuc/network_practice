"use client";

import { useMemo, useState } from "react";
import { PORTS } from "@/lib/domain1";

const D1 = "#3b82f6";

const PROTO_COLOR: Record<string, string> = {
  TCP: "#3b82f6",
  UDP: "#a855f7",
  "TCP/UDP": "#14b8a6",
};

type Q = { idx: number; options: string[] };

// deterministic first question (HTTP → 80) to avoid hydration mismatch
const FIRST_Q: Q = { idx: 7, options: ["443", "80", "22", "53"] };

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeQ(): Q {
  const idx = Math.floor(Math.random() * PORTS.length);
  const correct = PORTS[idx].port;
  const distractors: string[] = [];
  const pool = shuffle(PORTS.map((p) => p.port).filter((p) => p !== correct));
  for (const p of pool) {
    if (distractors.length >= 3) break;
    if (!distractors.includes(p)) distractors.push(p);
  }
  return { idx, options: shuffle([correct, ...distractors]) };
}

export default function PortsReference() {
  const [mode, setMode] = useState<"ref" | "game">("ref");
  const [query, setQuery] = useState("");
  const [q, setQ] = useState<Q>(FIRST_Q);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const filtered = useMemo(() => {
    const s = query.trim().toLowerCase();
    if (!s) return PORTS;
    return PORTS.filter(
      (p) => p.port.includes(s) || p.name.toLowerCase().includes(s) || p.use.toLowerCase().includes(s)
    );
  }, [query]);

  const target = PORTS[q.idx];
  const answer = target.port;

  function pick(opt: string) {
    if (picked) return;
    setPicked(opt);
    setScore((s) => ({ right: s.right + (opt === answer ? 1 : 0), total: s.total + 1 }));
  }
  function next() {
    setQ(makeQ());
    setPicked(null);
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-1 rounded-lg border border-line bg-surface-2 p-1 text-xs font-medium">
        {([["ref", "Reference"], ["game", "Match game"]] as const).map(([m, label]) => (
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

      {mode === "ref" ? (
        <>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search port, protocol, or purpose…"
            className="mb-3 h-9 w-full rounded-md border border-line bg-surface-2 px-3 text-sm text-text focus:border-accent"
          />
          <div className="max-h-72 overflow-y-auto rounded-lg border border-line-soft">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-surface-2 text-faint">
                <tr>
                  <th className="px-3 py-2 font-medium">Port</th>
                  <th className="px-3 py-2 font-medium">Protocol</th>
                  <th className="px-3 py-2 font-medium">T/U</th>
                  <th className="px-3 py-2 font-medium">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={`${p.port}-${p.name}-${i}`} className="border-t border-line-soft">
                    <td className="px-3 py-1.5 font-mono font-bold" style={{ color: D1 }}>{p.port}</td>
                    <td className="px-3 py-1.5 font-medium text-text">{p.name}</td>
                    <td className="px-3 py-1.5">
                      <span className="font-mono text-[10px] font-semibold" style={{ color: PROTO_COLOR[p.proto] }}>{p.proto}</span>
                    </td>
                    <td className="px-3 py-1.5 text-muted">{p.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="mb-1 text-xs text-faint">Score <span className="font-bold text-good">{score.right}</span> / {score.total}</div>
          <div className="mb-1 text-sm text-muted">Which port does this use?</div>
          <div className="mb-4 text-2xl font-bold text-text">{target.name}</div>
          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt) => {
              const isAnswer = opt === answer;
              const isPicked = opt === picked;
              let bg = "var(--color-surface-2)", border = "var(--color-line)";
              if (picked) {
                if (isAnswer) { bg = "color-mix(in oklab, var(--color-good) 18%, transparent)"; border = "var(--color-good)"; }
                else if (isPicked) { bg = "color-mix(in oklab, var(--color-bad) 18%, transparent)"; border = "var(--color-bad)"; }
              }
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => pick(opt)}
                  disabled={!!picked}
                  className="rounded-lg border px-3 py-2.5 font-mono text-base font-bold transition-colors"
                  style={{ backgroundColor: bg, borderColor: border, color: "var(--color-text)" }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {picked && (
            <div className="mt-3">
              <span className="text-sm text-muted">{target.name} uses <span className="font-mono font-bold text-text">{answer}</span> — {target.use}.</span>
              <div>
                <button type="button" onClick={next} className="mt-2 rounded-lg px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: D1 }}>
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
