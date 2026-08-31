import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getSearchConsoleAnalytics, requestGoogleIndexing, getGscCredentials } from "@/lib/gsc";

export async function GET(request: Request) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const url = new URL(request.url);
    const days = Number(url.searchParams.get("days")) || 28;

    const creds = getGscCredentials();
    const analytics = await getSearchConsoleAnalytics(days);

    return NextResponse.json({
        ok: true,
        connected: Boolean(creds),
        clientEmail: creds?.clientEmail || null,
        analytics,
    });
}

export async function POST(request: Request) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    let body: { url?: string; type?: "URL_UPDATED" | "URL_DELETED" };
    try {
        body = (await request.json()) as { url?: string; type?: "URL_UPDATED" | "URL_DELETED" };
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
    }

    if (!body.url || !body.url.trim()) {
        return NextResponse.json({ ok: false, error: "Target URL is required." }, { status: 400 });
    }

    const result = await requestGoogleIndexing(body.url.trim(), body.type || "URL_UPDATED");

    if (!result.ok) {
        return NextResponse.json({ ok: false, error: result.message }, { status: 502 });
    }

    return NextResponse.json({ ok: true, message: result.message });
}

