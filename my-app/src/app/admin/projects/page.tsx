"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminTable from "@/components/admin/AdminTable";
import { Button } from "@/components/admin/AdminForm";
import type { Project } from "@/lib/data";

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[] | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    function load() {
        fetch("/api/admin/projects")
            .then((res) => res.json() as Promise<{ ok: boolean; projects?: Project[] }>)
            .then((data) => setProjects(data.projects ?? []));
    }

    useEffect(load, []);

    async function handleDelete(project: Project) {
        if (!confirm(`Delete "${project.title}"? This also removes its uploaded RAG documents.`)) return;
        setDeletingId(project.id);
        try {
            await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
            load();
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-white">Projects</h1>
                    <p className="mt-1 text-sm text-white/50">
                        Manage portfolio case studies, system architectures, and RAG documents.
                    </p>
                </div>
                <Link href="/admin/projects/new">
                    <Button type="button">+ Add project</Button>
                </Link>
            </div>

            <div className="mt-6">
                <AdminTable
                    rows={projects ?? []}
                    rowKey={(p) => p.id}
                    emptyMessage={projects === null ? "Loading…" : "No projects yet."}
                    columns={[
                        {
                            header: "Title",
                            render: (p) => (
                                <div>
                                    <Link href={`/admin/projects/${p.id}`} className="font-medium text-white hover:underline">
                                        {p.title}
                                    </Link>
                                    <p className="text-xs text-white/40">/work/{p.slug}</p>
                                </div>
                            ),
                        },
                        { header: "Category", render: (p) => <span className="text-white/60">{p.category}</span> },
                        {
                            header: "Featured",
                            render: (p) => (p.featured ? <span className="text-emerald-400 font-semibold text-xs">Featured</span> : <span className="text-white/30 text-xs">No</span>),
                        },
                        { header: "Order", render: (p) => <span className="text-white/60">{p.sort_order}</span> },
                        {
                            header: "Actions",
                            className: "text-right",
                            render: (p) => (
                                <div className="flex items-center justify-end gap-3">
                                    <Link
                                        href={`/work/${p.slug}`}
                                        target="_blank"
                                        className="text-xs text-white/50 hover:text-white hover:underline"
                                    >
                                        View Live ↗
                                    </Link>
                                    <Link
                                        href={`/admin/projects/${p.id}`}
                                        className="text-xs font-semibold text-white/90 hover:text-white hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(p)}
                                        disabled={deletingId === p.id}
                                        className="text-xs font-medium text-red-400 hover:text-red-300 disabled:opacity-50"
                                    >
                                        {deletingId === p.id ? "Deleting…" : "Delete"}
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
