import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import ProjectChatPanel from "@/components/chat/ProjectChatPanel";
import { getAllProjects, getProjectBySlug } from "@/lib/data";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const cs = await getProjectBySlug(slug);
    if (!cs) return {};
    return {
        title: `${cs.title} | Kinetiq Work`,
        description: cs.summary,
    };
}

export default async function CaseStudyPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const cs = await getProjectBySlug(slug);
    if (!cs) notFound();

    const allProjects = await getAllProjects();
    const index = allProjects.findIndex((c) => c.slug === slug);
    const next = allProjects[(index + 1) % allProjects.length];

    const suggestedQuestions = [
        `What problem did ${cs.title} solve?`,
        `Show me the architecture and technical pipeline.`,
        `What were the key results or metrics achieved?`,
        `How does it work under the hood?`,
    ];

    return (
        <main>
            {/* Header */}
            <section className="mx-auto max-w-5xl px-6 pb-12 pt-36 md:pt-44">
                <FadeInWhenVisible>
                    <Link
                        href="/work"
                        className="font-heading text-sm text-muted hover:text-ink transition-colors"
                    >
                        ← All work
                    </Link>
                    <p className="mt-8 font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        {cs.category} · {cs.year}
                    </p>
                    <h1 className="mt-4 max-w-3xl text-5xl font-bold md:text-6xl text-ink">
                        {cs.title}
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                        {cs.summary}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                        {cs.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-none border border-line bg-surface px-3 py-1 text-xs text-muted"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </FadeInWhenVisible>
            </section>

            {/* Live Interactive Project Assistant */}
            <section className="mx-auto max-w-5xl px-6 pb-16 md:pb-24">
                <FadeInWhenVisible y={32}>
                    <ProjectChatPanel
                        projectTitle={cs.title}
                        projectSlug={cs.slug}
                        suggestedQuestions={suggestedQuestions}
                    />
                </FadeInWhenVisible>
            </section>

            {/* Metrics */}
            {cs.metrics && cs.metrics.length > 0 && (
                <section className="border-y border-line bg-surface">
                    <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                            {cs.metrics.map((m, i) => (
                                <div key={i} className="border-l border-line pl-4">
                                    <p className="font-heading text-3xl font-bold md:text-4xl text-ink">
                                        {m.value}
                                    </p>
                                    <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted">
                                        {m.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Deep-dive content: Challenge, Solution, Result */}
            {(cs.challenge || cs.solution || cs.result) && (
                <section className="mx-auto max-w-5xl px-6 py-16 md:py-24 space-y-16">
                    {cs.challenge && (
                        <FadeInWhenVisible>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <h2 className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                                    01 / The Challenge
                                </h2>
                                <div className="md:col-span-2">
                                    <p className="text-base md:text-lg leading-relaxed text-ink/90">
                                        {cs.challenge}
                                    </p>
                                </div>
                            </div>
                        </FadeInWhenVisible>
                    )}

                    {cs.solution && (
                        <FadeInWhenVisible>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <h2 className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                                    02 / Architecture & Solution
                                </h2>
                                <div className="md:col-span-2">
                                    <p className="text-base md:text-lg leading-relaxed text-ink/90">
                                        {cs.solution}
                                    </p>
                                </div>
                            </div>
                        </FadeInWhenVisible>
                    )}

                    {cs.result && (
                        <FadeInWhenVisible>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <h2 className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                                    03 / Outcomes & Impact
                                </h2>
                                <div className="md:col-span-2">
                                    <p className="text-base md:text-lg leading-relaxed text-ink/90">
                                        {cs.result}
                                    </p>
                                </div>
                            </div>
                        </FadeInWhenVisible>
                    )}
                </section>
            )}

            {/* Next project */}
            <section className="border-t border-line">
                <FadeInWhenVisible>
                    <Link href={`/work/${next.slug}`} className="group block">
                        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-16 md:py-20">
                            <div>
                                <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                                    Next project
                                </p>
                                <p className="mt-3 font-heading text-3xl font-bold md:text-4xl text-ink">
                                    {next.title}
                                </p>
                            </div>
                            <span className="font-heading text-3xl transition-transform group-hover:translate-x-2 text-ink">
                                →
                            </span>
                        </div>
                    </Link>
                </FadeInWhenVisible>
            </section>
        </main>
    );
}
