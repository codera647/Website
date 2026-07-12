"use client";

import { useState } from "react";

/**
 * Contact form with client-side validation (brief §4 Contact).
 * Submits to /api/contact, which sends via Resend to
 * contact@thekinetiq.solutions with the visitor's own email set as
 * reply-to, so replying goes straight back to them.
 */

const projectTypes = [
    "AI Automation",
    "Web Development",
    "Generative AI",
    "Something else",
];

interface Fields {
    name: string;
    email: string;
    projectType: string;
    message: string;
}

const empty: Fields = { name: "", email: "", projectType: "", message: "" };

export default function ContactForm() {
    const [fields, setFields] = useState<Fields>(empty);
    const [errors, setErrors] = useState<Partial<Fields>>({});
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [serverError, setServerError] = useState<string | null>(null);

    const validate = (): boolean => {
        const next: Partial<Fields> = {};
        if (!fields.name.trim()) next.name = "Please tell us your name.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = "Please enter a valid email.";
        if (!fields.projectType) next.projectType = "Pick the closest fit.";
        if (fields.message.trim().length < 10) next.message = "A sentence or two helps us prepare.";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setStatus("submitting");
        setServerError(null);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fields),
            });
            const data = await res.json().catch(() => ({ ok: false }));

            if (!res.ok || !data.ok) {
                setServerError(data.error || "Something went wrong. Please try again.");
                setStatus("error");
                return;
            }

            setStatus("success");
            setFields(empty);
        } catch {
            setServerError("Could not reach the server. Please try again.");
            setStatus("error");
        }
    };

    const set = (key: keyof Fields) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFields((f) => ({ ...f, [key]: e.target.value }));
        setErrors((er) => ({ ...er, [key]: undefined }));
    };

    const inputClass =
        "w-full rounded-xl border border-line bg-white px-4 py-3.5 text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none transition-colors";

    if (status === "success") {
        return (
            <div className="rounded-2xl border border-line bg-white p-10 text-center">
                <p className="font-heading text-2xl font-semibold">Message sent.</p>
                <p className="mt-3 text-muted">
                    Thanks for reaching out — we&apos;ll get back to you within one business day.
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 font-heading text-sm font-semibold underline underline-offset-4"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="name" className="mb-2 block font-heading text-sm font-medium">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Jane Doe"
                        value={fields.name}
                        onChange={set("name")}
                        required
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        className={inputClass}
                    />
                    {errors.name && (
                        <p id="name-error" role="alert" className="mt-1.5 text-sm text-ink-soft">
                            {errors.name}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="email" className="mb-2 block font-heading text-sm font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="jane@company.com"
                        value={fields.email}
                        onChange={set("email")}
                        required
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        className={inputClass}
                    />
                    {errors.email && (
                        <p id="email-error" role="alert" className="mt-1.5 text-sm text-ink-soft">
                            {errors.email}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="projectType" className="mb-2 block font-heading text-sm font-medium">
                    Project type
                </label>
                <select
                    id="projectType"
                    value={fields.projectType}
                    onChange={set("projectType")}
                    required
                    aria-invalid={!!errors.projectType}
                    aria-describedby={errors.projectType ? "projectType-error" : undefined}
                    className={`${inputClass} ${fields.projectType ? "" : "text-muted/60"}`}
                >
                    <option value="" disabled>
                        What are we building?
                    </option>
                    {projectTypes.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
                {errors.projectType && (
                    <p id="projectType-error" role="alert" className="mt-1.5 text-sm text-ink-soft">
                        {errors.projectType}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="message" className="mb-2 block font-heading text-sm font-medium">
                    Message
                </label>
                <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us about the system you have in mind…"
                    value={fields.message}
                    onChange={set("message")}
                    required
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={inputClass}
                />
                {errors.message && (
                    <p id="message-error" role="alert" className="mt-1.5 text-sm text-ink-soft">
                        {errors.message}
                    </p>
                )}
            </div>

            {status === "error" && serverError && (
                <p role="alert" className="text-sm font-medium text-red-600">
                    {serverError}
                </p>
            )}

            <button
                type="submit"
                disabled={status === "submitting"}
                className="rounded-full bg-ink px-8 py-4 font-heading text-sm font-semibold text-white transition-colors hover:bg-ink-soft disabled:opacity-60"
            >
                {status === "submitting" ? "Sending…" : "Send message"}
            </button>
        </form>
    );
}
