"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Open application ("send us your CV") form on the careers page.
 *
 * The job-title field is a combobox: a dropdown pane lists current
 * openings (passed in via `openRoles`) so applicants can pick one, but
 * the field stays a free text input — when nothing is open (or nothing
 * fits) they can type any title and still send a CV. Suggested titles
 * below are shown as fallback ideas when there are no openings. [DRAFT]
 *
 * Submits multipart/form-data to /api/careers/apply (same endpoint as
 * the per-role ApplicationForm — the typed/selected title is sent as
 * `roleTitle`). Designed for a dark section background (bg-ink).
 */

const SUGGESTED_TITLES = [
    "AI Engineer",
    "Full-stack Developer",
    "Frontend Engineer",
    "Machine Learning Engineer",
];

interface Props {
    openRoles: string[];
}

interface Fields {
    name: string;
    email: string;
    jobTitle: string;
    message: string;
}

const empty: Fields = { name: "", email: "", jobTitle: "", message: "" };
const MAX_CV_BYTES = 5 * 1024 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function OpenApplicationForm({ openRoles }: Props) {
    const [fields, setFields] = useState<Fields>(empty);
    const [cv, setCv] = useState<File | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof Fields | "cv", string>>>({});
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [serverError, setServerError] = useState<string | null>(null);

    // --- job-title combobox state ---
    const [paneOpen, setPaneOpen] = useState(false);
    const comboRef = useRef<HTMLDivElement>(null);

    const options = openRoles.length > 0 ? openRoles : SUGGESTED_TITLES;
    const filtered = fields.jobTitle.trim()
        ? options.filter((t) => t.toLowerCase().includes(fields.jobTitle.trim().toLowerCase()))
        : options;

    // close the pane on outside click / Escape
    useEffect(() => {
        if (!paneOpen) return;
        const onPointerDown = (e: PointerEvent) => {
            if (comboRef.current && !comboRef.current.contains(e.target as Node)) {
                setPaneOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setPaneOpen(false);
        };
        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [paneOpen]);

    const validate = (): boolean => {
        const next: Partial<Record<keyof Fields | "cv", string>> = {};
        if (!fields.name.trim()) next.name = "Please tell us your name.";
        if (!EMAIL_RE.test(fields.email)) next.email = "Please enter a valid email.";
        if (!fields.jobTitle.trim()) next.jobTitle = "Pick an opening or type the role you want.";
        if (!cv) next.cv = "Please attach your CV/resume.";
        else if (cv.size > MAX_CV_BYTES) next.cv = "File is too large (max 5MB).";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || !cv) return;
        setStatus("submitting");
        setServerError(null);

        try {
            const formData = new FormData();
            formData.set("name", fields.name);
            formData.set("email", fields.email);
            formData.set("roleTitle", fields.jobTitle.trim());
            formData.set("additionalInfo", fields.message);
            formData.set("cv", cv);

            const res = await fetch("/api/careers/apply", { method: "POST", body: formData });
            const data = await res.json().catch(() => ({ ok: false }));

            if (!res.ok || !data.ok) {
                setServerError(data.error || "Something went wrong. Please try again.");
                setStatus("error");
                return;
            }

            setStatus("success");
            setFields(empty);
            setCv(null);
        } catch {
            setServerError("Could not reach the server. Please try again.");
            setStatus("error");
        }
    };

    const set = (key: keyof Fields) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFields((f) => ({ ...f, [key]: e.target.value }));
        setErrors((er) => ({ ...er, [key]: undefined }));
    };

    const inputClass =
        "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/35 focus:border-white/40 focus:outline-none transition-colors";

    if (status === "success") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center"
            >
                <p className="font-heading text-2xl font-semibold text-white">CV received.</p>
                <p className="mt-3 text-white/60">
                    Thanks for reaching out — a real person reads every application
                    and will get back to you if there&apos;s a fit.
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 font-heading text-sm font-semibold text-white underline underline-offset-4"
                >
                    Send another
                </button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-xl space-y-5 text-left">
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="open-name" className="mb-2 block font-heading text-sm font-medium text-white">
                        Name
                    </label>
                    <input
                        id="open-name"
                        type="text"
                        placeholder="Jane Doe"
                        value={fields.name}
                        onChange={set("name")}
                        required
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "open-name-error" : undefined}
                        className={inputClass}
                    />
                    {errors.name && (
                        <p id="open-name-error" role="alert" className="mt-1.5 text-sm text-white/70">
                            {errors.name}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="open-email" className="mb-2 block font-heading text-sm font-medium text-white">
                        Email
                    </label>
                    <input
                        id="open-email"
                        type="email"
                        placeholder="jane@email.com"
                        value={fields.email}
                        onChange={set("email")}
                        required
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "open-email-error" : undefined}
                        className={inputClass}
                    />
                    {errors.email && (
                        <p id="open-email-error" role="alert" className="mt-1.5 text-sm text-white/70">
                            {errors.email}
                        </p>
                    )}
                </div>
            </div>

            {/* job title combobox: select an opening OR type any title */}
            <div ref={comboRef} className="relative">
                <label htmlFor="open-title" className="mb-2 block font-heading text-sm font-medium text-white">
                    Job title{" "}
                    <span className="text-white/40">
                        {openRoles.length > 0
                            ? "(pick an opening or type your own)"
                            : "(no openings right now — type the role you want)"}
                    </span>
                </label>
                <div className="relative">
                    <input
                        id="open-title"
                        type="text"
                        role="combobox"
                        aria-expanded={paneOpen}
                        aria-controls="open-title-pane"
                        aria-autocomplete="list"
                        autoComplete="off"
                        placeholder={openRoles[0] ?? "e.g. AI Engineer"}
                        value={fields.jobTitle}
                        onChange={(e) => {
                            set("jobTitle")(e);
                            setPaneOpen(true);
                        }}
                        onFocus={() => setPaneOpen(true)}
                        required
                        aria-invalid={!!errors.jobTitle}
                        aria-describedby={errors.jobTitle ? "open-title-error" : undefined}
                        className={`${inputClass} pr-11`}
                    />
                    <button
                        type="button"
                        tabIndex={-1}
                        aria-label={paneOpen ? "Close suggestions" : "Show suggestions"}
                        onClick={() => setPaneOpen((o) => !o)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/45 transition-colors hover:text-white"
                    >
                        <motion.span
                            className="block font-heading text-sm"
                            animate={{ rotate: paneOpen ? 180 : 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            ▾
                        </motion.span>
                    </button>
                </div>

                <AnimatePresence>
                    {paneOpen && (
                        <motion.ul
                            id="open-title-pane"
                            role="listbox"
                            aria-label="Suggested job titles"
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/15 bg-ink shadow-[0_24px_64px_-16px_rgba(0,0,0,0.7)]"
                        >
                            <li className="border-b border-white/10 px-4 py-2.5 font-heading text-xs font-medium uppercase tracking-[0.18em] text-white/40">
                                {openRoles.length > 0 ? "Current openings" : "Suggestions"}
                            </li>
                            {filtered.length > 0 ? (
                                filtered.map((title) => (
                                    <li key={title} role="option" aria-selected={fields.jobTitle === title}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFields((f) => ({ ...f, jobTitle: title }));
                                                setErrors((er) => ({ ...er, jobTitle: undefined }));
                                                setPaneOpen(false);
                                            }}
                                            className="group flex w-full items-center justify-between px-4 py-3 text-left text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                                        >
                                            {title}
                                            <span
                                                aria-hidden="true"
                                                className="translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                                            >
                                                ↵
                                            </span>
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-3 text-sm text-white/50">
                                    No match — keep typing, we&apos;ll take your CV for
                                    &ldquo;{fields.jobTitle.trim()}&rdquo; anyway.
                                </li>
                            )}
                        </motion.ul>
                    )}
                </AnimatePresence>
                {errors.jobTitle && (
                    <p id="open-title-error" role="alert" className="mt-1.5 text-sm text-white/70">
                        {errors.jobTitle}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="open-cv" className="mb-2 block font-heading text-sm font-medium text-white">
                    CV / resume <span className="text-white/40">(PDF or Word, max 5MB)</span>
                </label>
                <input
                    id="open-cv"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    required
                    onChange={(e) => {
                        setCv(e.target.files?.[0] ?? null);
                        setErrors((er) => ({ ...er, cv: undefined }));
                    }}
                    aria-invalid={!!errors.cv}
                    aria-describedby={errors.cv ? "open-cv-error" : undefined}
                    className="block w-full text-sm text-white/70 file:mr-4 file:rounded-full file:border file:border-white/15 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white file:transition-colors hover:file:bg-white/15"
                />
                {errors.cv && (
                    <p id="open-cv-error" role="alert" className="mt-1.5 text-sm text-white/70">
                        {errors.cv}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="open-message" className="mb-2 block font-heading text-sm font-medium text-white">
                    Anything else <span className="text-white/40">(optional)</span>
                </label>
                <textarea
                    id="open-message"
                    rows={3}
                    placeholder="Portfolio links, availability, what you'd love to work on…"
                    value={fields.message}
                    onChange={set("message")}
                    className={inputClass}
                />
            </div>

            {status === "error" && serverError && (
                <p role="alert" className="text-sm font-medium text-white">
                    {serverError}
                </p>
            )}

            <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-heading text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/85 hover:shadow-[0_12px_32px_-12px_rgba(255,255,255,0.35)] disabled:opacity-60"
            >
                {status === "submitting" ? "Sending…" : "Send CV"}
                {status !== "submitting" && <span aria-hidden="true">→</span>}
            </button>
        </form>
    );
}
