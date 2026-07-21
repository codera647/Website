import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";
import { featuredCaseStudies } from "@/data/work";

export function WorkCard({
    slug,
    title,
    category,
    summary,
    tags,
}: {
    slug: string;
    title: string;
    category: string;
    summary: string;
    tags: string[];
}) {
    return (
        <Link href={`/work/${slug}`} className="group relative block h-full">
            {/*
              Grows IN FLOW on hover (no position:absolute detach), via the
              grid-rows-[0fr]->[1fr] height trick below. Because the card
              stays a normal grid item, CSS Grid's own row-sizing does the
              "reposition" work for free: the row the hovered card sits in
              grows to fit it, which pushes every row after it further down
              the page — no manual repositioning, and nothing can overlap
              the row below since that row simply moves. Cards sharing the
              hovered card's row stretch to match (default grid behaviour),
              which reads as the whole row responding together rather than
              one card overlapping its neighbours.
            */}
            <div className="relative z-10 flex h-full min-h-[190px] flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-7 pb-16 transition-colors duration-500 ease-out md:p-8 md:pb-16 md:group-hover:border-ink md:group-hover:bg-ink md:group-hover:shadow-[0_32px_64px_-24px_rgba(17,17,19,0.45)]">
                <div>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.18em] text-muted transition-colors duration-500 ease-out md:group-hover:text-white/50">
                        {category}
                    </p>
                    <h3 className="mt-3 font-heading text-2xl font-semibold text-ink transition-colors duration-500 ease-out md:group-hover:text-white">
                        {title}
                    </h3>
                </div>

                {/* always-visible affordance for the compact state; fades out once the reveal panel takes over on hover. */}
                <span className="absolute bottom-7 right-7 flex size-9 items-center justify-center rounded-none border border-line font-heading text-sm text-muted transition-opacity duration-300 ease-out md:group-hover:opacity-0">
                    →
                </span>

                {/* hover reveal — md+ only: summary, tags, CTA. 0fr -> 1fr grid-row trick animates height smoothly */}
                <div className="hidden md:grid md:grid-rows-[0fr] md:transition-[grid-template-rows] md:duration-500 md:ease-out md:group-hover:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                        <p className="mt-5 text-sm leading-relaxed text-white/70">{summary}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-none border border-white/20 px-2.5 py-1 text-xs text-white/60"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <span className="mt-6 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-white">
                            View project
                            <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                                →
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function FeaturedWork() {
    return (
        <section className="container-wide py-24 md:py-32">
            <FadeInWhenVisible>
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                            Selected work
                        </p>
                        <h2 className="mt-4 text-4xl font-bold md:text-5xl">Built and shipped.</h2>
                    </div>
                    <Link
                        href="/work"
                        className="font-heading text-sm font-semibold text-ink underline-offset-4 hover:underline"
                    >
                        All work →
                    </Link>
                </div>
            </FadeInWhenVisible>

            <StaggerList
                className="mt-14 grid gap-6 md:grid-cols-3"
                itemClassName="h-full"
                stagger={0.12}
            >
                {featuredCaseStudies.map((cs) => (
                    <WorkCard key={cs.slug} {...cs} />
                ))}
            </StaggerList>
        </section>
    );
}
