import { Resend } from "resend";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Shared Resend client. Reads RESEND_API_KEY lazily (at send time)
 * from process.env or Cloudflare context env.
 */

let client: Resend | null = null;

export function getResend(overrideKey?: string): Resend {
    let apiKey = overrideKey || process.env.RESEND_API_KEY;

    if (!apiKey) {
        try {
            const { env } = getCloudflareContext();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            apiKey = (env as Record<string, any>)?.RESEND_API_KEY;
        } catch {
            // Outside Cloudflare context
        }
    }

    if (!apiKey) {
        throw new Error(
            "RESEND_API_KEY is not set. Add it to your environment variables to enable email sending."
        );
    }

    if (!client) client = new Resend(apiKey);
    return client;
}

export const FROM_EMAIL =
    process.env.RESEND_FROM_EMAIL || "Kinetiq Careers <onboarding@resend.dev>";
