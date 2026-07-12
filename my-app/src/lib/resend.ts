import { Resend } from "resend";

/**
 * Shared Resend client. Reads RESEND_API_KEY lazily (at send time, not
 * at import time) so a missing key surfaces as a clean 500 from the
 * API route instead of crashing the build/dev server on startup.
 *
 * TODO(user): once thekinetiq.solutions is a verified sending domain
 * in Resend, set RESEND_FROM_EMAIL (e.g. "Kinetiq <noreply@thekinetiq.solutions>")
 * for proper deliverability. Until then this falls back to Resend's
 * shared onboarding domain, which works immediately with no setup.
 */

let client: Resend | null = null;

export function getResend(): Resend {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        throw new Error(
            "RESEND_API_KEY is not set. Add it to your .env file to enable email sending."
        );
    }
    if (!client) client = new Resend(apiKey);
    return client;
}

export const FROM_EMAIL =
    process.env.RESEND_FROM_EMAIL || "Kinetiq Website <onboarding@resend.dev>";
