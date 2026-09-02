"use client";

/**
 * Site-wide AI assistant (Motion) — floating button + panel, present on every page.
 * Powered by Cloudflare Workers AI with live website knowledge, D1 portfolio integration,
 * Claude-like clean typography, interactive sitemap CTA routing, and an interactive
 * 4-step Tier Recommendation Survey Agent.
 */

import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MarkdownLite from "@/components/chat/MarkdownLite";

interface ChatMessage {
    role: "user" | "assistant";
    text: string;
    isSurveyResult?: boolean;
}

interface SurveyOption {
    key: "A" | "B" | "C";
    label: string;
    desc: string;
}

interface SurveyQuestion {
    id: number;
    stepNumber: number;
    title: string;
    question: string;
    options: SurveyOption[];
}

const SURVEY_QUESTIONS: SurveyQuestion[] = [
    {
        id: 1,
        stepNumber: 1,
        title: "Step 1 of 4 · Online Baseline & Goal",
        question: "What is the current online state of your business and what's your top priority?",
        options: [
            {
                key: "A",
                label: "Establishing our digital foundation",
                desc: "We need a modern, mobile-first website + Google profile to get properly established.",
            },
            {
                key: "B",
                label: "Automating repeat bookings & retention",
                desc: "We have a website, but need automated follow-ups, review requests, and a customer portal.",
            },
            {
                key: "C",
                label: "Scaling multi-location & CRM workflows",
                desc: "We need 2-way CRM integration, multi-city SEO expansion, and 24/7 AI booking agents.",
            },
        ],
    },
    {
        id: 2,
        stepNumber: 2,
        title: "Step 2 of 4 · Customer Portal & Repeat Model",
        question: "Do your customers book repeat services, maintenance plans, or benefit from logging in?",
        options: [
            {
                key: "A",
                label: "Mostly one-off / emergency jobs",
                desc: "Basic booking and review requests are fine; no customer portal needed yet.",
            },
            {
                key: "B",
                label: "Yes, repeat service & seasonal tune-ups",
                desc: "We want a customer portal for service records and automated seasonal reminder texts.",
            },
            {
                key: "C",
                label: "High-volume service contracts & accounts",
                desc: "We manage multiple client properties and need custom account & member workflows.",
            },
        ],
    },
    {
        id: 3,
        stepNumber: 3,
        title: "Step 3 of 4 · Service Territory & Geography",
        question: "How many towns or service territories are you targeting for new customer acquisition?",
        options: [
            {
                key: "A",
                label: "1 primary hometown territory",
                desc: "Our focus is ranking and dominating local search in our single immediate city.",
            },
            {
                key: "B",
                label: "2 to 8 neighboring towns / service areas",
                desc: "We service multiple towns and need high-converting local landing pages for each.",
            },
            {
                key: "C",
                label: "8+ towns / multiple branch locations",
                desc: "We operate regionally and need unlimited location pages and multi-branch infrastructure.",
            },
        ],
    },
    {
        id: 4,
        stepNumber: 4,
        title: "Step 4 of 4 · Tooling & Automation Depth",
        question: "What software integrations and automation depth do you require?",
        options: [
            {
                key: "A",
                label: "Simple booking & review requests",
                desc: "Core automated booking confirmations and post-service 5-star review generation.",
            },
            {
                key: "B",
                label: "Full SMS nurture & seasonal campaigns",
                desc: "Automated SMS reminders, win-back flows, and annual maintenance reminder campaigns.",
            },
            {
                key: "C",
                label: "Direct CRM integration & AI booking agent",
                desc: "Live 2-way sync with Housecall Pro, ServiceTitan, or Jobber + 24/7 AI chat agent.",
            },
        ],
    },
];

const SUGGESTED = [
    "🎯 Find My Ideal Tier (1-Min Survey)",
    "What is a Momentum System?",
    "What are your pricing & tiers?",
    "What AI services do you build?",
];

