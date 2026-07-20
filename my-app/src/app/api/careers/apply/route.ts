import { NextResponse } from "next/server";
import { getResend, FROM_EMAIL } from "@/lib/resend";

const CAREERS_TO = "careers@thekinetiq.solutions";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_CV_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_CV_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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

    const title = typeof roleTitle === "string" && roleTitle ? roleTitle : "Open role";

    try {
        const resend = getResend();
        const buffer = Buffer.from(await cv.arrayBuffer());

        const bodyLines = [
            `Name: ${name}`,
            `Email: ${email}`,
            `Role: ${title}`,
            "",
            typeof coverLetter === "string" && coverLetter.trim()
                ? `Cover letter:\n${coverLetter}\n`
                : null,
            typeof additionalInfo === "string" && additionalInfo.trim()
                ? `Additional information:\n${additionalInfo}\n`
                : null,
        ].filter((line): line is string => line !== null);

        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: CAREERS_TO,
            replyTo: email,
            subject: `New application: ${title} from ${name}`,
            text: bodyLines.join("\n"),
            attachments: [{ filename: cv.name || "resume", content: buffer }],
        });

        if (error) {
            console.error("Resend error (careers):", error);
            return NextResponse.json(
                { ok: false, error: "Could not send your application. Please try again." },
                { status: 502 }
            );
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Careers application send failed:", err);
        return NextResponse.json(
            { ok: false, error: "Email service is not configured." },
            { status: 500 }
        );
    }
}
