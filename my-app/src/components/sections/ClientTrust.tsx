import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";
import Marquee from "@/components/motion/Marquee";
import { testimonials, testimonialSnippets } from "@/data/testimonials";

/** initials for the avatar badge, e.g. "Hammad Sarwar" -> "HS" */
function initials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

/** Social proof (brief §4 Home #6): fast marquee ticker → full testimonial cards. */
export default function ClientTrust() {
    return (
        <section className="bg-surface py-24 md:py-32">
            {/* fast snippet ticker */}
            <Marquee duration={22} className="border-y border-line bg-background py-4">
                {testimonialSnippets.map((snippet) => (
                    <span key={snippet} className="mx-8 font-heading text-sm text-muted">
                        {snippet}
                    </span>
                ))}
            </Marquee>

            <div className="mx-auto max-w-6xl px-6 pt-20">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        Client trust
                    </p>
                    <h2 className="mt-4 text-4xl font-bold md:text-5xl">
                        What clients are saying
                    </h2>
                </FadeInWhenVisible>

                <StaggerList
                    className="mt-14 grid gap-6 md:grid-cols-2"
                    itemClassName="h-full"
                    stagger={0.15}
                >
                    {testimonials.map((t) => (
                        <figure
                            key={t.name}
                            className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white p-8 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-ink hover:shadow-[0_32px_64px_-32px_rgba(17,17,19,0.35)] md:p-10"
                        >
                            <span
                                aria-hidden="true"
                                className="font-heading text-7xl leading-none text-line transition-colors duration-500 ease-out group-hover:text-ink/10"
                            >
                                &ldquo;
                            </span>
                            <blockquote className="-mt-5 flex-1 text-lg leading-relaxed text-ink-soft md:text-xl">
                                {t.quote}
                            </blockquote>
                            <figcaption className="mt-8 flex items-center gap-4 border-t border-line pt-6">
                                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink font-heading text-sm font-semibold text-white">
                                    {initials(t.name)}
                                </span>
                                <div>
                                    <p className="font-heading font-semibold">{t.name}</p>
                                    <p className="text-sm text-muted">
                                        {t.role}, {t.company}
                                    </p>
                                </div>
                            </figcaption>
                        </figure>
                    ))}
                </StaggerList>
            </div>
        </section>
    );
}
