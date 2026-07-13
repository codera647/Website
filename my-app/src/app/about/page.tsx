import type { Metadata } from "next";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";
import ProofBand from "@/components/sections/ProofBand";
import FounderSection from "@/components/sections/FounderSection";
import ClosingCTA from "@/components/sections/ClosingCTA";

export const metadata: Metadata = {
    title: "About — Kinetiq",
    description:
        "Kinetiq is a software house building intelligent systems — agentic AI, automation, and modern engineering guided by practical problem-solving.",
};

/** Story copy is REAL (from the previous site). Values + process are DRAFT — TODO(user): review. */
const values = [
    {
        title: "Practical over flashy",
        text: "Innovation guided by real problem-solving — we build what pays off in production, not what demos well.",
    },
    {
        title: "Engineering rigor",
        text: "AI systems held to the same standard as any production software: tested, monitored, documented.",
    },
    {
        title: "Transparency",
        text: "Honest demos, plain-language explanations, and architecture you can inspect. No black boxes.",
    },
    {
        title: "Always in motion",
        text: "Continuous experimentation keeps us — and the systems we ship — ready for what's next.",
    },
];

/** How an engagement actually runs, start to finish. [DRAFT] */
const process = [
    {
        step: "Discover",
        text: "We start with your workflow, not our tech stack — mapping where automation and intelligence actually pay off before writing a line of code.",
    },
    {
        step: "Design",
        text: "Architecture sketches, honest trade-offs, and a scoped plan you can inspect. You know what's being built and why before we build it.",
    },
    {
        step: "Build",
        text: "Short iterations with working software at every step — tested, monitored, and demoed as it grows, never a black-box reveal at the end.",
    },
    {
        step: "Run",
        text: "We ship to production and stay: observability, refinements, and support as the system meets real users and real data.",
    },
];

export default function AboutPage() {
    return (
        <main>
            <section className="container-wide pb-16 pt-36 md:pt-44">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        About
                    </p>
                    <h1 className="mt-4 max-w-2xl text-5xl font-bold md:text-6xl">
                        A studio built around one idea.
                    </h1>
                </FadeInWhenVisible>
            </section>

            <section className="container-wide pb-20">
                <div className="grid gap-10 md:grid-cols-[220px_1fr]">
                    <FadeInWhenVisible>
                        <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                            Our story
                        </p>
                    </FadeInWhenVisible>
                    <div className="max-w-2xl space-y-6">
                        <FadeInWhenVisible>
                            <p className="text-xl leading-relaxed text-ink-soft md:text-2xl">
                                At Kinetiq, we build intelligent systems that create real impact.
                                Sitting at the intersection of agentic AI, automation, and modern
                                engineering, our innovation is guided by practical problem-solving.
                            </p>
                        </FadeInWhenVisible>
                        <FadeInWhenVisible delay={0.1}>
                            <p className="text-lg leading-relaxed text-muted">
                                We design scalable, purpose-built solutions that integrate seamlessly
                                into workflows. By combining thoughtful engineering with continuous
                                experimentation, we deliver reliable technology that helps
                                organizations operate smarter and stay ready for what&apos;s next.
                            </p>
                        </FadeInWhenVisible>
                        <FadeInWhenVisible delay={0.2}>
                            <p className="text-lg leading-relaxed text-muted">
                                We stay deliberately small. Every project gets senior engineers who
                                own the work end to end — from the first architecture sketch to
                                production monitoring — because intelligent systems fail in the
                                details, and details need owners. {/* [DRAFT] */}
                            </p>
                        </FadeInWhenVisible>
                    </div>
                </div>
            </section>

            <ProofBand />

            {/* how we work */}
            <section className="container-wide py-24 md:py-32">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        How we work
                    </p>
                    <h2 className="mt-4 max-w-lg text-4xl font-bold md:text-5xl">
                        From first sketch to production.
                    </h2>
                </FadeInWhenVisible>
                <StaggerList className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
                    {process.map((p, i) => (
                        <div
                            key={p.step}
                            className="group relative h-full overflow-hidden rounded-2xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-ink hover:shadow-[0_20px_48px_-24px_rgba(0,0,0,0.35)]"
                        >
                            <p className="font-heading text-4xl font-bold text-line transition-colors duration-300 group-hover:text-ink">
                                0{i + 1}
                            </p>
                            <h3 className="mt-4 font-heading text-lg font-semibold">{p.step}</h3>
                            <p className="mt-2.5 text-sm leading-relaxed text-muted">{p.text}</p>
                            {/* progress line along the bottom on hover */}
                            <span
                                aria-hidden="true"
                                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-ink transition-transform duration-500 ease-out group-hover:scale-x-100"
                            />
                        </div>
                    ))}
                </StaggerList>
            </section>

            {/* values */}
            <section className="container-wide pb-24 md:pb-32">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        Values
                    </p>
                    <h2 className="mt-4 text-4xl font-bold md:text-5xl">How we think.</h2>
                </FadeInWhenVisible>
                <StaggerList className="mt-14 grid gap-6 sm:grid-cols-2" stagger={0.12}>
                    {values.map((v, i) => (
                        <div
                            key={v.title}
                            className="group rounded-2xl border border-line bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-ink hover:shadow-[0_20px_48px_-24px_rgba(0,0,0,0.35)]"
                        >
                            <p className="font-heading text-sm font-semibold text-muted transition-colors duration-300 group-hover:text-ink">
                                0{i + 1}
                            </p>
                            <h3 className="mt-3 font-heading text-xl font-semibold">{v.title}</h3>
                            <p className="mt-3 leading-relaxed text-muted">{v.text}</p>
                        </div>
                    ))}
                </StaggerList>
            </section>

            <FounderSection />

            <ClosingCTA />
        </main>
    );
}
