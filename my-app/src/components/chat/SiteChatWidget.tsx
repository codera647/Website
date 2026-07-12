"use client";

/**
 * Site-wide AI assistant — floating button + panel, present on every page
 * (mounted once in the root layout). Backed by Cloudflare AI Search via
 * /api/chat (no projectSlug -> searches the whole knowledge base: general
 * company content plus every project). See rag-content/README.md for the
 * data-source setup this depends on.
 */

import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MarkdownLite from "@/components/chat/MarkdownLite";

interface ChatMessage {
    role: "user" | "assistant";
    text: string;
}

const SUGGESTED = [
    "What services does Kinetiq offer?",
    "What have you built before?",
    "How fast can you ship an MVP?",
];

export default function SiteChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
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
                body: JSON.stringify({ message: trimmed }),
            });
            const data = (await res.json()) as { ok: boolean; answer?: string; error?: string };

            if (!res.ok || !data.ok) {
                setError(data.error ?? "Something went wrong. Please try again.");
            } else {
                setMessages((m) => [...m, { role: "assistant", text: data.answer ?? "" }]);
            }
        } catch {
            setError("Could not reach the assistant. Please try again.");
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {open && (
                    <motion.div
                        role="dialog"
                        aria-label="Kinetiq assistant"
                        initial={{ opacity: 0, y: 16, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.97 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-4 flex h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink shadow-[0_24px_64px_-16px_rgba(0,0,0,0.6)]"
                    >
                        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                            <div>
                                <p className="font-heading text-sm font-semibold text-white">
                                    Kinetiq assistant
                                </p>
                                <p className="font-heading text-xs text-white/45">
                                    Ask about services, process, or past work
                                </p>
                            </div>
                            <button
                                type="button"
                                aria-label="Close assistant"
                                onClick={() => setOpen(false)}
                                className="flex size-7 shrink-0 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                            {messages.length === 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {SUGGESTED.map((q) => (
                                        <button
                                            key={q}
                                            type="button"
                                            onClick={() => send(q)}
                                            className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-left text-xs text-white/70 hover:bg-white/10"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {messages.map((m, i) =>
                                m.role === "user" ? (
                                    <div
                                        key={i}
                                        className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-white px-4 py-2.5 text-sm text-ink"
                                    >
                                        {m.text}
                                    </div>
                                ) : (
                                    <MarkdownLite
                                        key={i}
                                        text={m.text}
                                        className="mr-auto max-w-[85%] space-y-2 rounded-2xl rounded-bl-sm bg-white/10 px-4 py-2.5 text-sm leading-relaxed text-white/90"
                                    />
                                )
                            )}

                            {pending && (
                                <div className="mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-white/10 px-4 py-2.5 text-sm text-white/50">
                                    Thinking…
                                </div>
                            )}
                            {error && (
                                <p className="text-xs text-red-300">{error}</p>
                            )}
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                send(input);
                            }}
                            className="flex items-center gap-2 border-t border-white/10 p-3"
                        >
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question…"
                                className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
                            />
                            <button
                                type="submit"
                                disabled={pending || !input.trim()}
                                aria-label="Send"
                                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white font-heading text-sm text-ink disabled:opacity-40"
                            >
                                →
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? "Close assistant" : "Open Kinetiq assistant"}
                aria-expanded={open}
                className="flex size-14 items-center justify-center rounded-full bg-ink font-heading text-sm text-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] transition-transform hover:scale-105"
            >
                {open ? "✕" : "Ask"}
            </button>
        </div>
    );
}
