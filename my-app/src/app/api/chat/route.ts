import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getAllProjects, getProjectBySlug } from "@/lib/data";

/**
 * Chat endpoint backing both the site-wide assistant (Motion) and
 * deep-dive project assistants on /work/[slug].
 *
 * Ground-truth architecture:
 * - Comprehensive full-site crawl knowledge graph (Services, Momentum Systems, Pricing, Values, Process, FAQs).
 * - Dynamic D1 database project lookup with live metrics, technical architectures, and visual diagram artifacts.
 * - Proactive Markdown CTA button generator with routing to sitemap pages or direct Cal.com booking modal.
 */

const PRIMARY_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const FALLBACK_MODEL = "@cf/meta/llama-3.1-8b-instruct";

const SITE_KNOWLEDGE_BASE = `
==============================
KINETIQ WEBSITE KNOWLEDGE GRAPH
==============================

COMPANY OVERVIEW:
- Name: Kinetiq
- Tagline: "Always in motion."
- Website: thekinetiq.solutions
- Core Identity: High-performance software engineering studio specializing in AI Automation, Web Development, Generative AI, and Momentum Systems.
- Email: info@thekinetiq.solutions
- Booking: Free 30-minute growth audit or architecture strategy call via Cal.com.

DISCIPLINES & CORE SERVICES (/services):
1. AI Automation:
   - What we do: Agentic workflows, autonomous reasoning agents, robotic process automation (RPA) + LLM orchestration, and process intelligence.
   - Stack: Python, LangChain, LlamaIndex, n8n, AWS, Temporal, Docker.
   - URL: /services#ai-automation
2. Web Development:
   - What we do: Production-grade web applications, client portals, cloud-native systems, API engineering, fast modern frontends.
   - Stack: TypeScript, Next.js 15, React 19, Node.js, Cloudflare D1/R2, Supabase, Tailwind CSS.
   - URL: /services#web-development
3. Generative AI:
   - What we do: Multi-agent RAG research platforms, custom LLM fine-tuning, computer vision & background matting, multi-modal AI, recommender systems.
   - Stack: Python, PyTorch, FAISS, Weaviate, OpenCV, Mistral, Llama 3, Scikit-learn, FastAPI.
   - URL: /services#generative-ai

MOMENTUM SYSTEMS (/momentum-systems):
- What it is: A packaged, outcome-priced growth engine designed specifically for local and repeat service businesses (starting with HVAC contractors, plumbing, electrical, wellness clinics, and local trades).
- The Core Problem: Small business owners do not want a static brochure website that sits there; they want more bookings, higher customer retention, and fewer manual follow-up headaches.
- The 3 Pillars:
  * Pillar 01 · Identity & Access: A real customer portal with logins, service records, equipment specs, and one-click repeat appointment booking behind authentication.
  * Pillar 02 · Automated Engagement: Email and SMS sequences running without human intervention (instant booking confirmations, SMS appointment reminders, automated 5-star review requests, win-back campaigns, seasonal furnace/AC tune-up reminders).
  * Pillar 03 · Programmatic Growth: Systematic search-optimized pages generated for every service and location a business serves (e.g., "Emergency AC Repair in [Town]" across 8+ towns), rather than one generic homepage.
- The Compounding Flywheel Loop: Programmatic growth pages capture local searchers → Portal converts them into recognized accounts → Automated engagement retains them with seasonal reminders → Happy clients leave 5-star Google reviews → Review velocity boosts Google ranking and drives even more search traffic.
- URL: /momentum-systems

PRICING & TIERS (/pricing):
- Model: Outcome-priced software model — a smaller one-time setup/build fee plus a predictable monthly fee covering hosting, maintenance, automated workflows, and continuous search growth.
- Founding Client Pricing (Limited to First 10 Businesses Total, locked in for life):
  1. Foundation Tier:
     * Setup Fee: $497 (regular $1,997) | Monthly: $497/mo (regular $697/mo)
     * Includes: Modern mobile-first website, Google Business Profile optimization, 2 core automations (booking confirmation + post-service review request), 1 service territory local SEO, managed hosting & monthly report.
  2. Momentum Tier (⭐ Flagship / Recommended / Most Popular):
     * Setup Fee: $797 (regular $2,997) | Monthly: $897/mo (regular $1,297/mo)
     * Includes: Everything in Foundation + Customer & Member Portal, full automated SMS/email library (reminders, win-backs, seasonal maintenance nudges), programmatic SEO across up to 8 towns, monthly 30-min strategy call, and full attribution dashboard.
  3. Momentum Pro Tier:
     * Setup Fee: $1,297 (regular $4,997) | Monthly: $1,497/mo (regular $2,197/mo)
     * Includes: Everything in Momentum + Unlimited service-area pages, AI-assisted lead qualification & auto-booking chat agent, field-service / CRM integration (Housecall Pro, ServiceTitan, Jobber), monthly A/B conversion testing, priority SLA.
- Terms & Guarantees:
  * No Long-Term Lock-In: Month-to-month after an initial 3-month ramp period.
  * 30-Day Satisfaction Guarantee: 100% full refund on setup fee if system is not live and working as promised in the first 30 days.
  * 100% In-House Engineering: Built directly by Kinetiq's production software engineers, never resold third-party white-label tools.
  * 100% Ownership: Clients own all their data, domains, and branding assets.
- URL: /pricing

HOW WE WORK & TIMELINE:
- 4-Step Process: 01. Discover → 02. Design → 03. Build → 04. Deploy.
- Timeline: Focused MVPs or core Momentum Systems ship within 3 to 8 weeks.
- Values: Practical over flashy, Engineering rigor, Transparency, Always in motion.

SITEMAP & ROUTING DIRECTORY:
- Homepage: /
- Momentum Systems: /momentum-systems
- Pricing & Tiers: /pricing
- Services Overview: /services
- Selected Work: /work
- About Kinetiq: /about
- Careers: /careers
- Blog: /blog
- Book a Free Strategy Call / Growth Audit: action:book-call
`;

