"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import TypingText from "@/components/motion/TypingText";

const NAME = "Abdul Moiz";
const ROLE = "Co-founder & CTO";
/** ⚠️ DRAFT intro — TODO(user): review wording. Sourced from CV. */
const INTRO =
    "Co-founder & CTO of Kinetiq — leads engineering across production-grade LLM, RAG, and agentic AI, from multi-tenant retrieval platforms to real-time computer vision and robotics.";

/**
 * Circular avatar in the navbar, before the wordmark. Hovering (or
 * tapping, for touch — hover alone doesn't work on mobile) opens a speech
 * -bubble card with a pointing needle back to the avatar: the box itself
 * is fixed-size (sized for this exact bio, not content-driven) so it
 * doesn't resize as the intro types in — only the text inside animates.
 */
export default function NavAvatar() {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button
                type="button"
                aria-label={`About ${NAME}`}
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                className="relative block size-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white/15 transition-all duration-300 hover:ring-white/45"
            >
                <Image
                    src="/team/abdul-moiz.png"
                    alt={NAME}
                    fill
                    sizes="36px"
                    className="object-cover"
                />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        role="status"
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-0 top-[calc(100%+26px)] z-50 h-56 w-80 rounded-2xl border border-white/10 bg-ink p-5 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.6)]"
                    >
                        {/* needle pointing back up at the avatar */}
                        <span
                            aria-hidden="true"
                            className="absolute -top-[7px] left-[11px] size-3.5 rotate-45 border-l border-t border-white/10 bg-ink"
                        />
                        <p className="font-heading text-base font-semibold text-white">
                            {NAME}
                        </p>
                        <p className="mt-0.5 font-heading text-xs text-white/45">{ROLE}</p>
                        <p className="mt-3 text-sm leading-relaxed text-white/70">
                            <TypingText text={INTRO} active={open} />
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
