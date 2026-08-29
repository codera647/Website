#!/usr/bin/env node
// Generates seed.sql from the existing hardcoded data (src/data/work.ts,
// src/data/blog.ts, public/blogs/*.txt) so it can be loaded into D1 via:
//   npx wrangler d1 execute kinetiq-db --local --file=seed.sql   (local dev)
//   npx wrangler d1 execute kinetiq-db --remote --file=seed.sql  (production, once)
//
// One-time migration script (implementation_plan.md: src/lib/seed.ts / Phase 4).
// Kept as a plain Node script (not TS-in-Workers) because it just needs to
// read local files and emit SQL text — no D1 binding required to run it.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function sqlString(value) {
    if (value === null || value === undefined) return "NULL";
    return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJson(value) {
    return sqlString(JSON.stringify(value));
}

// ── Projects (ported from src/data/work.ts) ─────────────────────────

const caseStudies = [
    {
        slug: "synapse",
        title: "Synapse",
        category: "Generative AI",
        tags: ["RAG", "Analytics", "Multi-tenant"],
        summary:
            "A RAG-based knowledge and analytics platform that lets organizations search, analyze, and interact with thousands of documents using AI.",
        thumbnail: "/thumbnails/synapse.png",
        images: ["/synapse/1.PNG", "/synapse/2.PNG", "/synapse/3.PNG"],
        year: "2025",
        featured: true,
        challenge:
            "Organizations sit on vast document collections spread across drives, wikis, and reports that are effectively unsearchable. Keyword search misses context, and manual review does not scale.",
        solution:
            "Synapse connects data sources such as Google Drive, processes thousands of documents into secure per-tenant libraries, and combines keyword, semantic, and contextual retrieval with a reasoning layer that produces answers, summaries, charts, and reports.",
        result:
            "Enterprise-ready knowledge search with strict data isolation and GPU-accelerated processing. Teams get answers in seconds instead of spending hours digging by hand.",
        metrics: [
            { value: "1000s", label: "documents indexed per library" },
            { value: "3", label: "retrieval modes combined" },
            { value: "100%", label: "tenant data isolation" },
        ],
        quote: null,
    },
    {
        slug: "learn-quran-global",
        title: "Learn Quran Global",
        category: "Web Development",
        tags: ["EdTech", "Platform", "Payments"],
        summary:
            "An online academy platform connecting students with qualified Quran teachers worldwide, with scheduling, progress tracking, and payments built in.",
        thumbnail: "/lqg/lqfg-1.png",
        images: ["/lqg/lqfg-1.png", "/lqg/lqg-2.png", "/lqg/lqg-3.png"],
        year: "2025",
        featured: true,
        challenge:
            "The academy needed a reliable platform serving students and teachers across time zones, intuitive enough for users of all ages.",
        solution:
            "A complete platform with student registration, teacher profiles, real-time class booking, progress tracking, and secure payment integration, built for clarity and reliability.",
        result:
            "A stable production platform that students and teachers use daily, delivered in a two-month engagement.",
        metrics: [
            { value: "2", label: "months to launch" },
            { value: "2-sided", label: "student + teacher platform" },
            { value: "Live", label: "in production" },
        ],
        quote: {
            text: "Working with KINETIQ was a smooth and reassuring experience. They clearly understood our vision and translated it into a clean, easy-to-use website. The platform runs reliably, and the team was responsive throughout.",
            name: "Hammad Sarwar",
            role: "Learn Quran Global",
        },
    },
    {
        slug: "records",
        title: "Records",
        category: "Web Development",
        tags: ["Desktop", "Fintech", "SQLite"],
        summary:
            "A custom desktop application for jewelry businesses to manage khata (credit/debit) records with automatic balances and reporting.",
        thumbnail: "/records/1.png",
        images: ["/records/1.png", "/records/2.png", "/records/3.png", "/records/4.png"],
        year: "2025",
        featured: true,
        challenge:
            "Daily credit and debit bookkeeping was manual and error-prone, and the business needed software shaped around how khata records actually work.",
        solution:
            "A desktop application built with input from working jewelry business owners, covering customer profiles, transaction tracking, automatic balance updates, reporting, and backup with recovery.",
        result:
            "Cleaner records, fewer manual errors, and daily operations that take minutes instead of hours.",
        metrics: [
            { value: "2", label: "months to delivery" },
            { value: "Auto", label: "balance calculation" },
            { value: "Daily", label: "business use" },
        ],
        quote: {
            text: "KINETIQ developed a custom desktop application for our jewelry business. The system simplified our daily operations and reduced manual errors. The software is practical, stable, and has made record-keeping much easier.",
            name: "Qaisar Abbas",
            role: "Records",
        },
    },
    {
        slug: "fo-intelligence",
        title: "FO Intelligence",
        category: "AI Automation",
        tags: ["AI Pipeline", "RAG", "Data Enrichment"],
        summary:
            "An automated intelligence pipeline that discovers, enriches, and scores family office records from public sources, then serves them through a RAG-powered chat and search interface.",
        thumbnail: "/fo-intelligence/1.png",
        images: ["/fo-intelligence/1.png", "/fo-intelligence/2.png"],
        year: "2026",
        featured: false,
        challenge:
            "Family offices are a notoriously sparse research target — entity and contact data scattered across a single directory listing and hundreds of individual websites, none of it structured. Building a usable, current dataset by hand would take a research team weeks, and it would be stale again within a month.",
        solution:
            "A six-stage, resumable pipeline: discovery from a directory source, website crawling with GPT-4o-mini extraction, contact discovery through search-API queries and email-pattern inference, an enrichment pass that verifies domains and de-duplicates records, an analytical scoring stage that selects a curated top set, and finally embedding into a Qdrant vector database behind a FastAPI RAG service so the whole dataset can be queried in plain language through a React interface.",
        result:
            "A self-contained pipeline that goes from zero to a scored, searchable 28-column dataset with a working chat interface, deployed end-to-end — every stage writes its own JSON checkpoint, so any step can be re-run on its own without losing prior work.",
        metrics: [
            { value: "6", label: "pipeline stages" },
            { value: "28", label: "data columns per record" },
            { value: "50", label: "curated records served" },
        ],
        quote: null,
    },
    {
        slug: "autobg",
        title: "AutoBG",
        category: "Generative AI",
        tags: ["Computer Vision", "Diffusion Models", "Image Compositing"],
        summary:
            "An AI-powered studio tool that lifts a car cleanly off its background with GPU-accelerated matting, then composites it onto a photorealistic studio scene — either a built-in template or a fully AI-generated backdrop.",
        thumbnail: "/autobg/1.png",
        images: ["/autobg/1.png", "/autobg/2.png"],
        year: "2026",
        featured: false,
        challenge:
            "Professional car photography for dealerships and online listings normally means a physical studio, controlled lighting, and manual retouching — too slow and expensive for a seller who just wants one clean, consistent photo.",
        solution:
            "A FastAPI backend runs RMBG-2.0 on a GPU for a crisp, full-resolution alpha matte, then renders the result through one of three modes: composite onto a hand-built studio template with a generated floor reflection and contact shadow, generate the backdrop from scratch with an SDXL ControlNet inpainting pipeline guided by the car's edges, or blend an AI-relit reflection over an exact template floor. A deterministic realism pass — white-balance harmonization, edge light-wrap, floor-bounce relighting, and film grain — knits the cutout into the scene so it stops reading as pasted in.",
        result:
            "One upload produces a dealership-ready studio shot in seconds, on any car angle, because the pipeline grounds the reflection and shadow from the actual contact line in the alpha mask rather than a fixed bounding box.",
        metrics: [
            { value: "3", label: "render modes: template, AI, reflect-AI" },
            { value: "2048px", label: "full-resolution GPU matting" },
            { value: "GPU", label: "accelerated end-to-end pipeline" },
        ],
        quote: null,
    },
    {
        slug: "queuecare",
        title: "QueueCare",
        category: "Web Development",
        tags: ["Healthcare", "Firebase", "Real-time Queue"],
        summary:
            "A clinic queue and appointment platform that lets patients book, track, and get notified about their visit in real time, while clinics manage doctors, walk-ins, and queue flow from a live dashboard.",
        thumbnail: "/queuecare/1.png",
        images: ["/queuecare/1.png", "/queuecare/2.png"],
        year: "2026",
        featured: false,
        challenge:
            "Clinic waiting rooms run on guesswork — patients have no visibility into how long they'll wait, and staff juggle doctor schedules, walk-ins, and appointment status changes by hand across paper and phone calls.",
        solution:
            "A Next.js web app built as a companion to an existing mobile app, sharing one Firebase project across both. Patients browse clinics, book by doctor, service, date, and slot, and follow a live active-booking tracker with push notifications. Clinics get doctor switching, a selected-date dashboard, walk-in intake, queue start/pause/resume/close controls, and weekly availability management, with cancellation rules kept consistent with the mobile app.",
        result:
            "A production web companion to the mobile app with real-time booking, live queue state, and Firebase Cloud Functions driving appointment reminders and status-update push notifications.",
        metrics: [
            { value: "2", label: "linked apps: patient + clinic" },
            { value: "Real-time", label: "queue and booking state" },
            { value: "Shared", label: "Firebase backend with mobile" },
        ],
        quote: null,
    },
];

