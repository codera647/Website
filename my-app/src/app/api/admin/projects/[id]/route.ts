import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getBucket } from "@/lib/db";
import {
    deleteProject,
    getProjectById,
    getProjectDocuments,
    updateProject,
    type ProjectInput,
} from "@/lib/data";

function parseId(idParam: string): number | null {
    const id = Number(idParam);
    return Number.isInteger(id) && id > 0 ? id : null;
}

/** GET — single project. */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const id = parseId((await params).id);
    if (id === null) {
        return NextResponse.json({ ok: false, error: "Invalid project id." }, { status: 400 });
    }

    const project = await getProjectById(id);
    if (!project) {
        return NextResponse.json({ ok: false, error: "Project not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, project });
}

/** PUT — update a project. */
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const id = parseId((await params).id);
    if (id === null) {
        return NextResponse.json({ ok: false, error: "Invalid project id." }, { status: 400 });
    }

    const existing = await getProjectById(id);
    if (!existing) {
        return NextResponse.json({ ok: false, error: "Project not found." }, { status: 404 });
    }

    let body: Partial<ProjectInput>;
    try {
        body = (await request.json()) as Partial<ProjectInput>;
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }

    try {
        const project = await updateProject(id, {
            slug: body.slug ?? existing.slug,
            title: body.title ?? existing.title,
            category: body.category ?? existing.category,
            tags: body.tags ?? existing.tags,
            summary: body.summary ?? existing.summary,
            thumbnail: body.thumbnail ?? existing.thumbnail,
            images: body.images ?? existing.images,
            year: body.year ?? existing.year,
            featured: body.featured ?? existing.featured,
            challenge: body.challenge ?? existing.challenge,
            solution: body.solution ?? existing.solution,
            result: body.result ?? existing.result,
            metrics: body.metrics ?? existing.metrics,
            quote: body.quote !== undefined ? body.quote : existing.quote,
            sort_order: body.sort_order ?? existing.sort_order,
        });
        return NextResponse.json({ ok: true, project });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update project.";
        const isDuplicate = message.includes("UNIQUE constraint failed");
        return NextResponse.json(
            { ok: false, error: isDuplicate ? "A project with that slug already exists." : message },
            { status: isDuplicate ? 409 : 500 }
        );
    }
}

/** DELETE — delete a project and cascade-delete its R2 documents. */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const id = parseId((await params).id);
    if (id === null) {
        return NextResponse.json({ ok: false, error: "Invalid project id." }, { status: 400 });
    }

    const existing = await getProjectById(id);
    if (!existing) {
        return NextResponse.json({ ok: false, error: "Project not found." }, { status: 404 });
    }

    const docs = await getProjectDocuments(id);
    const bucket = getBucket();
    await Promise.all(
        docs.map((doc) => bucket.delete(doc.r2_key).catch(() => undefined))
    );

    await deleteProject(id);
    return NextResponse.json({ ok: true });
}
