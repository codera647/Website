"use client";

import { useEffect, useState } from "react";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import LegalRichText from "./LegalRichText";
import type { LegalSection } from "@/data/legal";

interface Props {
    eyebrow: string;
    title: string;
    intro: string;
    lastUpdated: string;
    sections: LegalSection[];
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

/**
 * Shared shell for /terms and /privacy: a hero, a reading-progress hairline
 * under the nav, section prose on the left, and a sticky scrollspy table of
 * contents on the right that highlights and smooth-scrolls to whichever
 * section is currently on screen. Kept intentionally free of accordions —
 * hiding clauses behind a click cuts against the point of a legal document,
 * so every word is visible by default; the interactivity here is entirely
 * about helping you navigate a long page, not about concealing content.
 */
export default function LegalPage({ eyebrow, title, intro, lastUpdated, sections }: Props) {
    const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const headings = sections
            .map((s) => document.getElementById(s.id))
            .filter((el): el is HTMLElement => el !== null);

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((entry) => entry.isIntersecting);
                if (visible.length === 0) return;
                const topMost = visible.reduce((a, b) =>
                    a.boundingClientRect.top < b.boundingClientRect.top ? a : b
                );
                setActiveId(topMost.target.id);
            },
            { rootMargin: "-15% 0px -70% 0px", threshold: [0, 1] }
        );
        headings.forEach((el) => observer.observe(el));

        const onScroll = () => {
            const doc = document.documentElement;
            const total = doc.scrollHeight - doc.clientHeight;
            setProgress(total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", onScroll);
        };
    }, [sections]);

    return (
        <main>
            {/* reading progress hairline, pinned just under the fixed nav */}
            <div
                aria-hidden="true"
                className="fixed inset-x-0 top-[72px] z-30 h-[2px] bg-line/60"
            >
                <div
                    className="h-full bg-ink transition-[width] duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <section className="container-wide pb-14 pt-32 md:pb-20 md:pt-44">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted">
                        {eyebrow}
                    </p>
                    <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight md:text-6xl">
                        {title}
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>
                    <span className="mt-6 inline-block rounded-full border border-line bg-surface px-4 py-1.5 font-heading text-sm font-medium text-ink-soft">
                        Last updated {formatDate(lastUpdated)}
                    </span>
                </FadeInWhenVisible>
            </section>

            <section className="container-wide pb-24 md:pb-32">
                <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_280px] lg:gap-20">
                    {/* section prose */}
                    <div className="min-w-0 space-y-14">
                        {sections.map((section) => (
                            <FadeInWhenVisible key={section.id} y={16}>
                                <div id={section.id} className="scroll-mt-28">
                                    <h2 className="font-heading text-2xl font-bold leading-snug text-ink md:text-3xl">
                                        {section.title}
                                    </h2>
                                    <div className="mt-4">
                                        <LegalRichText blocks={section.blocks} />
                                    </div>
                                </div>
                            </FadeInWhenVisible>
                        ))}
                    </div>

                    {/* sticky scrollspy table of contents */}
                    <aside className="hidden min-w-0 md:block">
                        <div className="sticky top-28">
                            <p className="font-heading text-xs font-medium uppercase tracking-[0.24em] text-muted">
                                On this page
                            </p>
                            <nav className="mt-4 max-h-[58vh] overflow-y-auto border-l border-line pr-2">
                                {sections.map((section) => {
                                    const active = section.id === activeId;
                                    return (
                                        <a
                                            key={section.id}
                                            href={`#${section.id}`}
                                            className={`-ml-px block border-l-2 py-1.5 pl-4 font-heading text-sm leading-snug transition-colors duration-200 ${
                                                active
                                                    ? "border-ink font-semibold text-ink"
                                                    : "border-transparent text-muted hover:text-ink-soft"
                                            }`}
                                        >
                                            {section.title}
                                        </a>
                                    );
                                })}
                            </nav>
                            <a
                                href="#main"
                                className="mt-6 inline-flex items-center gap-1.5 font-heading text-sm font-medium text-muted transition-colors hover:text-ink"
                            >
                                <span aria-hidden="true">↑</span> Back to top
                            </a>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}
