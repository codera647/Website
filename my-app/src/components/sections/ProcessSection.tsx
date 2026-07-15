import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";

/**
 * "How we work" — the four-step process section, shared by the About
 * and Services pages so the design stays identical in both places.
 * Cards use the site-standard .card-hover (lift + ink border + bottom
 * progress line) and equal heights via h-full. [DRAFT copy]
 */

const process = [
    {
        step: "Discover",
        text: "We start with your workflow rather than our tech stack, mapping where automation and intelligence will pay off before we write a line of code.",
    },
    {
        step: "Design",
        text: "Architecture sketches, honest trade-offs, and a scoped plan you can inspect. You know what's being built and why before we build it.",
    },
    {
        step: "Build",
        text: "Short iterations deliver working software at every step. Everything is tested, monitored, and demonstrated as it grows, with no surprises at the end.",
    },
    {
        step: "Run",
        text: "We ship to production and stay involved, providing observability, refinement, and support as the system meets real users and real data.",
    },
];

interface Props {
    /** headline under the "How we work" eyebrow */
    title?: string;
}

export default function ProcessSection({ title = "From first sketch to production." }: Props) {
    return (
        <section className="container-wide py-24 md:py-32">
            <FadeInWhenVisible>
                <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                    How we work
                </p>
                <h2 className="mt-4 max-w-lg text-4xl font-bold md:text-5xl">{title}</h2>
            </FadeInWhenVisible>
            <StaggerList
                className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                itemClassName="h-full"
                stagger={0.1}
            >
                {process.map((p, i) => (
                    <div
                        key={p.step}
                        className="card-hover group h-full rounded-2xl border border-line bg-white p-7"
                    >
                        <p className="font-heading text-4xl font-bold text-line transition-colors duration-300 group-hover:text-ink">
                            0{i + 1}
                        </p>
                        <h3 className="mt-4 font-heading text-lg font-semibold">{p.step}</h3>
                        <p className="mt-2.5 text-sm leading-relaxed text-muted">{p.text}</p>
                    </div>
                ))}
            </StaggerList>
        </section>
    );
}
