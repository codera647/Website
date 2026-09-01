import crypto from "crypto";
import { getSupabaseAdmin, getEnvSecret } from "@/lib/supabase";

/**
 * Cal.com webhook receiver — subscribed to MEETING_ENDED only (fires once
 * the scheduled call's end time has passed, so it doubles as "the call
 * happened"). Upserts a row into Supabase's `leads` table via the
 * upsert_lead_from_cal() function (see leads-schema.sql) rather than a
 * plain upsert, so a retried webhook delivery — Cal.com retries on any
 * non-2xx or timeout — never resets a lead a human already marked 'won'
 * back to 'pending'. BOOKING_CREATED is deliberately not used here —
 * that fires at booking time, before anyone knows if the call happens.
 *
 * Configure in Cal.com: Settings -> Webhooks -> add this route's full URL,
 * subscribe to MEETING_ENDED, and set the signing secret to the same
 * value as this Worker's CAL_WEBHOOK_SECRET so the signature check below
 * passes.
 */

interface CalAttendee {
    email?: string;
    name?: string;
}

interface CalWebhookPayload {
    triggerEvent?: string;
    payload?: {
        uid?: string;
        startTime?: string;
        attendees?: CalAttendee[];
    };
}

export async function POST(req: Request) {
    // Must read as raw text BEFORE parsing JSON — the signature is
    // computed over the raw bytes, not the re-serialized object.
    const rawBody = await req.text();
    const signature = req.headers.get("x-cal-signature-256");

    const secret = getEnvSecret("CAL_WEBHOOK_SECRET");
    if (!secret) {
        console.error("Cal webhook: CAL_WEBHOOK_SECRET is not configured.");
        return new Response("Webhook not configured", { status: 500 });
    }

    const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

    if (
        !signature ||
        signature.length !== expected.length ||
        !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    ) {
        return new Response("Invalid signature", { status: 401 });
    }

    const payload = JSON.parse(rawBody) as CalWebhookPayload;

    if (payload.triggerEvent !== "MEETING_ENDED") {
        // Defensive — the webhook is scoped to this event already, but
        // don't trust that alone.
        return new Response("Ignored", { status: 200 });
    }

    const booking = payload.payload;
    const attendee = booking?.attendees?.[0];

    const { error } = await getSupabaseAdmin().rpc("upsert_lead_from_cal", {
        p_cal_booking_uid: booking?.uid,
        p_name: attendee?.name ?? "Unknown",
        p_email: attendee?.email ?? "",
        p_call_date: booking?.startTime,
    });

    if (error) {
        console.error("Failed to upsert lead:", error);
        return new Response("DB error", { status: 500 }); // non-200 so Cal.com retries
    }

    return new Response("OK", { status: 200 });
}