// ── Blogs (ported from src/data/blog.ts + public/blogs/*.txt) ───────

const blogPosts = [
    {
        slug: "edge-ai-autonomous-drones",
        title: "Eyes in the Sky: How Edge AI Is Making Drones Truly Autonomous",
        excerpt:
            "Onboard perception, real-time obstacle avoidance, and the early stages of swarm coordination — how edge AI is turning remote-controlled aircraft into genuinely autonomous systems.",
        category: "Drones",
        date: "2026-07-18",
        file: "blog9.txt",
        readTime: 4,
    },
    {
        slug: "faa-part-108-bvlos-autonomous-drones",
        title: "Part 108 Is Coming: What the FAA's New BVLOS Rules Mean for Autonomous Drones",
        excerpt:
            "The FAA's incoming Part 108 rule replaces case-by-case BVLOS waivers with performance-based standards. Here's what it changes and why the timing matters now.",
        category: "Drones",
        date: "2026-07-07",
        file: "blog8.txt",
        readTime: 4,
    },
    {
        slug: "yolo26-real-time-vision-refresh",
        title: "Real-Time Vision Gets a Refresh: YOLO26 and the Unified Detection Stack",
        excerpt:
            "A native end-to-end, NMS-free architecture and six vision tasks in one framework — why purpose-built detectors like YOLO26 still matter alongside foundation models.",
        category: "Computer Vision",
        date: "2026-06-23",
        file: "blog7.txt",
        readTime: 3,
    },
    {
        slug: "sam-3-segment-anything-grows-up",
        title: "Segment Anything Grows Up: How SAM 3 Changes What's Possible in Computer Vision",
        excerpt:
            "Text-prompt segmentation, 270,000+ zero-shot concepts, and a new architecture for telling closely related objects apart — inside Meta's SAM 3.",
        category: "Computer Vision",
        date: "2026-06-09",
        file: "blog6.txt",
        readTime: 4,
    },
    {
        slug: "humanoid-robot-race-pilot-to-platform",
        title: "The Humanoid Robot Race: From Pilot Programs to Production Floors",
        excerpt:
            "Optimus Gen 2, 1X's NEO, and Boston Dynamics' Electric Atlas are moving out of the lab. What's actually running unsupervised today, and what still isn't.",
        category: "Robotics",
        date: "2026-05-26",
        file: "blog5.txt",
        readTime: 4,
    },
    {
        slug: "vla-to-world-models-general-purpose-robots",
        title: "From Vision-Language-Action to World Models: The New Architecture Behind General-Purpose Robots",
        excerpt:
            "Why leading labs are moving past direct perception-to-action mapping toward learned world models that let robots imagine outcomes before they act.",
        category: "Robotics",
        date: "2026-05-12",
        file: "blog4.txt",
        readTime: 3,
    },
    {
        slug: "scalable-software-in-the-age-of-ai",
        title: "Building Scalable Software in the Age of AI: Lessons from Modern Web Development",
        excerpt:
            "Architecture-first thinking, performance under AI-driven load, and why adaptability has become a foundational requirement, not a nice-to-have.",
        category: "Company",
        date: "2026-03-28",
        file: "blog3.txt",
        readTime: 2,
    },
    {
        slug: "generative-ai-beyond-chatbots",
        title: "Generative AI in Real-World Products: Moving Beyond Chatbots",
        excerpt:
            "Generative AI as a system component, not a novelty feature — how it's showing up in content generation, developer tooling, and data-heavy products.",
        category: "Company",
        date: "2026-03-05",
        file: "blog2.txt",
        readTime: 3,
    },
    {
        slug: "from-automation-to-autonomy-agentic-ai",
        title: "From Automation to Autonomy: How Agentic AI Is Changing the Way Businesses Operate",
        excerpt:
            "Rule-based automation reacts. Agentic AI decides. Why the shift from automation to autonomy is becoming a real operational differentiator.",
        category: "Company",
        date: "2026-02-10",
        file: "blog1.txt",
        readTime: 2,
    },
];

