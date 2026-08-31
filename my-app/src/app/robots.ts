import type { MetadataRoute } from "next";

const BASE_URL = "https://thekinetiq.solutions";

/**
 * Next.js robots.txt generation — produces /robots.txt at build time.
 * Allows search crawlers, points to the dynamic sitemap, and blocks
 * /api/ endpoints and /admin/ dashboard to conserve crawl budget.
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/admin/"],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
