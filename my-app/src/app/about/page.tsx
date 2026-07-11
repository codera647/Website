import type { Metadata } from "next";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";
import ProofBand from "@/components/sections/ProofBand";
import ClosingCTA from "@/components/sections/ClosingCTA";

export const metadata: Metadata = {
    title: "About — Kinetiq",
    description:
        "Kinetiq is a software house building intelligent systems — agentic AI, automation, and modern engineering guided by practical problem-solving.",
};

/** Story copy is REAL (from the previous site). Values are DRAFT — TODO(user): review. */
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

export default function AboutPage() {
    return (
        <main>
            <section className="mx-auto max-w-6xl px-6 pb-16 pt-36 md:pt-44">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        About
                    </p>
                    <h1 className="mt-4 max-w-2xl text-5xl font-bold md:text-6xl">
                        A studio built around one idea.
                    </h1>
                </FadeInWhenVisible>
            </section>

            <section className="mx-auto max-w-6xl px-6 pb-20">
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
                    </div>
                </div>
            </section>

            <ProofBand />

            <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        Values
                    </p>
                    <h2 className="mt-4 text-4xl font-bold md:text-5xl">How we think.</h2>
                </FadeInWhenVisible>
                <StaggerList className="mt-14 grid gap-6 sm:grid-cols-2" stagger={0.12}>
                    {values.map((v, i) => (
                        <div key={v.title} className="rounded-2xl border border-line bg-white p-8">
                            <p className="font-heading text-sm font-semibold text-muted">0{i + 1}</p>
                            <h3 className="mt-3 font-heading text-xl font-semibold">{v.title}</h3>
                            <p className="mt-3 leading-relaxed text-muted">{v.text}</p>
                        </div>
                    ))}
                </StaggerList>
            </section>

            <ClosingCTA />
        </main>
    );
}
