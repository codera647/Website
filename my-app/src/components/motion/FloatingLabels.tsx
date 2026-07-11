"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Props {
    labels: string[];
    className?: string;
}

/** anchor slots around the parent container (max 6 labels) */
const SLOTS: React.CSSProperties[] = [
    { top: "8%", left: "-4%" },
    { top: "18%", right: "-6%" },
    { bottom: "30%", left: "-8%" },
    { bottom: "12%", right: "-2%" },
    { top: "-6%", right: "20%" },
    { bottom: "-8%", left: "24%" },
];

/**
 * invoko.ai-style kinetic value-prop tags floating gently around a
 * hero visual. Each fades in independently then drifts on its own
 * slow loop. Static pills under reduced motion (brief §5).
 */
export default function FloatingLabels({ labels, className }: Props) {
    const reduced = useReducedMotion();

    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 hidden md:block ${className ?? ""}`}
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
