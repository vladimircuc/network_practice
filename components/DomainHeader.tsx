import type { Domain } from "@/lib/domains";
import { Container } from "./ui";

/** Page header shown at the top of every domain tab. */
export default function DomainHeader({ domain }: { domain: Domain }) {
  return (
    <Container>
      <div className="flex items-start gap-4">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl font-mono text-xl font-bold"
          style={{
            color: domain.accent,
            backgroundColor: `color-mix(in oklab, ${domain.accent} 16%, transparent)`,
            boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${domain.accent} 40%, transparent)`,
          }}
        >
          {domain.num}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-faint">
            Domain {domain.num}
            <span className="text-line">·</span>
            <span style={{ color: domain.accent }}>{domain.weight}% of the exam</span>
          </div>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-text sm:text-3xl">
            {domain.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {domain.blurb}
          </p>
        </div>
      </div>

      {/* objective checklist */}
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {domain.objectives.map((o) => (
          <div
            key={o.id}
            className="flex items-center gap-2.5 rounded-lg border border-line-soft bg-surface/40 px-3 py-2"
          >
            <span
              className="grid h-6 w-9 shrink-0 place-items-center rounded font-mono text-[11px] font-bold tabular"
              style={{
                color: o.clean ? "var(--color-good)" : domain.accent,
                backgroundColor: `color-mix(in oklab, ${
                  o.clean ? "var(--color-good)" : domain.accent
                } 14%, transparent)`,
              }}
            >
              {o.id}
            </span>
            <span className="text-sm text-muted">{o.title}</span>
            {o.clean && (
              <span
                className="ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-good"
                style={{ backgroundColor: "color-mix(in oklab, var(--color-good) 14%, transparent)" }}
              >
                clean
              </span>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
}
