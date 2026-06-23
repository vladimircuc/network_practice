"use client";

import { useMemo, useState } from "react";
import { octetsToInt, networkInt, intToIp, type Octets } from "@/lib/subnet";

const BASES: { ip: Octets; cidr: number }[] = [
  { ip: [10, 0, 0, 0], cidr: 8 },
  { ip: [172, 16, 0, 0], cidr: 16 },
  { ip: [192, 168, 0, 0], cidr: 16 },
  { ip: [10, 20, 0, 0], cidr: 16 },
];
const SUBNET_REQS = [5, 6, 9, 12, 18, 20];

function randInt(n: number) {
  return Math.floor(Math.random() * n);
}

function newScenario() {
  const base = BASES[randInt(BASES.length)];
  const need = SUBNET_REQS[randInt(SUBNET_REQS.length)];
  const k = 2 + randInt(3); // subnet #2..#4
  return { base, need, k };
}

// Module-level so it keeps a stable identity across re-renders (otherwise the
// input remounts on every keystroke and loses focus).
function Field({
  label, value, onChange, placeholder, checked, ok,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  checked: boolean;
  ok: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-muted">{label}</label>
      <div className="flex items-center gap-2">
        <input
          value={value}
          disabled={checked}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-9 w-full rounded-md border bg-surface-2 px-3 font-mono text-sm text-text focus:border-accent"
          style={{ borderColor: checked ? (ok ? "var(--color-good)" : "var(--color-bad)") : "var(--color-line)" }}
        />
        {checked && (
          <span className="text-xs" style={{ color: ok ? "var(--color-good)" : "var(--color-bad)" }}>
            {ok ? "✓" : "✗"}
          </span>
        )}
      </div>
    </div>
  );
}

export default function SubnetDesignPBQ() {
  // deterministic first scenario (avoids hydration mismatch); randomizes on New scenario
  const [sc, setSc] = useState({ base: BASES[1], need: 6, k: 3 });
  const [ans, setAns] = useState({ prefix: "", hosts: "", network: "" });
  const [checked, setChecked] = useState(false);

  const sol = useMemo(() => {
    const bits = Math.ceil(Math.log2(sc.need));
    const newCidr = sc.base.cidr + bits;
    const block = Math.pow(2, 32 - newCidr);
    const hosts = block - 2;
    const baseNet = networkInt(octetsToInt(sc.base.ip), sc.base.cidr);
    const kNet = baseNet + (sc.k - 1) * block;
    return {
      bits,
      newCidr,
      block,
      hosts,
      subnetsMade: Math.pow(2, bits),
      network: intToIp(kNet),
    };
  }, [sc]);

  const prefixOk = checked && ans.prefix.replace("/", "").trim() === String(sol.newCidr);
  const hostsOk = checked && ans.hosts.trim() === String(sol.hosts);
  const netOk = checked && ans.network.trim() === sol.network;

  function regenerate() {
    setSc(newScenario());
    setAns({ prefix: "", hosts: "", network: "" });
    setChecked(false);
  }

  return (
    <div>
      {/* scenario */}
      <div className="mb-4 rounded-lg border border-line-soft bg-surface/60 p-4 text-sm leading-relaxed text-muted">
        You&apos;ve been allocated{" "}
        <span className="font-mono font-bold text-text">{sc.base.ip.join(".")}/{sc.base.cidr}</span>.
        You need at least <span className="font-bold text-text">{sc.need} subnets</span> of equal size,
        using the <span className="text-text">smallest prefix that fits</span>. Then answer about
        subnet <span className="font-bold text-text">#{sc.k}</span> (counting the first subnet as #1).
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="(a) New prefix length" placeholder="/26" checked={checked} ok={prefixOk}
          value={ans.prefix} onChange={(v) => setAns((a) => ({ ...a, prefix: v }))} />
        <Field label="(b) Usable hosts / subnet" placeholder="62" checked={checked} ok={hostsOk}
          value={ans.hosts} onChange={(v) => setAns((a) => ({ ...a, hosts: v }))} />
        <Field label={`(c) Network of subnet #${sc.k}`} placeholder="10.0.64.0" checked={checked} ok={netOk}
          value={ans.network} onChange={(v) => setAns((a) => ({ ...a, network: v }))} />
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {!checked ? (
          <button type="button" onClick={() => setChecked(true)} className="rounded-lg px-6 py-2 text-sm font-semibold text-white" style={{ backgroundColor: "#3b82f6" }}>
            Submit
          </button>
        ) : (
          <button type="button" onClick={regenerate} className="rounded-lg px-6 py-2 text-sm font-semibold text-white" style={{ backgroundColor: "var(--color-good)" }}>
            New scenario →
          </button>
        )}
      </div>

      {checked && (
        <div className="mt-4 rounded-lg border border-line-soft bg-surface-2/60 p-4 text-sm leading-relaxed text-muted">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">Worked solution</div>
          <ul className="list-disc space-y-1 pl-5">
            <li>{sc.need} subnets needs <span className="font-mono text-text">⌈log₂{sc.need}⌉ = {sol.bits}</span> borrowed bits → /{sc.base.cidr} + {sol.bits} = <span className="font-mono font-bold text-text">/{sol.newCidr}</span> (makes {sol.subnetsMade} subnets).</li>
            <li>Block size = 2<sup>{32 - sol.newCidr}</sup> = <span className="font-mono text-text">{sol.block.toLocaleString()}</span> addresses → <span className="font-mono font-bold text-text">{sol.hosts.toLocaleString()}</span> usable hosts (− network &amp; broadcast).</li>
            <li>Subnet #{sc.k} starts at base + ({sc.k} − 1) × {sol.block.toLocaleString()} = <span className="font-mono font-bold text-text">{sol.network}/{sol.newCidr}</span>.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
