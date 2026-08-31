import type { Metadata } from "next";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";
import BlogCard from "@/components/blog/BlogCard";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { getAllBlogPosts } from "@/lib/data";

export const metadata: Metadata = {
    title: "Insights, AI Architectures & Technical Blog | Kinetiq",
    description:
        "Deep-dive technical articles on agentic AI workflows, Next.js 15 architectures, RAG systems, and business automation by the Kinetiq engineering team.",
    keywords: [
        "Kinetiq Blog",
        "AI Engineering Articles",
        "Agentic AI Architecture",
        "RAG Pipeline Best Practices",
        "Next.js Development Insights",
        "Programmatic SEO Guides",
    ],
    alternates: {
        canonical: "/blog",
    },
    openGraph: {
        title: "Insights, AI Architectures & Technical Blog | Kinetiq",
        description:
            "Deep-dive technical articles on agentic AI workflows, Next.js architectures, and automation by the Kinetiq engineering team.",
        url: "https://thekinetiq.solutions/blog",
        siteName: "Kinetiq",
        type: "website",
    },
};

export default async function BlogPage() {
    const posts = await getAllBlogPosts();

    const blogSchema = {
        "@context": "https://schema.org",
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
                name: "Blog",
                item: "https://thekinetiq.solutions/blog",
            },
        ],
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
            />
            <section className="container-wide pb-10 pt-36 md:pt-44">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        Blog
                    </p>
                    <h1 className="mt-4 max-w-2xl text-5xl font-bold md:text-6xl">
                        Ideas in motion.
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                        Notes on AI automation, robotics, computer vision, drones, and
                        modern software engineering — from the systems we&apos;re
                        building and the fields we&apos;re watching.
                    </p>
                </FadeInWhenVisible>
            </section>

            <section className="container-wide pb-24 pt-6 md:pb-32">
                <FadeInWhenVisible delay={0.1}>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.24em] text-muted">
                        {posts.length} {posts.length === 1 ? "Article" : "Articles"}
                    </p>
                </FadeInWhenVisible>

                <StaggerList
                    className="mt-8 grid gap-6 md:grid-cols-3"
                    itemClassName="h-full"
                    stagger={0.08}
                >
                    {posts.map((post) => (
                        <BlogCard key={post.slug} post={post} />
                    ))}
                </StaggerList>
            </section>

            <ClosingCTA />
        </main>
    );
}
