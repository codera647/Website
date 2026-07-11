import Link from "next/link";
import Image from "next/image";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";
import { featuredCaseStudies } from "@/data/work";

export function WorkCard({
    slug,
    title,
    category,
    summary,
    thumbnail,
    tags,
}: {
    slug: string;
    title: string;
    category: string;
    summary: string;
    thumbnail: string;
    tags: string[];
}) {
    return (
        <Link href={`/work/${slug}`} className="group block">
            <div className="overflow-hidden rounded-2xl border border-line bg-white">
                {/* thumbnails are wide product/landing shots — near-native 2:1 crop */}
                <div className="relative aspect-[2/1] overflow-hidden bg-surface">
                    <Image
                        src={thumbnail}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                </div>
                <div className="p-6">
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.18em] text-muted">
                        {category}
                    </p>
                    <h3 className="mt-2 font-heading text-xl font-semibold group-hover:underline group-hover:underline-offset-4">
                        {title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full border border-line px-2.5 py-1 text-xs text-muted"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function FeaturedWork() {
    return (
        <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
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

            <StaggerList className="mt-14 grid gap-6 md:grid-cols-3" stagger={0.12}>
                {featuredCaseStudies.map((cs) => (
                    <WorkCard key={cs.slug} {...cs} />
                ))}
            </StaggerList>
        </section>
    );
}
