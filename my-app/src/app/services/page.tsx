import type { Metadata } from "next";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";
import ServiceDemoBlock from "@/components/sections/ServiceDemoBlock";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { services, process } from "@/data/services";

export const metadata: Metadata = {
    title: "Services — Kinetiq",
    description:
        "AI automation, web development, and generative AI — designed, built, and shipped by Kinetiq.",
};

export default function ServicesPage() {
    return (
        <main>
            {/* intro */}
            <section className="mx-auto max-w-6xl px-6 pb-10 pt-36 md:pt-44">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        Services
                    </p>
                    <h1 className="mt-4 max-w-2xl text-5xl font-bold md:text-6xl">
                        What we build.
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                        Three disciplines, one standard: production-grade systems that hold up
                        in the real world — shown below actually working, not just described.
                    </p>
                </FadeInWhenVisible>
            </section>

            {/* the three services, alternating layout */}
            {services.map((service, i) => (
                <section
                    key={service.id}
                    id={service.anchor}
                    className={`scroll-mt-28 ${i % 2 === 1 ? "bg-surface" : ""}`}
                >
                    <div
                        className={`mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-2 ${
                            i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                        }`}
                    >
                        <FadeInWhenVisible>
                            <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                                0{i + 1} — {service.tagline}
                            </p>
                            <h2 className="mt-4 text-4xl font-bold md:text-5xl">{service.title}</h2>
                            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
                                {service.description}
                            </p>
                            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {service.capabilities.map((cap) => (
                                    <li key={cap} className="flex items-center gap-2.5 font-heading text-sm font-medium">
                                        <span className="size-1.5 rounded-full bg-ink" />
                                        {cap}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 flex flex-wrap gap-2">
                                {service.stack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="rounded-full border border-line bg-white px-3 py-1 text-xs text-muted"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </FadeInWhenVisible>

                        <FadeInWhenVisible delay={0.15} y={32}>
                            <ServiceDemoBlock service={service} />
                        </FadeInWhenVisible>
                    </div>
                </section>
            ))}

            {/* how we work */}
            <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        How we work
                    </p>
                    <h2 className="mt-4 text-4xl font-bold md:text-5xl">
                        Four steps, no surprises.
                    </h2>
                </FadeInWhenVisible>
                <StaggerList className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.12}>
                    {process.map((p) => (
                        <div key={p.step} className="rounded-2xl border border-line bg-white p-7">
                            <p className="font-heading text-sm font-semibold text-muted">{p.step}</p>
                            <h3 className="mt-3 font-heading text-xl font-semibold">{p.title}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-muted">{p.text}</p>
                        </div>
                    ))}
                </StaggerList>
            </section>

            <ClosingCTA />
        </main>
    );
}
