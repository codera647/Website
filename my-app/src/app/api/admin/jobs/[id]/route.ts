import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { deleteJob, getJobById, updateJob, type UpdateJobInput } from "@/lib/data";

function parseId(idParam: string): number | null {
    const id = Number(idParam);
    return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const id = parseId((await params).id);
    if (id === null) {
        return NextResponse.json({ ok: false, error: "Invalid job id." }, { status: 400 });
    }

    const job = await getJobById(id);
    if (!job) {
        return NextResponse.json({ ok: false, error: "Job not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, job });
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const id = parseId((await params).id);
    if (id === null) {
        return NextResponse.json({ ok: false, error: "Invalid job id." }, { status: 400 });
    }

    let body: Partial<UpdateJobInput>;
    try {
        body = (await request.json()) as Partial<UpdateJobInput>;
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
    }

    try {
        const job = await updateJob(id, {
            slug: body.slug ? body.slug.trim().toLowerCase() : undefined,
            title: body.title ? body.title.trim() : undefined,
            department: body.department ? body.department.trim() : undefined,
            location: body.location ? body.location.trim() : undefined,
            type: body.type,
            summary: body.summary ? body.summary.trim() : undefined,
            jd_content: body.jd_content,
            responsibilities: Array.isArray(body.responsibilities) ? body.responsibilities : undefined,
            requirements: Array.isArray(body.requirements) ? body.requirements : undefined,
            nice_to_have: Array.isArray(body.nice_to_have) ? body.nice_to_have : undefined,
            active: body.active,
            posted_date: body.posted_date,
        });

        if (!job) {
            return NextResponse.json({ ok: false, error: "Job not found." }, { status: 404 });
        }

        return NextResponse.json({ ok: true, job });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return NextResponse.json(
            { ok: false, error: msg.includes("UNIQUE") ? "A job with this slug already exists." : msg },
            { status: 400 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const id = parseId((await params).id);
    if (id === null) {
        return NextResponse.json({ ok: false, error: "Invalid job id." }, { status: 400 });
    }

    const job = await getJobById(id);
    if (!job) {
        return NextResponse.json({ ok: false, error: "Job not found." }, { status: 404 });
    }

    await deleteJob(id);
    return NextResponse.json({ ok: true });
}

