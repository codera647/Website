import { getBucket } from "@/lib/db";

/**
 * Public document server for job specifications & project documents
 * stored in the BUCKET R2 bucket.
 */
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const key = path.join("/");

    const bucket = getBucket();
    const object = await bucket.get(key);

    if (!object) {
        return new Response("Document not found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("Cache-Control", "public, max-age=86400");

    const filename = path[path.length - 1] || "document.pdf";
    headers.set("Content-Disposition", `inline; filename="${filename}"`);

    return new Response(object.body, { headers });
}

