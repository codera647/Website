"use client";

import { motion } from "framer-motion";
import DemoLoop from "@/components/motion/DemoLoop";
import type { Service } from "@/data/services";

/**
 * Animated UI mockups for each service's DemoLoop (brief §4 Services).
 * Each loops on a repeatDelay so the section feels alive.
 * TODO(user): replace with real screen-capture footage via `demoVideo`.
 */

const LOOP = { repeat: Infinity, repeatDelay: 5.5 };

function AutomationDemo() {
    const steps = [
        "Trigger: new order received",
        "Agent: verify inventory and pricing",
        "Agent: draft confirmation email",
        "Action: update ledger and CRM",
        "Notify: #operations",
    ];
    return (
        <div className="space-y-2.5 p-5">
            {steps.map((step, i) => (
                <motion.div
                    key={step}
                    className="flex items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3"
                    initial={{ opacity: 0.3 }}
                    whileInView={{ opacity: [0.3, 1] }}
                    viewport={{ once: false, margin: "-15%" }}
                    transition={{ duration: 0.45, delay: i * 0.6, ...LOOP }}
                >
                    <motion.span
                        className="size-2 shrink-0 rounded-full bg-ink"
                        initial={{ scale: 0.5 }}
                        whileInView={{ scale: [0.5, 1.25, 1] }}
                        viewport={{ once: false, margin: "-15%" }}
                        transition={{ duration: 0.4, delay: i * 0.6, ...LOOP }}
                    />
                    <span className="truncate font-heading text-sm text-ink-soft">{step}</span>
                    {i === steps.length - 1 && (
                        <motion.span
                            className="ml-auto shrink-0 rounded-none bg-ink px-2.5 py-0.5 text-xs font-medium text-white"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: [0, 1] }}
                            viewport={{ once: false, margin: "-15%" }}
                            transition={{ duration: 0.3, delay: steps.length * 0.6, ...LOOP }}
                        >
                            complete
                        </motion.span>
                    )}
                </motion.div>
            ))}
        </div>
    );
}

function CodeDemo() {
    const lines = [72, 55, 84, 40, 66, 30];
    return (
        <div className="p-5">
            <div className="space-y-3 rounded-lg border border-line bg-surface p-5">
                {lines.map((width, i) => (
                    <motion.div
                        key={i}
                        className="h-2.5 origin-left rounded-none bg-line"
                        style={{ width: `${width}%`, marginLeft: i % 3 === 0 ? 0 : "8%" }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: [0, 1] }}
                        viewport={{ once: false, margin: "-15%" }}
                        transition={{ duration: 0.45, delay: i * 0.45, ...LOOP }}
                    />
                ))}
            </div>
            <motion.div
                className="mt-4 flex items-center gap-2 font-heading text-sm text-ink-soft"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: [0, 1] }}
                viewport={{ once: false, margin: "-15%" }}
                transition={{ duration: 0.4, delay: lines.length * 0.45 + 0.3, ...LOOP }}
            >
                <span className="flex size-5 items-center justify-center rounded-none bg-ink text-xs text-white">
                    ✓
                </span>
                Build passed. Deployed to production
            </motion.div>
        </div>
    );
}

function RagDemo() {
    const results = [
        { text: "Q3 supplier report: delivery delays", score: 96 },
        { text: "Ops review notes: schedule risks", score: 88 },
        { text: "Procurement email thread: revised ETAs", score: 81 },
    ];
    return (
        <div className="space-y-3 p-5">
            <motion.div
                className="flex items-center gap-2 rounded-none border border-line bg-surface px-4 py-2.5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: [0, 1] }}
                viewport={{ once: false, margin: "-15%" }}
                transition={{ duration: 0.4, ...LOOP }}
            >
                <span className="text-muted">⌕</span>
                <span className="truncate font-heading text-sm text-ink-soft">
                    Which suppliers are behind schedule?
                </span>
            </motion.div>
            {results.map((r, i) => (
                <motion.div
                    key={r.text}
                    className="rounded-lg border border-line bg-surface px-4 py-3"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: [0, 1], y: [8, 0] }}
                    viewport={{ once: false, margin: "-15%" }}
                    transition={{ duration: 0.45, delay: 0.7 + i * 0.4, ...LOOP }}
                >
                    <p className="truncate font-heading text-sm text-ink-soft">{r.text}</p>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-none bg-line">
                            <motion.div
                                className="h-full origin-left rounded-none bg-ink"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: [0, r.score / 100] }}
                                viewport={{ once: false, margin: "-15%" }}
                                transition={{ duration: 0.6, delay: 1 + i * 0.4, ...LOOP }}
                            />
                        </div>
                        <span className="text-xs text-muted">{r.score}%</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

const mockups = {
    automation: AutomationDemo,
    code: CodeDemo,
    rag: RagDemo,
} as const;

export default function ServiceDemoBlock({ service }: { service: Service }) {
    const Mockup = mockups[service.demoMockup];
    return (
        <DemoLoop videoSrc={service.demoVideo} label={service.demoLabel}>
            <Mockup />
        </DemoLoop>
    );
}
