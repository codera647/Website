import { NextResponse } from "next/server";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import { renderMarkdownEmailHtml } from "@/lib/emailMarkdown";

const NOTIFY_EMAIL = "info@thekinetiq.solutions";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SurveyAnswerPayload {
    questionId: number;
    title: string;
    key: string;
    label: string;
}

function buildAnswersHtml(answers: SurveyAnswerPayload[]): string {
    return answers
        .map(
            (a, i) => `
            <div style="margin-bottom: 16px; padding: 12px; background: #f8fafc; border-left: 4px solid #111113; border-radius: 4px;">
                <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">
                    Question 0${i + 1}: ${a.title}
                </p>
                <p style="margin: 0; font-size: 14px; color: #0f172a; font-weight: 500;">
                    ${a.label}
                </p>
            </div>
        `
        )
        .join("");
}

function buildAnswersText(answers: SurveyAnswerPayload[]): string {
    return answers.map((a, i) => `Q${i + 1} (${a.title}): ${a.label}`).join("\n");
}

/** Internal lead notification — sent to the team every time, regardless of whether the visitor left an email. */
async function sendInternalNotification(opts: {
    answers: SurveyAnswerPayload[];
    recommendedTier: string;
    userEmail?: string;
    userName?: string;
    summaryNotes?: string;
}) {
    const { answers, recommendedTier, userEmail, userName, summaryNotes } = opts;
    const resend = getResend();

    const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background: #111113; padding: 24px; text-align: left;">
                <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700; letter-spacing: -0.02em;">
                    ⚡ New Momentum Survey Assessment Lead
                </h1>
                <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0 0;">
                    A prospect just completed the interactive Momentum System recommendation survey.
                </p>
            </div>

            <div style="padding: 24px;">
                <div style="background: #f1f5f9; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
                    <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; font-weight: bold;">
                        Recommended Tier
                    </p>
                    <p style="margin: 4px 0 0 0; font-size: 22px; font-weight: 800; color: #0f172a;">
                        ${recommendedTier}
                    </p>
                    ${userEmail ? `<p style="margin: 8px 0 0 0; font-size: 14px; color: #334155;"><strong>Contact Email:</strong> <a href="mailto:${userEmail}" style="color: #2563eb;">${userEmail}</a>${userName ? ` (${userName})` : ""}</p>` : `<p style="margin: 8px 0 0 0; font-size: 13px; color: #64748b;"><em>Lead completed survey anonymously (direct chat session)</em></p>`}
                </div>

                <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.08em; color: #475569; margin: 0 0 12px 0;">
                    Prospect Responses:
                </h3>

                ${buildAnswersHtml(answers)}

                ${
                    summaryNotes
                        ? `
                    <div style="margin-top: 20px; padding: 16px; background: #fafafa; border: 1px solid #e5e5e5; border-radius: 6px;">
                        <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #525252;">AI Recommendation Synthesis:</p>
                        <div style="font-size: 13px; color: #262626;">${renderMarkdownEmailHtml(summaryNotes)}</div>
                    </div>
                `
                        : ""
                }

                <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
                    Sent automatically by Kinetiq Motion AI Engine • thekinetiq.solutions
                </div>
            </div>
        </div>
    `;

    const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: NOTIFY_EMAIL,
        replyTo: userEmail || undefined,
        subject: `⚡ Momentum Survey Lead: ${recommendedTier}${userEmail ? ` — ${userEmail}` : ""}`,
        html,
        text: `NEW MOMENTUM SURVEY LEAD\n\nRecommended Tier: ${recommendedTier}\nContact: ${userEmail || "Anonymous Chat Visitor"}\n\nSURVEY RESPONSES:\n${buildAnswersText(answers)}\n\n${summaryNotes ? `AI Notes:\n${summaryNotes}` : ""}`,
    });

    if (error) throw new Error(typeof error === "string" ? error : error.message);
}

/** The actual deliverable the visitor asked for: their full growth assessment report, sent to their own inbox. */
async function sendUserReport(opts: {
    answers: SurveyAnswerPayload[];
    recommendedTier: string;
    userEmail: string;
    userName?: string;
    summaryNotes: string;
}) {
    const { answers, recommendedTier, userEmail, userName, summaryNotes } = opts;
    const resend = getResend();

    const reportHtml = summaryNotes.trim()
        ? renderMarkdownEmailHtml(summaryNotes)
        : `<p style="margin:0;color:#1e293b;">Your recommended tier is <strong>${recommendedTier}</strong>. Reply to this email or book a call below and we'll walk you through the full breakdown.</p>`;

    const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background: #111113; padding: 28px 24px; text-align: left;">
                <p style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 800; letter-spacing: -0.02em;">
                    kinet<span style="color:#94a3b8;">iq</span>
                </p>
                <h1 style="color: #ffffff; font-size: 18px; margin: 14px 0 0 0; font-weight: 700;">
                    Your Momentum System Growth Assessment
                </h1>
            </div>

            <div style="padding: 28px 24px;">
                <p style="margin: 0 0 18px 0; font-size: 14px; color: #334155;">
                    Hi${userName ? ` ${userName}` : ""}, thanks for taking the 1-minute assessment. Here's your
                    personalized breakdown and recommended tier, based on your answers.
                </p>

                <div style="background: #f1f5f9; padding: 16px 18px; border-radius: 6px; margin-bottom: 24px;">
                    <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; font-weight: bold;">
                        Recommended Tier
                    </p>
                    <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: 800; color: #0f172a;">
                        ${recommendedTier}
                    </p>
                </div>

                <div style="font-size: 14px;">${reportHtml}</div>

                <div style="margin: 28px 0; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b;">
                        Want to talk it through? Grab 30 minutes with our team:
                    </p>
                    <a
                        href="https://cal.com/abdul-moiz/30min"
                        style="display: inline-block; background: #111113; color: #ffffff; font-weight: 700; font-size: 13px; padding: 12px 22px; border-radius: 4px; text-decoration: none;"
                    >
                        Book a 30-minute call →
                    </a>
                </div>

                <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; margin: 0 0 12px 0;">
                    Your responses
                </h3>
                ${buildAnswersHtml(answers)}

                <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
                    Sent by Kinetiq • <a href="mailto:${NOTIFY_EMAIL}" style="color: #94a3b8;">${NOTIFY_EMAIL}</a> • thekinetiq.solutions
                </div>
            </div>
        </div>
    `;

    const text = `YOUR MOMENTUM SYSTEM GROWTH ASSESSMENT\n\nRecommended Tier: ${recommendedTier}\n\n${summaryNotes || ""}\n\nBook a call: https://cal.com/abdul-moiz/30min\n\nYour responses:\n${buildAnswersText(answers)}\n\n— Kinetiq (${NOTIFY_EMAIL})`;

    const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: userEmail,
        replyTo: NOTIFY_EMAIL,
        subject: `Your Momentum System recommendation: ${recommendedTier}`,
        html,
        text,
    });

    if (error) throw new Error(typeof error === "string" ? error : error.message);
}

