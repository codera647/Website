"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import TypingText from "@/components/motion/TypingText";

/**
 * "Who's behind Kinetiq" — the personal touch that used to live in the
 * navbar avatar bubble, promoted to a full section on the About page.
 * ⚠️ Bio copy is DRAFT (sourced from CV) — TODO(user): review wording.
 */

const NAME = "Abdul Moiz";
const ROLE = "Co-founder & CTO";
const INTRO =
    "Leads engineering across production-grade LLM, RAG, and agentic AI, from multi-tenant retrieval platforms to real-time computer vision and robotics.";
const BIO_EXTENDED =
    "Kinetiq began with a simple observation: plenty of AI demos well, and far less of it survives production. Abdul builds the kind that survives. Every system ships with tests, monitoring, and documentation, delivered by a small team that stays hands-on from the first architecture sketch to the final deploy.";

const FOCUS_AREAS = [
    "LLM & RAG systems",
    "Agentic AI",
    "Computer vision",
    "Robotics",
    "Full-stack engineering",
];

export default function FounderSection() {
    const [inView, setInView] = useState(false);

    return (
        <section className="bg-ink">
            <div className="container-wide py-24 md:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                    onViewportEnter={() => setInView(true)}
                >
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-white/45">
                        The person behind it
                    </p>
                    <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
                        Built by an engineer, not a sales deck.
                    </h2>
                </motion.div>

                <div className="mt-14 grid items-start gap-12 md:grid-cols-[320px_1fr]">
                    {/* portrait */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="group relative mx-auto w-full max-w-[320px]"
                    >
                        <div className="relative aspect-square overflow-hidden rounded-3xl ring-1 ring-white/15 transition-all duration-500 group-hover:ring-white/40">
                            <Image
                                src="/team/abdul-moiz.png"
                                alt={NAME}
                                fill
                                sizes="(max-width: 768px) 90vw, 320px"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                            />
                        </div>
                        {/* brand dots echo under the portrait */}
                        <div
                            aria-hidden="true"
                            className="mt-5 flex items-center justify-center gap-2"
                        >
                            {["#B5B5B5", "#888888", "#555555"].map((color, i) => (
                                <motion.span
                                    key={color}
                                    className="size-2 rounded-full"
                                    style={{ backgroundColor: color }}
                                    animate={{ opacity: [0.35, 1, 0.35] }}
                                    transition={{
                                        duration: 1.8,
                                        repeat: Infinity,
                                        delay: i * 0.25,
                                        ease: "easeInOut",
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* bio */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        <p className="font-heading text-2xl font-semibold text-white md:text-3xl">
                            {NAME}
                        </p>
                        <p className="mt-1 font-heading text-sm text-white/45">{ROLE}</p>

                        <p className="mt-6 min-h-[3.5rem] text-lg leading-relaxed text-white/80">
                            <TypingText text={INTRO} active={inView} />
                        </p>
                        <p className="mt-5 leading-relaxed text-white/60">{BIO_EXTENDED}</p>

                        <div className="mt-8 flex flex-wrap gap-2.5">
                            {FOCUS_AREAS.map((area) => (
                                <span
                                    key={area}
                                    className="rounded-none border border-white/15 px-4 py-1.5 font-heading text-xs font-medium text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white hover:text-ink"
                                >
                                    {area}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
