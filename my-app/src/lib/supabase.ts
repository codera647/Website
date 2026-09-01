import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Server-only Supabase client, using the service-role key (bypasses RLS).
 * Only used for the leads pipeline (Cal.com webhook → leads table → daily
 * follow-up job) — everything else on this site runs on D1. Never expose
 * this client or the service-role key to the browser.
 */

function getEnvVar(key: string): string | undefined {
    const fromProcess = process.env[key];
    if (fromProcess) return fromProcess;
    try {
        const { env } = getCloudflareContext();
        return (env as unknown as Record<string, string | undefined>)?.[key];
    } catch {
        return undefined;
    }
}

let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
    const url = getEnvVar("SUPABASE_URL");
    const serviceRoleKey = getEnvVar("SUPABASE_SERVICE_ROLE_KEY");

    if (!url || !serviceRoleKey) {
        throw new Error(
            "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
        );
    }

    if (!client) {
        client = createClient(url, serviceRoleKey, {
            auth: { persistSession: false, autoRefreshToken: false },
        });
    }
    return client;
}

export function getEnvSecret(key: string): string | undefined {
    return getEnvVar(key);
}
