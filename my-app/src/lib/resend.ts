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

/**
 * Identity for automated mail sent TO an external recipient (prospects,
 * leads, customers) — as opposed to internal team notifications, which use
 * FROM_EMAIL above and are fine coming from a general Kinetiq sender.
 *
 * `no-reply@` sets the correct expectation that this is an automated
 * message. `reply_to: info@` is required, not optional — it's what stops a
 * recipient's reply from bouncing or silently vanishing; info@ is a real,
 * human-monitored Google Workspace inbox. Never send bulk/automated mail
 * FROM info@ directly — it stays reserved for direct human correspondence.
 */
export const NO_REPLY_FROM_EMAIL = "Kinetiq <no-reply@thekinetiq.solutions>";
export const REPLY_TO_EMAIL = "info@thekinetiq.solutions";
