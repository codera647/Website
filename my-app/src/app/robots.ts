import type { MetadataRoute } from "next";

const BASE_URL = "https://thekinetiq.solutions";

/**
 * Next.js robots.txt generation — produces /robots.txt at build time.
 * Allows all crawlers, points to the sitemap, and blocks /api/ routes
 * (they're JSON endpoints, not pages).
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/"],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}

