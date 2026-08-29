"use client";

import { useState } from "react";
import { Button, Checkbox, ErrorBanner, Field, Input, Select, Textarea } from "@/components/admin/AdminForm";
import DocumentUploader from "@/components/admin/DocumentUploader";
import type { Project, ProjectInput } from "@/lib/data";

const CATEGORIES: Project["category"][] = ["AI Automation", "Web Development", "Generative AI"];

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function uploadImage(file: File, folder: string): Promise<string> {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", folder);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = (await res.json().catch(() => ({ ok: false }))) as { ok: boolean; url?: string; error?: string };
    if (!res.ok || !data.ok || !data.url) throw new Error(data.error ?? "Upload failed.");
    return data.url;
}

export default function ProjectForm({
    initial,
    onSubmit,
    submitLabel,
}: {
    initial?: Project;
    onSubmit: (input: ProjectInput) => Promise<void>;
    submitLabel: string;
}) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [slug, setSlug] = useState(initial?.slug ?? "");
    const [slugTouched, setSlugTouched] = useState(Boolean(initial));
    const [category, setCategory] = useState<Project["category"]>(initial?.category ?? "AI Automation");
    const [year, setYear] = useState(initial?.year ?? new Date().getFullYear().toString());
    const [featured, setFeatured] = useState(initial?.featured ?? false);
    const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
    const [summary, setSummary] = useState(initial?.summary ?? "");
    const [thumbnail, setThumbnail] = useState(initial?.thumbnail ?? "");
    const [images, setImages] = useState<string[]>(initial?.images ?? []);
    const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
    const [challenge, setChallenge] = useState(initial?.challenge ?? "");
    const [solution, setSolution] = useState(initial?.solution ?? "");
    const [result, setResult] = useState(initial?.result ?? "");
    const [metrics, setMetrics] = useState(initial?.metrics ?? []);
    const [hasQuote, setHasQuote] = useState(Boolean(initial?.quote));
    const [quoteText, setQuoteText] = useState(initial?.quote?.text ?? "");
    const [quoteName, setQuoteName] = useState(initial?.quote?.name ?? "");
    const [quoteRole, setQuoteRole] = useState(initial?.quote?.role ?? "");

    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await onSubmit({
                title,
                slug,
                category,
                year,
                featured,
                sort_order: Number(sortOrder) || 0,
                summary,
                thumbnail,
                images,
                tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
                challenge,
                solution,
                result,
                metrics,
                quote: hasQuote ? { text: quoteText, name: quoteName, role: quoteRole } : null,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save project.");
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && <ErrorBanner message={error} />}

            <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Title" required>
                    <Input
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (!slugTouched) setSlug(slugify(e.target.value));
                        }}
                        required
                    />
                </Field>
                <Field label="Slug" required hint="Used in the URL: /work/<slug>">
                    <Input
                        value={slug}
                        onChange={(e) => {
                            setSlug(e.target.value);
                            setSlugTouched(true);
                        }}
                        required
                    />
                </Field>
                <Field label="Category" required>
                    <Select value={category} onChange={(e) => setCategory(e.target.value as Project["category"])}>
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </Select>
                </Field>
                <Field label="Year" required>
                    <Input value={year} onChange={(e) => setYear(e.target.value)} required />
                </Field>
                <Field label="Sort order" hint="Lower shows first">
                    <Input
                        type="number"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(Number(e.target.value))}
                    />
                </Field>
                <Field label="Tags" hint="Comma-separated">
                    <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="RAG, Analytics" />
                </Field>
            </div>

            <Checkbox label="Featured on the homepage" checked={featured} onChange={setFeatured} />

            <Field label="Summary" required>
                <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} required />
            </Field>

            <Field label="Thumbnail" hint="URL, or upload an image below">
                <Input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="/thumbnails/example.png" />
                <div className="mt-2">
                    <DocumentUploader
                        accept="image/*"
                        label="Drop a thumbnail image, or click to browse"
                        onUpload={async (file) => setThumbnail(await uploadImage(file, slug || "misc"))}
                    />
                </div>
            </Field>

            <Field label="Gallery images">
                <div className="space-y-2">
                    {images.map((img, i) => (
                        <div key={i} className="flex gap-2">
                            <Input
                                value={img}
                                onChange={(e) =>
                                    setImages(images.map((v, idx) => (idx === i ? e.target.value : v)))
                                }
                            />
                            <button
                                type="button"
                                onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                                className="px-3 text-sm text-white/40 hover:text-red-400"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-2">
                    <DocumentUploader
                        accept="image/*"
                        label="Drop a gallery image to add it, or click to browse"
                        onUpload={async (file) => setImages([...images, await uploadImage(file, slug || "misc")])}
                    />
                </div>
            </Field>

            <Field label="Challenge" required>
                <Textarea value={challenge} onChange={(e) => setChallenge(e.target.value)} rows={3} required />
            </Field>
            <Field label="Solution" required>
                <Textarea value={solution} onChange={(e) => setSolution(e.target.value)} rows={3} required />
            </Field>
            <Field label="Result" required>
                <Textarea value={result} onChange={(e) => setResult(e.target.value)} rows={3} required />
            </Field>

            <Field label="Metrics">
                <div className="space-y-2">
                    {metrics.map((m, i) => (
                        <div key={i} className="flex gap-2">
                            <Input
                                value={m.value}
                                placeholder="Value (e.g. 6)"
                                onChange={(e) =>
                                    setMetrics(metrics.map((v, idx) => (idx === i ? { ...v, value: e.target.value } : v)))
                                }
                            />
                            <Input
                                value={m.label}
                                placeholder="Label (e.g. pipeline stages)"
                                onChange={(e) =>
                                    setMetrics(metrics.map((v, idx) => (idx === i ? { ...v, label: e.target.value } : v)))
                                }
                            />
                            <button
                                type="button"
                                onClick={() => setMetrics(metrics.filter((_, idx) => idx !== i))}
                                className="px-3 text-sm text-white/40 hover:text-red-400"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => setMetrics([...metrics, { value: "", label: "" }])}
                    className="mt-2 text-xs font-medium text-white/60 hover:text-white"
                >
                    + Add metric
                </button>
            </Field>

            <div>
                <Checkbox label="Include a client quote" checked={hasQuote} onChange={setHasQuote} />
                {hasQuote && (
                    <div className="mt-4 space-y-4 border-l-2 border-white/10 pl-5">
                        <Field label="Quote text">
                            <Textarea value={quoteText} onChange={(e) => setQuoteText(e.target.value)} rows={3} />
                        </Field>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Name">
                                <Input value={quoteName} onChange={(e) => setQuoteName(e.target.value)} />
                            </Field>
                            <Field label="Role / company">
                                <Input value={quoteRole} onChange={(e) => setQuoteRole(e.target.value)} />
                            </Field>
                        </div>
                    </div>
                )}
            </div>

            <Button type="submit" disabled={submitting}>
                {submitting ? "Saving…" : submitLabel}
            </Button>
        </form>
    );
}
