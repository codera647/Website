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
];

export const featuredCaseStudies = caseStudies.filter((c) => c.featured);
