import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getAllProjects, getProjectBySlug } from "@/lib/data";

/**
 * Chat endpoint backing both the site-wide assistant (floating widget)
 * and per-project assistants (project detail pages).
 *
 * Multi-layer architecture:
 * 1. Primary: Cloudflare AI Search (AutoRAG instance `kinetiq-knowledge`)
 * 2. Fallback: Cloudflare Workers AI model directly with dynamic project context from D1
 */

const AI_SEARCH_INSTANCE = "kinetiq-knowledge";
const PRIMARY_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const FALLBACK_MODEL = "@cf/meta/llama-3.1-8b-instruct";

const BASE_SYSTEM_PROMPT = `You are Motion, the expert AI assistant for Kinetiq — a high-performance software studio specializing in AI Automation, Web Development, and Generative AI systems. You are direct, technical, clear, and professional.

Formatting guidelines:
- Use **bold** for important terms and highlights.
- Use bullet lists (- item) or numbered lists (1. 2.) when listing features, steps, or metrics.
- Keep paragraphs compact (1-3 sentences).
- Never use markdown headings (#).
- You can embed relevant project image artifacts or diagrams using standard Markdown image syntax \`![Caption / Description](/path/to/image.png)\` whenever visual architectures, workflows, or demo previews add value to the answer.
- Answer accurately based on the provided project context. If something isn't covered in the context, be honest and suggest reaching out via the contact form.`;

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
        const ai = (env as Record<string, any>)?.AI;

        if (!ai) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Cloudflare AI binding (env.AI) is not configured in this environment.",
                },
                { status: 503 }
            );
        }

        // 1. Try AutoRAG / AI Search first
        try {
            if (typeof ai.autorag === "function") {
                const filters = slug
                    ? { folder: { $gte: `projects/${slug}/`, $lt: `projects/${slug}0` } }
                    : undefined;

                const autoRagResult = await ai.autorag(AI_SEARCH_INSTANCE).aiSearch({
                    query: message,
                    model: PRIMARY_MODEL,
                    system_prompt: BASE_SYSTEM_PROMPT,
                    rewrite_query: true,
                    max_num_results: 5,
                    ranking_options: { score_threshold: 0.25 },
                    ...(filters ? { filters } : {}),
                });

                if (autoRagResult?.response) {
                    return NextResponse.json({
                        ok: true,
                        answer: autoRagResult.response,
                        sources: Array.isArray(autoRagResult.data)
                            ? autoRagResult.data
                                  .map((d: { filename?: string }) => d.filename)
                                  .filter(Boolean)
                            : [],
                    });
                }
            }
        } catch (ragErr) {
            console.warn("AutoRAG query skipped or failed, falling back to direct Workers AI:", ragErr);
        }

        // 2. Direct Workers AI with rich D1 project context fallback
        let contextualSystemPrompt = BASE_SYSTEM_PROMPT;
        let sourcesList: string[] = [];

        if (slug) {
            try {
                const project = await getProjectBySlug(slug);
                if (project) {
                    sourcesList = [`${project.title} Documentation`];
                    const metricsStr = project.metrics?.map((m) => `${m.label}: ${m.value}`).join(", ") || "";
                    const tagsStr = project.tags?.join(", ") || "";

                    const imagesList = Array.isArray(project.images) ? project.images : [];
                    const imagesGuide = imagesList.length > 0
                        ? `\n\nAVAILABLE IMAGE ARTIFACTS & DIAGRAMS:\n${imagesList.map((img) => `- ${img}`).join("\n")}\n\nIMAGE INSTRUCTION:\nWhen the user asks about the system architecture, ingestion pipeline, UI, or demo results, embed the relevant image artifact using \`![Clear Description](${imagesList[0]})\` syntax with the matching URL from the list above. Do not fabricate unlisted URLs.`
                        : "";

                    contextualSystemPrompt += `\n\nYou are answering specifically about the project: "${project.title}".
PROJECT DETAILS & CONTEXT:
- Category: ${project.category} (${project.year})
- Tags / Tech: ${tagsStr}
- Summary: ${project.summary}
- Challenge: ${project.challenge || "N/A"}
- Architecture & Solution: ${project.solution || "N/A"}
- Results & Impact: ${project.result || "N/A"}
- Key Metrics: ${metricsStr}
${imagesGuide}

Use these project details as ground truth to answer the user's question thoroughly, visually (when relevant), and accurately.`;
                }
            } catch (dbErr) {
                console.warn("Could not fetch project context from D1:", dbErr);
            }
        } else {
            try {
                const allProjects = await getAllProjects();
                const projectSummaries = allProjects
                    .map((p) => `- ${p.title} (${p.category}): ${p.summary}`)
                    .join("\n");

                contextualSystemPrompt += `\n\nKINETIQ PORTFOLIO CONTEXT:
${projectSummaries}
- Company: Kinetiq (Always in Motion) — Full-stack AI automation, web development, and generative AI studio.
- Email: info@thekinetiq.solutions`;
            } catch {
                // Ignore DB error for prompt building
            }
        }

        // Call Workers AI directly
        let aiResponse: unknown;
        try {
            aiResponse = await ai.run(PRIMARY_MODEL, {
                messages: [
                    { role: "system", content: contextualSystemPrompt },
                    { role: "user", content: message },
                ],
                max_tokens: 1024,
            });
        } catch (primaryModelErr) {
            console.warn("Primary model failed, trying fallback model:", primaryModelErr);
            aiResponse = await ai.run(FALLBACK_MODEL, {
                messages: [
                    { role: "system", content: contextualSystemPrompt },
                    { role: "user", content: message },
                ],
                max_tokens: 1024,
            });
        }

        // Handle various response shapes from Workers AI
        let answerText = "";
        if (typeof aiResponse === "string") {
            answerText = aiResponse;
        } else if (aiResponse && typeof aiResponse === "object") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const obj = aiResponse as Record<string, any>;
            answerText = obj.response || obj.text || obj.result || JSON.stringify(obj);
        }

        if (!answerText) {
            answerText = "I don't have an answer for that yet. Feel free to contact our team!";
        }

        return NextResponse.json({
            ok: true,
            answer: answerText,
            sources: sourcesList,
        });
    } catch (err) {
        const errorDetails = err instanceof Error ? err.message : String(err);
        console.error("AI Assistant error:", err);
        return NextResponse.json(
            {
                ok: false,
                error: `The assistant is currently unavailable: ${errorDetails}`,
            },
            { status: 502 }
        );
    }
}
