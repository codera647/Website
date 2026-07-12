import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Minimal config for launch — no R2 incremental cache override yet.
 * TODO(user): once an R2 bucket is bound (see wrangler.jsonc), wire in
 * `@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache`
 * here for ISR/data-cache persistence.
 */
export default defineCloudflareConfig();
