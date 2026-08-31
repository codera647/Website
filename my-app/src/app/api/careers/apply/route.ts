import { NextResponse } from "next/server";
import { getResend, FROM_EMAIL } from "@/lib/resend";

const CAREERS_TO = "info@thekinetiq.solutions";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_CV_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_CV_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/octet-stream", // Fallback for some OS file uploads
];

export async function POST(request: Request) {
    let form: FormData;
    try {
        form = await request.formData();
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid form submission." }, { status: 400 });
    }

    const name = form.get("name");
    const email = form.get("email");
    const roleTitle = form.get("roleTitle");
    const coverLetter = form.get("coverLetter");
    const additionalInfo = form.get("additionalInfo");
    const cv = form.get("cv");

    if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
    }
    if (typeof email !== "string" || !EMAIL_RE.test(email)) {
        return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 });
    }
    if (!(cv instanceof File) || cv.size === 0) {
        return NextResponse.json({ ok: false, error: "A CV/resume file is required." }, { status: 400 });
    }
    if (cv.size > MAX_CV_BYTES) {
        return NextResponse.json({ ok: false, error: "CV file is too large (max 5MB)." }, { status: 400 });
    }
    if (cv.type && !ALLOWED_CV_TYPES.includes(cv.type)) {
        return NextResponse.json(
            { ok: false, error: "CV must be a PDF or Word document." },
            { status: 400 }
        );
    }

    const title = typeof roleTitle === "string" && roleTitle.trim() ? roleTitle.trim() : "Open Application";
    const candidateMessage =
        (typeof coverLetter === "string" && coverLetter.trim()) ||
        (typeof additionalInfo === "string" && additionalInfo.trim()) ||
        "";

    try {
        const resend = getResend();
        const buffer = Buffer.from(await cv.arrayBuffer());
        const cvFileName = cv.name || `${name.trim().toLowerCase().replace(/\s+/g, "_")}_cv.pdf`;
        const cvSizeKb = (cv.size / 1024).toFixed(1);
        const formattedDate = new Date().toUTCString();

        // 1. Plain text fallback
        const bodyLines = [
            `========================================`,
            `NEW CV APPLICATION: ${title}`,
            `========================================`,
            ``,
            `Candidate Details:`,
            `• Name: ${name}`,
            `• Email: ${email}`,
            `• Position: ${title}`,
            `• Submitted At: ${formattedDate}`,
            `• Attached File: ${cvFileName} (${cvSizeKb} KB)`,
            ``,
            candidateMessage ? `Candidate Message / Notes:\n${candidateMessage}\n` : null,
            `========================================`,
            `Reply to this email directly to contact ${name} at ${email}.`,
        ].filter((line): line is string => line !== null);

        // 2. Rich HTML email template
        const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New CV Application</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 24px; color: #111113;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden;">
    
    <!-- Header -->
    <tr>
      <td style="background-color: #111113; padding: 24px 32px; text-align: left;">
        <p style="margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #a1a1aa;">
          kinetiq &middot; Careers Portal
        </p>
        <h1 style="margin: 8px 0 0 0; font-size: 20px; font-weight: 700; color: #ffffff;">
          New Candidate Application
        </h1>
      </td>
    </tr>

    <!-- Role Highlight Band -->
    <tr>
      <td style="background-color: #f8fafc; border-bottom: 1px solid #e4e4e7; padding: 16px 32px;">
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #71717a;">Position Applied:</span>
        <div style="font-size: 16px; font-weight: 700; color: #111113; margin-top: 2px;">${title}</div>
      </td>
    </tr>

    <!-- Applicant Metadata -->
    <tr>
      <td style="padding: 32px;">
        <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a;">
          Candidate Details
        </h2>
        
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 14px; line-height: 1.6;">
          <tr>
            <td style="padding: 6px 0; color: #71717a; width: 140px; font-weight: 500;">Full Name:</td>
            <td style="padding: 6px 0; color: #111113; font-weight: 600;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #71717a; width: 140px; font-weight: 500;">Email:</td>
            <td style="padding: 6px 0;">
              <a href="mailto:${email}" style="color: #111113; font-weight: 600; text-decoration: underline;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #71717a; width: 140px; font-weight: 500;">Attached CV:</td>
            <td style="padding: 6px 0; color: #111113; font-weight: 600;">
              📎 ${cvFileName} <span style="font-size: 12px; font-weight: 400; color: #71717a;">(${cvSizeKb} KB)</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #71717a; width: 140px; font-weight: 500;">Submitted:</td>
            <td style="padding: 6px 0; color: #71717a;">${formattedDate}</td>
          </tr>
        </table>

        ${
            candidateMessage
                ? `
        <div style="margin-top: 24px; padding: 18px; background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 6px;">
          <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a;">
            Cover Letter / Notes:
          </h3>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #27272a; white-space: pre-wrap;">${candidateMessage}</p>
        </div>`
                : ""
        }

        <div style="margin-top: 32px; padding: 16px; background-color: #f4f4f5; border-radius: 6px; text-align: center;">
          <p style="margin: 0; font-size: 13px; color: #52525b;">
            To contact this applicant, simply <strong>Reply directly</strong> to this email (reply-to is set to <a href="mailto:${email}" style="color: #111113;">${email}</a>).
          </p>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f8fafc; border-top: 1px solid #e4e4e7; padding: 16px 32px; text-align: center; font-size: 11px; color: #a1a1aa;">
        Kinetiq &middot; Always in Motion &middot; Sent automatically via thekinetiq.solutions
      </td>
    </tr>
  </table>
</body>
</html>
`;

        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: CAREERS_TO,
            replyTo: `${name} <${email}>`,
            subject: `New CV Application: ${title} — ${name}`,
            text: bodyLines.join("\n"),
            html: htmlTemplate,
            attachments: [{ filename: cvFileName, content: buffer }],
        });

        if (error) {
            console.error("Resend error (careers):", error);
            return NextResponse.json(
                { ok: false, error: "Could not send application email. Please verify RESEND_API_KEY." },
                { status: 502 }
            );
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error("Careers application send failed:", err);
        return NextResponse.json(
            { ok: false, error: `Email service error: ${errorMsg}` },
            { status: 500 }
        );
    }
}
