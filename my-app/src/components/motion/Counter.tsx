"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

interface Props {
    to: number;
    prefix?: string;
    suffix?: string;
    /** seconds */
    duration?: number;
    className?: string;
}

/**
 * Animates 0 → `to` when scrolled into view. Under reduced motion the
 * final number renders instantly (brief §5).
 */
export default function Counter({
    to,
    prefix = "",
    suffix = "",
    duration = 1.6,
    className,
}: Props) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-64px" });
    const reduced = useReducedMotion();
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!inView) return;
        if (reduced) {
            setValue(to);
            return;
        }
        const controls = animate(0, to, {
            duration,
            ease: "easeOut",
            onUpdate: (v) => setValue(Math.round(v)),
        });
        return () => controls.stop();
    }, [inView, to, duration, reduced]);

    return (
        <span ref={ref} className={className}>
            {prefix}
            {value.toLocaleString()}
            {suffix}
        </span>
    );
}
