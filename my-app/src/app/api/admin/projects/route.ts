import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createProject, getAllProjects, type ProjectInput } from "@/lib/data";

/** GET — list all projects (sorted by sort_order). */
export async function GET(request: Request) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const projects = await getAllProjects();
    return NextResponse.json({ ok: true, projects });
}

/** POST — create a new project. */
export async function POST(request: Request) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    let body: Partial<ProjectInput>;
    try {
        body = (await request.json()) as Partial<ProjectInput>;
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }

    if (!body.slug || !body.title || !body.category) {
        return NextResponse.json(
            { ok: false, error: "slug, title, and category are required." },
            { status: 400 }
        );
    }

    try {
        const project = await createProject({
            slug: body.slug,
            title: body.title,
            category: body.category,
            tags: body.tags ?? [],
            summary: body.summary ?? "",
            thumbnail: body.thumbnail ?? "",
            images: body.images ?? [],
            year: body.year ?? new Date().getFullYear().toString(),
            featured: body.featured ?? false,
            challenge: body.challenge ?? "",
            solution: body.solution ?? "",
            result: body.result ?? "",
            metrics: body.metrics ?? [],
            quote: body.quote ?? null,
            sort_order: body.sort_order ?? 0,
        });
        return NextResponse.json({ ok: true, project }, { status: 201 });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create project.";
        const isDuplicate = message.includes("UNIQUE constraint failed");
        return NextResponse.json(
            { ok: false, error: isDuplicate ? "A project with that slug already exists." : message },
            { status: isDuplicate ? 409 : 500 }
        );
    }
}