// The .txt files start with a plain-text title line followed by a blank
// line, then the markdown body. We drop that first line since `title`
// already carries it, and store the rest as the blog's markdown content.
function loadBody(file) {
    const raw = readFileSync(path.join(ROOT, "public", "blogs", file), "utf8");
    const lines = raw.split(/\r?\n/);
    // Skip the title line and the blank line after it.
    return lines.slice(2).join("\n").trim();
}

// ── Emit SQL ──────────────────────────────────────────────────────────

const lines = [
    "-- Auto-generated by scripts/generate-seed.mjs — do not edit by hand.",
    "-- Migrates src/data/work.ts + src/data/blog.ts + public/blogs/*.txt into D1.",
    "",
];

caseStudies.forEach((cs, i) => {
    lines.push(
        `INSERT INTO projects (slug, title, category, tags, summary, thumbnail, images, year, featured, challenge, solution, result, metrics, quote, sort_order) VALUES (` +
            [
                sqlString(cs.slug),
                sqlString(cs.title),
                sqlString(cs.category),
                sqlJson(cs.tags),
                sqlString(cs.summary),
                sqlString(cs.thumbnail),
                sqlJson(cs.images),
                sqlString(cs.year),
                cs.featured ? 1 : 0,
                sqlString(cs.challenge),
                sqlString(cs.solution),
                sqlString(cs.result),
                sqlJson(cs.metrics),
                cs.quote ? sqlJson(cs.quote) : "NULL",
                i,
            ].join(", ") +
            ");"
    );
});

lines.push("");

blogPosts.forEach((post) => {
    const content = loadBody(post.file);
    lines.push(
        `INSERT INTO blogs (slug, title, excerpt, category, date, read_time, content, published) VALUES (` +
            [
                sqlString(post.slug),
                sqlString(post.title),
                sqlString(post.excerpt),
                sqlString(post.category),
                sqlString(post.date),
                post.readTime,
                sqlString(content),
                1,
            ].join(", ") +
            ");"
    );
});

writeFileSync(path.join(ROOT, "seed.sql"), lines.join("\n") + "\n", "utf8");
console.log(`Wrote seed.sql (${caseStudies.length} projects, ${blogPosts.length} blogs).`);
