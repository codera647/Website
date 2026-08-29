"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminTable from "@/components/admin/AdminTable";
import { Button } from "@/components/admin/AdminForm";
import type { BlogPost } from "@/lib/data";

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<BlogPost[] | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    function load() {
        fetch("/api/admin/blogs")
            .then((res) => res.json() as Promise<{ ok: boolean; blogs?: BlogPost[] }>)
            .then((data) => setBlogs(data.blogs ?? []));
    }

    useEffect(load, []);

    async function handleDelete(blog: BlogPost) {
        if (!confirm(`Delete "${blog.title}"?`)) return;
        setDeletingId(blog.id);
        try {
            await fetch(`/api/admin/blogs/${blog.id}`, { method: "DELETE" });
            load();
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="font-heading text-2xl font-bold text-white">Blogs</h1>
                <Link href="/admin/blogs/new">
                    <Button type="button">+ New post</Button>
                </Link>
            </div>

            <div className="mt-6">
                <AdminTable
                    rows={blogs ?? []}
                    rowKey={(b) => b.id}
                    emptyMessage={blogs === null ? "Loading…" : "No blog posts yet."}
                    columns={[
                        {
                            header: "Title",
                            render: (b) => (
                                <Link href={`/admin/blogs/${b.id}`} className="font-medium text-white hover:underline">
                                    {b.title}
                                </Link>
                            ),
                        },
                        { header: "Category", render: (b) => <span className="text-white/60">{b.category}</span> },
                        { header: "Date", render: (b) => <span className="text-white/60">{formatDate(b.date)}</span> },
                        {
                            header: "Status",
                            render: (b) =>
                                b.published ? (
                                    <span className="text-white/80">Published</span>
                                ) : (
                                    <span className="text-white/40">Draft</span>
                                ),
                        },
                        {
                            header: "",
                            className: "text-right",
                            render: (b) => (
                                <button
                                    type="button"
                                    onClick={() => handleDelete(b)}
                                    disabled={deletingId === b.id}
                                    className="text-xs font-medium text-red-400 hover:text-red-300 disabled:opacity-50"
                                >
                                    {deletingId === b.id ? "Deleting…" : "Delete"}
                                </button>
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    );
}
