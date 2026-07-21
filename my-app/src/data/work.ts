/**
 * Case studies (brief §4 Work). Projects, imagery, and client quotes
 * are REAL (ported from the previous site). ⚠️ challenge/solution/
 * result narratives and metrics are DRAFT — TODO(user): replace with
 * real figures and approved wording.
 */

export interface CaseStudy {
    slug: string;
    title: string;
    category: "AI Automation" | "Web Development" | "Generative AI";
    tags: string[];
    summary: string;
    thumbnail: string;
    images: string[];
    year: string;
    featured: boolean;
    challenge: string;
    solution: string;
    result: string;
    metrics: { value: string; label: string }[];
    quote?: { text: string; name: string; role: string };
}

export const caseStudies: CaseStudy[] = [
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
    },
    {
        slug: "learn-quran-global",
        title: "Learn Quran Global",
        category: "Web Development",
        tags: ["EdTech", "Platform", "Payments"],
        summary:
            "An online academy platform connecting students with qualified Quran teachers worldwide, with scheduling, progress tracking, and payments built in.",
        // TODO(user): provide /thumbnails/learn-quran-global.png like Synapse's
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
        // TODO(user): provide /thumbnails/records.png like Synapse's
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
        // TODO(user): add real screenshots to /public/fo-intelligence/ and update these paths
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
    },
    {
        slug: "autobg",
        title: "AutoBG",
        category: "Generative AI",
        tags: ["Computer Vision", "Diffusion Models", "Image Compositing"],
        summary:
            "An AI-powered studio tool that lifts a car cleanly off its background with GPU-accelerated matting, then composites it onto a photorealistic studio scene — either a built-in template or a fully AI-generated backdrop.",
        // TODO(user): add real screenshots to /public/autobg/ and update these paths
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
    },
    {
        slug: "queuecare",
        title: "QueueCare",
        category: "Web Development",
        tags: ["Healthcare", "Firebase", "Real-time Queue"],
        summary:
            "A clinic queue and appointment platform that lets patients book, track, and get notified about their visit in real time, while clinics manage doctors, walk-ins, and queue flow from a live dashboard.",
        // TODO(user): add real screenshots to /public/queuecare/ and update these paths
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
    },
];

export const featuredCaseStudies = caseStudies.filter((c) => c.featured);
