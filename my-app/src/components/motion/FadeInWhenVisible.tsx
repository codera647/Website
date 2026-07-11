"use client";

import { motion } from "framer-motion";

interface Props {
    children: React.ReactNode;
    /** seconds before the reveal starts */
    delay?: number;
    /** px the element slides up from */
    y?: number;
    /** animate only the first time it enters the viewport */
    once?: boolean;
    className?: string;
}

/** The site's default reveal: fade + slide-up on scroll into view. */
export default function FadeInWhenVisible({
    children,
    delay = 0,
    y = 24,
    once = true,
    className,
}: Props) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, margin: "-64px" }}
            transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
            {children}
        </motion.div>
    );
}
