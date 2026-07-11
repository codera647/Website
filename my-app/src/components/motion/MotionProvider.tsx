"use client";

import { MotionConfig } from "framer-motion";

/**
 * Site-wide motion policy: `reducedMotion="user"` makes every Framer
 * Motion transform animation respect prefers-reduced-motion
 * automatically (opacity still animates, content always shows).
 */
export default function MotionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