export async function POST(request: Request) {
    let body: {
        answers?: SurveyAnswerPayload[];
        recommendedTier?: string;
        userEmail?: string;
        userName?: string;
        summaryNotes?: string;
    };

    try {
        body = (await request.json()) as typeof body;
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
    }

    const { answers = [], recommendedTier = "Momentum System", userEmail, userName, summaryNotes = "" } = body;

    if (!Array.isArray(answers) || answers.length === 0) {
        return NextResponse.json({ ok: false, error: "Survey answers are required." }, { status: 400 });
    }

    const trimmedEmail = userEmail?.trim();
    if (trimmedEmail && !EMAIL_RE.test(trimmedEmail)) {
        return NextResponse.json({ ok: false, error: "That email address doesn't look right." }, { status: 400 });
    }

    // Internal notification is best-effort — it should never block or fail
    // the visitor-facing request.
    const internalNotifyPromise = sendInternalNotification({
        answers,
        recommendedTier,
        userEmail: trimmedEmail,
        userName,
        summaryNotes,
    }).catch((err) => {
        console.error("Survey lead: internal notification failed:", err);
    });

    if (!trimmedEmail) {
        await internalNotifyPromise;
        return NextResponse.json({ ok: true, message: "Lead alert sent successfully." });
    }

    // A user email means the visitor explicitly asked for their report —
    // that send's outcome is what the response should reflect.
    try {
        await sendUserReport({ answers, recommendedTier, userEmail: trimmedEmail, userName, summaryNotes });
        await internalNotifyPromise;
        return NextResponse.json({ ok: true, message: "Report sent to your inbox." });
    } catch (err) {
        console.error("Survey lead: failed to email report to user:", err);
        await internalNotifyPromise;
        return NextResponse.json(
            { ok: false, error: "Could not send the report to that email. Please try again." },
            { status: 502 }
        );
    }
}
