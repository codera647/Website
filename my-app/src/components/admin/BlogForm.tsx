"use client";

import { useState } from "react";
import { Button, Checkbox, ErrorBanner, Field, Input, Select, Textarea } from "@/components/admin/AdminForm";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import type { BlogInput, BlogPost } from "@/lib/data";

const CATEGORIES: BlogPost["category"][] = ["Company", "Robotics", "Computer Vision", "Drones"];

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function todayISO(): string {
    return new Date().toISOString().slice(0, 10);
}

export default function BlogForm({
    initial,
    onSubmit,
    submitLabel,
}: {
    initial?: BlogPost;
    onSubmit: (input: BlogInput) => Promise<void>;
    submitLabel: string;
}) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [slug, setSlug] = useState(initial?.slug ?? "");
    const [slugTouched, setSlugTouched] = useState(Boolean(initial));
    const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
    const [category, setCategory] = useState<BlogPost["category"]>(initial?.category ?? "Company");
    const [date, setDate] = useState(initial?.date ?? todayISO());
    const [readTime, setReadTime] = useState(initial?.read_time ?? 3);
    const [content, setContent] = useState(initial?.content ?? "");
    const [published, setPublished] = useState(initial?.published ?? true);

    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await onSubmit({ title, slug, excerpt, category, date, read_time: Number(readTime) || 3, content, published });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save blog post.");
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
                <Field label="Slug" required hint="Used in the URL: /blog/<slug>">
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
                    <Select value={category} onChange={(e) => setCategory(e.target.value as BlogPost["category"])}>
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </Select>
                </Field>
                <Field label="Date" required>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </Field>
                <Field label="Read time" hint="Minutes">
                    <Input type="number" min={1} value={readTime} onChange={(e) => setReadTime(Number(e.target.value))} />
                </Field>
            </div>

            <Checkbox label="Published" checked={published} onChange={setPublished} />

            <Field label="Excerpt" required hint="Shown on the blog list and in link previews">
                <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} required />
            </Field>

            <Field label="Body" required>
                <MarkdownEditor value={content} onChange={setContent} />
            </Field>

            <Button type="submit" disabled={submitting}>
                {submitting ? "Saving…" : submitLabel}
            </Button>
        </form>
    );
}
