import { getDB, getEnv } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Simple admin authentication — password-based with session tokens.
 *
 * Flow:
 * 1. Admin POSTs password to /api/admin/auth
 * 2. Server verifies against ADMIN_PASSWORD_HASH env var
 * 3. On match: creates a random session token, stores in D1 with expiry,
 *    returns it as an HttpOnly cookie
 * 4. Subsequent /api/admin/* requests check the cookie against D1
 * 5. Logout deletes the session from D1 and clears the cookie
 *
 * Password hashing uses the Web Crypto API (SHA-256) — available on
 * Cloudflare Workers without extra dependencies. The ADMIN_PASSWORD_HASH
 * env var should be generated with the same algorithm (see setup docs).
 */

const SESSION_COOKIE = "kinetiq_admin_session";
const SESSION_DURATION_HOURS = 24;

/** Hash a password string with SHA-256 (Workers-compatible). */
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Verify a password against the stored hash. */
export async function verifyPassword(password: string): Promise<boolean> {
    const env = getEnv();
    const storedHash = env.ADMIN_PASSWORD_HASH;
    if (!storedHash) return false;
    const inputHash = await hashPassword(password);
    return inputHash === storedHash;
}

/** Generate a cryptographically random session token. */
function generateToken(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

/** Create a new session in D1, returns the token. */
export async function createSession(): Promise<string> {
    const db = getDB();
    const token = generateToken();
    const now = new Date();
    const expires = new Date(now.getTime() + SESSION_DURATION_HOURS * 60 * 60 * 1000);

    await db
        .prepare("INSERT INTO admin_sessions (token, created_at, expires_at) VALUES (?, ?, ?)")
        .bind(token, now.toISOString(), expires.toISOString())
        .run();

    // Clean up any expired sessions while we're here
    await db
        .prepare("DELETE FROM admin_sessions WHERE expires_at < ?")
        .bind(now.toISOString())
        .run();

    return token;
}

/** Validate a session token from the cookie. Returns true if valid. */
export async function validateSession(token: string | undefined): Promise<boolean> {
    if (!token) return false;
    const db = getDB();
    const now = new Date().toISOString();

    const row = await db
        .prepare("SELECT token FROM admin_sessions WHERE token = ? AND expires_at > ?")
        .bind(token, now)
        .first();

    return row !== null;
}

/** Delete a session from D1. */
export async function destroySession(token: string): Promise<void> {
    const db = getDB();
    await db.prepare("DELETE FROM admin_sessions WHERE token = ?").bind(token).run();
}

/** Extract the session token from a Request's cookies. */
export function getSessionToken(request: Request): string | undefined {
    const cookie = request.headers.get("cookie") ?? "";
    const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
    return match?.[1];
}

/** Build a Set-Cookie header to store the session token. */
export function sessionCookie(token: string): string {
    return `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION_HOURS * 3600}`;
}

/** Build a Set-Cookie header that clears the session cookie. */
export function clearSessionCookie(): string {
    return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

/**
 * Auth guard for admin API routes. Call at the top of every handler.
 * Returns null if authenticated, or a 401 NextResponse if not.
 */
export async function requireAuth(request: Request): Promise<NextResponse | null> {
    const token = getSessionToken(request);
    const valid = await validateSession(token);

    if (!valid) {
        return NextResponse.json(
            { ok: false, error: "Not authenticated." },
            { status: 401 }
        );
    }

    return null;
}
