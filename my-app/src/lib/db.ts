import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Typed Cloudflare env bindings — used by all server-side code that
 * touches D1, R2, or AI. Extends the base env that OpenNext provides.
 */
export interface CloudflareEnv {
    DB: D1Database;
    BUCKET: R2Bucket;
    IMAGES_BUCKET: R2Bucket;
    AI: Ai;
    ASSETS: Fetcher;
    ADMIN_PASSWORD_HASH: string;
}

/**
 * Get typed Cloudflare environment bindings.
 * Works in API routes and server components running on Workers.
 */
export function getEnv(): CloudflareEnv {
    const { env } = getCloudflareContext();
    return env as unknown as CloudflareEnv;
}

/**
 * Get the D1 database binding.
 */
export function getDB(): D1Database {
    return getEnv().DB;
}

/**
 * Get the R2 bucket binding (RAG source documents).
 */
export function getBucket(): R2Bucket {
    return getEnv().BUCKET;
}

/**
 * Get the R2 bucket binding for admin-uploaded images (project
 * thumbnails/screenshots), served publicly via /api/images/[...path].
 */
export function getImagesBucket(): R2Bucket {
    return getEnv().IMAGES_BUCKET;
}
