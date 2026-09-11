"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getCalApi } from "@calcom/embed-react";

/**
 * Branded "which call do you want" modal — the single entry point for
 * every booking CTA sitewide. Buttons no longer carry `data-cal-link`
 * directly (that used to open Cal's popup straight away); instead they
 * dispatch this "open-call-modal" window event, this modal opens, and
 * only the two option cards inside it carry the real `data-cal-link`
 * attributes that trigger Cal.com's embed.
 */

const OPTIONS = [
    {
        calLink: "kinetiq-solutions/30min",
        duration: "30 min",
        title: "Services Overview",
        description: "New here? A quick walkthrough of what we do and whether we're a fit.",
    },
    {
        calLink: "kinetiq-solutions/project-discussion",
        duration: "60 min",
        title: "Project Discussion",
        description: "Have a specific project in mind? A deeper session to scope it out.",
    },
];

export default function CallTypeModal() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        (async () => {
            const cal = await getCalApi();
            cal("ui", {
                styles: { branding: { brandColor: "#111113" } },
                hideEventTypeDetails: false,
                layout: "month_view",
            });
        })();
    }, []);

    useEffect(() => {
        const onOpen = () => setOpen(true);
        window.addEventListener("open-call-modal", onOpen);
        return () => window.removeEventListener("open-call-modal", onOpen);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Choose a call type"
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 backdrop-blur-sm px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setOpen(false)}
                >
                    <motion.div
                        className="w-full max-w-lg rounded-2xl border border-background/10 bg-ink p-6 shadow-2xl md:p-8"
                        initial={{ opacity: 0, y: 16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="font-heading text-xs font-medium uppercase tracking-[0.24em] text-background/45">
                                    Book a call
                                </p>
                                <h2 className="mt-2 font-heading text-2xl font-bold text-background">
                                    What do you want to talk through?
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close"
                                className="shrink-0 rounded-full border border-background/15 p-1.5 text-background/60 transition-colors hover:border-background/40 hover:text-background"
                            >
                                <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
                                    <path d="M4.3 4.3a1 1 0 0 1 1.4 0L10 8.6l4.3-4.3a1 1 0 1 1 1.4 1.4L11.4 10l4.3 4.3a1 1 0 0 1-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 0 1-1.4-1.4L8.6 10 4.3 5.7a1 1 0 0 1 0-1.4Z" />
                                </svg>
                            </button>
                        </div>

                        <div className="mt-6 space-y-3">
                            {OPTIONS.map((opt) => (
                                <button
                                    key={opt.calLink}
                                    type="button"
                                    data-cal-link={opt.calLink}
                                    onClick={() => setOpen(false)}
                                    className="group flex w-full items-center justify-between gap-4 rounded-xl border border-background/10 bg-background/[0.04] p-5 text-left transition-all duration-300 hover:border-background/30 hover:bg-background/[0.08] hover:-translate-y-0.5 cursor-pointer"
                                >
                                    <div>
                                        <p className="font-heading text-[11px] font-bold uppercase tracking-wider text-background/45">
                                            {opt.duration}
                                        </p>
                                        <p className="mt-1.5 font-heading text-lg font-semibold text-background">
                                            {opt.title}
                                        </p>
                                        <p className="mt-1.5 text-sm leading-relaxed text-background/60">
                                            {opt.description}
                                        </p>
                                    </div>
                                    <span className="shrink-0 font-heading text-xl text-background/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-background">
                                        →
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
