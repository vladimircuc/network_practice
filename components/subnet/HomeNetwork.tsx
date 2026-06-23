"use client";

import { useState } from "react";

const NET = "#3b82f6"; // network part (the "street")
const HOST = "#2fcf6b"; // host part (the "house")

const DEVICES = [
  { icon: "🌐", name: "Router (gateway)", host: 1 },
  { icon: "💻", name: "Your laptop", host: 42 },
  { icon: "📱", name: "Your phone", host: 43 },
  { icon: "📺", name: "Smart TV", host: 50 },
  { icon: "🖨️", name: "Printer", host: 60 },
];

const PREFIX = "192.168.1.";

export default function HomeNetwork() {
  const [sel, setSel] = useState(1); // laptop by default

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏠</span>
          <span className="text-sm font-semibold text-text">Home Wi-Fi</span>
        </div>
        <span className="font-mono text-xs text-faint">one network: 192.168.1.x</span>
      </div>

      <div className="space-y-1.5">
        {DEVICES.map((d, i) => {
          const active = i === sel;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSel(i)}
              className="flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors"
              style={{
                borderColor: active ? `color-mix(in oklab, ${HOST} 45%, transparent)` : "var(--color-line-soft)",
                backgroundColor: active ? `color-mix(in oklab, ${HOST} 8%, transparent)` : "var(--color-surface)",
              }}
            >
              <span className="text-lg">{d.icon}</span>
              <span className="flex-1 text-sm text-muted">{d.name}</span>
              <span className="font-mono text-sm">
                <span style={{ color: NET }}>{PREFIX}</span>
                <span className="font-bold" style={{ color: HOST }}>{d.host}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* breakdown of the selected device */}
      <div className="mt-4 rounded-lg border border-line-soft bg-surface-2/60 p-4 text-sm leading-relaxed text-muted">
        <span className="font-mono text-base">
          <span style={{ color: NET }}>{PREFIX.slice(0, -1)}</span>
          <span className="text-faint">.</span>
          <span className="font-bold" style={{ color: HOST }}>{DEVICES[sel].host}</span>
        </span>
        <div className="mt-2 grid gap-1.5">
          <div>
            <span className="font-semibold" style={{ color: NET }}>192.168.1</span> = the{" "}
            <span className="text-text">network</span> — like a street name. Every device here shares it.
          </div>
          <div>
            <span className="font-semibold" style={{ color: HOST }}>{DEVICES[sel].host}</span> = the{" "}
            <span className="text-text">host</span> — like a house number. Just this one device.
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-faint">
        Same first three numbers → same network → these devices talk to each other directly. A device
        on a different network (say <span className="font-mono text-muted">192.168.<b>2</b>.10</span>)
        is on another &ldquo;street,&rdquo; so traffic has to go through the router to reach it.
      </p>
    </div>
  );
}
