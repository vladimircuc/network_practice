/** Small monospace pill showing a sub-objective id like "1.7". */
export default function ObjectiveTag({
  id,
  accent,
  title,
}: {
  id: string;
  accent?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className="inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-semibold leading-none tabular"
      style={{
        borderColor: accent
          ? `color-mix(in oklab, ${accent} 50%, transparent)`
          : "var(--color-line)",
        color: accent ?? "var(--color-muted)",
        backgroundColor: accent
          ? `color-mix(in oklab, ${accent} 14%, transparent)`
          : "transparent",
      }}
    >
      {id}
    </span>
  );
}
