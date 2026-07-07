"use client";

import { useState } from "react";

const D3 = "var(--color-d3)";

const SCENARIOS = [
  {
    scenario: "A switch's production network is down, and you need to get in and reconfigure it remotely.",
    correct: "Out-of-band management (console / dedicated mgmt port)",
    distractors: ["In-band SSH to its production IP", "RDP to the switch", "A full-tunnel VPN"],
    explain: "If the production path is down, in-band access fails. Out-of-band (console server, dedicated mgmt interface, or cellular) gives you a separate way in.",
  },
  {
    scenario: "Securely administer a Linux server's command line across the network.",
    correct: "SSH",
    distractors: ["Telnet", "RDP", "FTP"],
    explain: "SSH is encrypted; Telnet sends everything (including credentials) in cleartext.",
  },
  {
    scenario: "Give an outside vendor limited, audited access to a few internal servers.",
    correct: "A jump box / bastion host",
    distractors: ["Open RDP to the internet", "A full-tunnel VPN for all staff", "Telnet from the vendor's site"],
    explain: "A hardened jump box is the single, logged choke point everyone must pass through to reach the protected segment.",
  },
  {
    scenario: "Remote staff need internal apps, but you want their personal browsing to stay fast and off the VPN.",
    correct: "Split-tunnel VPN",
    distractors: ["Full-tunnel VPN", "Out-of-band management", "Telnet"],
    explain: "Split tunnel sends only corporate traffic through the VPN; everything else goes direct — faster and lighter on the concentrator.",
  },
  {
    scenario: "Permanently connect two branch offices to each other over the internet.",
    correct: "Site-to-site VPN",
    distractors: ["Client-to-site (remote access) VPN", "A jump box", "A console cable"],
    explain: "Site-to-site links whole networks together always-on; client-to-site is for individual remote users.",
  },
  {
    scenario: "Remotely manage a Windows server's full graphical desktop.",
    correct: "RDP",
    distractors: ["SSH", "Telnet", "SNMP"],
    explain: "RDP gives the graphical Windows desktop; SSH is CLI, SNMP is for monitoring.",
  },
];

function shuffle<T>(x: T[]): T[] { const r = x.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

type Q = { idx: number; options: string[] };
const FIRST: Q = { idx: 0, options: ["In-band SSH to its production IP", "Out-of-band management (console / dedicated mgmt port)", "A full-tunnel VPN", "RDP to the switch"] };
function gen(prev?: number): Q { let idx = Math.floor(Math.random() * SCENARIOS.length); while (SCENARIOS.length > 1 && idx === prev) idx = Math.floor(Math.random() * SCENARIOS.length); const s = SCENARIOS[idx]; return { idx, options: shuffle([s.correct, ...s.distractors]) }; }

export default function AccessMethodPBQ() {
  const [q, setQ] = useState<Q>(FIRST);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const s = SCENARIOS[q.idx];
  function pick(o: string) { if (picked) return; setPicked(o); setScore((x) => ({ right: x.right + (o === s.correct ? 1 : 0), total: x.total + 1 })); }
  function next() { setQ((cur) => gen(cur.idx)); setPicked(null); }

  return (
    <div>
      <div className="mb-1 text-right text-xs text-faint">Score <span className="font-bold text-good">{score.right}</span> / {score.total}</div>
      <div className="mb-4 rounded-lg border border-line-soft bg-surface/60 p-4 text-sm leading-relaxed text-text">{s.scenario}</div>
      <div className="mb-3 text-sm text-muted">Best access method?</div>
      <div className="space-y-1.5">
        {q.options.map((opt, i) => {
          const isAns = opt === s.correct, isPicked = opt === picked;
          let border = "var(--color-line)", bg = "transparent";
          if (picked) { if (isAns) { border = "var(--color-good)"; bg = "color-mix(in oklab, var(--color-good) 10%, transparent)"; } else if (isPicked) { border = "var(--color-bad)"; bg = "color-mix(in oklab, var(--color-bad) 10%, transparent)"; } }
          return (
            <button key={i} type="button" disabled={!!picked} onClick={() => pick(opt)} className="flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors"
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
            <span className="font-semibold" style={{ color: picked === s.correct ? "var(--color-good)" : "var(--color-bad)" }}>{picked === s.correct ? "✓ Correct. " : "✗ Not quite. "}</span>{s.explain}
          </div>
          <div className="mt-3 flex justify-end"><button type="button" onClick={next} className="rounded-lg px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: D3 }}>Next scenario →</button></div>
        </>
      )}
    </div>
  );
}
