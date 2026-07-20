import { NextResponse } from "next/server";
import { getResend, FROM_EMAIL } from "@/lib/resend";

const CONTACT_TO = "contact@thekinetiq.solutions";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }

    const { name, email, projectType, message } = (body ?? {}) as Record<string, unknown>;

    if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
    }
    if (typeof email !== "string" || !EMAIL_RE.test(email)) {
        return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 });
    }
    if (typeof projectType !== "string" || !projectType.trim()) {
        return NextResponse.json({ ok: false, error: "Project type is required." }, { status: 400 });
    }
    if (typeof message !== "string" || message.trim().length < 10) {
        return NextResponse.json({ ok: false, error: "Message is required." }, { status: 400 });
    }

    try {
        const resend = getResend();
        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: CONTACT_TO,
            replyTo: email,
            subject: `New inquiry from ${name}: ${projectType}`,
            text: `Name: ${name}\nEmail: ${email}\nProject type: ${projectType}\n\n${message}`,
        });

        if (error) {
            console.error("Resend error (contact):", error);
            return NextResponse.json(
                { ok: false, error: "Could not send your message. Please try again." },
                { status: 502 }
            );
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Contact form send failed:", err);
        return NextResponse.json(
            { ok: false, error: "Email service is not configured." },
            { status: 500 }
        );
    }
}
