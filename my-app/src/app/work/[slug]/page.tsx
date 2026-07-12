import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import ProjectAssistantSketch from "@/components/sections/ProjectAssistantSketch";
import { caseStudies } from "@/data/work";

export function generateStaticParams() {
    return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const cs = caseStudies.find((c) => c.slug === slug);
    if (!cs) return {};
    return {
        title: `${cs.title} — Kinetiq Work`,
        description: cs.summary,
    };
}

export default async function CaseStudyPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const cs = caseStudies.find((c) => c.slug === slug);
    if (!cs) notFound();

    const index = caseStudies.findIndex((c) => c.slug === slug);
    const next = caseStudies[(index + 1) % caseStudies.length];

    const suggestedQuestions = [
        `What problem did ${cs.title} solve?`,
        `What's the tech stack behind it?`,
        "How long did it take to build?",
        "What did the client say about it?",
    ];

    return (
        <main>
            {/* header — page identity only; the rest of the page is being
                rebuilt around the project-assistant chatbot (see brief) */}
            <section className="mx-auto max-w-5xl px-6 pb-12 pt-36 md:pt-44">
                <FadeInWhenVisible>
                    <Link
                        href="/work"
                        className="font-heading text-sm text-muted hover:text-ink"
                    >
                        ← All work
                    </Link>
                    <p className="mt-8 font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        {cs.category} · {cs.year}
                    </p>
                    <h1 className="mt-4 max-w-3xl text-5xl font-bold md:text-6xl">{cs.title}</h1>
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{cs.summary}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                        {cs.tags.map((tag) => (
                            <span key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                                {tag}
                            </span>
                        ))}
                    </div>
                </FadeInWhenVisible>
            </section>

            {/* project assistant — design sketch only, not wired up yet */}
            <section className="mx-auto max-w-5xl px-6 pb-20 md:pb-28">
                <FadeInWhenVisible y={32}>
                    <ProjectAssistantSketch
                        projectTitle={cs.title}
                        suggestedQuestions={suggestedQuestions}
                    />
                </FadeInWhenVisible>
            </section>

            {/* next project */}
            <section className="border-t border-line">
                <FadeInWhenVisible>
                    <Link href={`/work/${next.slug}`} className="group block">
                        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-16 md:py-20">
                            <div>
                                <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                                    Next project
                                </p>
                                <p className="mt-3 font-heading text-3xl font-bold md:text-4xl">
                                    {next.title}
                                </p>
                            </div>
                            <span className="font-heading text-3xl transition-transform group-hover:translate-x-2">
                                →
                            </span>
                        </div>
                    </Link>
                </FadeInWhenVisible>
            </section>
        </main>
    );
}
