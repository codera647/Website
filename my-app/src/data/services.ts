/**
 * Services content (brief §4). ⚠️ Descriptions are DRAFT copy for the
 * user to replace. Demo loops currently render animated UI mockups —
 * TODO(user): provide real screen-capture footage per service and set
 * `demoVideo` to swap it in.
 */

export interface Service {
    id: string;
    anchor: string;
    title: string;
    tagline: string;
    description: string;
    capabilities: string[];
    stack: string[];
    /** which built-in animated mockup DemoLoop renders until real footage exists */
    demoMockup: "automation" | "code" | "rag";
    demoVideo?: string;
    demoLabel: string;
}

export const services: Service[] = [
    {
        id: "ai-automation",
        anchor: "ai-automation",
        title: "AI Automation",
        tagline: "Systems that work while you don't.",
        description:
            "We design agentic workflows and automation pipelines that take repetitive work off your team's plate, from task automation to autonomous agents that reason, decide, and act.",
        capabilities: [
            "Workflow automation",
            "Agentic systems",
            "RPA + LLM orchestration",
            "Process intelligence",
        ],
        stack: ["Python", "LangChain", "LlamaIndex", "n8n", "AWS"],
        demoMockup: "automation",
        demoLabel: "pipeline.run",
    },
    {
        id: "web-development",
        anchor: "web-development",
        title: "Web Development",
        tagline: "Production-grade, from day one.",
        description:
            "From marketing sites to complex internal platforms, we build fast, scalable, production-ready web applications, engineered with the same rigor we bring to our AI systems.",
        capabilities: [
            "Full-stack engineering",
            "Next.js & React",
            "Cloud-native architecture",
            "API & systems design",
        ],
        stack: ["TypeScript", "Next.js", "React", "Node.js", "Supabase", "Tailwind"],
        demoMockup: "code",
        demoLabel: "deploy: production",
    },
    {
        id: "generative-ai",
        anchor: "generative-ai",
        title: "Generative AI",
        tagline: "Real products, not demos.",
        description:
            "We build with the models shaping the next decade of software: retrieval systems, custom LLM pipelines, computer vision, and generative tools built for real problems rather than demos.",
        capabilities: [
            "RAG systems",
            "LLM integration",
            "Computer vision",
            "Multi-modal AI",
        ],
        stack: ["Python", "LangChain", "LlamaIndex", "OpenCV", "Flask", "AWS"],
        demoMockup: "rag",
        demoLabel: "search: knowledge base",
    },
];

/** "How we work" process (brief §4 Services) — DRAFT copy */
export const process = [
    {
        step: "01",
        title: "Discover",
        text: "We map your workflows, constraints, and goals, and find where software or AI actually pays off.",
    },
    {
        step: "02",
        title: "Design",
        text: "Architecture, interfaces, and a build plan you can hold us to. No black boxes.",
    },
    {
        step: "03",
        title: "Build",
        text: "Short iterations, working software every week, and honest demos of real progress.",
    },
    {
        step: "04",
        title: "Deploy",
        text: "Production launch, monitoring, documentation, and a handover your team actually understands.",
    },
];
