"use client";

import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import Counter from "@/components/motion/Counter";
import { services } from "@/data/services";
import type { Project } from "@/lib/data";

/**
 * Proof band — every number here is computed straight from the site's
 * own content (case studies + services), not hand-typed marketing
 * copy. Stats stay static on hover and tap.
 */

interface ProofStatData {
    to: number;
    label: string;
}

function buildStats(projects: Project[]): ProofStatData[] {
    const techStack = Array.from(new Set(services.flatMap((s) => s.stack)));

    return [
        {
            to: projects.length,
            label:
                projects.length === 1
                    ? "system shipped to production"
                    : "systems shipped to production",
        },
        {
            to: techStack.length,
            label: "technologies in active use",
        },
    ];
}

function ProofStat({ stat }: { stat: ProofStatData }) {
    return (
        <div className="w-full text-center">
            <Counter
                to={stat.to}
                className="font-heading text-5xl font-bold md:text-6xl"
            />
            <p className="mt-2 text-sm uppercase tracking-[0.14em] text-muted">
                {stat.label}
            </p>
        </div>
    );
}

export default function ProofBand({ projects }: { projects: Project[] }) {
    const stats = buildStats(projects);

    return (
        <section className="bg-surface">
            <FadeInWhenVisible>
                <div className="container-wide py-16 md:py-20">
                    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-16">
                        {stats.map((stat) => (
                            <ProofStat key={stat.label} stat={stat} />
                        ))}
                    </div>
                    <p className="mt-10 text-center text-xs text-muted/70">
                        Every figure above is read straight from our case studies.
                        Nothing is rounded up.
                    </p>
                </div>
            </FadeInWhenVisible>
        </section>
    );
}
