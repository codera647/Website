"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import DemoLoop from "@/components/motion/DemoLoop";

/** ⚠️ DRAFT copy (brief §4 Home #1) */
const HEADLINE = "We engineer intelligent systems.";
const SUBHEAD =
    "An AI automation, web development, and generative AI studio building the software that powers what's next.";

/** small animated "ops console" mockup as the hero visual */
function HeroConsole() {
    const rows = [
        { text: "Agent — triaging inbound requests", status: "running" },
        { text: "Pipeline — invoices → ledger", status: "done" },
        { text: "RAG — indexing 1,240 documents", status: "running" },
        { text: "Deploy — production release", status: "done" },
    ];
    return (
        <div className="space-y-2.5 p-5">
            {rows.map((row, i) => (
                <motion.div
                    key={row.text}
                    className="flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 + i * 0.18 }}
                >
                    <motion.span
                        className={`size-2 shrink-0 rounded-full ${row.status === "done" ? "bg-ink" : "bg-muted"}`}
                        animate={row.status === "running" ? { opacity: [1, 0.3, 1] } : undefined}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span className="min-w-0 truncate font-heading text-sm text-ink-soft">{row.text}</span>
                    <span
                        className={`ml-auto shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            row.status === "done"
                                ? "bg-ink text-white"
                                : "border border-line text-muted"
                        }`}
                    >
                        {row.status}
                    </span>
                </motion.div>
            ))}
        </div>
    );
}

export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 pb-24 pt-36 lg:grid-cols-[1.1fr_1fr] lg:pt-44">
                <div className="min-w-0">
                    <motion.p
                        className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-muted"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Kinetiq
                    </motion.p>
                    {/* deliberately NOT animated: this is the LCP element — it must
                        paint immediately, everything around it moves instead */}
                    <h1 className="mt-5 max-w-xl text-5xl font-bold leading-[1.05] md:text-6xl">
                        {HEADLINE}
                    </h1>
                    <motion.p
                        className="mt-6 max-w-md text-lg leading-relaxed text-muted"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.45 }}
                    >
                        {SUBHEAD}
                    </motion.p>
                    <motion.div
                        className="mt-9 flex flex-wrap items-center gap-4"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Link
                            href="/contact"
                            className="rounded-full bg-ink px-7 py-3.5 font-heading text-sm font-semibold text-white transition-colors hover:bg-ink-soft"
                        >
                            Let&apos;s talk
                        </Link>
                        <Link
                            href="/work"
                            className="rounded-full border border-line px-7 py-3.5 font-heading text-sm font-semibold text-ink transition-colors hover:border-ink"
                        >
                            See our work
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    className="relative min-w-0"
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                    <DemoLoop label="kinetiq — systems console">
                        <HeroConsole />
                    </DemoLoop>
                </motion.div>
            </div>
        </section>
    );
}
