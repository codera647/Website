import type { Metadata } from "next";
import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import FAQAccordion from "@/components/motion/FAQAccordion";
import StratumArchitecture from "@/components/systems/StratumArchitecture";
import StratumAuditButton from "@/components/systems/StratumAuditButton";
import StratumPricingCard from "@/components/pricing/StratumPricingCard";
import {
  stratumPillars,
  stratumLifecycle,
  stratumCapabilities,
  stratumExamples,
  stratumAudiences,
  stratumTiers,
  stratumFAQs,
  stratumDeliveryNote,
} from "@/data/stratum";

const title = "Stratum Systems | Production-Ready AI Systems by Kinetiq";
const description =
  "Kinetiq designs, builds and operates production-ready AI systems, including RAG platforms, AI agents, machine-learning products, computer vision and intelligent workflows.";
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/stratum-systems" },
  openGraph: {
    title,
    description,
    url: "https://thekinetiq.solutions/stratum-systems",
    siteName: "Kinetiq",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

const prototype = [
  "Works in a controlled demo",
  "Depends heavily on prompts",
  "Limited evaluation",
  "Manual deployment",
  "Weak monitoring",
  "Unclear failure handling",
  "Difficult to scale",
];
const production = [
  "Connected to real business data",
  "Evaluated against defined quality standards",
  "Protected by guardrails and permissions",
  "Integrated with existing tools",
  "Continuously monitored",
  "Designed for predictable failure handling",
  "Built to improve and scale",
];

function SectionIntro({
  eyebrow,
  heading,
  children,
}: {
  eyebrow: string;
  heading: string;
  children?: React.ReactNode;
}) {
  return (
    <FadeInWhenVisible>
      <p className="font-heading text-xs uppercase tracking-[0.24em] text-muted">
        {eyebrow}
      </p>
      <h2 className="mt-4 max-w-4xl font-heading text-4xl font-bold tracking-tight md:text-5xl">
        {heading}
      </h2>
      {children && (
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
          {children}
        </p>
      )}
    </FadeInWhenVisible>
  );
}

export default function StratumPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://thekinetiq.solutions/stratum-systems#service",
        name: "Stratum Systems by Kinetiq",
        serviceType: "Production AI engineering and product development",
        description,
        url: "https://thekinetiq.solutions/stratum-systems",
        provider: {
          "@type": "Organization",
          name: "Kinetiq",
          url: "https://thekinetiq.solutions",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://thekinetiq.solutions",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Stratum Systems",
            item: "https://thekinetiq.solutions/stratum-systems",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: stratumFAQs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
  return (
    <main className="stratum-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="container-wide grid items-center gap-14 pb-24 pt-36 md:pb-32 md:pt-44 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <FadeInWhenVisible>
          <p className="font-heading text-xs uppercase tracking-[0.24em] text-muted">
            A Kinetiq Production AI System
          </p>
          <h1 className="mt-6 font-heading text-5xl font-bold tracking-tight sm:text-6xl xl:text-7xl">
            Stratum Systems
          </h1>
          <p className="mt-6 max-w-2xl font-heading text-2xl font-medium leading-snug md:text-3xl">
            Production intelligence, engineered layer by layer.
          </p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            We design, build and operate dependable AI systems that move beyond
            prototypes and perform inside real businesses, real products and
            real workflows.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-6">
            <StratumAuditButton />
            <a
              href="#stratum-process"
              className="inline-flex min-h-12 items-center gap-3 font-heading text-sm font-semibold underline underline-offset-4"
            >
              Explore How It Works <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="mt-8 max-w-lg text-sm leading-relaxed text-muted">
            Custom AI engineering for startups, software companies and data-rich
            businesses.
          </p>
        </FadeInWhenVisible>
        <StratumArchitecture />
      </section>

      <section className="border-y border-line bg-surface py-24 md:py-32">
        <div className="container-wide">
          <SectionIntro
            eyebrow="From prototype to production"
            heading="A working demo is not the same as a working system."
          >
            Stratum closes the gap between AI experimentation and production
            deployment through deliberate architecture, evaluation, integration
            and operational control.
          </SectionIntro>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { name: "Prototype", items: prototype },
              { name: "Production System", items: production },
            ].map((column, i) => (
              <div
                key={column.name}
                className={`border p-7 sm:p-10 ${i ? "border-ink bg-background" : "border-line"}`}
              >
                <div className="flex items-center justify-between border-b border-line pb-6">
                  <h3 className="font-heading text-2xl font-bold">
                    {column.name}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="font-heading text-xs text-muted"
                  >
                    {i ? "02 / Dependable" : "01 / Experimental"}
                  </span>
                </div>
                <ul className="mt-6 space-y-4 text-sm leading-relaxed">
                  {column.items.map((item) => (
                    <li
                      key={item}
                      className={`flex gap-3 ${i ? "text-ink" : "text-muted"}`}
                    >
                      <span aria-hidden="true">{i ? "✓" : "—"}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide py-24 md:py-32">
        <SectionIntro
          eyebrow="Three connected pillars"
          heading="Architecture. Intelligence. Operations."
        >
          Every layer serves the same goal: a system your team can depend on.
        </SectionIntro>
        <div className="mt-12 grid border border-line md:grid-cols-3">
          {stratumPillars.map((pillar, i) => (
            <FadeInWhenVisible
              key={pillar.name}
              delay={i * 0.1}
              className="relative border-b border-line p-7 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 sm:p-10"
            >
              <span className="font-heading text-xs text-muted">
                0{i + 1} / STRATUM
              </span>
              <h3 className="mt-7 font-heading text-2xl font-bold">
                {pillar.name}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {pillar.description}
              </p>
              {i < 2 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-3 top-12 z-10 hidden bg-background px-1 text-muted md:block"
                >
                  →
                </span>
              )}
            </FadeInWhenVisible>
          ))}
        </div>
      </section>

      <section
        id="stratum-process"
        className="scroll-mt-28 border-y border-line bg-stratum-surface py-24 md:py-32"
      >
        <div className="container-wide">
          <SectionIntro
            eyebrow="The Stratum lifecycle"
            heading="A deliberate path to production."
          >
            Five stages, with validation built into the journey. We define the
            system before we build it, then improve it through real usage.
          </SectionIntro>
          <ol className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {stratumLifecycle.map((stage, i) => (
              <li key={stage.name}>
                <FadeInWhenVisible
                  delay={i * 0.08}
                  className="h-full border-t border-ink/30 pt-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-3xl font-bold text-muted/60">
                      0{i + 1}
                    </span>
                    <span aria-hidden="true" className="text-muted">
                      {i === 4 ? "↺" : "→"}
                    </span>
                  </div>
                  <h3 className="mt-6 font-heading text-xl font-bold">
                    {stage.name}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {stage.description}
                  </p>
                </FadeInWhenVisible>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-wide py-24 md:py-32">
        <SectionIntro
          eyebrow="What we build"
          heading="The right intelligence for the problem."
        >
          From retrieval and agents to predictive models and computer vision,
          the use case determines the approach.
        </SectionIntro>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stratumCapabilities.map((capability, i) => (
            <FadeInWhenVisible
              key={capability.name}
              delay={(i % 4) * 0.06}
              className="h-full"
            >
              <article className="h-full border border-line bg-surface p-7">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-8 text-ink"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                >
                  <path d={capability.icon} />
                </svg>
                <h3 className="mt-6 font-heading text-xl font-semibold leading-snug">
                  {capability.name}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {capability.description}
                </p>
              </article>
            </FadeInWhenVisible>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface py-24 md:py-32">
        <div className="container-wide">
          <SectionIntro
            eyebrow="Example Systems"
            heading="What Stratum can power."
          >
            These are example applications, not claimed client projects or
            results. Your Blueprint determines what is feasible for your data
            and requirements.
          </SectionIntro>
          <ul className="mt-12 grid gap-x-12 md:grid-cols-2">
            {stratumExamples.map((example, i) => (
              <li
                key={example}
                className="flex items-start gap-5 border-t border-line py-6"
              >
                <span className="pt-1 font-heading text-xs text-muted">
                  0{i + 1}
                </span>
                <h3 className="font-heading text-lg font-medium leading-relaxed">
                  {example}
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-wide py-24 md:py-32">
        <SectionIntro
          eyebrow="Who Stratum is for"
          heading="For teams building beyond the chatbot."
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {stratumAudiences.map((audience) => (
            <li
              key={audience}
              className="flex items-start gap-4 border border-line p-6 text-base leading-relaxed"
            >
              <span aria-hidden="true" className="text-muted">
                ↗
              </span>
              {audience}
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-4xl border-l-2 border-ink pl-6 text-sm leading-relaxed text-muted">
          Stratum is not intended for companies looking only for a basic website
          chatbot, simple content generation or a disconnected no-code
          automation. Those requirements may be better addressed through{" "}
          <Link
            href="/pricing#ai-add-ons"
            className="font-medium text-ink underline underline-offset-4"
          >
            Momentum’s AI capabilities
          </Link>
          .
        </p>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted">
          Momentum builds the engine that grows the business. Stratum builds the
          intelligence that powers the product and its operations.
        </p>
      </section>

      <section className="border-y border-line bg-surface py-24 md:py-32">
        <div className="container-wide">
          <SectionIntro
            eyebrow="Implementation plans · USD"
            heading="Start with clarity. Build with confidence."
          >
            Every implementation begins with a $497 Stratum Blueprint. The
            complete payment is credited toward implementation when you proceed
            within 30 days.
          </SectionIntro>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {stratumTiers.map((tier) => (
              <StratumPricingCard key={tier.id} tier={tier} preview />
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted">
            {stratumDeliveryNote}
          </p>
          <Link
            href="/pricing#stratum"
            className="mt-6 inline-flex min-h-12 items-center gap-4 font-heading text-base font-semibold underline underline-offset-4"
          >
            Explore Stratum Pricing <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 md:py-32">
        <SectionIntro eyebrow="FAQ" heading="Before we build." />
        <FAQAccordion items={stratumFAQs} className="mt-12" />
      </section>

      <section className="bg-ink py-24 text-background md:py-32">
        <div className="container-wide">
          <FadeInWhenVisible>
            <p className="font-heading text-xs uppercase tracking-[0.24em] text-background/60">
              Stratum Systems by Kinetiq
            </p>
            <h2 className="mt-6 max-w-4xl font-heading text-4xl font-bold tracking-tight md:text-6xl">
              Ready to move your AI system beyond the prototype?
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-background/70">
              Start with a Stratum Blueprint and leave with a practical
              architecture, implementation roadmap and clearly defined path to
              production.
            </p>
            <div className="mt-10">
              <StratumAuditButton dark />
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
    </main>
  );
}
