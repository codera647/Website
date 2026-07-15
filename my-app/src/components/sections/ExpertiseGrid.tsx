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
                {services.map((service) => (
                    <Link
                        key={service.id}
                        href={`/services#${service.anchor}`}
                        className="card-hover group flex h-full flex-col rounded-2xl border border-line bg-white p-8"
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
                ))}
            </StaggerList>
        </section>
    );
}
