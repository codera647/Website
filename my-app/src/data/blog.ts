/**
 * Blog index (brief: new /blog + /blog/[slug] pages). Metadata only —
 * kept dependency-free (no `fs`) so it can be imported from client
 * components (nav, footer) as well as server pages. Article bodies live
 * as plain text in public/blogs/*.txt and are read + parsed server-side
 * by src/lib/blog.ts.
 */

export type BlogCategory = "Company" | "Robotics" | "Computer Vision" | "Drones";

export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    category: BlogCategory;
    /** ISO date, used for sorting + display */
    date: string;
    /** filename inside public/blogs/ */
    file: string;
    readTime: number;
}

export const blogPosts: BlogPost[] = [
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

export function getAllPosts(): BlogPost[] {
    return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
    const current = getPostBySlug(slug);
    const rest = getAllPosts().filter((p) => p.slug !== slug);
    if (!current) return rest.slice(0, count);

    // prefer same-category posts, then fill with the most recent others
    const sameCategory = rest.filter((p) => p.category === current.category);
    const others = rest.filter((p) => p.category !== current.category);
    return [...sameCategory, ...others].slice(0, count);
}
