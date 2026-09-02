import type { Metadata } from "next";
import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import ServiceDemoBlock from "@/components/sections/ServiceDemoBlock";
import ProcessSection from "@/components/sections/ProcessSection";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { services } from "@/data/services";

export const metadata: Metadata = {
    title: "AI Automation, Web Development & Generative AI Services | Kinetiq",
    description:
        "Production-grade engineering services: Agentic AI workflows, custom Next.js web applications, enterprise RAG pipelines, and automated business infrastructure for clients in the US, UK, Pakistan, and worldwide.",
    keywords: [
        "AI Automation Services",
        "Hire AI Automation Agency",
        "Custom AI Agent Development Studio",
        "Next.js Web Development Services",
        "Enterprise RAG Architecture Developers",
        "Generative AI Consulting Studio",
        "Full-Stack Web Engineering Agency",
        "Bespoke Software Engineering UK US",
    ],
    alternates: {
        canonical: "/services",
    },
    openGraph: {
        title: "AI Automation, Web Development & Generative AI Services | Kinetiq",
        description:
            "Production-grade engineering services: Agentic AI workflows, custom Next.js web applications, and enterprise RAG pipelines.",
        url: "https://thekinetiq.solutions/services",
        siteName: "Kinetiq",
        type: "website",
    },
};

export default function ServicesPage() {
    const servicesSchema = {
        "@context": "https://schema.org",
        "@graph": [
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
                        name: "Services",
                        item: "https://thekinetiq.solutions/services",
                    },
                ],
            },
            ...services.map((s) => ({
                "@type": "Service",
                name: s.title,
                description: s.description,
                provider: {
                    "@type": "Organization",
                    name: "Kinetiq",
                    url: "https://thekinetiq.solutions",
                },
                serviceType: s.title,
                offers: {
                    "@type": "Offer",
                    url: "https://thekinetiq.solutions/services#" + s.anchor,
                },
            })),
        ],
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
            />
            {/* intro */}
            <section className="container-wide pb-10 pt-36 md:pt-44">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        Services
                    </p>
                    <h1 className="mt-4 max-w-2xl text-5xl font-bold md:text-6xl">
                        What we build.
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                        Three disciplines, one standard: production-grade systems that
                        hold up in the real world. Each one is shown below actually
                        working, not just described.
                    </p>
                </FadeInWhenVisible>
            </section>

            {/* the three services, alternating layout */}
            {services.map((service, i) => (
                <section
                    key={service.id}
                    id={service.anchor}
                    className={`scroll-mt-28 ${i % 2 === 1 ? "bg-surface" : ""}`}
                >
                    <div
                        className={`container-wide grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2 ${
                            i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                        }`}
                    >
                        <FadeInWhenVisible>
                            <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                                0{i + 1} · {service.tagline}
                            </p>
                            <h2 className="mt-4 text-4xl font-bold md:text-5xl">{service.title}</h2>
                            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
                                {service.description}
                            </p>
                            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {service.capabilities.map((cap) => (
                                    <li key={cap} className="flex items-center gap-2.5 font-heading text-sm font-medium">
                                        <span className="size-1.5 rounded-full bg-ink" />
                                        {cap}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 flex flex-wrap gap-2">
                                {service.stack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="rounded-none border border-line bg-[#F5F3E4] px-3 py-1 text-xs text-muted"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {(service.id === "ai-automation" || service.id === "generative-ai") && (
                                <Link
                                    href="/ai-engagements"
                                    className="mt-6 inline-block font-heading text-sm font-semibold text-ink underline-offset-4 hover:underline"
                                >
                                    Have a larger process or platform in mind? See engagement options →
                                </Link>
                            )}
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.15} y={32}>
                            <ServiceDemoBlock service={service} />
                        </FadeInWhenVisible>
                    </div>
                </section>
            ))}

            {/* Momentum Systems Packaged Offering Callout */}
            <section className="border-t border-line bg-ink text-white py-20 md:py-24">
                <div className="container-wide grid gap-8 lg:grid-cols-12 lg:items-center">
                    <div className="lg:col-span-8">
                        <FadeInWhenVisible>
                            <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-white/50">
                                Packaged Growth Engine
                            </p>
                            <h2 className="mt-3 font-heading text-3xl font-bold md:text-4xl text-white">
                                For local &amp; growing businesses: Momentum Systems.
                            </h2>
                            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
                                We combine all three disciplines — full-stack customer portals, automated email/SMS follow-up, and programmatic local SEO — into a unified, outcome-priced growth engine that keeps bringing customers back automatically.
                            </p>
                        </FadeInWhenVisible>
                    </div>
                    <div className="lg:col-span-4 lg:text-right">
                        <FadeInWhenVisible delay={0.1}>
                            <Link
                                href="/momentum-systems"
                                className="inline-block rounded-none border border-white/20 bg-[#F5F3E4] px-7 py-3.5 font-heading text-sm font-semibold text-ink transition-all duration-300 hover:bg-[#F5F3E4]/85 hover:-translate-y-0.5 shadow-sm"
                            >
                                Explore Momentum Systems →
                            </Link>
                        </FadeInWhenVisible>
                    </div>
                </div>
            </section>

            {/* how we work — same section as the About page */}
            <ProcessSection title="Four steps, no surprises." />

            <ClosingCTA />
        </main>
    );
}
