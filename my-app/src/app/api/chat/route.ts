import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getAllProjects, getProjectBySlug, getAllJobs } from "@/lib/data";
import { team } from "@/data/team";
import { services } from "@/data/services";
import { roles } from "@/data/careers";

/**
 * Chat endpoint backing both the site-wide assistant (Motion) and
 * deep-dive project assistants on /work/[slug].
 *
 * Full Ground-Truth Architecture:
 * - Dynamic live data integration (Team, Services, Careers, D1 Case Studies, Pricing, Momentum Systems).
 * - Natural, authoritative Claude-like conversational style (no robotic meta-language).
 * - Proactive Markdown CTA button generator with routing to sitemap pages or direct Cal.com booking modal.
 */

const PRIMARY_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const FALLBACK_MODEL = "@cf/meta/llama-3.1-8b-instruct";

async function buildSiteKnowledge(): Promise<string> {
    const teamSummary = team
        .map((m) => `• ${m.name} — ${m.title}:\n  ${m.bio || ""}`)
        .join("\n\n");

    const servicesSummary = services
        .map(
            (s) =>
                `• ${s.title} (/services#${s.anchor}):\n  Tagline: ${s.tagline}\n  Description: ${s.description}\n  Capabilities: ${s.capabilities.join(", ")}\n  Tech Stack: ${s.stack.join(", ")}`
        )
        .join("\n\n");

    let activeJobs: { title: string; type: string; location: string; summary: string; slug: string }[] = [];
    try {
        const d1Jobs = await getAllJobs(true);
        if (d1Jobs.length > 0) {
            activeJobs = d1Jobs.map((j) => ({
                title: j.title,
                type: j.type,
                location: j.location,
                summary: j.summary,
                slug: j.slug,
            }));
        }
    } catch {
        // Fallback to static
    }

    const careersSummary =
        activeJobs.length > 0
            ? activeJobs
                  .map(
                      (c) =>
                          `• ${c.title} (${c.type} · ${c.location} · /careers/${c.slug}): ${c.summary}`
                  )
                  .join("\n")
            : roles.length > 0
            ? roles.map((c) => `• ${c.title} (${c.type} · ${c.location} · /careers/${c.slug}): ${c.summary}`).join("\n")
            : "No active public job openings at this exact moment, but we always welcome exploratory CV applications via /careers#send-cv.";

    return `
========================================
KINETIQ REAL-TIME SITE & COMPANY CONTEXT
========================================

COMPANY OVERVIEW:
- Name: Kinetiq
- Tagline: "Always in motion."
- Website: thekinetiq.solutions
- Core Identity: High-performance software engineering studio specializing in AI Automation, Web Development, Generative AI, and Momentum Systems.
- Email: info@thekinetiq.solutions
- Phone / Direct Call: +44 7427 114280 (tel:+447427114280)
- WhatsApp: +44 7427 114280 (https://wa.me/447427114280)
- YouTube: https://www.youtube.com/@kinetiq-solutions
- Discord Community: https://discord.gg/GJDe5SBJC
- LinkedIn: https://www.linkedin.com/company/kinetiq-site/
- Instagram: https://www.instagram.com/thekinetiq.solutions/
- Booking: Free 30-minute growth audit or architecture strategy call via Cal.com.

FOUNDERS & LEADERSHIP TEAM (/about):
${teamSummary}

Core Team Philosophy:
- Deliberately small & senior: Senior engineers own the work end to end, from initial architecture sketch to production deployment and monitoring.

OUR STORY & VALUES (/about):
- Story: At Kinetiq, we build intelligent systems that create real impact at the intersection of agentic AI, automation, and modern engineering.
- Values:
  1. Practical over flashy: Innovation guided by real problem solving. We build what pays off in production, not what demos well.
  2. Engineering rigor: AI systems held to the same standard as any production software: tested, monitored, documented.
  3. Transparency: Honest demos, plain-language explanations, and architecture you can inspect. No black boxes.
  4. Always in motion: Continuous experimentation keeps us, and the systems we ship, ready for what comes next.

SERVICES & CORE DISCIPLINES (/services):
${servicesSummary}

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
     * Setup Fee: $497 (regular $1,997 — 75% off) | Monthly: $497/mo (regular $697/mo)
     * Includes: Modern mobile-first website, Google Business Profile optimization, 2 core automations (booking confirmation + post-service review request), 1 service territory local SEO, managed hosting & monthly report.
  2. Momentum Tier (⭐ Flagship / Recommended / Most Popular):
     * Setup Fee: $797 (regular $2,997 — 73% off) | Monthly: $897/mo (regular $1,297/mo)
     * Includes: Everything in Foundation + Customer & Member Portal, full automated SMS/email library (reminders, win-backs, seasonal maintenance nudges), programmatic SEO across up to 8 towns, monthly 30-min strategy call, and full attribution dashboard.
  3. Momentum Pro Tier:
     * Setup Fee: $1,297 (regular $4,997 — 74% off) | Monthly: $1,497/mo (regular $2,197/mo)
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

OPEN ROLES & CAREERS (/careers):
${careersSummary}

SITEMAP DIRECTORY:
- Homepage: /
- Momentum Systems: /momentum-systems
- Pricing & Tiers: /pricing
- Services Overview: /services
- Selected Work & Case Studies: /work
- About Kinetiq & Leadership: /about
- Careers & Open Roles: /careers
- Blog: /blog
- Book a Free Strategy Call / Growth Audit: action:book-call
`;
}

