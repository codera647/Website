import type { Metadata } from "next";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";
import BlogCard from "@/components/blog/BlogCard";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { getAllPosts } from "@/data/blog";

export const metadata: Metadata = {
    title: "Blog | Kinetiq",
    description:
        "Notes on AI automation, robotics, computer vision, drones, and modern software engineering from the Kinetiq team.",
};

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <main>
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
