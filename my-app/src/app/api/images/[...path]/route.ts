import { getImagesBucket } from "@/lib/db";

/**
 * Public image server for admin-uploaded project thumbnails/screenshots
 * (stored in the IMAGES_BUCKET R2 bucket, uploaded via /api/admin/upload).
 * No auth — these are public assets referenced from public pages.
 */
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const key = path.join("/");

    const bucket = getImagesBucket();
    const object = await bucket.get(key);

    if (!object) {
        return new Response("Not found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new Response(object.body, { headers });
}
