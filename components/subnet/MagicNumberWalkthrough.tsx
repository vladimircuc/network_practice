"use client";

import { useMemo, useState } from "react";
import {
  octetsToInt, intToOctets, maskInt, maskIp, intToIp,
  networkInt, broadcastInt, firstUsableInt, lastUsableInt, type Octets,
} from "@/lib/subnet";

const NET = "#3b82f6";
const CIDRS = [9, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 22, 25, 26, 27, 28, 29];

function randOctets(): Octets {
  return [
    [10, 172, 192][Math.floor(Math.random() * 3)],
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
  ] as Octets;
}

export default function MagicNumberWalkthrough() {
  const [octets, setOctets] = useState<Octets>([192, 168, 10, 37]);
  const [cidr, setCidr] = useState(26);
  const [step, setStep] = useState(0);

  const calc = useMemo(() => {
    const maskOcts = intToOctets(maskInt(cidr));
    let io = maskOcts.findIndex((v) => v !== 0 && v !== 255);
    if (io === -1) io = Math.max(0, Math.min(3, Math.floor((cidr - 1) / 8)));
    const block = 256 - maskOcts[io];
    const ipVal = octets[io];
    const start = Math.floor(ipVal / block) * block;
    const end = start + block - 1;
    const multiples: number[] = [];
    for (let m = 0; m < 256; m += block) multiples.push(m);
    const ipInt = octetsToInt(octets);
    return {
      maskOcts, io, block, ipVal, start, end, multiples,
      network: intToIp(networkInt(ipInt, cidr)),
      broadcast: intToIp(broadcastInt(ipInt, cidr)),
      first: intToIp(firstUsableInt(ipInt, cidr)),
      last: intToIp(lastUsableInt(ipInt, cidr)),
    };
  }, [octets, cidr]);

  const steps = [
    <>Write the mask for <b className="text-text">/{cidr}</b> → <span className="font-mono" style={{ color: NET }}>{maskIp(cidr)}</span>. The <b className="text-text">interesting octet</b> is octet <b className="text-text">{calc.io + 1}</b> (the one that isn&apos;t 0 or 255 → <span className="font-mono">{calc.maskOcts[calc.io]}</span>).</>,
    <>Find the <b className="text-text">magic number</b> (block size): <span className="font-mono" style={{ color: NET }}>256 − {calc.maskOcts[calc.io]} = {calc.block}</span>.</>,
    <>Count by {calc.block} in octet {calc.io + 1}: <span className="font-mono">{calc.multiples.join(", ")}</span>. Your IP&apos;s octet {calc.io + 1} is <b className="text-text">{calc.ipVal}</b> → it falls in the <b style={{ color: NET }}>{calc.start}</b> block.</>,
    <>So the <b className="text-text">network address</b> is <span className="font-mono" style={{ color: NET }}>{calc.network}</span> (octet {calc.io + 1} = {calc.start}, everything after → 0).</>,
    <>The <b className="text-text">broadcast</b> is the next block − 1: octet {calc.io + 1} = <b>{calc.end}</b> → <span className="font-mono" style={{ color: "var(--color-good)" }}>{calc.broadcast}</span>. Usable hosts: <span className="font-mono">{calc.first} – {calc.last}</span>.</>,
  ];

  function newProblem() {
    setOctets(randOctets());
    setCidr(CIDRS[Math.floor(Math.random() * CIDRS.length)]);
    setStep(0);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-xl font-bold text-text">
          {octets.join(".")}<span className="text-faint">/{cidr}</span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setStep(0)} className="rounded-md border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted hover:text-text">Reset</button>
          <button type="button" onClick={newProblem} className="rounded-md border border-line bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted hover:text-text">New problem</button>
        </div>
      </div>

      <ol className="space-y-2">
        {steps.map((s, i) => {
          const shown = i < step;
          return (
            <li
              key={i}
              className="flex gap-3 rounded-lg border px-4 py-3 text-sm leading-relaxed transition-all"
              style={{
                borderColor: shown ? "color-mix(in oklab, #3b82f6 30%, var(--color-line))" : "var(--color-line-soft)",
                backgroundColor: shown ? "color-mix(in oklab, #3b82f6 7%, transparent)" : "var(--color-surface)",
                opacity: shown ? 1 : 0.4,
              }}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold" style={{ color: NET, backgroundColor: "color-mix(in oklab, #3b82f6 16%, transparent)" }}>{i + 1}</span>
              <div className="text-muted">{shown ? s : <span className="italic text-faint">hidden — reveal to continue</span>}</div>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex justify-center">
        {step < steps.length ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="rounded-lg px-5 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: NET }}
          >
            {step === 0 ? "Start walkthrough" : "Next step →"}
          </button>
        ) : (
          <button
            type="button"
            onClick={newProblem}
            className="rounded-lg border border-line bg-surface-2 px-5 py-2 text-sm font-semibold text-text"
          >
            Try another →
          </button>
        )}
      </div>
    </div>
  );
}
