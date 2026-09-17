import type { Metadata } from "next";
import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import FAQAccordion from "@/components/motion/FAQAccordion";
import StratumArchitecture from "@/components/systems/StratumArchitecture";
import StratumAuditButton from "@/components/systems/StratumAuditButton";
import StratumPricingCard from "@/components/pricing/StratumPricingCard";
import { systemPageStyles as styles } from "@/components/systems/systemPageStyles";
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

const pillarDetails = [
  {
    tagline: "The technical foundation.",
    lifecycle: "Blueprint → Build",
    why: "A deliberate foundation keeps data access, integrations and responsibilities clear before development begins.",
  },
  {
    tagline: "The right approach for the problem.",
    lifecycle: "Build → Validate",
    why: "The business requirement determines the AI approach, with quality measured against defined success criteria.",
  },
  {
    tagline: "Dependable after deployment.",
    lifecycle: "Deploy → Evolve",
    why: "Operational control makes the system maintainable as data, providers and real-world usage change.",
  },
];
const comparisonDimensions = [
  "Readiness",
  "Intelligence",
  "Quality",
  "Deployment",
  "Visibility",
  "Failure handling",
  "Scalability",
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
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.heading}>{heading}</h2>
      {children && <p className={styles.description}>{children}</p>}
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
      <section className={styles.hero}>
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <FadeInWhenVisible className="lg:col-span-7">
            <div className={styles.heroBadge}>
              <span className="relative flex size-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink opacity-75 duration-1000" />
                <span className="relative inline-flex size-2 rounded-full bg-ink" />
              </span>
              A Kinetiq Production AI System
            </div>
            <h1 className={styles.heroTitle}>Stratum Systems</h1>
            <p className="mt-6 max-w-2xl font-heading text-2xl font-medium leading-snug text-ink md:text-3xl">
              Production intelligence, engineered layer by layer.
            </p>
            <p className={styles.heroDescription}>
              We design, build and operate dependable AI systems that move
              beyond prototypes and perform inside real businesses, real
              products and real workflows.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <StratumAuditButton />
              <Link href="/pricing#stratum" className={styles.primaryLink}>
                View Pricing &amp; Tiers →
              </Link>
              <a href="#stratum-process" className={styles.secondaryLink}>
                Explore How It Works
              </a>
            </div>
            <p className="mt-8 max-w-lg text-sm leading-relaxed text-muted">
              Custom AI engineering for startups, software companies and
              data-rich businesses.
            </p>
          </FadeInWhenVisible>
          <FadeInWhenVisible delay={0.1} className="lg:col-span-5">
            <StratumArchitecture />
          </FadeInWhenVisible>
        </div>
      </section>

      <section className={styles.surfaceSection}>
        <div className="container-wide">
          <SectionIntro
            eyebrow="From prototype to production"
            heading="A working demo is not the same as a working system."
          >
            Stratum closes the gap between AI experimentation and production
            deployment through deliberate architecture, evaluation, integration
            and operational control.
          </SectionIntro>
          <div className={styles.comparison}>
            <div
              className="overflow-x-auto"
              tabIndex={0}
              role="region"
              aria-label="Prototype and production system comparison"
            >
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-surface text-xs font-heading uppercase tracking-wider text-muted">
                    <th scope="col" className="p-5 font-semibold">
                      Dimension
                    </th>
                    <th scope="col" className="p-5 font-semibold text-muted/80">
                      Prototype
                    </th>
                    <th
                      scope="col"
                      className="p-5 font-semibold text-ink bg-ink/5"
                    >
                      Production System
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {prototype.map((item, i) => (
                    <tr
                      key={item}
                      className="hover:bg-surface/80 transition-colors group cursor-default"
                    >
                      <th
                        scope="row"
                        className="p-5 font-heading font-medium text-ink group-hover:text-ink"
                      >
                        {comparisonDimensions[i]}
                      </th>
                      <td className="p-5 text-muted group-hover:text-ink-soft">
                        {item}
                      </td>
                      <td className="p-5 font-medium text-ink bg-ink/5 group-hover:bg-ink/10 transition-colors">
                        {production[i]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section
        id="stratum-pillars"
        className={`${styles.surfaceSection} scroll-mt-24`}
      >
        <div className="container-wide">
          <SectionIntro
            eyebrow="The Three Pillars"
            heading="Architecture. Intelligence. Operations."
          >
            Every layer serves the same goal: a system your team can depend on.
          </SectionIntro>
          <div className="mt-16 space-y-8">
            {stratumPillars.map((pillar, i) => (
              <FadeInWhenVisible key={pillar.name} delay={i * 0.1}>
                <article className={styles.pillarCard}>
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <span className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                        Pillar 0{i + 1}
                      </span>
                      <h3 className="mt-2 font-heading text-2xl font-bold text-ink md:text-3xl">
                        {pillar.name}
                      </h3>
                      <p className="mt-2 font-heading text-sm font-medium text-ink-soft">
                        {pillarDetails[i].tagline}
                      </p>
                    </div>
                    <div className={styles.practicePanel}>
                      <span className="block font-heading font-semibold uppercase tracking-wider text-[11px] text-ink mb-1">
                        Connected lifecycle stages
                      </span>
                      {pillarDetails[i].lifecycle}
                    </div>
                  </div>
                  <div className="lg:col-span-7 space-y-6 lg:border-l lg:border-line lg:pl-12">
                    <div>
                      <h4 className="font-heading text-xs uppercase tracking-wider text-muted font-semibold">
                        What It Is
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-ink/90">
                        {pillar.description}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-heading text-xs uppercase tracking-wider text-muted font-semibold">
                        Why It Matters
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-ink/90">
                        {pillarDetails[i].why}
                      </p>
                    </div>
                  </div>
                </article>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      <section
        id="stratum-process"
        className={`${styles.lightSection} scroll-mt-24`}
      >
        <div className="container-wide">
          <SectionIntro
            eyebrow="The Stratum lifecycle"
            heading="A deliberate path to production."
          >
            Five stages, with validation built into the journey. We define the
            system before we build it, then improve it through real usage.
          </SectionIntro>
          <ol className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
            {stratumLifecycle.map((stage, i) => (
              <li key={stage.name}>
                <FadeInWhenVisible delay={0.05 + i * 0.05} className="h-full">
                  <article className={styles.workflowCard}>
                    <div>
                      <span className="font-heading text-xs font-bold text-muted">
                        0{i + 1} / {stage.name.toUpperCase()}
                      </span>
                      <h3 className="mt-3 font-heading text-lg font-bold text-ink">
                        {stage.name}
                      </h3>
                      <p className="mt-3 text-xs leading-relaxed text-muted">
                        {stage.description}
                      </p>
                    </div>
                    <span className="mt-6 font-heading text-xs font-semibold text-ink-soft transition-transform group-hover:translate-x-1">
                      {i === 4
                        ? "⟳ Improve through real usage"
                        : `→ ${stratumLifecycle[i + 1].name}`}
                    </span>
                  </article>
                </FadeInWhenVisible>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.lightSection}>
        <div className="container-wide">
          <SectionIntro
            eyebrow="What we build"
            heading="The right intelligence for the problem."
          >
            From retrieval and agents to predictive models and computer vision,
            the use case determines the approach.
          </SectionIntro>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {stratumCapabilities.map((capability, i) => (
              <FadeInWhenVisible
                key={capability.name}
                delay={(i % 4) * 0.08}
                className="h-full"
              >
                <article className={styles.contentCard}>
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
                  <h3 className="mt-6 font-heading text-xl font-bold text-ink">
                    {capability.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {capability.description}
                  </p>
                </article>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.surfaceSection}>
        <div className="container-wide">
          <SectionIntro
            eyebrow="Example Systems"
            heading="What Stratum can power."
          >
            These are example applications, not claimed client projects or
            results. Your Blueprint determines what is feasible for your data
            and requirements.
          </SectionIntro>
          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {stratumExamples.map((example, i) => (
              <li key={example}>
                <FadeInWhenVisible delay={(i % 2) * 0.08} className="h-full">
                  <article className={styles.contentCard}>
                    <span className="font-heading text-xs font-bold text-muted">
                      0{i + 1} / EXAMPLE SYSTEM
                    </span>
                    <h3 className="mt-3 font-heading text-xl font-bold text-ink">
                      {example}
                    </h3>
                  </article>
                </FadeInWhenVisible>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.lightSection}>
        <div className="container-wide">
          <SectionIntro
            eyebrow="Who Stratum is for"
            heading="For teams building beyond the chatbot."
          />
          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {stratumAudiences.map((audience, i) => (
              <li key={audience}>
                <FadeInWhenVisible delay={i * 0.08} className="h-full">
                  <article className={styles.contentCard}>
                    <h3 className="font-heading text-xl font-bold text-ink">
                      {audience}
                    </h3>
                  </article>
                </FadeInWhenVisible>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-4xl border-l-2 border-ink pl-6 text-sm leading-relaxed text-muted">
            Stratum is not intended for companies looking only for a basic
            website chatbot, simple content generation or a disconnected no-code
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
            Momentum builds the engine that grows the business. Stratum builds
            the intelligence that powers the product and its operations.
          </p>
        </div>
      </section>

      <section className={styles.surfaceSection}>
        <div className="container-wide">
          <SectionIntro
            eyebrow="Implementation plans · USD"
            heading="Start with clarity. Build with confidence."
          >
            Every implementation begins with a $497 Stratum Blueprint. The
            complete payment is credited toward implementation when you proceed
            within 30 days.
          </SectionIntro>
          <div className="mt-14 grid gap-8 lg:grid-cols-3 lg:items-stretch">
            {stratumTiers.map((tier, index) => (
              <StratumPricingCard
                key={tier.id}
                tier={tier}
                index={index}
                preview
              />
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted">
            {stratumDeliveryNote}
          </p>
          <FadeInWhenVisible delay={0.2} className="mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-line bg-background p-6 sm:p-8">
              <div>
                <h3 className="font-heading text-lg font-bold text-ink">
                  Ready to see your implementation and operations scope?
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Explore Stratum Launch, Production and Scale, starting with a
                  Blueprint.
                </p>
              </div>
              <Link
                href="/pricing#stratum"
                className="inline-block shrink-0 rounded-none bg-ink px-6 py-3 font-heading text-xs font-bold uppercase tracking-wider text-background hover:bg-ink-soft transition-colors shadow-sm"
              >
                Explore Stratum Pricing →
              </Link>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      <section className={styles.surfaceSection}>
        <div className="container-wide max-w-4xl">
          <SectionIntro
            eyebrow="Questions & Answers"
            heading="Before we build."
          />
          <FAQAccordion items={stratumFAQs} className="mt-12" />
        </div>
      </section>

      <section className={styles.closing}>
        <div className={styles.closingContainer}>
          <FadeInWhenVisible>
            <p className={styles.closingEyebrow}>Stratum Systems by Kinetiq</p>
            <h2 className={styles.closingHeading}>
              Ready to move your AI system beyond the prototype?
            </h2>
            <p className={styles.closingDescription}>
              Start with a Stratum Blueprint and leave with a practical
              architecture, implementation roadmap and clearly defined path to
              production.
            </p>
            <div className="mt-10">
              <StratumAuditButton />
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
    </main>
  );
}