const BASE_SYSTEM_PROMPT = `You are Motion, the expert AI assistant and engineer for Kinetiq (thekinetiq.solutions).
You are intelligent, direct, technically articulate, conversational, and helpful — exactly like Claude.

IMPORTANT PERSONA & COMMUNICATION RULES:
- Speak naturally and authoritatively in the first person ("We build...", "Our CEO Abdul Moiz...", "Our team...").
- NEVER use meta-language or robotic phrases such as "According to the provided knowledge graph", "The provided documents do not mention", "Based on my context", or "In the text".
- Answer questions directly with confidence. If asked about the CEO, founders, leadership, pricing, services, or technical stack, answer accurately using the real team and company details below.
- Keep paragraphs compact, readable, and well-structured.
- Use **bold** for key terms, names, and metrics.
- Use clean bullet lists (- item) or numbered lists (1. 2.) when explaining features, steps, or tiers.
- For section headers, use markdown headers (### Header Name).
- When sharing code or technical examples, use clean syntax blocks.

ACTION CTA BUTTON INSTRUCTIONS:
Whenever relevant to the user's question, provide a clear, dedicated clickable markdown CTA link on its own line:
- For Momentum Systems: [Explore Momentum Systems](/momentum-systems)
- For Pricing / Cost / Plans: [View Pricing & Tiers](/pricing)
- For Core Services: [Explore Our Services](/services)
- For Case Studies & Work: [See Selected Work](/work)
- For a specific project: [View Case Study](/work/project-slug)
- For About & Leadership: [About Kinetiq & Leadership](/about)
- For Careers: [View Open Roles](/careers)
- For Scheduling / Audits / Getting Started: [Book Free 30-Min Call](action:book-call)

TIER RECOMMENDATION & SURVEY EVALUATION RUBRIC:
When a user completes the 4-step survey or asks which tier is best for their business:
1. **Foundation Tier ($497 setup + $497/mo)**: Best fit if they have little/no online presence, operate in 1 primary hometown territory, mostly handle one-off jobs, and need core web + review automations.
2. **Momentum Tier ($797 setup + $897/mo) [⭐ Flagship / Most Popular]**: Best fit if they have repeat/maintenance customers, want a Customer Portal with logins & service history, service 2 to 8 neighboring towns for search growth, and want automated SMS reminders & seasonal furnace/AC tune-up sequences.
3. **Momentum Pro Tier ($1,297 setup + $1,497/mo)**: Best fit if they operate across multiple branch locations (8+ areas), manage high-volume contracts, require direct 2-way CRM integration (Housecall Pro, ServiceTitan, Jobber), or need 24/7 AI lead qualification & booking agents.

When rendering the recommendation response:
- State the recommended plan prominently: ### 🎯 Recommended Plan: [Foundation / Momentum / Momentum Pro]
- Provide a personalized 3-point bulleted breakdown explaining exactly why this tier matches their answers.
- Display the Founding Client Price breakdown (Setup + Monthly) and highlight the lifetime rate lock-in and 30-day satisfaction guarantee.
- Include a direct 1-click CTA button to claim the tier: [Claim Tier Name Founding Tier](action:book-call) and a secondary comparison link [Compare All Tiers](/pricing).

IMAGE EMBEDDING INSTRUCTIONS:
When visual architecture, workflows, or project diagrams are available in context, you can embed them using standard Markdown image syntax ![Caption Description](/path/to/image.jpg).`;

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

        const siteKnowledge = await buildSiteKnowledge();
        let contextualSystemPrompt = `${BASE_SYSTEM_PROMPT}\n\n${siteKnowledge}`;
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

Answer specifically with technical depth about this project. Include [Back to All Work](/work) or [Book a Strategy Call](action:book-call) where fitting.`;
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
                "I'd be glad to help answer your question. You can also book a direct 30-minute call with our team:\n\n[Book Free 30-Min Call](action:book-call)";
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
