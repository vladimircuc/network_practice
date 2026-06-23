import type { ReactNode } from "react";
import ObjectiveTag from "./ObjectiveTag";

/** Outer width container for page content. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}

/** A teaching section — a scroll target with a title and body. */
export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      {children}
    </section>
  );
}

/** Section heading with optional objective tag + kicker. */
export function SectionTitle({
  children,
  objective,
  accent,
  kicker,
}: {
  children: ReactNode;
  objective?: string;
  accent?: string;
  kicker?: string;
}) {
  return (
    <div className="mb-4 flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {objective && <ObjectiveTag id={objective} accent={accent} />}
        {kicker && (
          <span className="text-xs font-medium uppercase tracking-wider text-faint">
            {kicker}
          </span>
        )}
      </div>
      <h2 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">
        {children}
      </h2>
    </div>
  );
}

type Tone = "info" | "tip" | "warn" | "exam";
const TONE: Record<Tone, { c: string; label: string }> = {
  info: { c: "var(--color-accent)", label: "Note" },
  tip: { c: "var(--color-good)", label: "Tip" },
  warn: { c: "var(--color-partial)", label: "Watch out" },
  exam: { c: "var(--color-d4)", label: "On the exam" },
};

/** Tinted callout box for notes, tips, warnings, and exam traps. */
export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}) {
  const t = TONE[tone];
  return (
    <div
      className="my-4 rounded-lg border px-4 py-3 text-sm leading-relaxed text-muted"
      style={{
        borderColor: `color-mix(in oklab, ${t.c} 35%, transparent)`,
        backgroundColor: `color-mix(in oklab, ${t.c} 9%, transparent)`,
      }}
    >
      <div
        className="mb-1 text-xs font-semibold uppercase tracking-wider"
        style={{ color: t.c }}
      >
        {title ?? t.label}
      </div>
      {children}
    </div>
  );
}

/** Container for an interactive demo, with an "Interactive" badge + caption. */
export function DemoFrame({
  title,
  caption,
  children,
  accent = "var(--color-accent)",
}: {
  title?: string;
  caption?: ReactNode;
  children: ReactNode;
  accent?: string;
}) {
  return (
    <figure className="my-5 overflow-hidden rounded-xl border border-line bg-surface/60">
      <figcaption className="flex items-center justify-between gap-3 border-b border-line-soft bg-surface-2/60 px-4 py-2">
        <span className="text-sm font-medium text-text">{title ?? "Try it"}</span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{
            color: accent,
            backgroundColor: `color-mix(in oklab, ${accent} 14%, transparent)`,
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
            style={{ backgroundColor: accent }}
          />
          Interactive
        </span>
      </figcaption>
      <div className="p-4">{children}</div>
      {caption && (
        <div className="border-t border-line-soft px-4 py-2 text-xs text-faint">
          {caption}
        </div>
      )}
    </figure>
  );
}

/** Inline highlighted key term. */
export function Term({ children }: { children: ReactNode }) {
  return (
    <span className="font-medium text-text underline decoration-dotted decoration-faint underline-offset-4">
      {children}
    </span>
  );
}

/** Monospace inline code, handy for IPs / commands. */
export function Mono({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-[0.85em] text-accent-2">
      {children}
    </code>
  );
}
