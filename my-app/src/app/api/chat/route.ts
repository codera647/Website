import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Chat endpoint backing both the site-wide assistant (floating widget,
 * every page) and the per-project assistant (project detail pages).
 *
 * Powered by Cloudflare AI Search (managed RAG) — see rag-content/ for the
 * source documents and README.md there for the full setup checklist.
 *
 * Requires an AI Search instance named exactly `kinetiq-knowledge` to
 * exist in the Cloudflare account, backed by an R2 bucket whose content is
 * organized as:
 *   site/...              -> general company content (site-wide assistant)
 *   projects/<slug>/...   -> per-project material (that project's assistant)
 */

const AI_SEARCH_INSTANCE = "kinetiq-knowledge";
const GENERATION_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

const SYSTEM_PROMPT = `You are the Kinetiq assistant — helpful, direct, and concise.
Kinetiq is a software studio building AI automation, web development, and
generative AI systems. Answer only from the provided context. If the
context doesn't contain the answer, say you don't have that information
and suggest the visitor use the contact form instead of guessing. Keep
answers short (2-5 sentences) unless the question needs more detail.`;

interface ChatRequestBody {
    message?: unknown;
    projectSlug?: unknown;
}

export async function POST(request: Request) {
    let body: ChatRequestBody;
    try {
        body = (await request.json()) as ChatRequestBody;
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }

    const { message, projectSlug } = body;

    if (typeof message !== "string" || !message.trim()) {
        return NextResponse.json({ ok: false, error: "A message is required." }, { status: 400 });
    }
    if (message.length > 2000) {
        return NextResponse.json({ ok: false, error: "Message is too long." }, { status: 400 });
    }

    const slug = typeof projectSlug === "string" && projectSlug.trim() ? projectSlug.trim() : undefined;

    try {
        const { env } = getCloudflareContext();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ai = (env as Record<string, any>).AI;

        if (!ai) {
            return NextResponse.json(
                { ok: false, error: "The assistant is not configured yet." },
                { status: 503 }
            );
        }

        // Narrow retrieval to one project's docs when asked from a project
        // page; otherwise search the whole knowledge base (site + all
        // projects) for the site-wide assistant.
        const filters = slug
            ? { folder: { $gte: `projects/${slug}/`, $lt: `projects/${slug}0` } }
            : undefined;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (ai as any).autorag(AI_SEARCH_INSTANCE).aiSearch({
            query: message,
            model: GENERATION_MODEL,
            system_prompt: SYSTEM_PROMPT,
            rewrite_query: true,
            max_num_results: 5,
            ranking_options: { score_threshold: 0.25 },
            ...(filters ? { filters } : {}),
        });

        return NextResponse.json({
            ok: true,
            answer: result?.response ?? "I don't have an answer for that yet.",
            sources: Array.isArray(result?.data)
                ? result.data.map((d: { filename?: string }) => d.filename).filter(Boolean)
                : [],
        });
    } catch (err) {
        console.error("AI Search query failed:", err);
        return NextResponse.json(
            { ok: false, error: "The assistant is temporarily unavailable. Please try again." },
            { status: 502 }
        );
    }
}
