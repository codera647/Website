import { NextResponse } from "next/server";
import {
    clearSessionCookie,
    createSession,
    destroySession,
    getSessionToken,
    sessionCookie,
    validateSession,
    verifyPassword,
} from "@/lib/auth";

interface LoginBody {
    password?: unknown;
}

/** POST — log in with the admin password, create a session cookie. */
export async function POST(request: Request) {
    let body: LoginBody;
    try {
        body = (await request.json()) as LoginBody;
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
    }

    const { password } = body;
    if (typeof password !== "string" || !password) {
        return NextResponse.json({ ok: false, error: "Password is required." }, { status: 400 });
    }

    const valid = await verifyPassword(password);
    if (!valid) {
        return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 });
    }

    const token = await createSession();
    return NextResponse.json(
        { ok: true },
        { status: 200, headers: { "Set-Cookie": sessionCookie(token) } }
    );
}

/** GET — check whether the current session cookie is valid. */
export async function GET(request: Request) {
    const token = getSessionToken(request);
    const valid = await validateSession(token);
    return NextResponse.json({ ok: valid });
}

/** DELETE — log out, destroy the session. */
export async function DELETE(request: Request) {
    const token = getSessionToken(request);
    if (token) {
        await destroySession(token);
    }
    return NextResponse.json(
        { ok: true },
        { status: 200, headers: { "Set-Cookie": clearSessionCookie() } }
    );
}
