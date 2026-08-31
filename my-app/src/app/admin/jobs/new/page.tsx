"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Checkbox, ErrorBanner, Field, Input, Select, Textarea } from "@/components/admin/AdminForm";
import type { Job } from "@/lib/data";

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function NewJobPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [department, setDepartment] = useState("Engineering");
    const [location, setLocation] = useState("Remote");
    const [type, setType] = useState<Job["type"]>("Full-time");
    const [summary, setSummary] = useState("");
    const [jdContent, setJdContent] = useState("");
    const [responsibilitiesText, setResponsibilitiesText] = useState("");
    const [requirementsText, setRequirementsText] = useState("");
    const [niceToHaveText, setNiceToHaveText] = useState("");
    const [active, setActive] = useState(true);

    function handleTitleChange(val: string) {
        setTitle(val);
        if (!slug || slug === slugify(title)) {
            setSlug(slugify(val));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim() || !slug.trim() || !summary.trim()) {
            setError("Title, slug, and short summary are required.");
            return;
        }

        setSubmitting(true);
        setError(null);

        const responsibilities = responsibilitiesText
            .split("\n")
            .map((l) => l.trim().replace(/^[-*•]\s*/, ""))
            .filter(Boolean);

        const requirements = requirementsText
            .split("\n")
            .map((l) => l.trim().replace(/^[-*•]\s*/, ""))
            .filter(Boolean);

        const niceToHave = niceToHaveText
            .split("\n")
            .map((l) => l.trim().replace(/^[-*•]\s*/, ""))
            .filter(Boolean);

        try {
            const res = await fetch("/api/admin/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    slug: slug.trim(),
                    department: department.trim(),
                    location: location.trim(),
                    type,
                    summary: summary.trim(),
                    jd_content: jdContent.trim(),
                    responsibilities,
                    requirements,
                    nice_to_have: niceToHave,
                    active,
                    posted_date: new Date().toISOString().slice(0, 7),
                }),
            });

            const data = (await res.json()) as { ok: boolean; job?: Job; error?: string };

            if (!res.ok || !data.ok || !data.job) {
                setError(data.error ?? "Failed to create job opening.");
                setSubmitting(false);
                return;
            }

            router.push(`/admin/jobs/${data.job.id}`);
        } catch {
            setError("Could not reach the server. Please try again.");
            setSubmitting(false);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/admin/jobs" className="text-xs text-white/50 hover:text-white">
                        ← Back to Job Openings
                    </Link>
                    <h1 className="mt-2 font-heading text-2xl font-bold text-white">Post New Job Opening</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-6">
                {error && <ErrorBanner message={error} />}

                <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Job Title" required hint="e.g. SEO Engineer or Web Developer">
                        <Input
                            required
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Web Developer"
                        />
                    </Field>

                    <Field label="URL Slug" required hint="e.g. web-developer">
                        <Input
                            required
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="web-developer"
                        />
                    </Field>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                    <Field label="Department" required>
                        <Input
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            placeholder="Engineering"
                        />
                    </Field>

                    <Field label="Location" required>
                        <Input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Remote"
                        />
                    </Field>

                    <Field label="Employment Type" required>
                        <Select
                            value={type}
                            onChange={(e) => setType(e.target.value as Job["type"])}
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                        </Select>
                    </Field>
                </div>

                <Field label="Short Summary" required hint="1-2 sentences displayed on role cards and search results">
                    <Textarea
                        rows={2}
                        required
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Build and scale high-performance web applications and customer portals using Next.js and Cloudflare infrastructure."
                    />
                </Field>

                <Field label="Detailed Job Description (JD Content)" hint="Comprehensive role overview and description (Markdown supported)">
                    <Textarea
                        rows={6}
                        value={jdContent}
                        onChange={(e) => setJdContent(e.target.value)}
                        placeholder="We are looking for a Web Developer to join Kinetiq. You will work on production client systems, programmatic SEO engines, customer portals..."
                    />
                </Field>

                <Field label="Key Responsibilities" hint="One responsibility per line">
                    <Textarea
                        rows={4}
                        value={responsibilitiesText}
                        onChange={(e) => setResponsibilitiesText(e.target.value)}
                        placeholder="Engineer scalable full-stack web applications&#10;Build and optimize programmatic SEO engines&#10;Integrate with third-party APIs and databases"
                    />
                </Field>

                <Field label="Requirements" hint="One requirement per line">
                    <Textarea
                        rows={4}
                        value={requirementsText}
                        onChange={(e) => setRequirementsText(e.target.value)}
                        placeholder="2+ years of professional experience with React, Next.js, and TypeScript&#10;Solid grasp of edge computing, APIs, and databases&#10;Autonomous ownership mindset"
                    />
                </Field>

                <Field label="Nice to Have (Optional)" hint="One bonus skill per line">
                    <Textarea
                        rows={3}
                        value={niceToHaveText}
                        onChange={(e) => setNiceToHaveText(e.target.value)}
                        placeholder="Experience with Cloudflare Workers / D1 / R2&#10;Experience with AI APIs (Cloudflare Workers AI, OpenAI)&#10;Understanding of Technical SEO"
                    />
                </Field>

                <div className="border-t border-white/10 pt-4">
                    <Checkbox
                        label="Publish immediately (active on /careers)"
                        checked={active}
                        onChange={setActive}
                    />
                </div>

                <div className="flex items-center gap-3 pt-4">
                    <Button type="submit" disabled={submitting}>
                        {submitting ? "Creating…" : "Save & Add Documents →"}
                    </Button>
                    <Link href="/admin/jobs">
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}

