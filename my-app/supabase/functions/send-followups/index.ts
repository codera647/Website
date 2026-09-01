// Supabase Edge Function — daily follow-up sender.
//
// Deploy with:
//   npx supabase login
//   npx supabase link --project-ref ghvggluglhnsfntlivxy
//   npx supabase functions deploy send-followups
//
// Scheduled via Supabase's built-in Cron (pg_cron + pg_net) — see the
// `cron.schedule(...)` call at the bottom of leads-schema.sql. Silence
// (still 'pending' past the 7-day window) is treated the same as 'lost' —
// a real decision only pauses the follow-up if status is 'won'.

import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const FOLLOW_UP_WINDOW_DAYS = 7;

interface Lead {
    id: string;
    name: string;
    email: string;
    call_date: string;
    notes: string | null;
}

function formatCallDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

/**
 * No pressure, no "just checking in" filler — one specific reference from
 * lead.notes when it's set, a generic-but-honest opener when it's not,
 * and a low-friction next step (case study + an easy way to restart the
 * conversation) either way.
 */
function buildFollowUpEmail(lead: Lead): { subject: string; html: string; text: string } {
    const firstName = lead.name.trim().split(" ")[0] || lead.name;
    const callDate = formatCallDate(lead.call_date);
    const reference = lead.notes?.trim()
        ? `You mentioned ${lead.notes.trim()} when we spoke on ${callDate} — still happy to dig into that with you.`
        : `It's been a bit since we talked on ${callDate}, and I wanted to check whether anything's changed on your end.`;

    const subject = `Following up, ${firstName}`;

    const text = `Hi ${firstName},\n\n${reference}\n\nIf it's still useful, here's a look at what we've shipped for similar businesses: https://thekinetiq.solutions/work\n\nOr just reply to this email if you want to pick the conversation back up — no pressure either way.\n\n— Kinetiq\ninfo@thekinetiq.solutions`;

    const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1e293b;">
            <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6;">Hi ${firstName},</p>
            <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6;">${reference}</p>
            <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6;">
                If it's still useful, here's a look at
                <a href="https://thekinetiq.solutions/work" style="color: #111113; font-weight: 600;">what we've shipped</a>
                for similar businesses.
            </p>
            <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6;">
                Or just reply to this email if you want to pick the conversation back up — no pressure either way.
            </p>
            <p style="margin: 0; font-size: 14px; color: #64748b;">
                — Kinetiq · <a href="mailto:info@thekinetiq.solutions" style="color: #64748b;">info@thekinetiq.solutions</a>
            </p>
        </div>
    `;

    return { subject, html, text };
}

Deno.serve(async (req) => {
    const { data: leads, error } = await supabase
        .from("leads")
        .select("*")
        .neq("status", "won")
        .eq("follow_up_sent", false)
        .lt("call_date", new Date(Date.now() - FOLLOW_UP_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
        console.error("Query failed:", error);
        return new Response("Query failed", { status: 500 });
    }

    const results = [];
    for (const lead of (leads ?? []) as Lead[]) {
        try {
            const { subject, html, text } = buildFollowUpEmail(lead);

            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: "Kinetiq <no-reply@thekinetiq.solutions>",
                    reply_to: "info@thekinetiq.solutions",
                    to: lead.email,
                    subject,
                    html,
                    text,
                }),
            });

            if (!res.ok) throw new Error(await res.text());

            // The email is already sent at this point — if this update fails
            // (bad column, permissions, etc.) the lead would stay
            // follow_up_sent: false and get emailed again tomorrow. Checking
            // the error here (unlike a plain fire-and-forget update) is what
            // makes that failure visible instead of a silent double-send.
            const { error: updateError } = await supabase
                .from("leads")
                .update({ follow_up_sent: true, follow_up_sent_at: new Date().toISOString() })
                .eq("id", lead.id);

            if (updateError) {
                console.error(
                    `Sent to ${lead.email} but failed to mark follow_up_sent — will resend next run:`,
                    updateError
                );
                results.push({ id: lead.id, ok: false, error: `sent but not marked: ${updateError.message}` });
                continue;
            }

            results.push({ id: lead.id, ok: true });
        } catch (err) {
            console.error(`Failed to send follow-up to ${lead.email}:`, err);
            results.push({ id: lead.id, ok: false }); // one failure doesn't block the rest of the batch
        }
    }

    return new Response(JSON.stringify(results), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
});
