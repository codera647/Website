"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Props {
    labels: string[];
    className?: string;
}

/**
 * Corner anchor slots (max 4 labels). Each sits mostly *outside* the
 * card's own box (large negative offsets) so it only ever peeks past
 * an edge — never overlaps the card's own content — and the float
 * animation's small drift amplitude keeps it from drifting back in.
 */
const SLOTS: React.CSSProperties[] = [
    { top: "-8%", left: "-12%" },
    { top: "-10%", right: "-8%" },
    { bottom: "-9%", left: "-10%" },
    { bottom: "-11%", right: "-11%" },
];

/**
 * invoko.ai-style kinetic value-prop tags floating gently around a
 * hero visual. Each fades in independently then drifts on its own
 * slow loop. Static pills under reduced motion (brief §5).
 *
 * Only rendered at `lg`+ — that's the breakpoint where Hero switches
 * to its two-column layout and actually has gutter space for these to
 * float in without covering the card's own content or the console
 * getting clipped on narrower/tablet screens.
 */
export default function FloatingLabels({ labels, className }: Props) {
    const reduced = useReducedMotion();

    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 z-20 hidden lg:block ${className ?? ""}`}
        >
            {labels.slice(0, SLOTS.length).map((label, i) => (
                <motion.span
                    key={label}
                    style={SLOTS[i]}
                    className="absolute rounded-full border border-line bg-white/85 px-3.5 py-1.5 font-heading text-xs font-medium text-ink-soft shadow-sm backdrop-blur"
                    initial={{ opacity: 0, y: 8 }}
                    animate={
                        reduced
                            ? { opacity: 1, y: 0 }
                            : { opacity: 1, y: [8, -6, 8] }
                    }
                    transition={
                        reduced
                            ? { duration: 0.4, delay: 0.2 + i * 0.15 }
                            : {
                                opacity: { duration: 0.6, delay: 0.35 + i * 0.18 },
                                y: {
                                    duration: 4.5 + i * 0.8,
                                    delay: 0.35 + i * 0.18,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                },
                            }
                    }
                >
                    {label}
                </motion.span>
            ))}
        </div>
    );
}
