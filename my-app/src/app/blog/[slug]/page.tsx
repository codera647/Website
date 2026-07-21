import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";
import BlogCard from "@/components/blog/BlogCard";
import RichText from "@/components/blog/RichText";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { blogPosts, getPostBySlug, getRelatedPosts } from "@/data/blog";
import { getBlogContent } from "@/lib/blog";

export function generateStaticParams() {
    return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return {};
    return {
        title: `${post.title} | Kinetiq Blog`,
        description: post.excerpt,
    };
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) notFound();

    const { blocks, resources } = getBlogContent(post.file);
    const related = getRelatedPosts(slug, 4);

    return (
        <main>
            {/* mobile-only back link — the desktop equivalent lives in the sidebar */}
            <div className="container-wide pt-32 md:hidden">
                <Link href="/blog" className="font-heading text-sm text-muted hover:text-ink">
                    ← All articles
                </Link>
            </div>

            <section className="container-wide pb-10 pt-6 md:pt-44">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        {post.category}
                    </p>
                    <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
                        {post.title}
                    </h1>
                    <span className="mt-6 inline-block rounded-full border border-line bg-surface px-4 py-1.5 font-heading text-sm font-medium text-ink-soft">
                        {formatDate(post.date)}
                    </span>
                </FadeInWhenVisible>
            </section>

            <section className="container-wide pb-24 md:pb-32">
                <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_340px] lg:gap-20">
                    {/* main content */}
                    <FadeInWhenVisible y={20} className="min-w-0">
                        <RichText blocks={blocks} />

                        {resources.length > 0 && (
                            <div className="mt-12 rounded-2xl border border-line bg-surface p-7 md:p-8">
                                <p className="font-heading text-xs font-medium uppercase tracking-[0.24em] text-muted">
                                    Resources &amp; further reading
                                </p>
                                <ul className="mt-4 space-y-3">
                                    {resources.map((resource) => (
                                        <li key={resource.url || resource.label}>
                                            {resource.url ? (
                                                <a
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-heading text-sm font-medium text-ink underline-offset-4 hover:underline"
                                                >
                                                    {resource.label} ↗
                                                </a>
                                            ) : (
                                                <span className="font-heading text-sm font-medium text-ink-soft">
                                                    {resource.label}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </FadeInWhenVisible>

                    {/* sidebar — back button + a stacked rail of other articles */}
                    <div className="min-w-0 space-y-6">
                        <FadeInWhenVisible delay={0.05}>
                            <Link
                                href="/blog"
                                className="block rounded-full border border-line px-5 py-3 text-center font-heading text-sm font-semibold text-ink transition-colors duration-300 hover:border-ink hover:bg-surface"
                            >
                                ‹ Back to blog
                            </Link>
                        </FadeInWhenVisible>

                        <StaggerList className="space-y-6" stagger={0.1} delay={0.1}>
                            {related.map((p) => (
                                <BlogCard key={p.slug} post={p} />
                            ))}
                        </StaggerList>
                    </div>
                </div>
            </section>

            <ClosingCTA />
        </main>
    );
}
