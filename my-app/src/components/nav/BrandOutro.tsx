"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Dark brand band that closes out every page after the Footer — a giant
 * ALL-CAPS "KINETIQ" spanning the full viewport width (CURA-footer
 * reference). Two effects:
 *
 * 1. Text doubling: layered offset copies behind each letter ("HEY! YOU"
 *    reference) — instead of neon cyan/magenta we extrude with the three
 *    brand motion-circle grays (#B5B5B5 → #888 → #555), so the doubling
 *    IS the logo's motion trail. Offsets are in em so they scale with
 *    the viewport-sized type.
 *
 * 2. Scroll reveal (video reference: assets/kinetiq-footer-text-animation
 *    .mp4): each letter is clipped by an overflow-hidden mask and slides
 *    up from below with a slight rotation, staggered left → right, the
 *    moment the band scrolls into view. Letters also lift on hover.
 */

const LETTERS = "KINETIQ".split("");

/** brand-gray doubling: exactly two offset layers, scales with font size */
const DOUBLING_SHADOW = "0.035em 0.035em 0 #B5B5B5, 0.07em 0.07em 0 #555555";

export default function BrandOutro() {
    const ref = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();

    /* in-view detection lives on the PARENT line (always visible) and the
       letters animate via variants. Putting whileInView on the letters
       themselves deadlocks: they start translated 115% down inside an
       overflow-hidden mask, so they're fully clipped, the observer never
       sees them enter view, and the reveal never fires. */
    const line = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.07, delayChildren: 0.1 },
        },
    };
    const letterVariant = reduced
        ? {
              hidden: { y: "0%", rotate: 0, opacity: 1 },
              visible: { y: "0%", rotate: 0, opacity: 1 },
          }
        : {
              hidden: { y: "115%", rotate: 8, opacity: 0.6 },
              visible: {
                  y: "0%",
                  rotate: 0,
                  opacity: 1,
                  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
              },
          };

    return (
        <section ref={ref} className="relative overflow-hidden bg-ink">
            <div className="px-3 pb-8 pt-14 md:px-5 md:pb-10 md:pt-20">
                <motion.p
                    aria-hidden="true"
                    className="flex w-full select-none items-end justify-between font-heading font-bold leading-none"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={line}
                >
                    {LETTERS.map((letter, i) => (
                        <span
                            key={i}
                            /* mask: clips the slide-up reveal from the top; padding
                               on the right/bottom keeps the extrusion shadow visible */
                            className="inline-block overflow-hidden pb-[0.14em] pr-[0.09em] pt-[0.06em] text-[16vw] leading-none"
                        >
                            <motion.span
                                className="inline-block cursor-default text-white"
                                style={{ textShadow: DOUBLING_SHADOW }}
                                variants={letterVariant}
                                whileHover={reduced ? undefined : { y: "-4%", transition: { duration: 0.25 } }}
                            >
                                {letter}
                            </motion.span>
                        </span>
                    ))}
                </motion.p>
            </div>

            <div className="relative border-t border-white/10">
                <div className="container-wide flex flex-wrap items-center justify-between gap-3 py-6 font-heading text-xs text-white/50">
                    <p>&copy; {new Date().getFullYear()} Kinetiq. All rights reserved.</p>
                    <p className="uppercase tracking-[0.28em] text-white/35">Always in motion</p>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/terms"
                            className="text-white/50 underline-offset-4 hover:text-white hover:underline"
                        >
                            Terms
                        </Link>
                        <span aria-hidden="true" className="h-3 w-px bg-white/15" />
                        <Link
                            href="/privacy"
                            className="text-white/50 underline-offset-4 hover:text-white hover:underline"
                        >
                            Privacy
                        </Link>
                        <span aria-hidden="true" className="h-3 w-px bg-white/15" />
                        <a href="#main" className="text-white/50 underline-offset-4 hover:text-white hover:underline">
                            Back to top
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