const BASE_SYSTEM_PROMPT = `You are Motion, the intelligent AI engineering and systems assistant for Kinetiq (thekinetiq.solutions).
You are direct, knowledgeable, technically articulate, and concise.

STYLE & FORMATTING GUIDELINES (Claude-like Clean Markdown):
- Structure answers logically with crisp, clean paragraphs (1-3 sentences).
- Use **bold** for key terms, metrics, and technology names.
- Use clean bullet points (- item) or numbered lists (1. 2.) when listing features, steps, or tiers.
- For section titles or headings, use clean markdown headers (### Header Name).
- When discussing technical code, use \`inline code\` or \`\`\`language code blocks\`\`\`.

ACTION CTA BUTTON INSTRUCTIONS:
Whenever relevant to the user's question, provide a clear, dedicated clickable markdown CTA link on its own line:
- For Momentum Systems: [Explore Momentum Systems →](/momentum-systems)
- For Pricing / Cost / Plans: [View Pricing & Tiers →](/pricing)
- For Core Services: [Explore Our Services →](/services)
- For Case Studies & Work: [See Selected Work →](/work)
- For a specific project: [View Case Study →](/work/project-slug)
- For Scheduling / Audits / Getting Started: [Book Free 30-Min Call →](action:book-call)

IMAGE EMBEDDING INSTRUCTIONS:
When visual architecture, workflows, or project diagrams are available in context, you can embed them using standard Markdown image syntax \`![Caption Description](/path/to/image.jpg)\`.

Ground all answers in the Kinetiq knowledge base and project context below. If something is unknown, be honest and suggest booking a call.`;

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
    if (message.length > 2500) {
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

        let contextualSystemPrompt = `${BASE_SYSTEM_PROMPT}\n\n${SITE_KNOWLEDGE_BASE}`;
        let sourcesList: string[] = ["Kinetiq Site Knowledge Base"];

        // If user is inside a specific project deep-dive page, fetch its rich ground-truth from D1
        if (slug) {
            try {
                const project = await getProjectBySlug(slug);
                if (project) {
                    sourcesList = [`${project.title} Deep-Dive Specification`];
                    const metricsStr = project.metrics?.map((m) => `${m.label}: ${m.value}`).join(", ") || "";
                    const tagsStr = project.tags?.join(", ") || "";
                    const imagesList = Array.isArray(project.images) ? project.images : [];
                    const imagesGuide = imagesList.length > 0
                        ? `\nAVAILABLE DIAGRAMS & VISUAL ARTIFACTS:\n${imagesList.map((img) => `- ${img}`).join("\n")}\n\nIMAGE INSTRUCTION: Embed relevant diagram(s) using ![Description](image_path) when explaining the architecture or pipeline.`
                        : "";

                    contextualSystemPrompt += `\n\n==============================\nFOCUSED PROJECT CONTEXT: "${project.title}"\n==============================
- Slug: ${project.slug}
- Category: ${project.category} (${project.year})
- Tags / Tech Stack: ${tagsStr}
- Summary: ${project.summary}
- Challenge: ${project.challenge || "N/A"}
- Engineering Architecture & Solution: ${project.solution || "N/A"}
- Production Result & Impact: ${project.result || "N/A"}
- Measured Metrics: ${metricsStr}
${imagesGuide}

Answer specifically with technical depth about this project. Include [Back to All Work →](/work) or [Book a Strategy Call →](action:book-call) where fitting.`;
                }
            } catch (dbErr) {
                console.warn("Could not fetch specific project context from D1:", dbErr);
            }
        } else {
            // Site-wide chat: Fetch all live projects from D1 to ground portfolio queries
            try {
                const allProjects = await getAllProjects();
                if (allProjects && allProjects.length > 0) {
                    const projectListings = allProjects
                        .map(
                            (p) =>
                                `• ${p.title} (/work/${p.slug}) [${p.category}]: ${p.summary} | Tech: ${(p.tags || []).slice(0, 4).join(", ")}`
                        )
                        .join("\n");

                    contextualSystemPrompt += `\n\nLIVE CASE STUDIES IN PORTFOLIO:\n${projectListings}`;
                }
            } catch (allErr) {
                console.warn("Could not fetch all projects from D1:", allErr);
            }
        }

        // Call Cloudflare Workers AI
        let aiResponse: unknown;
        try {
            aiResponse = await ai.run(PRIMARY_MODEL, {
                messages: [
                    { role: "system", content: contextualSystemPrompt },
                    { role: "user", content: message },
                ],
                max_tokens: 1200,
            });
        } catch (primaryModelErr) {
            console.warn("Primary model failed, attempting fallback model:", primaryModelErr);
            aiResponse = await ai.run(FALLBACK_MODEL, {
                messages: [
                    { role: "system", content: contextualSystemPrompt },
                    { role: "user", content: message },
                ],
                max_tokens: 1200,
            });
        }

        let answerText = "";
        if (typeof aiResponse === "string") {
            answerText = aiResponse;
        } else if (aiResponse && typeof aiResponse === "object") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const obj = aiResponse as Record<string, any>;
            answerText = obj.response || obj.text || obj.result || JSON.stringify(obj);
        }

        if (!answerText) {
            answerText =
                "I don't have a direct answer for that question right now. Feel free to book a free 30-minute call with our team:\n\n[Book a Free Strategy Call →](action:book-call)";
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
