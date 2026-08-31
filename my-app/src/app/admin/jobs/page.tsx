"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminTable from "@/components/admin/AdminTable";
import { Button } from "@/components/admin/AdminForm";
import type { Job } from "@/lib/data";

export default function AdminJobsPage() {
    const [jobs, setJobs] = useState<Job[] | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    function load() {
        fetch("/api/admin/jobs")
            .then((res) => res.json() as Promise<{ ok: boolean; jobs?: Job[] }>)
            .then((data) => setJobs(data.jobs ?? []));
    }

    useEffect(load, []);

    async function handleDelete(job: Job) {
        if (!confirm(`Delete opening for "${job.title}"? This also removes attached specification documents.`)) return;
        setDeletingId(job.id);
        try {
            await fetch(`/api/admin/jobs/${job.id}`, { method: "DELETE" });
            load();
        } finally {
            setDeletingId(null);
        }
    }

    async function toggleActive(job: Job) {
        try {
            await fetch(`/api/admin/jobs/${job.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active: !job.active }),
            });
            load();
        } catch {
            alert("Could not update status.");
        }
    }

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-white">Job Openings</h1>
                    <p className="mt-1 text-sm text-white/50">
                        Manage career openings, detailed JDs, and specification documents displayed on the careers page.
                    </p>
                </div>
                <Link href="/admin/jobs/new">
                    <Button type="button">+ Post Job Opening</Button>
                </Link>
            </div>

            <div className="mt-8">
                <AdminTable
                    rows={jobs ?? []}
                    rowKey={(j) => j.id}
                    emptyMessage={jobs === null ? "Loading…" : "No job openings posted yet."}
                    columns={[
                        {
                            header: "Job Title",
                            render: (j) => (
                                <div>
                                    <Link href={`/admin/jobs/${j.id}`} className="font-medium text-white hover:underline">
                                        {j.title}
                                    </Link>
                                    <p className="text-xs text-white/40">/careers/{j.slug}</p>
                                </div>
                            ),
                        },
                        {
                            header: "Department",
                            render: (j) => <span className="text-white/70">{j.department}</span>,
                        },
                        {
                            header: "Location & Type",
                            render: (j) => (
                                <span className="text-xs text-white/60">
                                    {j.location} · {j.type}
                                </span>
                            ),
                        },
                        {
                            header: "Status",
                            render: (j) => (
                                <button
                                    type="button"
                                    onClick={() => toggleActive(j)}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold transition-colors ${
                                        j.active
                                            ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                                            : "bg-white/10 text-white/40 hover:bg-white/20"
                                    }`}
                                >
                                    <span className={`size-1.5 rounded-full ${j.active ? "bg-emerald-400" : "bg-white/40"}`} />
                                    {j.active ? "Active" : "Draft"}
                                </button>
                            ),
                        },
                        {
                            header: "Actions",
                            className: "text-right",
                            render: (j) => (
                                <div className="flex items-center justify-end gap-3">
                                    <Link
                                        href={`/careers/${j.slug}`}
                                        target="_blank"
                                        className="text-xs text-white/50 hover:text-white hover:underline"
                                    >
                                        View Live ↗
                                    </Link>
                                    <Link
                                        href={`/admin/jobs/${j.id}`}
                                        className="text-xs text-white/80 hover:text-white hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(j)}
                                        disabled={deletingId === j.id}
                                        className="text-xs font-medium text-red-400 hover:text-red-300 disabled:opacity-50"
                                    >
                                        {deletingId === j.id ? "…" : "Delete"}
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

