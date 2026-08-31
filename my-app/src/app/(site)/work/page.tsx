import type { Metadata } from "next";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";
import { WorkCard } from "@/components/sections/FeaturedWork";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { getAllProjects } from "@/lib/data";

export const metadata: Metadata = {
    title: "Case Studies & System Architectures | Kinetiq Engineering Portfolio",
    description:
        "Explore verified case studies and architectures shipped by Kinetiq: Enterprise RAG pipelines, autonomous agents, field operations customer portals, and AI copilots for US, UK, and global clients.",
    keywords: [
        "Kinetiq Case Studies",
        "AI Automation Portfolio",
        "RAG System Architecture Case Study",
        "Next.js Customer Portal Examples",
        "Autonomous Agent Architecture",
        "Software Engineering Portfolio",
    ],
    alternates: {
        canonical: "/work",
    },
    openGraph: {
        title: "Case Studies & System Architectures | Kinetiq Engineering Portfolio",
        description:
            "Explore production case studies across AI automation, full-stack web platforms, and generative AI.",
        url: "https://thekinetiq.solutions/work",
        siteName: "Kinetiq",
        type: "website",
    },
};

export default async function WorkPage() {
    const caseStudies = await getAllProjects();

    const workSchema = {
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
                        name: "Work",
                        item: "https://thekinetiq.solutions/work",
                    },
                ],
            },
            {
                "@type": "ItemList",
                name: "Kinetiq Production Systems & Case Studies",
                itemListElement: caseStudies.map((cs, idx) => ({
                    "@type": "ListItem",
                    position: idx + 1,
                    url: `https://thekinetiq.solutions/work/${cs.slug}`,
                    name: cs.title,
                })),
            },
        ],
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(workSchema) }}
            />
            <section className="container-wide pb-10 pt-36 md:pt-44">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        Work
                    </p>
                    <h1 className="mt-4 max-w-2xl text-5xl font-bold md:text-6xl">
                        Built and shipped.
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                        A selection of systems in production across AI automation,
                        web platforms, and generative AI.
                    </p>
                </FadeInWhenVisible>
            </section>

            <section className="container-wide pb-24 pt-10 md:pb-32">
                <StaggerList
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    itemClassName="h-full"
                    stagger={0.1}
                >
                    {caseStudies.map((cs) => (
                        <WorkCard key={cs.slug} {...cs} />
                    ))}
                </StaggerList>
            </section>

            <ClosingCTA />
        </main>
    );
}
