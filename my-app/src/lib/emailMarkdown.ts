/**
 * Minimal server-side markdown → inline-styled HTML converter, used to turn
 * the AI assistant's chat-formatted answers (see the SYSTEM_PROMPT in
 * src/app/api/chat/route.ts, and the client-side renderer of the same
 * dialect in src/components/chat/MarkdownLite.tsx) into email-safe HTML.
 * Email clients can't run JS or read Tailwind classes, so everything here
 * is plain tags with inline styles.
 */

const HEADING_RE = /^(#{1,4})\s+(.+)$/;
const ORDERED_RE = /^\s*\d+\.\s+/;
const BULLET_RE = /^\s*[-*•]\s+/;
const BLOCKQUOTE_RE = /^\s*>\s+(.+)$/;

const BASE_URL = "https://thekinetiq.solutions";
const BOOK_CALL_URL = "https://cal.com/kinetiq-solutions/30min";

function escapeHtml(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function resolveUrl(url: string): string {
    if (url === "action:book-call" || url === "#book") return BOOK_CALL_URL;
    if (url.includes("cal.com")) return url;
    if (url.startsWith("/")) return `${BASE_URL}${url}`;
    return url;
}

function renderInline(text: string): string {
    let html = escapeHtml(text);

    // [label](url) — links and CTA buttons
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, url: string) => {
        const cleanLabel = label.replace(/\s*(?:→|↗|->|-->|>)\s*$/, "").trim();
        const href = resolveUrl(url);
        return `<a href="${href}" style="color:#111113;font-weight:600;text-decoration:underline;">${cleanLabel} &rarr;</a>`;
    });

    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(
        /`([^`]+)`/g,
        '<code style="background:#f1f5f9;padding:1px 5px;border-radius:3px;font-family:monospace;font-size:0.9em;">$1</code>'
    );
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return html;
}

export function renderMarkdownEmailHtml(text: string): string {
    const lines = text.replace(/\r\n/g, "\n").split("\n");
    const blocks: string[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        const headingMatch = line.match(HEADING_RE);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const size = level === 1 ? "20px" : level === 2 ? "17px" : "15px";
            blocks.push(
                `<h3 style="margin:22px 0 8px;font-size:${size};font-weight:700;color:#0f172a;">${renderInline(headingMatch[2])}</h3>`
            );
            i++;
            continue;
        }

        const quoteMatch = line.match(BLOCKQUOTE_RE);
        if (quoteMatch) {
            blocks.push(
                `<blockquote style="margin:12px 0;padding:8px 14px;border-left:3px solid #111113;background:#f8fafc;font-style:italic;color:#334155;">${renderInline(quoteMatch[1])}</blockquote>`
            );
            i++;
            continue;
        }

        if (ORDERED_RE.test(line)) {
            const items: string[] = [];
            while (i < lines.length && ORDERED_RE.test(lines[i])) {
                items.push(lines[i].replace(ORDERED_RE, ""));
                i++;
            }
            blocks.push(
                `<ol style="margin:10px 0;padding-left:22px;color:#1e293b;">${items
                    .map((it) => `<li style="margin-bottom:6px;line-height:1.6;">${renderInline(it)}</li>`)
                    .join("")}</ol>`
            );
            continue;
        }

        if (BULLET_RE.test(line)) {
            const items: string[] = [];
            while (i < lines.length && BULLET_RE.test(lines[i])) {
                items.push(lines[i].replace(BULLET_RE, ""));
                i++;
            }
            blocks.push(
                `<ul style="margin:10px 0;padding-left:22px;color:#1e293b;">${items
                    .map((it) => `<li style="margin-bottom:6px;line-height:1.6;">${renderInline(it)}</li>`)
                    .join("")}</ul>`
            );
            continue;
        }

        if (line.trim() === "") {
            i++;
            continue;
        }

        const paraLines: string[] = [];
        while (
            i < lines.length &&
            lines[i].trim() !== "" &&
            !ORDERED_RE.test(lines[i]) &&
            !BULLET_RE.test(lines[i]) &&
            !HEADING_RE.test(lines[i]) &&
            !BLOCKQUOTE_RE.test(lines[i])
        ) {
            paraLines.push(lines[i]);
            i++;
        }
        blocks.push(`<p style="margin:0 0 12px;line-height:1.65;color:#1e293b;">${renderInline(paraLines.join(" "))}</p>`);
    }

    return blocks.join("\n");
}