export default function SiteChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Survey State Machine
    const [surveyStepIndex, setSurveyStepIndex] = useState<number | null>(null);
    const [surveyAnswers, setSurveyAnswers] = useState<
        { questionId: number; title: string; key: string; label: string }[]
    >([]);

    // Lead Capture State
    const [leadEmail, setLeadEmail] = useState("");
    const [leadSubmitting, setLeadSubmitting] = useState(false);
    const [leadSent, setLeadSent] = useState(false);
    const [leadError, setLeadError] = useState<string | null>(null);
    const [capturedEmail, setCapturedEmail] = useState("");

    // Holds the full AI-generated recommendation text + tier from the most
    // recently completed survey, so "email me a copy" can send the actual
    // report instead of a placeholder string.
    const [surveyResultText, setSurveyResultText] = useState("");
    const [surveyRecommendedTier, setSurveyRecommendedTier] = useState("Momentum (Recommended)");

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Listen for custom event or hash to launch the survey from anywhere on the site
    useEffect(() => {
        const handleOpenSurvey = () => {
            setOpen(true);
            startSurvey();
        };

        window.addEventListener("open-motion-survey", handleOpenSurvey);

        if (typeof window !== "undefined" && window.location.hash === "#assess") {
            handleOpenSurvey();
        }

        return () => {
            window.removeEventListener("open-motion-survey", handleOpenSurvey);
        };
    }, []);

    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        }
    }, [open]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, pending, surveyStepIndex]);

    function startSurvey() {
        setSurveyStepIndex(0);
        setSurveyAnswers([]);
        setError(null);

        const firstQ = SURVEY_QUESTIONS[0];
        setMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                text: `### 🎯 Interactive Tier Assessment (1-Minute Survey)\nLet's find the exact Momentum System tier that fits your service business and growth goals.\n\n**${firstQ.title}**\n${firstQ.question}`,
            },
        ]);
    }

    async function handleSurveyChoice(option: SurveyOption) {
        if (surveyStepIndex === null) return;

        const currentQ = SURVEY_QUESTIONS[surveyStepIndex];
        const newAnswers = [
            ...surveyAnswers,
            {
                questionId: currentQ.id,
                title: currentQ.title,
                key: option.key,
                label: `${option.key}. ${option.label}`,
            },
        ];
        setSurveyAnswers(newAnswers);

        // Add user response to chat
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                text: `${option.key}. ${option.label}`,
            },
        ]);

        const nextIndex = surveyStepIndex + 1;

        if (nextIndex < SURVEY_QUESTIONS.length) {
            // Advance to next question
            const nextQ = SURVEY_QUESTIONS[nextIndex];
            setSurveyStepIndex(nextIndex);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: `**${nextQ.title}**\n${nextQ.question}`,
                },
            ]);
        } else {
            // Survey Completed! Send to backend for recommendation synthesis
            setSurveyStepIndex(null);
            setPending(true);

            const promptText = `I just completed the 4-step Tier Assessment survey with the following responses:
1. Online Baseline & Goal: ${newAnswers[0]?.label || "N/A"}
2. Customer Portal & Repeat Model: ${newAnswers[1]?.label || "N/A"}
3. Territory & Geography: ${newAnswers[2]?.label || "N/A"}
4. Tooling & Automation Depth: ${newAnswers[3]?.label || "N/A"}

Please evaluate these requirements and provide your definitive Momentum System Tier Recommendation (Foundation, Momentum, or Momentum Pro) with customized rationale, founding pricing breakdown, and next steps.`;

            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: promptText }),
                });
                const data = (await res.json()) as { ok: boolean; answer?: string; error?: string };

                if (!res.ok || !data.ok) {
                    setError(data.error ?? "Could not generate tier recommendation.");
                } else {
                    const ansText = data.answer ?? "";
                    setMessages((prev) => [
                        ...prev,
                        {
                            role: "assistant",
                            text: ansText,
                            isSurveyResult: true,
                        },
                    ]);

                    // Determine recommended tier for the notification
                    let recommendedTier = "Momentum (Recommended)";
                    if (ansText.toLowerCase().includes("momentum pro")) {
                        recommendedTier = "Momentum Pro";
                    } else if (ansText.toLowerCase().includes("foundation")) {
                        recommendedTier = "Foundation";
                    } else if (ansText.toLowerCase().includes("momentum")) {
                        recommendedTier = "Momentum";
                    }

                    // Keep the real report text + tier around so "email me a
                    // copy" below can send this exact content to the visitor.
                    setSurveyResultText(ansText);
                    setSurveyRecommendedTier(recommendedTier);
                    setLeadSent(false);
                    setLeadError(null);

                    // Automatically dispatch lead notification alert to info@thekinetiq.solutions
                    fetch("/api/chat/survey-lead", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            answers: newAnswers,
                            recommendedTier,
                            summaryNotes: ansText,
                        }),
                    }).catch(() => {});
                }
            } catch {
                setError("Could not reach the assistant. Please try again.");
            } finally {
                setPending(false);
            }
        }
    }

    async function handleLeadSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!leadEmail.trim() || leadSubmitting) return;

        setLeadSubmitting(true);
        setLeadError(null);
        const emailToSend = leadEmail.trim();

        try {
            const res = await fetch("/api/chat/survey-lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    answers: surveyAnswers,
                    recommendedTier: surveyRecommendedTier,
                    userEmail: emailToSend,
                    summaryNotes: surveyResultText,
                }),
            });
            const data = (await res.json().catch(() => ({ ok: false }))) as { ok: boolean; error?: string };

            if (!res.ok || !data.ok) {
                setLeadError(data.error ?? "Could not send the report. Please try again.");
                return;
            }

            setCapturedEmail(emailToSend);
            setLeadSent(true);
            setLeadEmail("");
        } catch {
            setLeadError("Could not reach the server. Please try again.");
        } finally {
            setLeadSubmitting(false);
        }
    }

    async function send(text: string) {
        const trimmed = text.trim();
        if (!trimmed || pending) return;

        // Check if user clicked the survey trigger suggestion
        if (
            trimmed === "🎯 Find My Ideal Tier (1-Min Survey)" ||
            trimmed.toLowerCase().includes("find my ideal tier") ||
            trimmed.toLowerCase().includes("take the survey") ||
            trimmed.toLowerCase().includes("start assessment")
        ) {
            startSurvey();
            return;
        }

        setMessages((m) => [...m, { role: "user", text: trimmed }]);
        setInput("");
        setPending(true);
        setError(null);

        // If user types while in survey mode, exit survey mode to handle general query
        if (surveyStepIndex !== null) {
            setSurveyStepIndex(null);
        }

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

    const currentSurveyQuestion =
        surveyStepIndex !== null ? SURVEY_QUESTIONS[surveyStepIndex] : null;

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
                        className="mb-4 flex h-[34rem] w-[25rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-background/15 bg-ink shadow-[0_24px_64px_-16px_rgba(0,0,0,0.85)]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-background/10 bg-background/[0.03] px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                                <span className="relative flex size-2 shrink-0">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-background opacity-75 duration-1000" />
                                    <span className="relative inline-flex size-2 rounded-full bg-background" />
                                </span>
                                <div>
                                    <p className="font-heading text-sm font-bold text-background leading-none">
                                        Motion
                                    </p>
                                    <p className="mt-1 font-heading text-[11px] text-background/50">
                                        Kinetiq Systems &amp; Tier Advisor
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {messages.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMessages([]);
                                            setSurveyStepIndex(null);
                                            setSurveyAnswers([]);
                                            setError(null);
                                        }}
                                        className="font-heading text-[11px] text-background/40 hover:text-background transition-colors"
                                    >
                                        Reset
                                    </button>
                                )}
                                <button
                                    type="button"
                                    aria-label="Close Motion"
                                    onClick={() => setOpen(false)}
                                    className="flex size-7 shrink-0 items-center justify-center rounded-none text-background/50 hover:bg-background/10 hover:text-background transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Message Feed */}
                        <div ref={scrollRef} className="flex-1 space-y-3.5 overflow-y-auto px-4 py-4 text-xs">
                            {messages.length === 0 && (
                                <div className="space-y-3 py-2">
                                    <p className="font-heading text-[11px] uppercase tracking-wider text-background/50">
                                        Suggested Actions
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {SUGGESTED.map((q, idx) => (
                                            <button
                                                key={q}
                                                type="button"
                                                onClick={() => send(q)}
                                                className={`group flex items-center justify-between rounded-none border p-3 text-left text-xs font-medium transition-all ${
                                                    idx === 0
                                                        ? "border-background/40 bg-background/10 text-background font-semibold shadow-sm hover:bg-background/20 hover:border-background"
                                                        : "border-background/15 bg-background/[0.04] text-background/80 hover:border-background/40 hover:bg-background/10 hover:text-background"
                                                }`}
                                            >
                                                <span>{q}</span>
                                                <span className="text-background/40 group-hover:text-background transition-colors">
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
                                                ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-background px-4 py-2.5 text-xs font-medium text-ink shadow-sm"
                                                : "mr-auto max-w-[94%] rounded-2xl rounded-bl-sm border border-background/10 bg-background/[0.07] p-4 text-xs leading-relaxed text-background/95 shadow-sm"
                                        }
                                    >
                                        {m.role === "user" ? (
                                            m.text
                                        ) : (
                                            <div>
                                                <MarkdownLite text={m.text} />
                                                {m.isSurveyResult && (
                                                    <div className="mt-4 space-y-3 border-t border-background/10 pt-3">
                                                        {/* Optional Email Capture Box */}
                                                        <div className="rounded-lg border border-background/15 bg-background/5 p-3.5 space-y-2">
                                                            <p className="font-heading text-[11px] font-bold text-background uppercase tracking-wider">
                                                                📩 Get this Audit &amp; Proposal in your Inbox
                                                            </p>
                                                            <p className="text-[11px] text-background/60">
                                                                Enter your work email to receive this tier roadmap and growth breakdown:
                                                            </p>
                                                            {leadSent ? (
                                                                <div className="border border-emerald-500/30 bg-emerald-500/10 p-2 text-center text-[11px] font-medium text-emerald-300">
                                                                    ✓ Strategy roadmap dispatched to {capturedEmail}! Our team will follow up.
                                                                </div>
                                                            ) : (
                                                                <form onSubmit={handleLeadSubmit} className="flex gap-2">
                                                                    <input
                                                                        type="email"
                                                                        value={leadEmail}
                                                                        onChange={(e) => setLeadEmail(e.target.value)}
                                                                        placeholder="you@company.com"
                                                                        required
                                                                        className="flex-1 rounded-none border border-background/20 bg-background/5 px-2.5 py-1.5 text-xs text-background placeholder-background/40 focus:border-background focus:outline-none"
                                                                    />
                                                                    <button
                                                                        type="submit"
                                                                        disabled={leadSubmitting}
                                                                        className="bg-background px-3 py-1.5 font-heading text-[10px] font-bold uppercase tracking-wider text-ink transition-colors hover:bg-background/90 cursor-pointer disabled:opacity-50"
                                                                    >
                                                                        {leadSubmitting ? "Sending…" : "Send Me Copy →"}
                                                                    </button>
                                                                </form>
                                                            )}
                                                            {leadError && !leadSent && (
                                                                <div className="border border-red-500/30 bg-red-500/10 p-2 text-center text-[11px] font-medium text-red-300">
                                                                    ⚠ {leadError}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={startSurvey}
                                                            className="inline-flex items-center gap-1.5 font-heading text-[11px] font-semibold text-background/60 hover:text-background transition-colors cursor-pointer"
                                                        >
                                                            <span>↻ Retake Assessment</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}

                                {/* Interactive Survey Option Pills */}
                                {currentSurveyQuestion && !pending && (
                                    <motion.div
                                        key={`survey-step-${currentSurveyQuestion.id}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="space-y-2 pt-1"
                                    >
                                        <p className="font-heading text-[10px] font-semibold uppercase tracking-wider text-background/45">
                                            Select your answer (or type below):
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            {currentSurveyQuestion.options.map((opt) => (
                                                <button
                                                    key={opt.key}
                                                    type="button"
                                                    onClick={() => handleSurveyChoice(opt)}
                                                    className="group flex flex-col text-left rounded-lg border border-background/20 bg-background/[0.06] p-3 transition-all duration-200 hover:border-background hover:bg-background hover:text-ink cursor-pointer shadow-sm"
                                                >
                                                    <div className="flex items-center justify-between font-heading font-bold text-xs text-background group-hover:text-ink">
                                                        <span>
                                                            {opt.key}. {opt.label}
                                                        </span>
                                                        <span className="text-[10px] opacity-60 group-hover:opacity-100 transition-opacity">
                                                            Select →
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-[11px] text-background/70 group-hover:text-ink/80 leading-normal">
                                                        {opt.desc}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {pending && (
                                    <motion.div
                                        key="typing"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        aria-label="Motion is thinking"
                                        className="mr-auto flex max-w-[85%] items-center gap-2 rounded-2xl rounded-bl-sm border border-background/10 bg-background/[0.07] px-4 py-3"
                                    >
                                        <span className="font-heading text-[11px] text-background/60">
                                            {surveyStepIndex === null && surveyAnswers.length === 4
                                                ? "Evaluating your requirements"
                                                : "Motion is thinking"}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {[0, 1, 2].map((dot) => (
                                                <motion.span
                                                    key={dot}
                                                    className="size-1.5 rounded-full bg-background/80"
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
                            className="flex items-center gap-2 border-t border-background/10 bg-background/[0.02] p-3"
                        >
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={
                                    surveyStepIndex !== null
                                        ? "Click an option above or type here…"
                                        : "Ask about services, systems, pricing…"
                                }
                                disabled={pending}
                                className="flex-1 rounded-none border border-background/15 bg-background/5 px-3.5 py-2 text-xs text-background placeholder:text-background/40 focus:border-background/40 focus:bg-background/10 focus:outline-none transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={pending || !input.trim()}
                                aria-label="Send"
                                className="flex size-8 shrink-0 items-center justify-center rounded-none bg-background font-heading text-xs font-bold text-ink transition-all hover:bg-background/90 disabled:opacity-30 cursor-pointer"
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
                        className="pointer-events-none absolute inset-0 rounded-none border-2 border-background"
                        animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                )}
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    aria-label={open ? "Close Motion" : "Open Motion, the Kinetiq assistant"}
                    aria-expanded={open}
                    className="relative flex size-13 items-center justify-center rounded-none border-2 border-background bg-ink font-heading text-xs font-bold uppercase tracking-wider text-background shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] transition-all hover:scale-105 hover:bg-background hover:text-ink cursor-pointer"
                >
                    {open ? "✕" : "Ask AI"}
                </button>
            </div>
        </div>
    );
}
