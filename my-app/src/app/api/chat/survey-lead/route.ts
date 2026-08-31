import { NextResponse } from "next/server";
import { getResend, FROM_EMAIL } from "@/lib/resend";

const NOTIFY_EMAIL = "info@thekinetiq.solutions";

interface SurveyAnswerPayload {
    questionId: number;
    title: string;
    key: string;
    label: string;
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

    const { answers = [], recommendedTier = "Momentum System", userEmail, userName, summaryNotes } = body;

    if (!Array.isArray(answers) || answers.length === 0) {
        return NextResponse.json({ ok: false, error: "Survey answers are required." }, { status: 400 });
    }

    const answersHtml = answers
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

    const answersText = answers
        .map((a, i) => `Q${i + 1} (${a.title}): ${a.label}`)
        .join("\n");

    const htmlContent = `
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

                ${answersHtml}

                ${
                    summaryNotes
                        ? `
                    <div style="margin-top: 20px; padding: 16px; background: #fafafa; border: 1px solid #e5e5e5; border-radius: 6px;">
                        <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #525252;">AI Recommendation Synthesis:</p>
                        <p style="margin: 0; font-size: 13px; color: #262626; line-height: 1.5; white-space: pre-wrap;">${summaryNotes}</p>
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

    try {
        const resend = getResend();
        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: NOTIFY_EMAIL,
            replyTo: userEmail || undefined,
            subject: `⚡ Momentum Survey Lead: ${recommendedTier}${userEmail ? ` — ${userEmail}` : ""}`,
            html: htmlContent,
            text: `NEW MOMENTUM SURVEY LEAD\n\nRecommended Tier: ${recommendedTier}\nContact: ${userEmail || "Anonymous Chat Visitor"}\n\nSURVEY RESPONSES:\n${answersText}\n\n${summaryNotes ? `AI Notes:\n${summaryNotes}` : ""}`,
        });

        if (error) {
            console.error("Failed to send survey lead notification:", error);
            return NextResponse.json({ ok: false, error: "Email delivery failed." }, { status: 502 });
        }

        return NextResponse.json({ ok: true, message: "Lead alert sent successfully." });
    } catch (err) {
        console.error("Survey lead route exception:", err);
        // Do not crash client even if email service is not configured
        return NextResponse.json({ ok: false, error: "Email service unconfigured." }, { status: 500 });
    }
}

