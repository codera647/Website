"use client";

import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DemoLoop from "@/components/motion/DemoLoop";
import MarkdownLite from "@/components/chat/MarkdownLite";

interface ChatMessage {
    role: "user" | "assistant";
    text: string;
    sources?: string[];
}

interface Props {
    projectTitle: string;
    projectSlug: string;
    suggestedQuestions: string[];
}

export default function ProjectChatPanel({
    projectTitle,
    projectSlug,
    suggestedQuestions,
}: Props) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, pending]);

    async function send(text: string) {
        const trimmed = text.trim();
        if (!trimmed || pending) return;

        setMessages((m) => [...m, { role: "user", text: trimmed }]);
        setInput("");
        setPending(true);
        setError(null);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: trimmed,
                    projectSlug,
                }),
            });

            const data = (await res.json()) as {
                ok: boolean;
                answer?: string;
                sources?: string[];
                error?: string;
            };

            if (!res.ok || !data.ok) {
                setError(data.error ?? "The assistant encountered an issue. Please try again.");
            } else {
                setMessages((m) => [
                    ...m,
                    {
                        role: "assistant",
                        text: data.answer ?? "No response received.",
                        sources: data.sources ?? [],
                    },
                ]);
            }
        } catch {
            setError("Could not connect to the assistant service. Please try again.");
        } finally {
            setPending(false);
        }
    }

    return (
        <DemoLoop label={`kinetiq: ${projectSlug}.assistant`}>
            <div className="flex min-h-[460px] max-h-[640px] flex-col justify-between bg-surface p-6 md:p-8">
                {/* Header info */}
                <div className="border-b border-line pb-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 rounded-none border border-line bg-[#7a7a7c] px-3 py-1 font-heading text-xs font-medium uppercase tracking-[0.14em] text-ink">
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                            </span>
                            Active Project Assistant
                        </span>
                        {messages.length > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    setMessages([]);
                                    setError(null);
                                }}
                                className="font-heading text-xs text-muted hover:text-ink transition-colors"
                            >
                                Reset chat
                            </button>
                        )}
                    </div>

                    <div className="mt-4">
                        <h3 className="font-heading text-2xl font-bold md:text-3xl text-ink">
                            Ask anything about {projectTitle}
                        </h3>
                        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted">
                            Grounded in the real architecture, implementation, and documents for this project.
                        </p>
                    </div>
                </div>

                {/* Chat feed / Suggested questions */}
                <div
                    ref={scrollRef}
                    className="my-4 flex-1 space-y-4 overflow-y-auto pr-1"
                >
                    {messages.length === 0 ? (
                        <div className="space-y-3 py-2">
                            <p className="font-heading text-xs uppercase tracking-wider text-muted">
                                Suggested questions
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {suggestedQuestions.map((q) => (
                                    <button
                                        key={q}
                                        type="button"
                                        onClick={() => send(q)}
                                        className="rounded-none border border-line bg-[#7a7a7c] px-4 py-2.5 text-left text-sm text-ink transition-all hover:-translate-y-0.5 hover:border-ink hover:shadow-sm"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                    className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                                >
                                    <div
                                        className={
                                            m.role === "user"
                                                ? "max-w-[85%] rounded-none border border-ink bg-ink px-4 py-3 text-sm text-white"
                                                : "max-w-[90%] rounded-none border border-line bg-[#7a7a7c] p-4 text-sm leading-relaxed text-ink shadow-sm"
                                        }
                                    >
                                        {m.role === "user" ? (
                                            <p>{m.text}</p>
                                        ) : (
                                            <div>
                                                <MarkdownLite text={m.text} theme="light" className="space-y-2" />
                                                {m.sources && m.sources.length > 0 && (
                                                    <div className="mt-3.5 border-t border-line/70 pt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
                                                        <span className="font-medium uppercase tracking-wider text-[10px]">Sources:</span>
                                                        {m.sources.map((src, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="rounded border border-line bg-surface px-1.5 py-0.5"
                                                            >
                                                                {src}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {pending && (
                                <motion.div
                                    key="typing"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-1.5 rounded-none border border-line bg-[#7a7a7c] px-4 py-3"
                                >
                                    <span className="font-heading text-xs text-muted mr-1">Consulting knowledge base</span>
                                    {[0, 1, 2].map((dot) => (
                                        <motion.span
                                            key={dot}
                                            className="size-1.5 rounded-full bg-ink"
                                            animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
                                            transition={{
                                                duration: 0.8,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: dot * 0.15,
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}

                    {error && (
                        <div className="rounded-none border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                {/* Input form */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        send(input);
                    }}
                    className="mt-2 flex items-center gap-2 border-t border-line pt-4"
                >
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Ask a question about ${projectTitle}…`}
                        disabled={pending}
                        className="flex-1 rounded-none border border-line bg-[#7a7a7c] px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={pending || !input.trim()}
                        aria-label="Send question"
                        className="flex size-11 shrink-0 items-center justify-center rounded-none bg-ink font-heading text-sm text-white transition-all hover:bg-ink-soft disabled:opacity-40"
                    >
                        {pending ? "…" : "→"}
                    </button>
                </form>
            </div>
        </DemoLoop>
    );
}

