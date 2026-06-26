"use client";

import { useState } from "react";

const D3 = "var(--color-d3)";

const NODES = ["💻 You", "🔁 Recursive resolver", "🌐 Root (.)", "🏷️ TLD (.com)", "📒 Authoritative (acme.com)"];

const STEPS = [
  { from: "You", to: "Recursive resolver", text: <>&ldquo;What&apos;s the IP of <span className="font-mono text-text">web.acme.com</span>?&rdquo; Your device asks its configured resolver (often your ISP or 8.8.8.8).</> },
  { from: "Resolver", to: "Root (.)", text: <>&ldquo;Who handles <span className="font-mono text-text">.com</span>?&rdquo; → Root replies: &ldquo;ask the .com TLD servers.&rdquo;</> },
  { from: "Resolver", to: "TLD (.com)", text: <>&ldquo;Who handles <span className="font-mono text-text">acme.com</span>?&rdquo; → TLD replies: &ldquo;ask acme.com&apos;s name servers.&rdquo;</> },
  { from: "Resolver", to: "Authoritative", text: <>&ldquo;What&apos;s <span className="font-mono text-text">web.acme.com</span>?&rdquo; → The authoritative server answers: <span className="font-mono" style={{ color: D3 }}>192.0.2.10</span>.</> },
  { from: "Resolver", to: "You", text: <>&ldquo;It&apos;s <span className="font-mono" style={{ color: D3 }}>192.0.2.10</span>&rdquo; — and the resolver caches it for the record&apos;s TTL so the next lookup is instant.</> },
];

export default function DnsResolution() {
  const [step, setStep] = useState(0);

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-center gap-1.5">
        {NODES.map((n, i) => {
          const active = step > 0 && (i <= 1 || i + 1 === step + 1 || (step >= 4 && i <= 1));
          return (
            <span key={n} className="rounded-md border px-2 py-1 text-[11px] transition-colors"
              style={{ borderColor: active ? D3 : "var(--color-line)", color: active ? "var(--color-text)" : "var(--color-faint)", backgroundColor: active ? `color-mix(in oklab, ${D3} 10%, transparent)` : "transparent" }}>
              {n}
            </span>
          );
        })}
      </div>

      <ol className="space-y-2">
        {STEPS.map((s, i) => {
          const shown = i < step;
          return (
            <li key={i} className="rounded-lg border px-3 py-2 transition-all"
              style={{ borderColor: shown ? `color-mix(in oklab, ${D3} 35%, var(--color-line))` : "var(--color-line-soft)", backgroundColor: shown ? `color-mix(in oklab, ${D3} 7%, transparent)` : "var(--color-surface)", opacity: shown ? 1 : 0.4 }}>
              <div className="flex items-center gap-2 text-xs">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full font-bold" style={{ color: D3, backgroundColor: `color-mix(in oklab, ${D3} 16%, transparent)` }}>{i + 1}</span>
                <span className="font-mono text-faint">{s.from} → {s.to}</span>
              </div>
              {shown && <p className="mt-1 pl-7 text-xs leading-relaxed text-muted">{s.text}</p>}
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex justify-center gap-2">
        {step < STEPS.length ? (
          <button type="button" onClick={() => setStep((s) => s + 1)} className="rounded-lg px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: D3 }}>
            {step === 0 ? "Look it up" : "Next step →"}
          </button>
        ) : (
          <button type="button" onClick={() => setStep(0)} className="rounded-lg border border-line bg-surface-2 px-5 py-2 text-sm font-semibold text-text">Replay</button>
        )}
      </div>
    </div>
  );
}
