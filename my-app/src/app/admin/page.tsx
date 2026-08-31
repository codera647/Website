"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BlogPost, Job, Project } from "@/lib/data";

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
    const [jobs, setJobs] = useState<Job[] | null>(null);

    useEffect(() => {
        fetch("/api/admin/projects")
            .then((res) => res.json() as Promise<{ ok: boolean; projects?: Project[] }>)
            .then((data) => setProjects(data.projects ?? []));
        fetch("/api/admin/blogs")
            .then((res) => res.json() as Promise<{ ok: boolean; blogs?: BlogPost[] }>)
            .then((data) => setBlogs(data.blogs ?? []));
        fetch("/api/admin/jobs")
            .then((res) => res.json() as Promise<{ ok: boolean; jobs?: Job[] }>)
            .then((data) => setJobs(data.jobs ?? []));
    }, []);

    const publishedBlogs = blogs?.filter((b) => b.published).length ?? 0;
    const activeJobs = jobs?.filter((j) => j.active).length ?? 0;

    return (
        <div>
            <h1 className="font-heading text-2xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-white/50">An overview of your site's content and careers.</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-4">
                <StatCard label="Projects" value={projects?.length ?? "…"} href="/admin/projects" />
                <StatCard label="Active Jobs" value={jobs ? activeJobs : "…"} href="/admin/jobs" />
                <StatCard label="Published posts" value={blogs ? publishedBlogs : "…"} href="/admin/blogs" />
                <StatCard label="Total Jobs" value={jobs?.length ?? "…"} href="/admin/jobs" />
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
                <Link
                    href="/admin/jobs/new"
                    className="border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
                >
                    + Post new job opening
                </Link>
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
