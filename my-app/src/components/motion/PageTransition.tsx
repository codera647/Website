"use client";

import { motion } from "framer-motion";

/**
 * Soft fade/slide on route entry. Used from app/template.tsx so it
 * re-mounts per navigation (App Router pattern).
 */
export default function PageTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
            {children}
        </motion.div>
    );
}
