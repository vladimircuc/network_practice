import type { Domain } from "@/lib/domains";
import { Container } from "./ui";

/** Placeholder body for domains whose full content hasn't been built yet. */
export default function ComingSoon({ domain }: { domain: Domain }) {
  return (
    <Container className="mt-10">
      <div
        className="rounded-2xl border bg-surface/50 p-8 text-center"
        style={{ borderColor: `color-mix(in oklab, ${domain.accent} 30%, var(--color-line))` }}
      >
        <div
          className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full text-xl"
          style={{
            color: domain.accent,
            backgroundColor: `color-mix(in oklab, ${domain.accent} 14%, transparent)`,
          }}
        >
          ✦
        </div>
        <h2 className="text-lg font-semibold text-text">
          We&apos;ll build this domain in an upcoming session
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          Each domain is researched against the current {`N10-009`} objectives first,
          then built out with visual demonstrations, open-recall questions, and
          performance-based practice — so the content is accurate and up to date.
        </p>
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 text-xs text-faint">
          Planned for this domain:
          <span className="rounded-full bg-surface-2 px-2 py-1 text-muted">Concept walkthroughs</span>
          <span className="rounded-full bg-surface-2 px-2 py-1 text-muted">Interactive demos</span>
          <span className="rounded-full bg-surface-2 px-2 py-1 text-muted">Open questions</span>
          <span className="rounded-full bg-surface-2 px-2 py-1 text-muted">PBQs + free resources</span>
        </div>
      </div>
    </Container>
  );
}
