"use client";

import { Children } from "react";
import { motion } from "framer-motion";

interface Props {
    children: React.ReactNode;
    /** seconds between each child's reveal */
    stagger?: number;
    delay?: number;
    className?: string;
    itemClassName?: string;
}

const container = (stagger: number, delay: number) => ({
    hidden: {},
    show: {
        transition: { staggerChildren: stagger, delayChildren: delay },
    },
});

const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const },
    },
};

/** Staggered reveal for card grids / lists. Each direct child animates in sequence. */
export default function StaggerList({
    children,
    stagger = 0.08,
    delay = 0,
    className,
    itemClassName,
}: Props) {
    return (
        <motion.div
            className={className}
            variants={container(stagger, delay)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-64px" }}
        >
            {Children.map(children, (child, i) => (
                <motion.div key={i} variants={item} className={itemClassName}>
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
}
