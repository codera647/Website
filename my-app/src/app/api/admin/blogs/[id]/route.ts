import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { deleteBlog, getBlogById, updateBlog, type BlogInput } from "@/lib/data";

function parseId(idParam: string): number | null {
    const id = Number(idParam);
    return Number.isInteger(id) && id > 0 ? id : null;
}

/** GET — single blog. */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const id = parseId((await params).id);
    if (id === null) {
        return NextResponse.json({ ok: false, error: "Invalid blog id." }, { status: 400 });
    }

    const blog = await getBlogById(id);
    if (!blog) {
        return NextResponse.json({ ok: false, error: "Blog not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, blog });
}

/** PUT — update a blog post. */
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const id = parseId((await params).id);
    if (id === null) {
        return NextResponse.json({ ok: false, error: "Invalid blog id." }, { status: 400 });
    }

    const existing = await getBlogById(id);
    if (!existing) {
        return NextResponse.json({ ok: false, error: "Blog not found." }, { status: 404 });
    }

    let body: Partial<BlogInput>;
    try {
        body = (await request.json()) as Partial<BlogInput>;
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }

    try {
        const blog = await updateBlog(id, {
            slug: body.slug ?? existing.slug,
            title: body.title ?? existing.title,
            excerpt: body.excerpt ?? existing.excerpt,
            category: body.category ?? existing.category,
            date: body.date ?? existing.date,
            read_time: body.read_time ?? existing.read_time,
            content: body.content ?? existing.content,
            published: body.published ?? existing.published,
        });
        return NextResponse.json({ ok: true, blog });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update blog.";
        const isDuplicate = message.includes("UNIQUE constraint failed");
        return NextResponse.json(
            { ok: false, error: isDuplicate ? "A blog with that slug already exists." : message },
            { status: isDuplicate ? 409 : 500 }
        );
    }
}

/** DELETE — delete a blog post. */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const id = parseId((await params).id);
    if (id === null) {
        return NextResponse.json({ ok: false, error: "Invalid blog id." }, { status: 400 });
    }

    const existing = await getBlogById(id);
    if (!existing) {
        return NextResponse.json({ ok: false, error: "Blog not found." }, { status: 404 });
    }

    await deleteBlog(id);
    return NextResponse.json({ ok: true });
}
