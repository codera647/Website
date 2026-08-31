"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProjectForm from "@/components/admin/ProjectForm";
import DocumentUploader from "@/components/admin/DocumentUploader";
import { Button } from "@/components/admin/AdminForm";
import type { Project, ProjectDocument, ProjectInput } from "@/lib/data";

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DocumentsPanel({ projectId }: { projectId: number }) {
    const [documents, setDocuments] = useState<ProjectDocument[] | null>(null);

    function load() {
        fetch(`/api/admin/projects/${projectId}/documents`)
            .then((res) => res.json() as Promise<{ ok: boolean; documents?: ProjectDocument[] }>)
            .then((data) => setDocuments(data.documents ?? []));
    }

    useEffect(load, [projectId]);

    async function handleUpload(file: File) {
        const formData = new FormData();
        formData.set("file", file);
        const res = await fetch(`/api/admin/projects/${projectId}/documents`, { method: "POST", body: formData });
        const data = (await res.json().catch(() => ({ ok: false }))) as { ok: boolean; error?: string };
        if (!res.ok || !data.ok) throw new Error(data.error ?? "Upload failed.");
        load();
    }

    async function handleDelete(doc: ProjectDocument) {
        if (!confirm(`Delete "${doc.filename}"?`)) return;
        await fetch(`/api/admin/projects/${projectId}/documents?documentId=${doc.id}`, { method: "DELETE" });
        load();
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-white/50">
                Documents uploaded here feed this project&apos;s RAG assistant. They&apos;re stored in R2 under{" "}
                <code className="text-white/70">projects/&lt;slug&gt;/</code>.
            </p>

            <DocumentUploader onUpload={handleUpload} />

            <div className="border border-white/10">
                {documents === null || documents.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-white/40">
                        {documents === null ? "Loading…" : "No documents uploaded yet."}
                    </p>
                ) : (
                    <ul className="divide-y divide-white/5">
                        {documents.map((doc) => (
                            <li key={doc.id} className="flex items-center justify-between gap-4 px-4 py-3">
                                <div className="min-w-0">
                                    <p className="truncate text-sm text-white/85">{doc.filename}</p>
                                    <p className="text-xs text-white/40">{formatBytes(doc.size_bytes)}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(doc)}
                                    className="shrink-0 text-xs font-medium text-red-400 hover:text-red-300"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default function EditProjectPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [tab, setTab] = useState<"details" | "documents">("details");
    const [savedSuccess, setSavedSuccess] = useState(false);

    useEffect(() => {
        fetch(`/api/admin/projects/${params.id}`)
            .then((res) => res.json() as Promise<{ ok: boolean; project?: Project }>)
            .then((data) => {
                if (data.ok && data.project) setProject(data.project);
                else setNotFound(true);
            })
            .catch(() => setNotFound(true));
    }, [params.id]);

    async function handleSubmit(input: ProjectInput) {
        const res = await fetch(`/api/admin/projects/${params.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        });
        const data = (await res.json().catch(() => ({ ok: false }))) as {
            ok: boolean;
            project?: Project;
            error?: string;
        };
        if (!res.ok || !data.ok || !data.project) {
            throw new Error(data.error ?? "Failed to update project.");
        }
        setProject(data.project);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
    }

    async function handleDelete() {
        if (!project) return;
        if (!confirm(`Delete "${project.title}"? This also removes its uploaded RAG documents.`)) return;
        await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
        router.push("/admin/projects");
    }

    if (notFound) {
        return (
            <div>
                <p className="text-sm text-white/50">Project not found.</p>
                <Link href="/admin/projects" className="mt-4 inline-block text-xs text-white underline">
                    ← Return to Projects
                </Link>
            </div>
        );
    }

    if (!project) {
        return <p className="text-sm text-white/50">Loading project details…</p>;
    }

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Link href="/admin/projects" className="text-xs text-white/50 hover:text-white">
                        ← Back to Projects
                    </Link>
                    <h1 className="mt-2 font-heading text-2xl font-bold text-white">Edit: {project.title}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/work/${project.slug}`}
                        target="_blank"
                        className="border border-white/15 px-3 py-2 text-xs font-semibold text-white transition-colors hover:border-white/40"
                    >
                        View Live ↗
                    </Link>
                    <Button type="button" variant="danger" onClick={handleDelete}>
                        Delete project
                    </Button>
                </div>
            </div>

            {savedSuccess && (
                <div className="mt-6 border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                    Project updated successfully.
                </div>
            )}

            <div className="mt-6 flex gap-1 border-b border-white/10">
                {(["details", "documents"] as const).map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setTab(t)}
                        className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                            tab === t ? "border-b-2 border-white text-white" : "text-white/45 hover:text-white/70"
                        }`}
                    >
                        {t === "details" ? "Project Information" : "RAG Documents"}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                {tab === "details" ? (
                    <ProjectForm initial={project} onSubmit={handleSubmit} submitLabel="Save changes" />
                ) : (
                    <DocumentsPanel projectId={project.id} />
                )}
            </div>
        </div>
    );
}
