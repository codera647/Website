"use client";

import React, { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { getCalApi } from "@calcom/embed-react";

/**
 * Claude-style rich markdown renderer for chat responses:
 * - High-contrast headings (#, ##, ###)
 * - Crisp bold & italic
 * - Standalone and inline code blocks with syntax styling
 * - Clean bullet & ordered lists
 * - Interactive CTA action buttons & links (internal routes, external links, Cal.com triggers)
 * - Visual image artifacts ![alt](url) with responsive figure cards & captions
 */

const IMAGE_BLOCK_RE = /^\s*!\[(.*?)\]\((.*?)\)\s*$/;
const HEADING_RE = /^(#{1,4})\s+(.+)$/;
const ORDERED_RE = /^\s*\d+\.\s+/;
const BULLET_RE = /^\s*[-*•]\s+/;
const BLOCKQUOTE_RE = /^\s*>\s+(.+)$/;

function parseInline(text: string, isDark: boolean): ReactNode[] {
    const nodes: ReactNode[] = [];
    const regex =
        /(!\[(.*?)\]\((.*?)\))|(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\*([^*]+)\*)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            nodes.push(text.slice(lastIndex, match.index));
        }

        if (match[1] !== undefined && match[2] !== undefined && match[3] !== undefined) {
            // Inline image ![alt](url)
            const alt = match[2];
            const src = match[3];
            nodes.push(
                <span
                    key={key++}
                    className={`my-2.5 block overflow-hidden rounded-lg border shadow-md ${
                        isDark
                            ? "border-white/15 bg-black/40"
                            : "border-line bg-surface"
                    }`}
                >
                    <img
                        src={src}
                        alt={alt || "Visual diagram"}
                        loading="lazy"
                        className={`max-h-[300px] w-full object-contain p-1 ${
                            isDark ? "bg-black/60" : "bg-white"
                        }`}
                    />
                    {alt && (
                        <span
                            className={`block border-t px-3 py-1.5 font-heading text-[11px] ${
                                isDark
                                    ? "border-white/10 bg-white/5 text-white/75"
                                    : "border-line bg-white text-muted"
                            }`}
                        >
                            {alt}
                        </span>
                    )}
                </span>
            );
        } else if (match[4] !== undefined && match[5] !== undefined && match[6] !== undefined) {
            // Markdown link / CTA button: [label](url)
            const rawLabel = match[5];
            const url = match[6];
            // Strip any trailing arrows from rawLabel so double arrows never render
            const cleanLabel = rawLabel.replace(/\s*(?:→|↗|->|-->|>)\s*$/, "").trim();

            const isBookingAction =
                url === "action:book-call" ||
                url === "#book" ||
                url.includes("cal.com") ||
                url === "/contact";

            if (isBookingAction) {
                nodes.push(
                    <button
                        key={key++}
                        type="button"
                        data-cal-link="abdul-moiz/30min"
                        className={`my-1 inline-flex items-center gap-2 rounded-none border px-3.5 py-1.5 font-heading text-xs font-bold shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                            isDark
                                ? "border-white/30 bg-white text-ink hover:bg-white/90 hover:shadow-md"
                                : "border-ink bg-ink text-white hover:bg-ink-soft hover:shadow-md"
                        }`}
                    >
                        <span>{cleanLabel}</span>
                        <span className="text-xs">→</span>
                    </button>
                );
            } else if (url.startsWith("/")) {
                nodes.push(
                    <Link
                        key={key++}
                        href={url}
                        className={`group my-1 inline-flex items-center gap-2 rounded-none border px-3.5 py-1.5 font-heading text-xs font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${
                            isDark
                                ? "border-white/20 bg-white/10 text-white hover:border-white hover:bg-white hover:text-ink"
                                : "border-line bg-surface text-ink hover:border-ink hover:bg-white"
                        }`}
                    >
                        <span>{cleanLabel}</span>
                        <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    </Link>
                );
            } else {
                nodes.push(
                    <a
                        key={key++}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-medium underline underline-offset-4 transition-colors ${
                            isDark
                                ? "text-white decoration-white/40 hover:decoration-white"
                                : "text-ink decoration-ink/40 hover:decoration-ink"
                        }`}
                    >
                        {cleanLabel} ↗
                    </a>
                );
            }
        } else if (match[7] !== undefined) {
            // Bold **text**
            nodes.push(
                <strong
                    key={key++}
                    className={`font-semibold ${isDark ? "text-white" : "text-ink"}`}
                >
                    {match[8]}
                </strong>
            );
        } else if (match[9] !== undefined) {
            // Inline code `code`
            nodes.push(
                <code
                    key={key++}
                    className={`rounded px-1.5 py-0.5 font-mono text-[0.88em] ${
                        isDark
                            ? "border border-white/15 bg-white/10 text-white"
                            : "border border-line bg-surface text-ink"
                    }`}
                >
                    {match[10]}
                </code>
            );
        } else if (match[11] !== undefined) {
            // Italic *text*
            nodes.push(
                <em
                    key={key++}
                    className={`italic ${isDark ? "text-white/85" : "text-ink/80"}`}
                >
                    {match[12]}
                </em>
            );
        }
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
    return nodes;
}

export default function MarkdownLite({
    text,
    className,
    theme = "dark",
}: {
    text: string;
    className?: string;
    theme?: "dark" | "light";
}) {
    const isDark = theme === "dark";

    // Initialize Cal.com modal embed handler for any CTA action buttons
    useEffect(() => {
        (async () => {
            try {
                const cal = await getCalApi();
                cal("ui", {
                    styles: { branding: { brandColor: "#111113" } },
                    hideEventTypeDetails: false,
                    layout: "month_view",
                });
            } catch {
                // Cal embed script fallback
            }
        })();
    }, []);

    const lines = text.split("\n");
    const blocks: ReactNode[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
        const line = lines[i];

        // 1. Standalone Code Block (``` ... ```)
        if (line.trim().startsWith("```")) {
            const lang = line.trim().slice(3).trim();
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith("```")) {
                codeLines.push(lines[i]);
                i++;
            }
            if (i < lines.length) i++; // skip closing ```
            blocks.push(
                <div
                    key={key++}
                    className={`my-3 overflow-hidden rounded-lg border font-mono text-xs shadow-md ${
                        isDark
                            ? "border-white/15 bg-black/70"
                            : "border-line bg-ink-soft text-white"
                    }`}
                >
                    {lang && (
                        <div className="border-b border-white/10 bg-white/5 px-3.5 py-1 text-[10px] uppercase tracking-wider text-white/60">
                            {lang}
                        </div>
                    )}
                    <pre className="overflow-x-auto p-3.5 leading-relaxed text-white/95">
                        <code>{codeLines.join("\n")}</code>
                    </pre>
                </div>
            );
            continue;
        }

        // 2. Standalone Image Line (![alt](url))
        const imgMatch = line.match(IMAGE_BLOCK_RE);
        if (imgMatch) {
            const alt = imgMatch[1];
            const src = imgMatch[2];
            blocks.push(
                <figure
                    key={key++}
                    className={`my-3 overflow-hidden rounded-lg border shadow-md ${
                        isDark ? "border-white/15 bg-black/60" : "border-line bg-surface"
                    }`}
                >
                    <div className="flex max-h-[340px] w-full items-center justify-center p-1.5">
                        <img
                            src={src}
                            alt={alt || "Architecture diagram"}
                            loading="lazy"
                            className="max-h-[300px] w-auto max-w-full object-contain rounded"
                        />
                    </div>
                    {alt && (
                        <figcaption
                            className={`border-t px-3.5 py-1.5 font-heading text-[11px] ${
                                isDark
                                    ? "border-white/10 bg-white/5 text-white/75"
                                    : "border-line bg-white text-muted"
                            }`}
                        >
                            {alt}
                        </figcaption>
                    )}
                </figure>
            );
            i++;
            continue;
        }

        // 3. Headings (#, ##, ###, ####)
        const headingMatch = line.match(HEADING_RE);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const headingText = headingMatch[2];
            if (level === 1) {
                blocks.push(
                    <h3
                        key={key++}
                        className={`mt-4 mb-2 font-heading text-lg font-bold border-b pb-1 ${
                            isDark
                                ? "text-white border-white/10"
                                : "text-ink border-line"
                        }`}
                    >
                        {parseInline(headingText, isDark)}
                    </h3>
                );
            } else if (level === 2) {
                blocks.push(
                    <h4
                        key={key++}
                        className={`mt-3.5 mb-1.5 font-heading text-base font-bold ${
                            isDark ? "text-white" : "text-ink"
                        }`}
                    >
                        {parseInline(headingText, isDark)}
                    </h4>
                );
            } else {
                blocks.push(
                    <h5
                        key={key++}
                        className={`mt-3 mb-1 font-heading text-sm font-semibold uppercase tracking-wider ${
                            isDark ? "text-white" : "text-ink"
                        }`}
                    >
                        {parseInline(headingText, isDark)}
                    </h5>
                );
            }
            i++;
            continue;
        }

        // 4. Blockquote (> quote)
        const quoteMatch = line.match(BLOCKQUOTE_RE);
        if (quoteMatch) {
            blocks.push(
                <blockquote
                    key={key++}
                    className={`my-2.5 border-l-2 py-1.5 pl-3 pr-2 text-xs italic ${
                        isDark
                            ? "border-white/50 bg-white/5 text-white/90"
                            : "border-ink bg-surface text-ink/90"
                    }`}
                >
                    {parseInline(quoteMatch[1], isDark)}
                </blockquote>
            );
            i++;
            continue;
        }

        // 5. Ordered List (1. item)
        if (ORDERED_RE.test(line)) {
            const items: string[] = [];
            while (i < lines.length && ORDERED_RE.test(lines[i])) {
                items.push(lines[i].replace(ORDERED_RE, ""));
                i++;
            }
            blocks.push(
                <ol
                    key={key++}
                    className={`my-2 list-decimal space-y-1.5 pl-5 ${
                        isDark ? "text-white/90" : "text-ink/90"
                    }`}
                >
                    {items.map((it, idx) => (
                        <li key={idx} className="leading-relaxed">
                            {parseInline(it, isDark)}
                        </li>
                    ))}
                </ol>
            );
            continue;
        }

        // 6. Bullet List (- item, * item, • item)
        if (BULLET_RE.test(line)) {
            const items: string[] = [];
            while (i < lines.length && BULLET_RE.test(lines[i])) {
                items.push(lines[i].replace(BULLET_RE, ""));
                i++;
            }
            blocks.push(
                <ul
                    key={key++}
                    className={`my-2 list-disc space-y-1.5 pl-5 ${
                        isDark ? "text-white/90" : "text-ink/90"
                    }`}
                >
                    {items.map((it, idx) => (
                        <li key={idx} className="leading-relaxed">
                            {parseInline(it, isDark)}
                        </li>
                    ))}
                </ul>
            );
            continue;
        }

        // 7. Empty line spacer
        if (line.trim() === "") {
            i++;
            continue;
        }

        // 8. Regular Paragraph
        const paraLines: string[] = [];
        while (
            i < lines.length &&
            lines[i].trim() !== "" &&
            !ORDERED_RE.test(lines[i]) &&
            !BULLET_RE.test(lines[i]) &&
            !IMAGE_BLOCK_RE.test(lines[i]) &&
            !HEADING_RE.test(lines[i]) &&
            !BLOCKQUOTE_RE.test(lines[i]) &&
            !lines[i].trim().startsWith("```")
        ) {
            paraLines.push(lines[i]);
            i++;
        }

        blocks.push(
            <p
                key={key++}
                className={`leading-relaxed ${
                    isDark ? "text-white/90" : "text-ink/90"
                }`}
            >
                {parseInline(paraLines.join(" "), isDark)}
            </p>
        );
    }

    return <div className={`space-y-2.5 ${className ?? ""}`}>{blocks}</div>;
}
