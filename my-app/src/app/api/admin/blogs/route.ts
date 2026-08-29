import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createBlog, getAllBlogPosts, type BlogInput } from "@/lib/data";

/** GET — list all blogs (published + drafts), sorted by date. */
export async function GET(request: Request) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const blogs = await getAllBlogPosts(true);
    return NextResponse.json({ ok: true, blogs });
}

/** POST — create a new blog post. */
export async function POST(request: Request) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    let body: Partial<BlogInput>;
    try {
        body = (await request.json()) as Partial<BlogInput>;
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }

    if (!body.slug || !body.title || !body.category || !body.date) {
        return NextResponse.json(
            { ok: false, error: "slug, title, category, and date are required." },
            { status: 400 }
        );
    }

    try {
        const blog = await createBlog({
            slug: body.slug,
            title: body.title,
            excerpt: body.excerpt ?? "",
            category: body.category,
            date: body.date,
            read_time: body.read_time ?? 3,
            content: body.content ?? "",
            published: body.published ?? true,
        });
        return NextResponse.json({ ok: true, blog }, { status: 201 });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create blog.";
        const isDuplicate = message.includes("UNIQUE constraint failed");
        return NextResponse.json(
            { ok: false, error: isDuplicate ? "A blog with that slug already exists." : message },
            { status: isDuplicate ? 409 : 500 }
        );
    }
}
