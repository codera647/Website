"use client";

import { useRouter } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import type { Project, ProjectInput } from "@/lib/data";

export default function NewProjectPage() {
    const router = useRouter();

    async function handleSubmit(input: ProjectInput) {
        const res = await fetch("/api/admin/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        });
        const data = (await res.json().catch(() => ({ ok: false }))) as {
            ok: boolean;
            project?: Project;
            error?: string;
        };
        if (!res.ok || !data.ok || !data.project) {
            throw new Error(data.error ?? "Failed to create project.");
        }
        router.push(`/admin/projects/${data.project.id}`);
    }

    return (
        <div>
            <h1 className="font-heading text-2xl font-bold text-white">New project</h1>
            <div className="mt-6">
                <ProjectForm onSubmit={handleSubmit} submitLabel="Create project" />
            </div>
        </div>
    );
}
