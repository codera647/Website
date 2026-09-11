"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Soft fade/slide on route entry. Used from app/template.tsx so it
 * re-mounts per navigation (App Router pattern).
 */
export default function PageTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    const reduced = useReducedMotion();
    return (
        <motion.div
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
            {children}
        </motion.div>
    );
}
