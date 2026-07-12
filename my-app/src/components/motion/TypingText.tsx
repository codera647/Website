"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface Props {
    text: string;
    /** typing only runs while true; resets to empty the moment it goes false */
    active: boolean;
    /** ms per character */
    speed?: number;
    className?: string;
}

/**
 * Simple typewriter reveal — reveals `text` one character at a time while
 * `active`, with a blinking caret at the write head. Respects
 * prefers-reduced-motion by showing the full text immediately instead.
 */
export default function TypingText({ text, active, speed = 16, className }: Props) {
    const reduced = useReducedMotion();
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!active) {
            setCount(0);
            return;
        }
        if (reduced) {
            setCount(text.length);
            return;
        }
        setCount(0);
        let i = 0;
        const id = setInterval(() => {
            i += 1;
            setCount(i);
            if (i >= text.length) clearInterval(id);
        }, speed);
        return () => clearInterval(id);
    }, [active, text, reduced, speed]);

    const done = count >= text.length;

    return (
        <span className={className}>
            {text.slice(0, count)}
            {active && !done && (
                <span
                    aria-hidden="true"
                    className="ml-0.5 inline-block h-3.5 w-[2px] -translate-y-[1px] animate-pulse bg-white/50"
                />
            )}
        </span>
    );
}
