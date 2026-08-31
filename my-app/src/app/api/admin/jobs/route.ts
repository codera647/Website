import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createJob, getAllJobs, type CreateJobInput } from "@/lib/data";
import { requestGoogleIndexing } from "@/lib/gsc";

export async function GET(request: Request) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const jobs = await getAllJobs(false);
    return NextResponse.json({ ok: true, jobs });
}

export async function POST(request: Request) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    let body: Partial<CreateJobInput>;
    try {
        body = (await request.json()) as Partial<CreateJobInput>;
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
    }

    if (!body.title || !body.title.trim()) {
        return NextResponse.json({ ok: false, error: "Job title is required." }, { status: 400 });
    }
    if (!body.slug || !body.slug.trim()) {
        return NextResponse.json({ ok: false, error: "Job slug is required." }, { status: 400 });
    }
    if (!body.summary || !body.summary.trim()) {
        return NextResponse.json({ ok: false, error: "Job summary is required." }, { status: 400 });
    }

    try {
        const job = await createJob({
            slug: body.slug.trim().toLowerCase(),
            title: body.title.trim(),
            department: body.department?.trim() || "Engineering",
            location: body.location?.trim() || "Remote",
            type: body.type || "Full-time",
            summary: body.summary.trim(),
            jd_content: body.jd_content || "",
            responsibilities: Array.isArray(body.responsibilities) ? body.responsibilities : [],
            requirements: Array.isArray(body.requirements) ? body.requirements : [],
            nice_to_have: Array.isArray(body.nice_to_have) ? body.nice_to_have : [],
            active: body.active !== false,
            posted_date: body.posted_date || new Date().toISOString().slice(0, 7),
        });

        if (job.active) {
            requestGoogleIndexing(`/careers/${job.slug}`).catch(() => {});
        }
        return NextResponse.json({ ok: true, job }, { status: 201 });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return NextResponse.json(
            { ok: false, error: msg.includes("UNIQUE") ? "A job with this slug already exists." : msg },
            { status: 400 }
        );
    }
}

