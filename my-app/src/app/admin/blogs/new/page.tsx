"use client";

import { useRouter } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import type { BlogInput, BlogPost } from "@/lib/data";

export default function NewBlogPage() {
    const router = useRouter();

    async function handleSubmit(input: BlogInput) {
        const res = await fetch("/api/admin/blogs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        });
        const data = (await res.json().catch(() => ({ ok: false }))) as {
            ok: boolean;
            blog?: BlogPost;
            error?: string;
        };
        if (!res.ok || !data.ok || !data.blog) {
            throw new Error(data.error ?? "Failed to create blog post.");
        }
        router.push(`/admin/blogs/${data.blog.id}`);
    }

    return (
        <div>
            <h1 className="font-heading text-2xl font-bold text-white">New blog post</h1>
            <div className="mt-6">
                <BlogForm onSubmit={handleSubmit} submitLabel="Create post" />
            </div>
        </div>
    );
}
