import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Google Search Console & Indexing API Client.
 * Authenticates with Google OAuth 2.0 via Service Account JWT signing (Web Crypto / Node crypto).
 */

const SITE_URL = "https://thekinetiq.solutions";
// GSC property identifier (Domain property or URL-prefix)
const GSC_PROPERTY = "sc-domain:thekinetiq.solutions";

interface GscCredentials {
    clientEmail: string;
    privateKey: string;
}

const DEFAULT_CLIENT_EMAIL = "kinetiq-gsc-bot@kinetiq-seo-automation-507202.iam.gserviceaccount.com";
const DEFAULT_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCt4p3Iw5TxqJws
btMpjYJ5svLOwvft4T2R6vtsPwlr03OA/MMCR801tQ8dTVlXgfwmXxS0a9IkMAcJ
WCS5gKyz7zb54TcMCgVHypapMkgCeZqd6zvPcZVLcaeT8FnUn9hGWsRKcc6+i4sF
khy3Tpo22DVoDVRMIoFsoBZ5lcJ3JhuN2um0pgFduGi8uefmOADuMEdXUhbERCX+
MVpo1VmjIgZwoQD9F3HefrzOYiLDIwdBapT1n52hwOHc27h9S6YT9oSlXQoHgIrA
xf+yy3uwfWEMDxucUYtwhGuPhahptyvWS7aSKAwea4+GVlz1dVRvJlhHGiFgtCmW
YGgUtdUFAgMBAAECggEAHXlh9u+mDc9fh42SiALXWLMbQq5cMauCEPuUegz2Vxtc
wwK1OGv8zgt+gCBGElXzbHql6w4yrNUiQDR7ZyE3RPm5pyIEf2ssaXae0pe2Cotb
yMRgm0FcxdDCT8qII4kjsws8JgVD/tru6fcSHIU7kSvVY6mMvioEJ6o8HQhkUecx
IyVhwM6FGxQCPnWb1UTn1kmqmd3NZJSemQpMtfzpSLb03irBNU7e38MYhLf9LCFB
8NAizv8rieHBSJqg73/JTfQt8TeME/5NR4X2wxjVpwHjFLddBlx001m8vCkxhBtC
CXRacaDC34xsqtM1RZWvuVbxYuL/aR9RG4BJztGlkQKBgQDnhiBuJdrjhju8LFay
LTVjXcjtKDGU8SYoCGLNp1qNh7sWrIezNL7r2wZT2+lkBKn+TxHc/sYpoRwdmSDt
OpAgmzt1HDaDI6QIMk3Vd1c60rSG0asIDXcW7sfwxtYTPzRd4OhGzoyq3QkI13L7
BknT09IfSqov8H4whG125bUw1QKBgQDARJP7ktfQ+p9AVCDnJ2g02unen1LDFyyZ
L9qBHIns/rYfagxPNETcq7u9nNS1UODuZbabQj8/VQtnohJdGmYZNPext3KsBqf6
hsoyvvUkvOj+BqUXjpDShdweSLgd4m//IC34EEXJDdOaOalkwxSK49MLhEQ+PoPZ
Da0zfimrcQKBgH1UkTevTFfAcZPC2MepS25X9Y3UJUsAY+xl5b54Kr/UywVSLj9n
fTbGIR3CPQyErdVZzky4qmMcsNCg9T8WZbEQ91XFCQligMhjGtlEujbAmzMkSxaX
23DRn/CKYpaWr21mc7bo1yMjdmGP59FVrR97WhLQY2KCKH1xIqSrYrNlAoGAA0Vn
ayFNcK3C5dpIkQY3nKaY0gPN6anMRXLt+cJdil2vBYvNV8+g2ExHrmsrp0YP/Z5X
Y/7ViqNMxV+ZhmH7mLQw/qILXmfilb2TVRewngZkxGWii2sOhbZnT1CXaVK/6wxG
G/FS7p/AmOAgRKmZAN/taEXAz3pKzfeQmc6ssNECgYB2RAKkyqiVz8P+qfWCL4F0
JaXuaTg9jhBWt6IqwiOTdBDjFAnHETtbQhecGWnQwM7T6PiH2so98W0+0TOliK0h
eAV+fLUUcaaJM6pxhA1zOzTG2Bp9YqalgViv0uEpc1VmVzNr4V4ZgrMAkyHtmMa+
VdPKG7qwjW1xdiglDVcpSg==
-----END PRIVATE KEY-----`;

export function getGscCredentials(): GscCredentials | null {
    let clientEmail = process.env.GSC_CLIENT_EMAIL;
    let privateKey = process.env.GSC_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
        try {
            const { env } = getCloudflareContext();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cfEnv = env as Record<string, any>;
            if (cfEnv?.GSC_CLIENT_EMAIL) clientEmail = cfEnv.GSC_CLIENT_EMAIL;
            if (cfEnv?.GSC_PRIVATE_KEY) privateKey = cfEnv.GSC_PRIVATE_KEY;
        } catch {
            // Outside Cloudflare context
        }
    }

    clientEmail = clientEmail || DEFAULT_CLIENT_EMAIL;
    privateKey = privateKey || DEFAULT_PRIVATE_KEY;

    if (!clientEmail || !privateKey) return null;

    const cleanedKey = privateKey.replace(/\\n/g, "\n");
    return { clientEmail, privateKey: cleanedKey };
}

/**
 * Creates a signed Google OAuth2 JWT for Service Account authorization.
 */
async function generateGoogleJwt(clientEmail: string, privateKeyPem: string, scopes: string[]): Promise<string> {
    const crypto = await import("crypto");
    const now = Math.floor(Date.now() / 1000);

    const header = {
        alg: "RS256",
        typ: "JWT",
    };

    const claimSet = {
        iss: clientEmail,
        scope: scopes.join(" "),
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now,
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
    const encodedClaim = Buffer.from(JSON.stringify(claimSet)).toString("base64url");
    const stringToSign = `${encodedHeader}.${encodedClaim}`;

    const signer = crypto.createSign("RSA-SHA256");
    signer.update(stringToSign);
    const signature = signer.sign(privateKeyPem, "base64url");

    return `${stringToSign}.${signature}`;
}

/**
 * Obtains an access token from Google OAuth2 endpoint.
 */
export async function getGoogleAccessToken(scopes: string[]): Promise<string | null> {
    const creds = getGscCredentials();
    if (!creds) return null;

    try {
        const assertion = await generateGoogleJwt(creds.clientEmail, creds.privateKey, scopes);

        const res = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                assertion,
            }),
        });

        const data = (await res.json()) as { access_token?: string; error?: string; error_description?: string };
        if (!res.ok || !data.access_token) {
            console.error("Google OAuth token error:", data.error, data.error_description);
            return null;
        }

        return data.access_token;
    } catch (err) {
        console.error("Failed to generate Google access token:", err);
        return null;
    }
}

/**
 * Requests instant crawling & indexing from Google Indexing API.
 * Notifies Google whenever a new Blog, Job Opening, or Case Study is published or updated.
 */
export async function requestGoogleIndexing(
    targetUrl: string,
    type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
): Promise<{ ok: boolean; message?: string }> {
    const fullUrl = targetUrl.startsWith("http") ? targetUrl : `${SITE_URL}${targetUrl.startsWith("/") ? "" : "/"}${targetUrl}`;
    const token = await getGoogleAccessToken(["https://www.googleapis.com/auth/indexing"]);

    if (!token) {
        return { ok: false, message: "Google Indexing API credentials not configured." };
    }

    try {
        const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: fullUrl,
                type,
            }),
        });

        const data = await res.json();
        if (!res.ok) {
            return { ok: false, message: JSON.stringify(data) };
        }

        return { ok: true, message: `Successfully submitted ${fullUrl} to Google Indexing queue.` };
    } catch (err) {
        return { ok: false, message: err instanceof Error ? err.message : String(err) };
    }
}

export interface SearchQueryMetric {
    keys: string[];
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
}

export interface SearchAnalyticsResult {
    ok: boolean;
    error?: string;
    totals?: {
        clicks: number;
        impressions: number;
        avgCtr: number;
        avgPosition: number;
    };
    queries?: SearchQueryMetric[];
    pages?: SearchQueryMetric[];
}

/**
 * Fetches 28-day organic search analytics (Clicks, Impressions, CTR, Average Position, Top Queries) from GSC.
 */
export async function getSearchConsoleAnalytics(days = 28): Promise<SearchAnalyticsResult> {
    const token = await getGoogleAccessToken(["https://www.googleapis.com/auth/webmasters.readonly"]);

    if (!token) {
        return {
            ok: false,
            error: "Google Search Console API credentials not configured or not yet authorized.",
        };
    }

    const endDate = new Date().toISOString().slice(0, 10);
    const startDateObj = new Date();
    startDateObj.setDate(startDateObj.getDate() - days);
    const startDate = startDateObj.toISOString().slice(0, 10);

    const propertiesToTry = [
        GSC_PROPERTY,
        `${SITE_URL}/`,
        SITE_URL,
    ];

    for (const prop of propertiesToTry) {
        try {
            const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(prop)}/searchAnalytics/query`;

            // 1. Fetch top queries
            const queryRes = await fetch(endpoint, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    startDate,
                    endDate,
                    dimensions: ["query"],
                    rowLimit: 25,
                }),
            });

            if (!queryRes.ok) continue;

            const queryData = (await queryRes.json()) as { rows?: SearchQueryMetric[] };

            // 2. Fetch top pages
            const pageRes = await fetch(endpoint, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    startDate,
                    endDate,
                    dimensions: ["page"],
                    rowLimit: 25,
                }),
            });

            const pageData = ((await pageRes.json()) as { rows?: SearchQueryMetric[] }) || {};

            const queries = queryData.rows ?? [];
            const pages = pageData.rows ?? [];

            let totalClicks = 0;
            let totalImpressions = 0;
            let sumPosition = 0;

            for (const q of queries) {
                totalClicks += q.clicks;
                totalImpressions += q.impressions;
                sumPosition += q.position;
            }

            const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
            const avgPosition = queries.length > 0 ? sumPosition / queries.length : 0;

            return {
                ok: true,
                totals: {
                    clicks: totalClicks,
                    impressions: totalImpressions,
                    avgCtr,
                    avgPosition,
                },
                queries,
                pages,
            };
        } catch {
            // Try next property format
        }
    }

    return {
        ok: false,
        error: "Could not fetch data for property. Please ensure service account is added as an Owner in Google Search Console.",
    };
}
