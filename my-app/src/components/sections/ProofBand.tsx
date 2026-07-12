"use client";

import { useState } from "react";
import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import Counter from "@/components/motion/Counter";
import { caseStudies } from "@/data/work";
import { services } from "@/data/services";

/**
 * Proof band — every number here is computed straight from the site's
 * own content (case studies + services), not hand-typed marketing
 * copy. If a stat is wrong, the source data is wrong, and fixing the
 * data fixes the claim. Each stat is interactive: hover (or tap, for
 * touch) reveals exactly which systems/clients/tools back the number.
 */

interface ProofItem {
    text: string;
    sub?: string;
    href?: string;
}

interface ProofStatData {
    to: number;
    label: string;
    proofLabel: string;
    layout: "list" | "chips";
    proof: ProofItem[];
}

const techStack = Array.from(new Set(services.flatMap((s) => s.stack)));
const quotedCaseStudies = caseStudies.filter((cs) => cs.quote);

const stats: ProofStatData[] = [
    {
        to: caseStudies.length,
        label:
            caseStudies.length === 1
                ? "system shipped to production"
                : "systems shipped to production",
        proofLabel: "the systems",
        layout: "list",
        proof: caseStudies.map((cs) => ({
            text: cs.title,
            sub: cs.category,
            href: `/work/${cs.slug}`,
        })),
    },
    {
        to: quotedCaseStudies.length,
        label:
            quotedCaseStudies.length === 1
                ? "client testimonial on record"
                : "client testimonials on record",
        proofLabel: "the clients",
        layout: "list",
        proof: quotedCaseStudies.map((cs) => ({
            text: cs.quote!.name,
            sub: cs.quote!.role,
            href: `/work/${cs.slug}`,
        })),
    },
    {
        to: techStack.length,
        label: "technologies in active use",
        proofLabel: "the stack",
        layout: "chips",
        proof: techStack.map((tech) => ({ text: tech })),
    },
];

function ProofStat({ stat }: { stat: ProofStatData }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className="group w-full text-center"
            >
                <Counter
                    to={stat.to}
                    className="font-heading text-5xl font-bold md:text-6xl"
                />
                <p className="mt-2 text-sm uppercase tracking-[0.14em] text-muted">
                    {stat.label}
                </p>
                <span
                    className={`mt-3 inline-flex items-center gap-1 text-xs font-medium transition-colors group-hover:text-ink ${
                        open ? "text-ink" : "text-muted/70"
                    }`}
                >
                    see {stat.proofLabel}
                    <span
                        aria-hidden="true"
                        className={`inline-block transition-transform duration-300 ${
                            open ? "rotate-180" : ""
                        }`}
                    >
                        &#8595;
                    </span>
                </span>
            </button>

            <div
                className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
            >
                <div className="overflow-hidden">
                    {stat.layout === "list" ? (
                        <ul className="mx-auto mt-5 flex w-full max-w-[280px] flex-col gap-2">
                            {stat.proof.map((item) => (
                                <li key={item.text}>
                                    <Link
                                        href={item.href ?? "#"}
                                        className="flex h-12 items-center justify-between gap-3 rounded-full border border-line bg-white px-4 text-left transition-colors hover:border-ink hover:shadow-[0_8px_20px_-12px_rgba(17,17,19,0.25)]"
                                    >
                                        <span className="min-w-0 truncate font-heading text-sm font-semibold text-ink">
                                            {item.text}
                                        </span>
                                        {item.sub && (
                                            <span className="shrink-0 text-xs text-muted">
                                                {item.sub}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <ul className="mx-auto mt-5 flex max-w-xs flex-wrap justify-center gap-2">
                            {stat.proof.map((item) => (
                                <li
                                    key={item.text}
                                    className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-ink-soft"
                                >
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProofBand() {
    return (
        <section className="bg-surface">
            <FadeInWhenVisible>
                <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-10">
                        {stats.map((stat) => (
                            <ProofStat key={stat.label} stat={stat} />
                        ))}
                    </div>
                    <p className="mt-10 text-center text-xs text-muted/70">
                        Every figure above is read straight from our case studies —
                        nothing rounded up.
                    </p>
                </div>
            </FadeInWhenVisible>
        </section>
    );
}
