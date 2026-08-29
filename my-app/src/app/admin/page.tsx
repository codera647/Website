"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BlogPost, Project } from "@/lib/data";

function StatCard({ label, value, href }: { label: string; value: number | string; href: string }) {
    return (
        <Link
            href={href}
            className="block border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/25"
        >
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-white/45">{label}</p>
        </Link>
    );
}

export default function AdminDashboardPage() {
    const [projects, setProjects] = useState<Project[] | null>(null);
    const [blogs, setBlogs] = useState<BlogPost[] | null>(null);

    useEffect(() => {
        fetch("/api/admin/projects")
            .then((res) => res.json() as Promise<{ ok: boolean; projects?: Project[] }>)
            .then((data) => setProjects(data.projects ?? []));
        fetch("/api/admin/blogs")
            .then((res) => res.json() as Promise<{ ok: boolean; blogs?: BlogPost[] }>)
            .then((data) => setBlogs(data.blogs ?? []));
    }, []);

    const publishedBlogs = blogs?.filter((b) => b.published).length ?? 0;
    const draftBlogs = blogs ? blogs.length - publishedBlogs : 0;

    return (
        <div>
            <h1 className="font-heading text-2xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-white/50">An overview of your site's content.</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <StatCard label="Projects" value={projects?.length ?? "…"} href="/admin/projects" />
                <StatCard label="Published posts" value={blogs ? publishedBlogs : "…"} href="/admin/blogs" />
                <StatCard label="Draft posts" value={blogs ? draftBlogs : "…"} href="/admin/blogs" />
            </div>

            <div className="mt-10 flex gap-3">
                <Link
                    href="/admin/projects/new"
                    className="border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/40"
                >
                    + New project
                </Link>
                <Link
                    href="/admin/blogs/new"
                    className="border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/40"
                >
                    + New blog post
                </Link>
            </div>
        </div>
    );
}
