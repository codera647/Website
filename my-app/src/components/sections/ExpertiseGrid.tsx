import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";
import { services } from "@/data/services";

export default function ExpertiseGrid() {
    return (
        <section className="container-wide py-24 md:py-32">
            <FadeInWhenVisible>
                <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                    What we do
                </p>
                <h2 className="mt-4 max-w-lg text-4xl font-bold md:text-5xl">
                    Three disciplines, one team.
                </h2>
            </FadeInWhenVisible>

            <StaggerList className="mt-14 grid gap-6 md:grid-cols-3" stagger={0.12}>
                {services.map((service) => {
                    const isEnterpriseTrack = service.id === "ai-automation" || service.id === "generative-ai";

                    // The AI Automation / Generative AI tiles carry a second
                    // link (to /ai-engagements), so they can't be a single
                    // full-card <Link> like Web Development — nested anchors
                    // aren't valid HTML.
                    if (isEnterpriseTrack) {
                        return (
                            <div
                                key={service.id}
                                className="card-hover group flex h-full flex-col rounded-2xl border border-line bg-[#7a7a7c] p-8"
                            >
                                <Link href={`/services#${service.anchor}`} className="flex flex-1 flex-col">
                                    <h3 className="font-heading text-xl font-semibold">{service.title}</h3>
                                    <p className="mt-1 font-heading text-sm text-muted">{service.tagline}</p>
                                    <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                                        {service.description}
                                    </p>
                                    <span className="mt-6 font-heading text-sm font-medium text-ink">
                                        Explore{" "}
                                        <span className="inline-block transition-transform group-hover:translate-x-1.5">
                                            →
                                        </span>
                                    </span>
                                </Link>
                                <Link
                                    href="/ai-engagements"
                                    className="mt-4 border-t border-line pt-4 font-heading text-xs font-medium text-muted underline-offset-4 hover:text-ink hover:underline"
                                >
                                    Enterprise &amp; custom builds →
                                </Link>
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={service.id}
                            href={`/services#${service.anchor}`}
                            className="card-hover group flex h-full flex-col rounded-2xl border border-line bg-[#7a7a7c] p-8"
                        >
                            <h3 className="font-heading text-xl font-semibold">{service.title}</h3>
                            <p className="mt-1 font-heading text-sm text-muted">{service.tagline}</p>
                            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                                {service.description}
                            </p>
                            <span className="mt-6 font-heading text-sm font-medium text-ink">
                                Explore{" "}
                                <span className="inline-block transition-transform group-hover:translate-x-1.5">
                                    →
                                </span>
                            </span>
                        </Link>
                    );
                })}
            </StaggerList>

            {/* Momentum Systems Spotlight */}
            <FadeInWhenVisible delay={0.25} className="mt-6">
                <Link
                    href="/momentum-systems"
                    className="card-hover group flex flex-col justify-between rounded-2xl border border-line bg-surface p-8 transition-all hover:border-ink md:flex-row md:items-center md:p-10"
                >
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2.5">
                            <span className="font-heading text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                                04 · Packaged Growth System
                            </span>
                            <span className="rounded-full bg-ink px-2.5 py-0.5 font-heading text-[10px] font-bold text-white">
                                FOR GROWING BUSINESSES
                            </span>
                        </div>
                        <h3 className="mt-3 font-heading text-2xl font-bold text-ink md:text-3xl">
                            Momentum Systems
                        </h3>
                        <p className="mt-1 font-heading text-sm text-ink-soft">
                            Growth that runs on its own.
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-muted">
                            The same three disciplines, packaged as an all-in-one growth engine for service businesses. Combines customer portals, automated SMS/email follow-up, and programmatic local SEO into a system that keeps bringing customers back automatically.
                        </p>
                    </div>
                    <div className="mt-6 flex shrink-0 items-center gap-2 font-heading text-sm font-semibold text-ink md:mt-0">
                        <span className="rounded-none border border-line bg-[#7a7a7c] px-5 py-2.5 shadow-sm group-hover:border-ink">
                            Explore Momentum Systems →
                        </span>
                    </div>
                </Link>
            </FadeInWhenVisible>
        </section>
    );
}
