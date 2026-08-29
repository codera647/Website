import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getBucket } from "@/lib/db";
import {
    addProjectDocument,
    deleteProjectDocument,
    getProjectById,
    getProjectDocumentById,
    getProjectDocuments,
} from "@/lib/data";

function parseId(idParam: string): number | null {
    const id = Number(idParam);
    return Number.isInteger(id) && id > 0 ? id : null;
}

/** GET — list RAG documents for a project. */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const projectId = parseId((await params).id);
    if (projectId === null) {
        return NextResponse.json({ ok: false, error: "Invalid project id." }, { status: 400 });
    }

    const documents = await getProjectDocuments(projectId);
    return NextResponse.json({ ok: true, documents });
}

/**
 * POST — upload a RAG document to R2 (`projects/<slug>/<filename>`) and
 * record its metadata in D1. Expects multipart/form-data with a `file` field.
 */
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const projectId = parseId((await params).id);
    if (projectId === null) {
        return NextResponse.json({ ok: false, error: "Invalid project id." }, { status: 400 });
    }

    const project = await getProjectById(projectId);
    if (!project) {
        return NextResponse.json({ ok: false, error: "Project not found." }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
        return NextResponse.json({ ok: false, error: "A file is required." }, { status: 400 });
    }
    if (file.size > 20 * 1024 * 1024) {
        return NextResponse.json({ ok: false, error: "File must be under 20MB." }, { status: 400 });
    }

    const safeName = file.name.replace(/[^\w.\-]/g, "_");
    const r2Key = `projects/${project.slug}/${safeName}`;

    const bucket = getBucket();
    await bucket.put(r2Key, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type || "application/octet-stream" },
    });

    const document = await addProjectDocument(projectId, safeName, r2Key, file.size);
    return NextResponse.json({ ok: true, document }, { status: 201 });
}

/** DELETE — remove a document from R2 + D1. Expects `?documentId=` query param. */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const projectId = parseId((await params).id);
    if (projectId === null) {
        return NextResponse.json({ ok: false, error: "Invalid project id." }, { status: 400 });
    }

    const url = new URL(request.url);
    const documentId = parseId(url.searchParams.get("documentId") ?? "");
    if (documentId === null) {
        return NextResponse.json({ ok: false, error: "documentId query param is required." }, { status: 400 });
    }

    const document = await getProjectDocumentById(documentId);
    if (!document || document.project_id !== projectId) {
        return NextResponse.json({ ok: false, error: "Document not found." }, { status: 404 });
    }

    const bucket = getBucket();
    await bucket.delete(document.r2_key);
    await deleteProjectDocument(documentId);

    return NextResponse.json({ ok: true });
}
