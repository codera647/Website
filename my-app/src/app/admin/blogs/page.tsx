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
                <div>
                    <h1 className="font-heading text-2xl font-bold text-white">Blogs</h1>
                    <p className="mt-1 text-sm text-white/50">Manage published articles and draft insights.</p>
                </div>
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
                                <div>
                                    <Link href={`/admin/blogs/${b.id}`} className="font-medium text-white hover:underline">
                                        {b.title}
                                    </Link>
                                    <p className="text-xs text-white/40">/blog/{b.slug}</p>
                                </div>
                            ),
                        },
                        { header: "Category", render: (b) => <span className="text-white/60">{b.category}</span> },
                        { header: "Date", render: (b) => <span className="text-white/60">{formatDate(b.date)}</span> },
                        {
                            header: "Status",
                            render: (b) =>
                                b.published ? (
                                    <span className="text-emerald-400 font-semibold text-xs">Published</span>
                                ) : (
                                    <span className="text-white/40 text-xs">Draft</span>
                                ),
                        },
                        {
                            header: "Actions",
                            className: "text-right",
                            render: (b) => (
                                <div className="flex items-center justify-end gap-3">
                                    {b.published && (
                                        <Link
                                            href={`/blog/${b.slug}`}
                                            target="_blank"
                                            className="text-xs text-white/50 hover:text-white hover:underline"
                                        >
                                            View Live ↗
                                        </Link>
                                    )}
                                    <Link
                                        href={`/admin/blogs/${b.id}`}
                                        className="text-xs font-semibold text-white/90 hover:text-white hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(b)}
                                        disabled={deletingId === b.id}
                                        className="text-xs font-medium text-red-400 hover:text-red-300 disabled:opacity-50"
                                    >
                                        {deletingId === b.id ? "…" : "Delete"}
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    );
}
