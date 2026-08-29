import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getImagesBucket } from "@/lib/db";

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);

/**
 * POST — upload an image (project thumbnail/screenshot) to the images R2
 * bucket. Expects multipart/form-data with a `file` field and an optional
 * `folder` field (defaults to "misc"). Returns a public URL served by
 * /api/images/[...path].
 */
export async function POST(request: Request) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const formData = await request.formData();
    const file = formData.get("file");
    const folderRaw = formData.get("folder");

    if (!(file instanceof File)) {
        return NextResponse.json({ ok: false, error: "A file is required." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
        return NextResponse.json(
            { ok: false, error: "Unsupported file type. Use PNG, JPEG, WebP, GIF, or SVG." },
            { status: 400 }
        );
    }
    if (file.size > 8 * 1024 * 1024) {
        return NextResponse.json({ ok: false, error: "Image must be under 8MB." }, { status: 400 });
    }

    const folder = typeof folderRaw === "string" && folderRaw.trim()
        ? folderRaw.trim().replace(/[^\w-]/g, "_")
        : "misc";
    const safeName = file.name.replace(/[^\w.\-]/g, "_");
    const key = `${folder}/${Date.now()}-${safeName}`;

    const bucket = getImagesBucket();
    await bucket.put(key, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type },
    });

    return NextResponse.json({ ok: true, url: `/api/images/${key}`, key }, { status: 201 });
}
