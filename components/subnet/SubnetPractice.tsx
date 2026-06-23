"use client";

import { useMemo, useState } from "react";
import { describe, octetsToInt, type Octets } from "@/lib/subnet";

const CIDRS = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
const FIELDS = [
  { key: "network", label: "Network address" },
  { key: "broadcast", label: "Broadcast address" },
  { key: "firstUsable", label: "First usable host" },
  { key: "lastUsable", label: "Last usable host" },
  { key: "usableHosts", label: "Usable hosts (number)" },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

function randProblem(): { octets: Octets; cidr: number } {
  return {
    octets: [
      [10, 172, 192][Math.floor(Math.random() * 3)],
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    ] as Octets,
    cidr: CIDRS[Math.floor(Math.random() * CIDRS.length)],
  };
}

export default function SubnetPractice() {
  // deterministic first problem (avoids hydration mismatch); randomizes on New problem
  const [problem, setProblem] = useState<{ octets: Octets; cidr: number }>({
    octets: [192, 168, 10, 0],
    cidr: 26,
  });
  const [answers, setAnswers] = useState<Record<FieldKey, string>>({
    network: "", broadcast: "", firstUsable: "", lastUsable: "", usableHosts: "",
  });
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const [streak, setStreak] = useState(0);

  const sol = useMemo(() => {
    const d = describe(octetsToInt(problem.octets), problem.cidr);
    return {
      network: d.network,
      broadcast: d.broadcast,
      firstUsable: d.firstUsable,
      lastUsable: d.lastUsable,
      usableHosts: String(d.usableHosts),
    } as Record<FieldKey, string>;
  }, [problem]);

  function correct(k: FieldKey): boolean {
    return answers[k].trim() === sol[k];
  }

  function check() {
    if (checked) return;
    const allRight = FIELDS.every((f) => answers[f.key].trim() === sol[f.key]);
    setChecked(true);
    setScore((s) => ({ right: s.right + (allRight ? 1 : 0), total: s.total + 1 }));
    setStreak((s) => (allRight ? s + 1 : 0));
  }

  function next() {
    setProblem(randProblem());
    setAnswers({ network: "", broadcast: "", firstUsable: "", lastUsable: "", usableHosts: "" });
    setChecked(false);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs text-faint">Solve for this network</span>
          <div className="font-mono text-2xl font-bold text-text">
            {problem.octets.join(".")}<span className="text-faint">/{problem.cidr}</span>
          </div>
        </div>
        <div className="text-right text-xs text-faint">
          <div>solved <span className="font-bold text-good">{score.right}</span> / {score.total}</div>
          <div>streak <span className="font-bold text-good">{streak}</span></div>
        </div>
      </div>

      <div className="space-y-2">
        {FIELDS.map((f) => {
          const ok = checked && correct(f.key);
          const bad = checked && !correct(f.key);
          return (
            <div key={f.key} className="flex flex-wrap items-center gap-2">
              <label className="w-40 shrink-0 text-sm text-muted">{f.label}</label>
              <input
                value={answers[f.key]}
                onChange={(e) => setAnswers((a) => ({ ...a, [f.key]: e.target.value }))}
                disabled={checked}
                onKeyDown={(e) => { if (e.key === "Enter") check(); }}
                placeholder={f.key === "usableHosts" ? "e.g. 62" : "e.g. 192.168.10.0"}
                className="h-9 flex-1 rounded-md border bg-surface-2 px-3 font-mono text-sm text-text focus:border-accent"
                style={{ borderColor: ok ? "var(--color-good)" : bad ? "var(--color-bad)" : "var(--color-line)" }}
              />
              {checked && (
                <span className="w-36 shrink-0 text-xs">
                  {ok ? (
                    <span className="text-good">✓ correct</span>
                  ) : (
                    <span className="text-bad">✗ {sol[f.key]}</span>
                  )}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {!checked ? (
          <button type="button" onClick={check} className="rounded-lg px-6 py-2 text-sm font-semibold text-white" style={{ backgroundColor: "#3b82f6" }}>
            Check answers
          </button>
        ) : (
          <button type="button" onClick={next} className="rounded-lg px-6 py-2 text-sm font-semibold text-white" style={{ backgroundColor: "var(--color-good)" }}>
            New problem →
          </button>
        )}
      </div>
    </div>
  );
}
