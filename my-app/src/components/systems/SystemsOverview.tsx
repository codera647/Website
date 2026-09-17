import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";

const systems = [
  {
    name: "Momentum Systems",
    label: "Business growth infrastructure",
    purpose:
      "Customer acquisition, conversion and business-growth infrastructure.",
    detail:
      "Connect your website, customer portal, follow-up and search visibility into a single growth engine for your service business.",
    href: "/momentum-systems",
    cta: "Explore Momentum",
  },
  {
    name: "Stratum Systems",
    label: "Production AI engineering",
    purpose:
      "Production-ready AI products, intelligent workflows and operational AI infrastructure.",
    detail:
      "Design, build and operate custom AI systems with the architecture, evaluation and monitoring that real-world use demands.",
    href: "/stratum-systems",
    cta: "Explore Stratum",
  },
];

export default function SystemsOverview() {
  return (
    <section
      id="systems"
      className="container-wide py-24 md:py-32"
      aria-labelledby="systems-heading"
    >
      <FadeInWhenVisible>
        <p className="font-heading text-xs uppercase tracking-[0.28em] text-muted">
          Systems by Kinetiq
        </p>
        <h2
          id="systems-heading"
          className="mt-4 max-w-4xl font-heading text-4xl font-bold tracking-tight md:text-5xl"
        >
          Two systems. One foundation for growth and intelligence.
        </h2>
      </FadeInWhenVisible>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {systems.map((system, i) => (
          <FadeInWhenVisible
            key={system.href}
            delay={i * 0.1}
            className="h-full"
          >
            <Link
              href={system.href}
              className={`group flex h-full flex-col border border-line p-7 transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:p-10 ${i ? "bg-stratum-surface" : "bg-surface"}`}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-heading text-xs uppercase tracking-[0.18em] text-muted">
                  {system.label}
                </p>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 52 52"
                  className="size-12 shrink-0 text-ink"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  {i ? (
                    <>
                      <path d="m26 5 22 9-22 9-22-9Z M4 24l22 9 22-9 M4 34l22 9 22-9" />
                      <path d="M26 5v38" opacity=".3" />
                    </>
                  ) : (
                    <>
                      <circle cx="26" cy="26" r="19" />
                      <path d="M13 29h9l6-10h11 M34 14l5 5-5 5" />
                    </>
                  )}
                </svg>
              </div>
              <h3 className="mt-8 font-heading text-3xl font-bold tracking-tight">
                {system.name}
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-ink">
                {system.purpose}
              </p>
              <p className="mb-8 mt-4 max-w-xl text-sm leading-relaxed text-muted">
                {system.detail}
              </p>
              <span className="mt-auto flex items-center justify-between border-t border-line pt-6 font-heading text-sm font-semibold">
                {system.cta}
                <span
                  aria-hidden="true"
                  className="transition-transform motion-safe:group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          </FadeInWhenVisible>
        ))}
      </div>
      <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted">
        Momentum builds the engine that grows the business. Stratum builds the
        intelligence that powers the product and its operations.
      </p>
    </section>
  );
}
