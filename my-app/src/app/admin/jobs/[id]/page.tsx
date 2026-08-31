"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DocumentUploader from "@/components/admin/DocumentUploader";
import { Button, Checkbox, ErrorBanner, Field, Input, Select, Textarea } from "@/components/admin/AdminForm";
import type { Job, JobDocument } from "@/lib/data";

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function JobDocumentsPanel({ jobId, jobSlug }: { jobId: number; jobSlug: string }) {
    const [documents, setDocuments] = useState<JobDocument[] | null>(null);

    function load() {
        fetch(`/api/admin/jobs/${jobId}/documents`)
            .then((res) => res.json() as Promise<{ ok: boolean; documents?: JobDocument[] }>)
            .then((data) => setDocuments(data.documents ?? []));
    }

    useEffect(load, [jobId]);

    async function handleUpload(file: File) {
        const formData = new FormData();
        formData.set("file", file);
        const res = await fetch(`/api/admin/jobs/${jobId}/documents`, { method: "POST", body: formData });
        const data = (await res.json().catch(() => ({ ok: false }))) as { ok: boolean; error?: string };
        if (!res.ok || !data.ok) throw new Error(data.error ?? "Upload failed.");
        load();
    }

    async function handleDelete(doc: JobDocument) {
        if (!confirm(`Delete "${doc.filename}"?`)) return;
        await fetch(`/api/admin/jobs/${jobId}/documents?documentId=${doc.id}`, { method: "DELETE" });
        load();
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-white/50">
                Upload additional job description PDFs, technical test specifications, or role documentation. Files are saved in R2 under{" "}
                <code className="text-white/70">jobs/{jobSlug}/</code> and linked on the careers page.
            </p>

            <DocumentUploader onUpload={handleUpload} />

            <div className="border border-white/10">
                {documents === null || documents.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-white/40">
                        {documents === null ? "Loading…" : "No specification documents attached yet."}
                    </p>
                ) : (
                    <ul className="divide-y divide-white/5">
                        {documents.map((doc) => (
                            <li key={doc.id} className="flex items-center justify-between gap-4 px-4 py-3">
                                <div className="min-w-0">
                                    <p className="truncate text-sm text-white/85">📎 {doc.filename}</p>
                                    <p className="text-xs text-white/40">{formatBytes(doc.size_bytes)}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(doc)}
                                    className="shrink-0 text-xs font-medium text-red-400 hover:text-red-300"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default function EditJobPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [job, setJob] = useState<Job | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [tab, setTab] = useState<"details" | "documents">("details");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form fields
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

    function populateForm(j: Job) {
        setJob(j);
        setTitle(j.title);
        setSlug(j.slug);
        setDepartment(j.department);
        setLocation(j.location);
        setType(j.type);
        setSummary(j.summary);
        setJdContent(j.jd_content || "");
        setResponsibilitiesText((j.responsibilities || []).join("\n"));
        setRequirementsText((j.requirements || []).join("\n"));
        setNiceToHaveText((j.nice_to_have || []).join("\n"));
        setActive(j.active);
    }

    useEffect(() => {
        fetch(`/api/admin/jobs/${params.id}`)
            .then((res) => res.json() as Promise<{ ok: boolean; job?: Job }>)
            .then((data) => {
                if (data.ok && data.job) populateForm(data.job);
                else setNotFound(true);
            })
            .catch(() => setNotFound(true));
    }, [params.id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim() || !slug.trim() || !summary.trim()) {
            setError("Title, slug, and short summary are required.");
            return;
        }

        setSaving(true);
        setError(null);
        setSuccess(false);

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
            const res = await fetch(`/api/admin/jobs/${params.id}`, {
                method: "PUT",
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
                }),
            });

            const data = (await res.json()) as { ok: boolean; job?: Job; error?: string };

            if (!res.ok || !data.ok || !data.job) {
                setError(data.error ?? "Failed to save changes.");
                setSaving(false);
                return;
            }

            populateForm(data.job);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch {
            setError("Could not reach the server. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!job) return;
        if (!confirm(`Delete opening "${job.title}"? This also removes attached documents.`)) return;
        await fetch(`/api/admin/jobs/${job.id}`, { method: "DELETE" });
        router.push("/admin/jobs");
    }

    if (notFound) {
        return (
            <div>
                <p className="text-sm text-white/50">Job opening not found.</p>
                <Link href="/admin/jobs" className="mt-4 inline-block text-xs text-white underline">
                    ← Return to Job Openings
                </Link>
            </div>
        );
    }

    if (!job) {
        return <p className="text-sm text-white/50">Loading job details…</p>;
    }

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Link href="/admin/jobs" className="text-xs text-white/50 hover:text-white">
                        ← Back to Job Openings
                    </Link>
                    <h1 className="mt-2 font-heading text-2xl font-bold text-white">{job.title}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/careers/${job.slug}`}
                        target="_blank"
                        className="border border-white/15 px-3 py-2 text-xs font-semibold text-white transition-colors hover:border-white/40"
                    >
                        View Live ↗
                    </Link>
                    <Button type="button" variant="danger" onClick={handleDelete}>
                        Delete Job Opening
                    </Button>
                </div>
            </div>

            <div className="mt-6 flex gap-1 border-b border-white/10">
                {(["details", "documents"] as const).map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setTab(t)}
                        className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                            tab === t ? "border-b-2 border-white text-white" : "text-white/45 hover:text-white/70"
                        }`}
                    >
                        {t === "documents" ? "Attached Documents" : "Job Details & JD"}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                {tab === "details" ? (
                    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                        {error && <ErrorBanner message={error} />}
                        {success && (
                            <div className="border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                                Job opening updated successfully.
                            </div>
                        )}

                        <div className="grid gap-6 sm:grid-cols-2">
                            <Field label="Job Title" required>
                                <Input
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. SEO Engineer"
                                />
                            </Field>

                            <Field label="URL Slug" required>
                                <Input
                                    required
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="seo-engineer"
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

                        <Field label="Short Summary" required hint="1-2 sentences displayed on cards & previews">
                            <Textarea
                                rows={2}
                                required
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                            />
                        </Field>

                        <Field label="Detailed Job Description (JD Content)" hint="Comprehensive role overview (Markdown supported)">
                            <Textarea
                                rows={8}
                                value={jdContent}
                                onChange={(e) => setJdContent(e.target.value)}
                                placeholder="Full job overview, scope of work, company mission, team structure..."
                            />
                        </Field>

                        <Field label="Key Responsibilities" hint="One responsibility per line">
                            <Textarea
                                rows={5}
                                value={responsibilitiesText}
                                onChange={(e) => setResponsibilitiesText(e.target.value)}
                            />
                        </Field>

                        <Field label="Requirements" hint="One requirement per line">
                            <Textarea
                                rows={5}
                                value={requirementsText}
                                onChange={(e) => setRequirementsText(e.target.value)}
                            />
                        </Field>

                        <Field label="Nice to Have (Optional)" hint="One bonus skill per line">
                            <Textarea
                                rows={4}
                                value={niceToHaveText}
                                onChange={(e) => setNiceToHaveText(e.target.value)}
                            />
                        </Field>

                        <div className="border-t border-white/10 pt-4">
                            <Checkbox
                                label="Published (active on /careers)"
                                checked={active}
                                onChange={setActive}
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                            <Button type="submit" disabled={saving}>
                                {saving ? "Saving…" : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <JobDocumentsPanel jobId={job.id} jobSlug={job.slug} />
                )}
            </div>
        </div>
    );
}

