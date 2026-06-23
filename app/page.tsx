import Link from "next/link";
import { DOMAINS, EXAM } from "@/lib/domains";
import { Container } from "@/components/ui";
import ObjectiveTag from "@/components/ObjectiveTag";

// position on the 100–900 scaled-score track
const pct = (n: number) => ((n - EXAM.scaleMin) / (EXAM.scaleMax - EXAM.scaleMin)) * 100;

export default function Overview() {
  return (
    <Container className="space-y-14">
      {/* ---- Hero ---------------------------------------------------------- */}
      <section className="space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1 text-xs font-medium text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-good" />
          Built for Tim&apos;s N10-009 retake
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
          CompTIA Network+ <span className="text-accent">({EXAM.code})</span>
          <br className="hidden sm:block" /> interactive study site
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Five domains, covered thoroughly — with visual demonstrations you can
          play with, open-recall questions you answer in your own words, and
          performance-based practice. Work one domain per session; answer cold,
          reveal the model answer, and score live.
        </p>

        {/* score-gap visual */}
        <div className="rounded-xl border border-line bg-surface/60 p-5">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-faint">
                Last attempt · 03 May 2026
              </div>
              <div className="text-2xl font-bold text-text">
                615<span className="text-base font-normal text-faint"> / 720 to pass</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium uppercase tracking-wider text-faint">
                The gap
              </div>
              <div className="text-2xl font-bold text-partial">~105 pts</div>
            </div>
          </div>

          <div className="relative mt-8 h-3 rounded-full bg-surface-3">
            {/* score fill */}
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${pct(615)}%`,
                background:
                  "linear-gradient(90deg, color-mix(in oklab, var(--color-partial) 55%, transparent), var(--color-partial))",
              }}
            />
            {/* his score marker */}
            <Marker at={pct(615)} color="var(--color-partial)" label="615 — you" above />
            {/* pass line */}
            <Marker at={pct(720)} color="var(--color-good)" label="720 — pass" dashed />
            {/* scale ends */}
            <span className="absolute -bottom-6 left-0 text-[11px] text-faint">100</span>
            <span className="absolute -bottom-6 right-0 text-[11px] text-faint">900</span>
          </div>
          <p className="mt-10 text-sm leading-relaxed text-muted">
            <span className="font-semibold text-text">The read:</span>{" "}
            this isn&apos;t one deep hole — it&apos;s thin, cram-driven coverage spread across{" "}
            <span className="font-semibold text-text">23 of 25 objectives</span>. The
            foundation is intact (OSI model and documentation came back clean). The fix
            is <span className="font-semibold text-text">systematic recall and
            application</span>, not relearning from scratch.
          </p>
        </div>
      </section>

      {/* ---- How this works ----------------------------------------------- */}
      <section className="grid gap-3 sm:grid-cols-3">
        {[
          {
            n: "1",
            t: "Answer cold",
            d: "Say the answer out loud in your own words before revealing anything. Recall, not recognition.",
          },
          {
            n: "2",
            t: "Reveal & compare",
            d: "Open the model answer and the “listen for” note to see how close you were.",
          },
          {
            n: "3",
            t: "Score live",
            d: "Tap red / amber / green on each question so we can see exactly which objectives to drill.",
          },
        ].map((s) => (
          <div key={s.n} className="rounded-xl border border-line bg-surface/50 p-4">
            <div className="mb-2 grid h-7 w-7 place-items-center rounded-full bg-accent/15 text-sm font-bold text-accent">
              {s.n}
            </div>
            <div className="font-semibold text-text">{s.t}</div>
            <p className="mt-1 text-sm leading-relaxed text-muted">{s.d}</p>
          </div>
        ))}
      </section>

      {/* ---- Exam at a glance --------------------------------------------- */}
      <section>
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-text">
          The exam at a glance
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Stat k="Questions" v={`${EXAM.maxQuestions} max`} sub="MC + PBQs" />
          <Stat k="Time" v={`${EXAM.minutes} min`} sub="~1 min / question" />
          <Stat k="Score" v={`${EXAM.pass} / ${EXAM.scaleMax}`} sub={`scale ${EXAM.scaleMin}–${EXAM.scaleMax}`} />
          <Stat k="Domains" v="5" sub="weighted below" />
          <Stat k="Retake" v="No wait" sub="14 days before 3rd try" />
        </div>
      </section>

      {/* ---- Domain composition + cards ----------------------------------- */}
      <section className="space-y-6">
        <div>
          <h2 className="mb-1 text-xl font-semibold tracking-tight text-text">
            The five domains
          </h2>
          <p className="text-sm text-muted">
            Study order follows the exam, but{" "}
            <span className="font-semibold text-text">
              Troubleshooting (24%) + Concepts (23%) ≈ 47% of the exam
            </span>{" "}
            — that&apos;s where points come back fastest.
          </p>
        </div>

        {/* stacked composition bar */}
        <div className="overflow-hidden rounded-xl border border-line">
          <div className="flex h-10 w-full">
            {DOMAINS.map((d) => (
              <div
                key={d.slug}
                className="flex items-center justify-center text-[11px] font-bold text-white/90"
                style={{
                  width: `${d.weight}%`,
                  backgroundColor: `color-mix(in oklab, ${d.accent} 70%, black)`,
                }}
                title={`${d.name} — ${d.weight}%`}
              >
                {d.weight}%
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {DOMAINS.map((d) => (
            <Link
              key={d.slug}
              href={`/${d.slug}`}
              className="group flex flex-col rounded-xl border border-line bg-surface/50 p-5 transition-colors hover:bg-surface-2/70"
              style={{ borderColor: "var(--color-line)" }}
            >
              <div className="mb-3 flex items-center gap-3">
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg font-mono text-base font-bold"
                  style={{
                    color: d.accent,
                    backgroundColor: `color-mix(in oklab, ${d.accent} 16%, transparent)`,
                  }}
                >
                  {d.num}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate font-semibold text-text">{d.name}</h3>
                    <span
                      className="shrink-0 text-sm font-bold"
                      style={{ color: d.accent }}
                    >
                      {d.weight}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-surface-3">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(d.weight / 24) * 100}%`,
                        backgroundColor: d.accent,
                      }}
                    />
                  </div>
                </div>
              </div>

              <p className="mb-3 text-sm leading-relaxed text-muted">{d.blurb}</p>

              <div className="mt-auto flex flex-wrap items-center gap-1.5">
                {d.objectives.map((o) => (
                  <span key={o.id} className="flex items-center gap-1">
                    <ObjectiveTag id={o.id} accent={o.clean ? "var(--color-good)" : d.accent} />
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-line-soft pt-3 text-xs">
                <span className="text-faint">
                  {d.objectives.length} objectives
                  {d.objectives.some((o) => o.clean) && (
                    <span className="text-good">
                      {" "}· {d.objectives.filter((o) => o.clean).length} clean
                    </span>
                  )}
                </span>
                <span
                  className="inline-flex items-center gap-1 font-medium"
                  style={{ color: d.built ? d.accent : "var(--color-faint)" }}
                >
                  {d.built ? "Open domain" : "Coming soon"}
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---- Study plan ---------------------------------------------------- */}
      <section className="space-y-5">
        <div>
          <h2 className="mb-1 text-xl font-semibold tracking-tight text-text">
            The retake plan
          </h2>
          <p className="text-sm text-muted">
            A structured ~2–3 week window beats another cram. A slightly later date
            with a pass beats a fast retake with another fail (and another fee).
          </p>
        </div>
        <ol className="space-y-3">
          {[
            {
              t: "Per-domain deep sessions",
              d: "One domain per session, prioritized by weight. Watch the demos, answer the open questions cold, and drill any objective that scores red or amber.",
            },
            {
              t: "PBQ reps",
              d: "Practice subnetting, OSI/port matching, firewall rules, and diagram troubleshooting until they're automatic — these are the hands-on exam items.",
            },
            {
              t: "Full practice exams",
              d: "Timed full-length runs in the final stretch to rebuild stamina and confirm retention before booking the retake.",
            },
          ].map((p, i) => (
            <li
              key={p.t}
              className="flex gap-4 rounded-xl border border-line bg-surface/50 p-4"
            >
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/15 text-sm font-bold text-accent">
                {i + 1}
              </div>
              <div>
                <div className="font-semibold text-text">{p.t}</div>
                <p className="mt-0.5 text-sm leading-relaxed text-muted">{p.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </Container>
  );
}

function Stat({ k, v, sub }: { k: string; v: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface/50 p-4">
      <div className="text-xs font-medium uppercase tracking-wider text-faint">{k}</div>
      <div className="mt-1 text-lg font-bold text-text">{v}</div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </div>
  );
}

function Marker({
  at,
  color,
  label,
  dashed,
  above,
}: {
  at: number;
  color: string;
  label: string;
  dashed?: boolean;
  above?: boolean;
}) {
  return (
    <div className="absolute inset-y-0" style={{ left: `${at}%` }}>
      <div
        className="absolute -top-1.5 h-6 w-0.5 -translate-x-1/2"
        style={{
          backgroundColor: dashed ? "transparent" : color,
          borderLeft: dashed ? `2px dashed ${color}` : "none",
        }}
      />
      <span
        className={`absolute -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold ${
          above ? "bottom-6" : "top-6"
        }`}
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}
