"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Site-wide loading / page-transition overlay.
 *
 * Modeled on the reference clip in public/refrence_video.mp4 (an agency
 * site's route-change transition): a full-screen panel snaps in instantly,
 * a centered brand mark draws itself in, holds for a beat, then the whole
 * panel slides down and off-screen — revealing the new page from the top
 * down as it goes, with a bright hairline riding the wipe boundary.
 *
 * Recolored to Kinetiq's monochrome palette (ink panel, white mark) and
 * built from our own brand motif — the overlapping "motion trail" of
 * circles that fades from faint to solid, already used in the Hero
 * wordmark's animated dots and public/Kinetiq - 1.png — rather than
 * tracing the reference's own logo.
 *
 * Runs once as a boot/loading sequence on first paint (the `visible`
 * state below defaults to true so the very first server-rendered frame
 * is already covered — no flash of unstyled content), then replays a
 * quicker version every time the route (pathname) changes.
 *
 * This is purely decorative timing, not a real navigation gate: Next's
 * App Router has already swapped in the new route's content underneath
 * by the time we reveal it, same as the reference (its "loading" beat is
 * branding flair, not an actual network wait).
 */

const DRAW_MS = 650;
const NAV_HOLD_MS = 250;
const BOOT_HOLD_MS = 500;
const EXIT_MS = 700;

const TRAIL_OPACITIES = [0.12, 0.26, 0.44, 0.68, 1];

export default function RouteTransitionOverlay() {
    const pathname = usePathname();
    const prefersReducedMotion = useReducedMotion();

    // Default to covering — this is the value used for the very first
    // server-rendered paint, so there's nothing to flash before it appears.
    const [visible, setVisible] = useState(true);
    const [drawn, setDrawn] = useState(false);

    const isBoot = useRef(true);
    const prevPathname = useRef(pathname);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        const clearTimers = () => {
            timers.current.forEach(clearTimeout);
            timers.current = [];
        };

        if (prefersReducedMotion) {
            clearTimers();
            setVisible(false);
            return clearTimers;
        }

        const runCycle = (holdMs: number) => {
            clearTimers();
            setVisible(true);
            setDrawn(false);
            timers.current.push(setTimeout(() => setDrawn(true), 60));
            timers.current.push(
                setTimeout(() => setVisible(false), 60 + DRAW_MS + holdMs)
            );
        };

        if (isBoot.current) {
            isBoot.current = false;
            runCycle(BOOT_HOLD_MS);
            return clearTimers;
        }

        if (prevPathname.current !== pathname) {
            prevPathname.current = pathname;
            runCycle(NAV_HOLD_MS);
        }

        return clearTimers;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, prefersReducedMotion]);

    if (prefersReducedMotion) return null;

    return (
        <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ink"
            initial={false}
            animate={{ y: visible ? "0%" : "100%" }}
            transition={
                visible
                    ? { duration: 0 }
                    : { duration: EXIT_MS / 1000, ease: [0.76, 0, 0.24, 1] }
            }
        >
            {/* wipe-boundary hairline — pinned to the overlay's own top edge,
                so it travels down together with the panel as it exits */}
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

            {/* the "motion trail" mark — overlapping circles, faint to solid */}
            <div className="flex items-center">
                {TRAIL_OPACITIES.map((op, i) => (
                    <motion.span
                        key={i}
                        className={`size-8 rounded-full bg-white md:size-10 ${i > 0 ? "-ml-3 md:-ml-4" : ""}`}
                        style={{ opacity: op, zIndex: i }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={
                            drawn
                                ? { scale: 1, opacity: op }
                                : { scale: 0, opacity: 0 }
                        }
                        transition={{
                            duration: 0.4,
                            delay: i * 0.07,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                    />
                ))}
            </div>

            <motion.p
                className="mt-6 font-heading text-xl font-semibold text-white md:text-2xl"
                initial={{ opacity: 0, y: 10 }}
                animate={drawn ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.32 }}
            >
                kinet<span className="text-white/45">iq</span>
            </motion.p>
            <motion.p
                className="mt-2 font-heading text-[10px] font-medium uppercase tracking-[0.32em] text-white/40"
                initial={{ opacity: 0 }}
                animate={drawn ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.46 }}
            >
                Always in motion
            </motion.p>
        </motion.div>
    );
}
