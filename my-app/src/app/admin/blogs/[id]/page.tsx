"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import { Button } from "@/components/admin/AdminForm";
import type { BlogInput, BlogPost } from "@/lib/data";

export default function EditBlogPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        fetch(`/api/admin/blogs/${params.id}`)
            .then((res) => res.json() as Promise<{ ok: boolean; blog?: BlogPost }>)
            .then((data) => {
                if (data.ok && data.blog) setBlog(data.blog);
                else setNotFound(true);
            });
    }, [params.id]);

    async function handleSubmit(input: BlogInput) {
        const res = await fetch(`/api/admin/blogs/${params.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        });
        const data = (await res.json().catch(() => ({ ok: false }))) as {
            ok: boolean;
            blog?: BlogPost;
            error?: string;
        };
        if (!res.ok || !data.ok || !data.blog) {
            throw new Error(data.error ?? "Failed to update blog post.");
        }
        setBlog(data.blog);
    }

    async function handleDelete() {
        if (!blog) return;
        if (!confirm(`Delete "${blog.title}"?`)) return;
        await fetch(`/api/admin/blogs/${blog.id}`, { method: "DELETE" });
        router.push("/admin/blogs");
    }

    if (notFound) {
        return <p className="text-sm text-white/50">Blog post not found.</p>;
    }

    if (!blog) {
        return <p className="text-sm text-white/50">Loading…</p>;
    }

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="font-heading text-2xl font-bold text-white">{blog.title}</h1>
                <Button type="button" variant="danger" onClick={handleDelete}>
                    Delete post
                </Button>
            </div>

            <div className="mt-6">
                <BlogForm initial={blog} onSubmit={handleSubmit} submitLabel="Save changes" />
            </div>
        </div>
    );
}
