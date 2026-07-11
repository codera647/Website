"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface Props {
    src: string;
    alt: string;
    /** max px of vertical drift while scrolling past */
    strength?: number;
    className?: string;
    sizes?: string;
    priority?: boolean;
}

/**
 * Subtle vertical parallax on an image as it scrolls through the
 * viewport. Wraps next/image (fill) — give the container a size via
 * className (e.g. aspect-[16/10]). No offset under reduced motion.
 */
export default function ParallaxImage({
    src,
    alt,
    strength = 40,
    className,
    sizes = "(max-width: 768px) 100vw, 60vw",
    priority = false,
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const y = useTransform(
        scrollYProgress,
        [0, 1],
        reduced ? [0, 0] : [strength, -strength]
    );

    return (
        <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
            <motion.div style={{ y }} className="absolute -inset-y-[12%] inset-x-0">
                <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
            </motion.div>
        </div>
    );
}
