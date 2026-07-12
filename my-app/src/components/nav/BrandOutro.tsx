"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Dark brand band that closes out every page after the Footer — a giant
 * outlined "kinetiq" watermark. Two layered motions, both tied to scroll:
 * a one-shot reveal (fade + scale + slide up) that fires the moment the
 * user scrolls down far enough for the section to enter view, then a
 * continuous, subtle sideways drift for as long as it's on screen (fits
 * the "always in motion" tagline). Reference: agency-style oversized
 * wordmark footers.
 */
export default function BrandOutro() {
    const ref = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const x = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-6%", "6%"]);

    return (
        <section ref={ref} className="relative overflow-hidden bg-ink">
            <div className="flex justify-center py-14 md:py-20">
                <motion.p
                    aria-hidden="true"
                    style={{ x }}
                    initial={{ opacity: 0, y: reduced ? 0 : 40, scale: reduced ? 1 : 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    className="select-none whitespace-nowrap font-heading text-[20vw] font-bold leading-none tracking-tight text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.35)] md:text-[15vw]"
                >
                    kinetiq
                </motion.p>
            </div>

            <div className="relative border-t border-white/10">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 font-heading text-xs text-white/50">
                    <p>&copy; {new Date().getFullYear()} Kinetiq. All rights reserved.</p>
                    <p className="uppercase tracking-[0.28em] text-white/35">Always in motion</p>
                    <a href="#main" className="text-white/50 underline-offset-4 hover:text-white hover:underline">
                        Back to top
                    </a>
                </div>
            </div>
        </section>
    );
}
