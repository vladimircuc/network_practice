"use client";

import { useState } from "react";
import { classify, octetsToInt, type Octets } from "@/lib/subnet";

type Choice = "public" | "private" | "apipa" | "loopback";
const CHOICES: { key: Choice; label: string; color: string }[] = [
  { key: "private", label: "Private", color: "#3b82f6" },
  { key: "public", label: "Public", color: "#2fcf6b" },
  { key: "apipa", label: "APIPA", color: "#f5a623" },
  { key: "loopback", label: "Loopback", color: "#a855f7" },
];

const EXPLAIN: Record<Choice, string> = {
  private: "RFC 1918: 10/8, 172.16–31, or 192.168/16 — not routable on the internet.",
  public: "Globally routable — outside the private, APIPA, and loopback ranges.",
  apipa: "169.254.0.0/16 — self-assigned when DHCP fails (link-local).",
  loopback: "127.0.0.0/8 — the host talking to itself (127.0.0.1).",
};

function rand(n: number) {
  return Math.floor(Math.random() * n);
}

function genFor(kind: Choice): Octets {
  switch (kind) {
    case "private": {
      const r = rand(3);
      if (r === 0) return [10, rand(256), rand(256), rand(254) + 1];
      if (r === 1) return [172, 16 + rand(16), rand(256), rand(254) + 1];
      return [192, 168, rand(256), rand(254) + 1];
    }
    case "apipa":
      return [169, 254, rand(256), rand(254) + 1];
    case "loopback":
      return [127, rand(256), rand(256), rand(254) + 1];
    case "public": {
      let o: Octets;
      do {
        o = [rand(223) + 1, rand(256), rand(256), rand(254) + 1];
      } while (classify(octetsToInt(o)) !== "public");
      return o;
    }
  }
}

function nextOctets(): Octets {
  const kinds: Choice[] = ["private", "public", "apipa", "loopback"];
  return genFor(kinds[rand(kinds.length)]);
}

export default function IpClassifier() {
  // deterministic first IP (avoids SSR/client hydration mismatch); randomizes on Next
  const [octets, setOctets] = useState<Octets>([10, 0, 0, 1]);
  const [picked, setPicked] = useState<Choice | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const answer = classify(octetsToInt(octets)) as Choice;

  function pick(c: Choice) {
    if (picked) return;
    setPicked(c);
    setScore((s) => ({ right: s.right + (c === answer ? 1 : 0), total: s.total + 1 }));
  }
  function next() {
    setOctets(nextOctets());
    setPicked(null);
  }

  return (
    <div className="text-center">
      <div className="mb-1 text-xs text-faint">
        Score <span className="font-bold text-good">{score.right}</span> / {score.total}
      </div>
      <div className="mb-5 font-mono text-3xl font-bold text-text">{octets.join(".")}</div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CHOICES.map((c) => {
          const isAnswer = c.key === answer;
          const isPicked = c.key === picked;
          let bg = "var(--color-surface-2)";
          let border = "var(--color-line)";
          if (picked) {
            if (isAnswer) { bg = `color-mix(in oklab, ${c.color} 22%, transparent)`; border = c.color; }
            else if (isPicked) { bg = "color-mix(in oklab, var(--color-bad) 18%, transparent)"; border = "var(--color-bad)"; }
          }
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => pick(c.key)}
              disabled={!!picked}
              className="rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors"
              style={{ backgroundColor: bg, borderColor: border, color: picked && (isAnswer || isPicked) ? "var(--color-text)" : "var(--color-muted)" }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="mt-4">
          <div className="text-sm font-semibold" style={{ color: picked === answer ? "var(--color-good)" : "var(--color-bad)" }}>
            {picked === answer ? "✓ Correct" : `✗ It's ${CHOICES.find((c) => c.key === answer)!.label}`}
          </div>
          <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-muted">{EXPLAIN[answer]}</p>
          <button type="button" onClick={next} className="mt-3 rounded-lg px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: "#3b82f6" }}>
            Next IP →
          </button>
        </div>
      )}
    </div>
  );
}
