const layers = [
  ["01", "Data & integrations", "Documents · databases · APIs"],
  ["02", "Intelligence", "Retrieval · models · agents"],
  ["03", "Evaluation & control", "Quality · permissions · fallbacks"],
  ["04", "Production operations", "Deployment · monitoring · improvement"],
];

/** Lightweight architecture illustration. The labels describe a design, not live telemetry. */
export default function StratumArchitecture() {
  return (
    <figure className="stratum-architecture relative overflow-hidden border border-background/20 bg-ink p-6 text-background sm:p-8">
      <figcaption className="flex items-center justify-between gap-4 border-b border-background/20 pb-5 font-heading text-xs uppercase tracking-[0.18em]">
        <span>System architecture</span>
        <span className="text-background/60">Layer by layer</span>
      </figcaption>
      <svg
        aria-hidden="true"
        viewBox="0 0 440 205"
        className="mx-auto my-6 w-full max-w-sm"
        fill="none"
      >
        {[80, 55, 30, 5].map((offset, i) => (
          <g
            key={offset}
            className="stratum-plane"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <path
              d={`M220 ${15 + offset} 395 ${75 + offset} 220 ${135 + offset} 45 ${75 + offset}Z`}
              fill={i === 3 ? "#4A4A50" : "#26262A"}
              stroke="#FAF9F6"
              strokeOpacity={0.25 + i * 0.15}
            />
            <path
              d={`M220 ${15 + offset}v120 M45 ${75 + offset}h350`}
              stroke="#FAF9F6"
              strokeOpacity=".12"
            />
          </g>
        ))}
        <path
          d="M220 20v175"
          stroke="#FAF9F6"
          strokeWidth="2"
          strokeDasharray="3 9"
          className="stratum-data-flow"
        />
        <circle cx="220" cy="80" r="4" fill="#FAF9F6" />
      </svg>
      <ol className="relative divide-y divide-background/15 border-y border-background/20">
        {layers.map(([number, title, detail]) => (
          <li key={number} className="flex items-start gap-4 py-4">
            <span className="pt-0.5 font-heading text-xs text-background/55">
              {number}
            </span>
            <div>
              <p className="font-heading text-base font-medium">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-background/65">
                {detail}
              </p>
            </div>
            <span aria-hidden="true" className="ml-auto text-background/40">
              ↳
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-xs leading-relaxed text-background/60">
        One connected foundation for your product and its workflows.
      </p>
    </figure>
  );
}
