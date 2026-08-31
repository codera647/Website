import type { MetadataRoute } from "next";
import { getAllBlogPosts, getAllProjects, getAllJobs } from "@/lib/data";

const BASE_URL = "https://thekinetiq.solutions";

// projects/blogs/jobs are read live from D1 — no static generation here.
export const dynamic = "force-dynamic";

/**
 * Next.js sitemap generation — produces /sitemap.xml dynamically.
 * Covers all static routes, blog posts, case studies, and active job openings.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const [posts, projects, jobs] = await Promise.all([
        getAllBlogPosts().catch(() => []),
        getAllProjects().catch(() => []),
        getAllJobs(true).catch(() => []),
    ]);

    /* ── Static pages ─────────────────────────────────────────── */
    const staticPages: MetadataRoute.Sitemap = [
        { url: `${BASE_URL}`, lastModified: now, changeFrequency: "weekly", priority: 1 },
        { url: `${BASE_URL}/momentum-systems`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
        { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
        { url: `${BASE_URL}/ai-engagements`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${BASE_URL}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
        { url: `${BASE_URL}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
        { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
        { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${BASE_URL}/careers`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
        { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
        { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ];

    /* ── Blog posts ───────────────────────────────────────────── */
    const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.date || now),
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    /* ── Case studies ─────────────────────────────────────────── */
    const workPages: MetadataRoute.Sitemap = projects.map((cs) => ({
        url: `${BASE_URL}/work/${cs.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    /* ── Job Openings ─────────────────────────────────────────── */
    const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
        url: `${BASE_URL}/careers/${job.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.75,
    }));

    return [...staticPages, ...blogPages, ...workPages, ...jobPages];
}
