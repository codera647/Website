import type { Metadata } from "next";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import FAQAccordion from "@/components/motion/FAQAccordion";
import EngagementLadder from "@/components/sections/EngagementLadder";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { engagementTiers, engagementFaqs } from "@/data/aiEngagements";

export const metadata: Metadata = {
    title: "AI Automation & Generative AI Engagements | Kinetiq",
    description:
        "Custom AI automation and generative AI platforms for growing companies — scoped audits, production builds, and ongoing AI operations. Built by the team behind Synapse and other production AI platforms.",
    keywords: [
        "Custom RAG Platform Development",
        "AI Automation for Enterprise",
        "Generative AI Consulting",
        "AI Readiness Audit",
        "Custom AI Platform Development",
        "Enterprise AI Program",
    ],
    alternates: {
        canonical: "/ai-engagements",
    },
    openGraph: {
        title: "AI Automation & Generative AI Engagements | Kinetiq",
        description:
            "Custom AI automation and generative AI platforms for growing companies — scoped audits, production builds, and ongoing AI operations.",
        url: "https://thekinetiq.solutions/ai-engagements",
        siteName: "Kinetiq",
        type: "website",
    },
};

export default function AiEngagementsPage() {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: "https://thekinetiq.solutions" },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "AI Engagements",
                        item: "https://thekinetiq.solutions/ai-engagements",
                    },
                ],
            },
            {
                "@type": "FAQPage",
                mainEntity: engagementFaqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: { "@type": "Answer", text: faq.answer },
                })),
            },
        ],
    };

    return (
        <main>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

            {/* Hero */}
            <section className="container-wide pb-16 pt-36 md:pb-24 md:pt-44">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        AI Automation &amp; Generative AI Engagements
                    </p>
                    <h1 className="mt-6 max-w-3xl font-heading text-5xl font-bold tracking-tight text-ink md:text-7xl">
                        The same team that ships production AI platforms — applied to your process.
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
                        Every engagement starts with a scoped audit, not a guess.
                    </p>
                </FadeInWhenVisible>
            </section>

            {/* Engagement ladder */}
            <section className="border-t border-line bg-surface/40 py-20 md:py-28">
                <div className="container-wide">
                    <FadeInWhenVisible>
                        <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                            Engagement stages
                        </p>
                        <h2 className="mt-3 max-w-2xl text-3xl font-bold md:text-4xl text-ink">
                            Four stages, starting wherever you are.
                        </h2>
                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
                            Every price below is a starting point — the final number is set
                            after a short scoping conversation, not a checkout page.
                        </p>
                    </FadeInWhenVisible>

                    <div className="mt-14">
                        <EngagementLadder tiers={engagementTiers} />
                    </div>
                </div>
            </section>

            {/* Portfolio proof — grounds the tiers in real, shipped work */}
            <section className="border-t border-line bg-background py-20 md:py-28">
                <div className="container-wide">
                    <FadeInWhenVisible>
                        <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                            Proof, not promises
                        </p>
                        <h2 className="mt-3 max-w-2xl text-3xl font-bold md:text-4xl text-ink">
                            This is the same work already in production.
                        </h2>
                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
                            Synapse, a multi-tenant RAG knowledge platform. A resume shortlisting
                            platform. A product recommendation engine. A family-offices
                            intelligence pipeline. A fuel route optimizer. AutoBG&apos;s
                            generative image pipeline. Custom AI Platform and Automation Build
                            engagements are how each of those started.
                        </p>
                        <a
                            href="/work"
                            className="mt-6 inline-block font-heading text-sm font-semibold text-ink underline-offset-4 hover:underline"
                        >
                            See the full portfolio →
                        </a>
                    </FadeInWhenVisible>
                </div>
            </section>

            {/* FAQ */}
            <section className="border-t border-line bg-surface/50 py-24 md:py-32">
                <div className="container-wide max-w-4xl">
                    <FadeInWhenVisible>
                        <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                            Common Questions
                        </p>
                        <h2 className="mt-4 text-4xl font-bold md:text-5xl text-ink">
                            Engagements &amp; Scoping
                        </h2>
                    </FadeInWhenVisible>

                    <div className="mt-12">
                        <FAQAccordion items={engagementFaqs} />
                    </div>
                </div>
            </section>

            <ClosingCTA />
        </main>
    );
}
