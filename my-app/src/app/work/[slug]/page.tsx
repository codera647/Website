import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";
import ParallaxImage from "@/components/motion/ParallaxImage";
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

const narrative = [
    { key: "challenge", label: "The challenge" },
    { key: "solution", label: "The solution" },
    { key: "result", label: "The result" },
] as const;

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

    return (
        <main>
            {/* header */}
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

            {/* hero image */}
            <section className="mx-auto max-w-6xl px-6">
                <FadeInWhenVisible y={32}>
                    <ParallaxImage
                        src={cs.thumbnail}
                        alt={cs.title}
                        className="aspect-[21/10] rounded-2xl border border-line"
                        sizes="(max-width: 1200px) 100vw, 1152px"
                        priority
                    />
                </FadeInWhenVisible>
            </section>

            {/* metrics */}
            <section className="mx-auto max-w-5xl px-6 pt-16">
                <StaggerList className="grid gap-4 sm:grid-cols-3" stagger={0.1}>
                    {cs.metrics.map((m) => (
                        <div key={m.label} className="rounded-2xl bg-surface p-7 text-center">
                            <p className="font-heading text-3xl font-bold">{m.value}</p>
                            <p className="mt-1.5 text-sm text-muted">{m.label}</p>
                        </div>
                    ))}
                </StaggerList>
            </section>

            {/* narrative */}
            <section className="mx-auto max-w-5xl space-y-16 px-6 py-20 md:py-28">
                {narrative.map((section, i) => (
                    <FadeInWhenVisible key={section.key}>
                        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                            <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                                0{i + 1} — {section.label}
                            </p>
                            <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
                                {cs[section.key]}
                            </p>
                        </div>
                    </FadeInWhenVisible>
                ))}
            </section>

            {/* client quote */}
            {cs.quote && (
                <section className="bg-surface">
                    <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-24">
                        <FadeInWhenVisible>
                            <p className="font-heading text-2xl font-medium leading-relaxed md:text-3xl">
                                &ldquo;{cs.quote.text}&rdquo;
                            </p>
                            <p className="mt-8 font-heading font-semibold">{cs.quote.name}</p>
                            <p className="text-sm text-muted">{cs.quote.role}</p>
                        </FadeInWhenVisible>
                    </div>
                </section>
            )}

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
