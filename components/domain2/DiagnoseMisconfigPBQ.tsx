"use client";

import { useState } from "react";

const D2 = "var(--color-d2)";

const SCENARIOS = [
  {
    symptom: "A PC NIC is hard-set to 100/Full. The switch port is left on auto-negotiate. Users report painfully slow transfers, and the interface counters show late collisions and CRC errors.",
    correct: "Duplex mismatch — one side full, the other negotiated half",
    distractors: ["Exhausted DHCP scope", "Incorrect DNS server", "VLAN assignment error"],
    explain: "Auto-negotiation against a hard-set peer falls back to half-duplex → late collisions and CRC errors. Set both ends the same (ideally both auto).",
  },
  {
    symptom: "An 802.1Q trunk between two switches has native VLAN 1 on one end and native VLAN 99 on the other. STP logs a mismatch and untagged traffic ends up in the wrong VLAN.",
    correct: "Native VLAN mismatch on the trunk",
    distractors: ["Duplicate IP address", "PoE budget exceeded", "Wrong subnet mask"],
    explain: "Untagged (native) VLANs must match on both ends of a trunk, or untagged frames land in different VLANs on each side.",
  },
  {
    symptom: "A host has a correct IP and subnet mask and can reach devices on its own subnet, but cannot reach any other subnet or the internet.",
    correct: "Missing or incorrect default gateway",
    distractors: ["Faulty patch cable", "Spanning Tree is blocking the port", "MTU set too low"],
    explain: "Same-subnet traffic needs no router, so local works. Off-subnet traffic requires the gateway — so it is missing or wrong.",
  },
  {
    symptom: "An access port configured with PortFast and BPDU Guard drops to err-disabled the instant someone plugs an unmanaged switch into it.",
    correct: "BPDU Guard disabled the port after it received BPDUs",
    distractors: ["DHCP starvation attack", "Wrong VLAN on the port", "Bad SFP transceiver"],
    explain: "BPDU Guard err-disables a PortFast edge port the moment it sees BPDUs — exactly what a rogue switch sends — protecting your STP topology.",
  },
  {
    symptom: "iSCSI storage works for small reads but large transfers stall. The server uses 9000-byte jumbo frames; one switch in the path is still at the default 1500 MTU.",
    correct: "MTU / jumbo-frame mismatch along the path",
    distractors: ["Half-duplex NIC", "Expired DHCP lease", "Wrong default gateway"],
    explain: "Jumbo frames must be enabled end-to-end. A 1500-MTU hop can't carry the 9000-byte frames, so large transfers fail.",
  },
  {
    symptom: "Two servers were manually given the same static IP. Users see intermittent connectivity and the OS logs 'address conflict' warnings.",
    correct: "Duplicate IP address",
    distractors: ["VLAN hopping attack", "Switching loop with STP disabled", "Oversubscribed uplink"],
    explain: "Two devices sharing an IP causes ARP confusion and intermittent reachability. Assign unique addresses (or use DHCP reservations).",
  },
];

function shuffle<T>(a: T[]): T[] {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}

type Q = { idx: number; options: string[] };
// deterministic first question with the answer NOT at position A
const FIRST: Q = {
  idx: 0,
  options: ["Incorrect DNS server", "Exhausted DHCP scope", "Duplex mismatch — one side full, the other negotiated half", "VLAN assignment error"],
};
function gen(): Q {
  const idx = Math.floor(Math.random() * SCENARIOS.length);
  const s = SCENARIOS[idx];
  return { idx, options: shuffle([s.correct, ...s.distractors]) };
}

export default function DiagnoseMisconfigPBQ() {
  const [q, setQ] = useState<Q>(FIRST);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const s = SCENARIOS[q.idx];

  function pick(opt: string) {
    if (picked) return;
    setPicked(opt);
    setScore((x) => ({ right: x.right + (opt === s.correct ? 1 : 0), total: x.total + 1 }));
  }
  function next() { setQ(gen()); setPicked(null); }

  return (
    <div>
      <div className="mb-1 text-right text-xs text-faint">Score <span className="font-bold text-good">{score.right}</span> / {score.total}</div>
      <div className="mb-4 rounded-lg border border-line-soft bg-surface/60 p-4 text-sm leading-relaxed text-text">{s.symptom}</div>
      <div className="mb-3 text-sm text-muted">What is the most likely cause?</div>

      <div className="space-y-1.5">
        {q.options.map((opt, i) => {
          const isAns = opt === s.correct;
          const isPicked = opt === picked;
          let border = "var(--color-line)", bg = "transparent";
          if (picked) {
            if (isAns) { border = "var(--color-good)"; bg = "color-mix(in oklab, var(--color-good) 10%, transparent)"; }
            else if (isPicked) { border = "var(--color-bad)"; bg = "color-mix(in oklab, var(--color-bad) 10%, transparent)"; }
          }
          return (
            <button key={i} type="button" disabled={!!picked} onClick={() => pick(opt)}
              className="flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors"
              style={{ borderColor: border, backgroundColor: bg, color: "var(--color-muted)" }}>
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] text-faint">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          );
        })}
      </div>

      {picked && (
        <>
          <div className="mt-3 rounded-lg border border-line-soft bg-surface-2/60 p-3 text-xs leading-relaxed text-muted">
            <span className="font-semibold" style={{ color: picked === s.correct ? "var(--color-good)" : "var(--color-bad)" }}>
              {picked === s.correct ? "✓ Correct. " : "✗ Not quite. "}
            </span>{s.explain}
          </div>
          <div className="mt-3 flex justify-end">
            <button type="button" onClick={next} className="rounded-lg px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: D2 }}>Next scenario →</button>
          </div>
        </>
      )}
    </div>
  );
}
