import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getBucket } from "@/lib/db";
import {
    addJobDocument,
    deleteJobDocument,
    getJobById,
    getJobDocumentById,
    getJobDocuments,
} from "@/lib/data";

function parseId(idParam: string): number | null {
    const id = Number(idParam);
    return Number.isInteger(id) && id > 0 ? id : null;
}

/** GET — list specification documents for a job opening. */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const jobId = parseId((await params).id);
    if (jobId === null) {
        return NextResponse.json({ ok: false, error: "Invalid job id." }, { status: 400 });
    }

    const documents = await getJobDocuments(jobId);
    return NextResponse.json({ ok: true, documents });
}

/**
 * POST — upload an additional specification document to R2 (`jobs/<slug>/<filename>`) and
 * record its metadata in D1. Expects multipart/form-data with a `file` field.
 */
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const jobId = parseId((await params).id);
    if (jobId === null) {
        return NextResponse.json({ ok: false, error: "Invalid job id." }, { status: 400 });
    }

    const job = await getJobById(jobId);
    if (!job) {
        return NextResponse.json({ ok: false, error: "Job opening not found." }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
        return NextResponse.json({ ok: false, error: "A file is required." }, { status: 400 });
    }
    if (file.size > 25 * 1024 * 1024) {
        return NextResponse.json({ ok: false, error: "File must be under 25MB." }, { status: 400 });
    }

    const safeName = file.name.replace(/[^\w.\-]/g, "_");
    const r2Key = `jobs/${job.slug}/${safeName}`;

    const bucket = getBucket();
    await bucket.put(r2Key, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type || "application/octet-stream" },
    });

    const document = await addJobDocument(jobId, safeName, r2Key, file.size);
    return NextResponse.json({ ok: true, document }, { status: 201 });
}

/** DELETE — remove a document from R2 + D1. Expects `?documentId=` query param. */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const jobId = parseId((await params).id);
    if (jobId === null) {
        return NextResponse.json({ ok: false, error: "Invalid job id." }, { status: 400 });
    }

    const url = new URL(request.url);
    const documentId = parseId(url.searchParams.get("documentId") ?? "");
    if (documentId === null) {
        return NextResponse.json({ ok: false, error: "documentId query param is required." }, { status: 400 });
    }

    const document = await getJobDocumentById(documentId);
    if (!document || document.job_id !== jobId) {
        return NextResponse.json({ ok: false, error: "Document not found." }, { status: 404 });
    }

    const bucket = getBucket();
    await bucket.delete(document.r2_key);
    await deleteJobDocument(documentId);

    return NextResponse.json({ ok: true });
}

