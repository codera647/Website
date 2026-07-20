"use client";

/**
 * Design sketch only — the "project assistant" chatbot panel is not
 * wired up yet. This is a static preview of the layout/interaction so
 * the real thing (RAG-backed chat via Cloudflare Workers AI) can be
 * built into this exact shell later. Buttons are inert on purpose.
 */

import DemoLoop from "@/components/motion/DemoLoop";

interface Props {
    projectTitle: string;
    suggestedQuestions: string[];
}

export default function ProjectAssistantSketch({
    projectTitle,
    suggestedQuestions,
}: Props) {
    return (
        <DemoLoop label="kinetiq: project assistant">
            <div className="space-y-6 p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-none border border-line px-3 py-1 font-heading text-xs font-medium uppercase tracking-[0.14em] text-muted">
                        <span className="size-1.5 rounded-full bg-ink" />
                        AI project assistant preview
                    </span>
                    <span className="font-heading text-xs text-muted">Coming soon</span>
                </div>

                <div>
                    <h3 className="font-heading text-2xl font-bold md:text-3xl">
                        Ask anything about {projectTitle}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
                        Grounded in the real build, including its architecture,
                        decisions, and outcomes. This is not a generic chatbot. It
                        only knows this project.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((q) => (
                        <button
                            key={q}
                            type="button"
                            disabled
                            className="cursor-not-allowed rounded-none border border-line bg-surface px-4 py-2 text-left text-sm text-ink-soft"
                        >
                            {q}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 rounded-none border border-line bg-surface px-5 py-3.5">
                    <span className="flex-1 truncate text-sm text-muted">
                        Ask a question about this project…
                    </span>
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-none bg-ink font-heading text-sm text-white">
                        →
                    </span>
                </div>
            </div>
        </DemoLoop>
    );
}
