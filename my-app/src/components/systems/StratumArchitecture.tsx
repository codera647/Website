const layers = [
  ["01", "Data & integrations", "Documents · databases · APIs"],
  ["02", "Intelligence", "Retrieval · models · agents"],
  ["03", "Evaluation & control", "Quality · permissions · fallbacks"],
  ["04", "Production operations", "Deployment · monitoring · improvement"],
];

/** Lightweight architecture illustration. The labels describe a design, not live telemetry. */
export default function StratumArchitecture() {
  return (
    <figure className="card-hover group rounded-2xl border border-line bg-background p-8 text-ink transition-all hover:border-ink md:p-12">
      <figcaption className="flex items-center justify-between gap-4 border-b border-line pb-5 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        <span>System architecture</span>
        <span>Layer by layer</span>
      </figcaption>
      <svg
        aria-hidden="true"
        viewBox="0 0 440 205"
        className="mx-auto my-6 w-full max-w-sm"
        fill="none"
      >
        {[80, 55, 30, 5].map((offset, i) => (
          <g key={offset}>
            <path
              d={`M220 ${15 + offset} 395 ${75 + offset} 220 ${135 + offset} 45 ${75 + offset}Z`}
              fill={
                i === 3 ? "var(--color-surface)" : "var(--color-background)"
              }
              stroke="currentColor"
              strokeOpacity={0.25 + i * 0.15}
            />
            <path
              d={`M220 ${15 + offset}v120 M45 ${75 + offset}h350`}
              stroke="currentColor"
              strokeOpacity=".12"
            />
          </g>
        ))}
        <path
          d="M220 20v175"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="3 9"
        />
        <circle cx="220" cy="80" r="4" fill="currentColor" />
      </svg>
      <ol className="relative divide-y divide-line border-y border-line">
        {layers.map(([number, title, detail]) => (
          <li key={number} className="flex items-start gap-4 py-4">
            <span className="pt-0.5 font-heading text-xs font-bold text-muted">
              {number}
            </span>
            <div>
              <p className="font-heading text-sm font-semibold text-ink">
                {title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {detail}
              </p>
            </div>
            <span
              aria-hidden="true"
              className="ml-auto text-muted transition-transform group-hover:translate-x-1"
            >
              ↳
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-xs leading-relaxed text-muted">
        One connected foundation for your product and its workflows.
      </p>
    </figure>
  );
}
