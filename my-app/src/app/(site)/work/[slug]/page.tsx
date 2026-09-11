import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import ProjectChatPanel from "@/components/chat/ProjectChatPanel";
import ProjectImage from "@/components/sections/ProjectImage";
import { getProjectPresentation } from "@/data/projectPresentation";
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
    const presentation = getProjectPresentation(cs);
    const gallery = cs.slug === "synapse"
        ? ["/synapse/system_architecture.jpg", "/synapse/pipeline_architecture.jpg"]
        : [...new Set(cs.images)].filter((src) => src !== presentation.image);

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
                        {presentation.summary}
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

            <section aria-label={`${cs.title} preview`} className="mx-auto max-w-5xl px-6 pb-12">
                <figure>
                    <a href={presentation.image || "#"} target="_blank" rel="noopener noreferrer" aria-label={`Open ${cs.title} preview at full size`} className="relative block aspect-video overflow-hidden border border-line bg-surface">
                        <ProjectImage src={presentation.image} alt={`${cs.title} — ${presentation.imageLabel}`} sizes="(max-width: 1024px) 100vw, 976px" priority />
                    </a>
                    <figcaption className="mt-3 text-sm text-muted">{cs.title} · {presentation.imageLabel}. Select the image to view it at full size.</figcaption>
                </figure>
            </section>

            {cs.slug === "synapse" && <section aria-labelledby="synapse-workflow" className="mx-auto max-w-5xl px-6 pb-16">
                <h2 id="synapse-workflow" className="text-2xl font-bold md:text-3xl">From documents to verifiable answers.</h2>
                <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        ["Bring your documents", "Files are processed into searchable libraries."],
                        ["Ask a question", "The system plans a search across relevant sources."],
                        ["Check the evidence", "Retrieved passages are checked and gaps explored."],
                        ["Trace the answer", "Citations and figures link the response to its sources."],
                    ].map(([title, description], i) => <li key={title} className="border-t-2 border-accent bg-surface p-5">
                        <p className="text-sm font-semibold text-accent">0{i + 1}</p>
                        <h3 className="mt-3 text-lg font-semibold">{title}</h3>
                        <p className="mt-2 text-base leading-relaxed text-muted">{description}</p>
                    </li>)}
                </ol>
            </section>}

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

            {/* Cross-link to enterprise engagement track — only for the AI
                Automation / Generative AI projects that track is scoped for. */}
            {gallery.length > 0 && <section aria-labelledby="project-gallery" className="mx-auto max-w-5xl px-6 pb-16">
                <h2 id="project-gallery" className="text-2xl font-bold md:text-3xl">Explore the project in detail.</h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    {gallery.map((src, i) => <figure key={src}>
                        <a href={src} target="_blank" rel="noopener noreferrer" aria-label={`Open ${cs.title} project visual ${i + 1} at full size`} className="relative block aspect-video overflow-hidden border border-line bg-surface">
                            <ProjectImage src={src} alt={`${cs.title} — ${/architecture|pipeline|workflow/i.test(src) ? "architecture or workflow diagram" : "project screenshot"} ${i + 1}`} sizes="(max-width: 640px) 100vw, 480px" />
                        </a>
                        <figcaption className="mt-2 text-sm text-muted">{cs.slug === "synapse" ? (i === 0 ? "System architecture" : "Retrieval pipeline") : `Project visual ${i + 1}`} · Open full size ↗</figcaption>
                    </figure>)}
                </div>
            </section>}

            <section className="mx-auto max-w-5xl px-6 pb-16 md:pb-24">
                <ProjectChatPanel projectTitle={cs.title} projectSlug={cs.slug} suggestedQuestions={suggestedQuestions} />
            </section>

            {(cs.category === "AI Automation" || cs.category === "Generative AI") && (
                <section className="border-t border-line bg-surface">
                    <div className="mx-auto max-w-5xl px-6 py-14 md:py-16">
                        <FadeInWhenVisible>
                            <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                                Want something like this?
                            </p>
                            <h2 className="mt-3 max-w-xl text-2xl font-bold md:text-3xl text-ink">
                                Want something like this built for your business?
                            </h2>
                            <Link
                                href="/ai-engagements"
                                className="mt-5 inline-block rounded-none border border-line bg-background px-6 py-3 font-heading text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink"
                            >
                                See engagement options →
                            </Link>
                        </FadeInWhenVisible>
                    </div>
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
