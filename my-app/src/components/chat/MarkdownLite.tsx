/**
 * Minimal markdown renderer for chat responses — handles:
 * **bold**, `code`, *italic*, numbered lists, bullet lists, and
 * inline/block image artifacts ![alt](url) with captions.
 */

import type { ReactNode } from "react";

const IMAGE_BLOCK_RE = /^\s*!\[(.*?)\]\((.*?)\)\s*$/;
const ORDERED_RE = /^\s*\d+\.\s+/;
const BULLET_RE = /^\s*[-*]\s+/;

function parseInline(text: string): ReactNode[] {
    const nodes: ReactNode[] = [];
    // Match inline images, bold, code, and italic
    const regex = /(!\[(.*?)\]\((.*?)\))|(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\*([^*]+)\*)/g;
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
                <span key={key++} className="my-2 block overflow-hidden rounded-none border border-line bg-surface shadow-sm">
                    <img
                        src={src}
                        alt={alt || "Project visual"}
                        loading="lazy"
                        className="max-h-[300px] w-full object-contain bg-ink-soft p-1"
                    />
                    {alt && (
                        <span className="block border-t border-line bg-white px-3 py-1.5 font-heading text-[11px] text-muted">
                            {alt}
                        </span>
                    )}
                </span>
            );
        } else if (match[5] !== undefined) {
            nodes.push(
                <strong key={key++} className="font-semibold text-ink">
                    {match[5]}
                </strong>
            );
        } else if (match[7] !== undefined) {
            nodes.push(
                <code key={key++} className="rounded border border-line/60 bg-surface px-1 py-0.5 text-[0.85em] font-mono">
                    {match[7]}
                </code>
            );
        } else if (match[9] !== undefined) {
            nodes.push(<em key={key++}>{match[9]}</em>);
        }
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
    return nodes;
}

export default function MarkdownLite({ text, className }: { text: string; className?: string }) {
    const lines = text.split("\n");
    const blocks: ReactNode[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Standalone Image line
        const imgMatch = line.match(IMAGE_BLOCK_RE);
        if (imgMatch) {
            const alt = imgMatch[1];
            const src = imgMatch[2];
            blocks.push(
                <figure key={key++} className="my-3 overflow-hidden rounded-none border border-line bg-surface shadow-sm">
                    <div className="flex max-h-[340px] w-full items-center justify-center bg-ink-soft p-1">
                        <img
                            src={src}
                            alt={alt || "Project visual"}
                            loading="lazy"
                            className="max-h-[320px] w-auto max-w-full object-contain"
                        />
                    </div>
                    {alt && (
                        <figcaption className="border-t border-line bg-white px-3.5 py-1.5 font-heading text-[11px] text-muted">
                            {alt}
                        </figcaption>
                    )}
                </figure>
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
                <ol key={key++} className="list-decimal space-y-1 pl-5">
                    {items.map((it, idx) => (
                        <li key={idx}>{parseInline(it)}</li>
                    ))}
                </ol>
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
                <ul key={key++} className="list-disc space-y-1 pl-5">
                    {items.map((it, idx) => (
                        <li key={idx}>{parseInline(it)}</li>
                    ))}
                </ul>
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
            !IMAGE_BLOCK_RE.test(lines[i])
        ) {
            paraLines.push(lines[i]);
            i++;
        }
        blocks.push(<p key={key++}>{parseInline(paraLines.join(" "))}</p>);
    }

    return <div className={className}>{blocks}</div>;
}
