/**
 * AI Automation & Generative AI Engagements (Track 2) — the enterprise/
 * mid-market counterpart to the local-business AI Add-Ons on /pricing.
 * Kept as structured data (same pattern as services.ts / work.ts) so the
 * page component stays pure presentation.
 *
 * Deliberately NOT the strikethrough/founding-price treatment used on
 * /pricing — a "founding client discount" reads as a red flag to an
 * enterprise buyer evaluating a platform vendor. These are presented as
 * engagement stages with "starting at" ranges, not a SaaS pricing table.
 */

export interface EngagementTier {
    id: string;
    stage: string;
    name: string;
    badge?: string;
    price: string;
    priceNote?: string;
    timeline: string;
    description: string;
    scope: string[];
    ctaText: string;
    ctaNote?: string;
}

export const engagementTiers: EngagementTier[] = [
    {
        id: "audit",
        stage: "01",
        name: "AI Readiness Audit",
        badge: "Entry point",
        price: "$1,500–$2,500",
        priceNote: "flat fee",
        timeline: "1–2 weeks",
        description:
            "A structured audit of your current processes, producing 3–5 concrete automation or generative-AI opportunities — each scored by effort and impact, with a rough build estimate.",
        scope: [
            "Process and workflow discovery across your team",
            "3–5 scored automation / generative-AI opportunities",
            "Effort vs. impact rating per opportunity",
            "Rough build estimate for each",
            "Fee credited toward the build if you proceed",
        ],
        ctaText: "Book an AI Readiness Audit",
    },
    {
        id: "automation-build",
        stage: "02",
        name: "Automation Build",
        price: "$8,000–$15,000",
        priceNote: "one-time build",
        timeline: "3–6 weeks",
        description:
            "Automating one specific, well-defined manual process — the kind of workflow that's currently eating hours of someone's week every week.",
        scope: [
            "One clearly scoped process, automated end to end",
            "Integration with the systems that process already touches",
            "Testing against real data before go-live",
            "Optional monitoring retainer: $500–$1,000/mo",
        ],
        ctaText: "Talk to our team",
    },
    {
        id: "custom-platform",
        stage: "03",
        name: "Custom AI Platform",
        badge: "Flagship",
        price: "$25,000–$60,000",
        priceNote: "one-time build",
        timeline: "8–16 weeks",
        description:
            "A full custom platform — a RAG-based internal knowledge system, a recommendation engine, an intelligence and analytics platform — matching the bulk of Kinetiq's existing production work.",
        scope: [
            "Production-grade architecture, not a prototype",
            "Custom retrieval, ranking, or recommendation pipeline as needed",
            "Deployed on your infrastructure or ours, your call",
            "Ongoing platform operations: $2,000–$4,000/mo",
            "Covers hosting, monitoring, and ongoing model/prompt improvement",
        ],
        ctaText: "Talk to our team",
    },
    {
        id: "enterprise-program",
        stage: "04",
        name: "Enterprise AI Program",
        price: "$75,000+",
        priceNote: "initial program scope, fully custom-quoted after the audit",
        timeline: "ongoing",
        description:
            "An ongoing AI and automation partnership across multiple systems, not a single project — for organizations that have already validated the model and are ready to scale it.",
        scope: [
            "Multiple systems and workflows under one program",
            "Dedicated engineering allocation",
            "Retainer: $5,000–$10,000/mo",
        ],
        ctaText: "Talk to our team",
        ctaNote: "Usually the second conversation, not the first — most programs start with the audit.",
    },
];

export interface EngagementFAQItem {
    question: string;
    answer: string;
}

export const engagementFaqs: EngagementFAQItem[] = [
    {
        question: "Why isn't there a fixed price?",
        answer:
            "Custom AI and automation work varies enormously by scope — a single workflow automation and a full platform build are very different engagements. The audit gives you a real, scoped number before you commit to anything larger.",
    },
    {
        question: "What happens after the AI Readiness Audit?",
        answer:
            "You get a written report with 3–5 opportunities, each with an effort/impact score and a rough estimate. If you move forward with a build, the audit fee is credited toward it. If not, you keep the report either way.",
    },
    {
        question: "How is this different from the Momentum Systems packages?",
        answer:
            "Momentum Systems is built for local and service businesses that want more bookings and repeat customers. This track is custom platform and automation work for larger companies with more complex processes — different scope, different team allocation, priced accordingly.",
    },
    {
        question: "Do you work with our existing tech stack?",
        answer:
            "Yes — we integrate with your existing databases, APIs, and cloud infrastructure rather than requiring a rebuild. Past engagements have connected to Postgres, Firebase, and CRM systems like Housecall Pro and ServiceTitan; platform builds typically deploy on AWS or GCP alongside the model provider that fits your requirements and existing vendor relationships, whether that's OpenAI, Anthropic, or an open-source option.",
    },
];
