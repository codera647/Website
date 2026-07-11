"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface FAQItem {
    question: string;
    answer: string;
}

interface Props {
    items: FAQItem[];
    className?: string;
}

/** Expand/collapse FAQ — one question open at a time, animated height. */
export default function FAQAccordion({ items, className }: Props) {
    const [open, setOpen] = useState<number | null>(0);
    const baseId = useId();

    return (
        <div className={`divide-y divide-line border-y border-line ${className ?? ""}`}>
            {items.map((item, i) => {
                const isOpen = open === i;
                const panelId = `${baseId}-panel-${i}`;
                const buttonId = `${baseId}-button-${i}`;
                return (
                    <div key={i}>
                        <button
                            id={buttonId}
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            onClick={() => setOpen(isOpen ? null : i)}
                            className="flex w-full items-center justify-between gap-6 py-6 text-left"
                        >
                            <span className="font-heading text-lg font-medium">
                                {item.question}
                            </span>
                            <motion.span
                                aria-hidden="true"
                                animate={{ rotate: isOpen ? 45 : 0 }}
                                transition={{ duration: 0.25 }}
                                className="shrink-0 text-2xl font-light text-muted"
                            >
                                +
                            </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    id={panelId}
                                    role="region"
                                    aria-labelledby={buttonId}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                                    className="overflow-hidden"
                                >
                                    <p className="max-w-2xl pb-6 leading-relaxed text-muted">
                                        {item.answer}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}
