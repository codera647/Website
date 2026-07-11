import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";
import Marquee from "@/components/motion/Marquee";
import {
    testimonials,
    testimonialSnippets,
    clientNames,
} from "@/data/testimonials";

/** Two-layer social proof (brief §4 Home #6): fast marquee → full cards → logo wall. */
export default function ClientTrust() {
    return (
        <section className="bg-surface py-24 md:py-32">
            {/* layer 1: fast snippet ticker */}
            <Marquee duration={22} className="border-y border-line bg-background py-4">
                {testimonialSnippets.map((snippet) => (
                    <span key={snippet} className="mx-8 font-heading text-sm text-muted">
                        {snippet}
                    </span>
                ))}
            </Marquee>

            {/* layer 2: full testimonials */}
            <div className="mx-auto max-w-6xl px-6 pt-20">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        Client trust
                    </p>
                    <h2 className="mt-4 text-4xl font-bold md:text-5xl">
                        What clients are saying
                    </h2>
                </FadeInWhenVisible>

                <StaggerList className="mt-14 grid gap-6 md:grid-cols-2" stagger={0.15}>
                    {testimonials.map((t) => (
                        <figure
                            key={t.name}
                            className="flex h-full flex-col rounded-2xl border border-line bg-white p-8"
                        >
                            <blockquote className="flex-1 text-lg leading-relaxed text-ink-soft">
                                &ldquo;{t.quote}&rdquo;
                            </blockquote>
                            <figcaption className="mt-6 border-t border-line pt-5">
                                <p className="font-heading font-semibold">{t.name}</p>
                                <p className="text-sm text-muted">
                                    {t.role}, {t.company}
                                </p>
                            </figcaption>
                        </figure>
                    ))}
                </StaggerList>

                {/* logo wall — TODO(user): swap names for real client logos */}
                <FadeInWhenVisible delay={0.15}>
                    <p className="mt-20 text-center font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        Trusted by
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                        {clientNames.map((name) => (
                            <span
                                key={name}
                                className="font-heading text-lg font-semibold text-muted/60"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                </FadeInWhenVisible>
            </div>
        </section>
    );
}
