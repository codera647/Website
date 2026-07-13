import type { Metadata } from "next";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";
import { WorkCard } from "@/components/sections/FeaturedWork";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { caseStudies } from "@/data/work";

export const metadata: Metadata = {
    title: "Work — Kinetiq",
    description: "Selected projects designed, built, and shipped by Kinetiq.",
};

export default function WorkPage() {
    return (
        <main>
            <section className="container-wide pb-10 pt-36 md:pt-44">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        Work
                    </p>
                    <h1 className="mt-4 max-w-2xl text-5xl font-bold md:text-6xl">
                        Built and shipped.
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                        A selection of systems in production — across AI automation, web
                        platforms, and generative AI.
                    </p>
                </FadeInWhenVisible>
            </section>

            <section className="container-wide pb-24 pt-10 md:pb-32">
                <StaggerList
                    className="grid gap-6 transition-[padding-bottom] duration-500 ease-out md:grid-cols-2 md:has-[:hover]:pb-64 lg:grid-cols-3"
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
