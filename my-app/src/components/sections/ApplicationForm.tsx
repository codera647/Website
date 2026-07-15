"use client";

import { useState } from "react";

/**
 * Job application form (careers detail page). Required: name, email,
 * CV/resume file. Optional: cover letter, additional information.
 * Submits multipart/form-data to /api/careers/apply, which emails
 * careers@thekinetiq.solutions via Resend with the CV attached and
 * the applicant's own email set as reply-to.
 *
 * Designed for a dark section background (bg-ink), unlike ContactForm.
 */

interface Props {
    roleTitle: string;
}

interface Fields {
    name: string;
    email: string;
    coverLetter: string;
    additionalInfo: string;
}

const empty: Fields = { name: "", email: "", coverLetter: "", additionalInfo: "" };
const MAX_CV_BYTES = 5 * 1024 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ApplicationForm({ roleTitle }: Props) {
    const [fields, setFields] = useState<Fields>(empty);
    const [cv, setCv] = useState<File | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof Fields | "cv", string>>>({});
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [serverError, setServerError] = useState<string | null>(null);

    const validate = (): boolean => {
        const next: Partial<Record<keyof Fields | "cv", string>> = {};
        if (!fields.name.trim()) next.name = "Please tell us your name.";
        if (!EMAIL_RE.test(fields.email)) next.email = "Please enter a valid email.";
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
            formData.set("roleTitle", roleTitle);
            formData.set("coverLetter", fields.coverLetter);
            formData.set("additionalInfo", fields.additionalInfo);
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
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
                <p className="font-heading text-2xl font-semibold text-white">Application sent.</p>
                <p className="mt-3 text-white/60">
                    Thanks for applying to {roleTitle}. A real person reads every
                    application and will get back to you.
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 font-heading text-sm font-semibold text-white underline underline-offset-4"
                >
                    Submit another application
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-xl space-y-5 text-left">
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="app-name" className="mb-2 block font-heading text-sm font-medium text-white">
                        Name
                    </label>
                    <input
                        id="app-name"
                        type="text"
                        placeholder="Jane Doe"
                        value={fields.name}
                        onChange={set("name")}
                        required
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "app-name-error" : undefined}
                        className={inputClass}
                    />
                    {errors.name && (
                        <p id="app-name-error" role="alert" className="mt-1.5 text-sm text-white/70">
                            {errors.name}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="app-email" className="mb-2 block font-heading text-sm font-medium text-white">
                        Email
                    </label>
                    <input
                        id="app-email"
                        type="email"
                        placeholder="jane@email.com"
                        value={fields.email}
                        onChange={set("email")}
                        required
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "app-email-error" : undefined}
                        className={inputClass}
                    />
                    {errors.email && (
                        <p id="app-email-error" role="alert" className="mt-1.5 text-sm text-white/70">
                            {errors.email}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="app-cv" className="mb-2 block font-heading text-sm font-medium text-white">
                    CV / resume <span className="text-white/40">(PDF or Word, max 5MB)</span>
                </label>
                <input
                    id="app-cv"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    required
                    onChange={(e) => {
                        setCv(e.target.files?.[0] ?? null);
                        setErrors((er) => ({ ...er, cv: undefined }));
                    }}
                    aria-invalid={!!errors.cv}
                    aria-describedby={errors.cv ? "app-cv-error" : undefined}
                    className="block w-full text-sm text-white/70 file:mr-4 file:rounded-none file:border file:border-white/15 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white file:transition-colors hover:file:bg-white/15"
                />
                {errors.cv && (
                    <p id="app-cv-error" role="alert" className="mt-1.5 text-sm text-white/70">
                        {errors.cv}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="app-cover" className="mb-2 block font-heading text-sm font-medium text-white">
                    Cover letter <span className="text-white/40">(optional)</span>
                </label>
                <textarea
                    id="app-cover"
                    rows={4}
                    placeholder="Why this role, why Kinetiq…"
                    value={fields.coverLetter}
                    onChange={set("coverLetter")}
                    className={inputClass}
                />
            </div>

            <div>
                <label htmlFor="app-additional" className="mb-2 block font-heading text-sm font-medium text-white">
                    Additional information <span className="text-white/40">(optional)</span>
                </label>
                <textarea
                    id="app-additional"
                    rows={3}
                    placeholder="Portfolio links, availability, anything else…"
                    value={fields.additionalInfo}
                    onChange={set("additionalInfo")}
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
                className="inline-flex items-center gap-2 rounded-none bg-white px-7 py-3.5 font-heading text-sm font-semibold text-ink transition-colors hover:bg-white/85 disabled:opacity-60"
            >
                {status === "submitting" ? "Sending…" : "Submit application"}
                {status !== "submitting" && <span aria-hidden="true">→</span>}
            </button>
        </form>
    );
}
