"use client";

/**
 * Site-wide AI assistant (Motion) — floating button + panel, present on every page.
 * Powered by Cloudflare Workers AI with live website knowledge, D1 portfolio integration,
 * Claude-like clean typography, and interactive sitemap CTA routing.
 */

import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MarkdownLite from "@/components/chat/MarkdownLite";

interface ChatMessage {
    role: "user" | "assistant";
    text: string;
}

const SUGGESTED = [
    "What is a Momentum System?",
    "What are your pricing & tiers?",
    "What AI services do you build?",
    "How fast can you ship an MVP?",
];

export default function SiteChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        }
    }, [open]);

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
                        aria-label="Motion — Kinetiq assistant"
                        initial={{ opacity: 0, y: 16, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.97 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-4 flex h-[32rem] w-[24rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-ink shadow-[0_24px_64px_-16px_rgba(0,0,0,0.8)]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                                <span className="relative flex size-2 shrink-0">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75 duration-1000" />
                                    <span className="relative inline-flex size-2 rounded-full bg-white" />
                                </span>
                                <div>
                                    <p className="font-heading text-sm font-bold text-white leading-none">
                                        Motion
                                    </p>
                                    <p className="mt-1 font-heading text-[11px] text-white/50">
                                        Kinetiq Systems &amp; AI Engineering Assistant
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                aria-label="Close Motion"
                                onClick={() => setOpen(false)}
                                className="flex size-7 shrink-0 items-center justify-center rounded-none text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Message Feed */}
                        <div ref={scrollRef} className="flex-1 space-y-3.5 overflow-y-auto px-4 py-4 text-xs">
                            {messages.length === 0 && (
                                <div className="space-y-3 py-2">
                                    <p className="font-heading text-[11px] uppercase tracking-wider text-white/50">
                                        Suggested Questions
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {SUGGESTED.map((q) => (
                                            <button
                                                key={q}
                                                type="button"
                                                onClick={() => send(q)}
                                                className="group flex items-center justify-between rounded-none border border-white/15 bg-white/[0.04] p-3 text-left text-xs font-medium text-white/80 transition-all hover:border-white/40 hover:bg-white/10 hover:text-white"
                                            >
                                                <span>{q}</span>
                                                <span className="text-white/40 group-hover:text-white transition-colors">
                                                    →
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <AnimatePresence initial={false}>
                                {messages.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                        className={
                                            m.role === "user"
                                                ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-white px-4 py-2.5 text-xs font-medium text-ink shadow-sm"
                                                : "mr-auto max-w-[92%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.07] p-4 text-xs leading-relaxed text-white/95 shadow-sm"
                                        }
                                    >
                                        {m.role === "user" ? (
                                            m.text
                                        ) : (
                                            <MarkdownLite text={m.text} />
                                        )}
                                    </motion.div>
                                ))}

                                {pending && (
                                    <motion.div
                                        key="typing"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        aria-label="Motion is thinking"
                                        className="mr-auto flex max-w-[85%] items-center gap-2 rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.07] px-4 py-3"
                                    >
                                        <span className="font-heading text-[11px] text-white/60">
                                            Motion is thinking
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {[0, 1, 2].map((dot) => (
                                                <motion.span
                                                    key={dot}
                                                    className="size-1.5 rounded-full bg-white/80"
                                                    animate={{ y: [0, -3, 0], opacity: [0.3, 1, 0.3] }}
                                                    transition={{
                                                        duration: 0.8,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                        delay: dot * 0.15,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {error && (
                                <div className="rounded-none border border-red-500/30 bg-red-950/40 p-2.5 text-[11px] text-red-200">
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Input Footer */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                send(input);
                            }}
                            className="flex items-center gap-2 border-t border-white/10 bg-white/[0.02] p-3"
                        >
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about services, systems, pricing…"
                                disabled={pending}
                                className="flex-1 rounded-none border border-white/15 bg-white/5 px-3.5 py-2 text-xs text-white placeholder:text-white/40 focus:border-white/40 focus:bg-white/10 focus:outline-none transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={pending || !input.trim()}
                                aria-label="Send"
                                className="flex size-8 shrink-0 items-center justify-center rounded-none bg-white font-heading text-xs font-bold text-ink transition-all hover:bg-white/90 disabled:opacity-30"
                            >
                                {pending ? "…" : "→"}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Launcher Button */}
            <div className="relative">
                {!open && (
                    <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-none border-2 border-white"
                        animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                )}
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    aria-label={open ? "Close Motion" : "Open Motion, the Kinetiq assistant"}
                    aria-expanded={open}
                    className="relative flex size-13 items-center justify-center rounded-none border-2 border-white bg-ink font-heading text-xs font-bold uppercase tracking-wider text-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] transition-all hover:scale-105 hover:bg-white hover:text-ink cursor-pointer"
                >
                    {open ? "✕" : "Ask AI"}
                </button>
            </div>
        </div>
    );
}
