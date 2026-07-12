/**
 * Minimal markdown renderer for chat responses — handles just what LLM
 * answers actually use: **bold**, `code`, *italic*, numbered lists, and
 * bullet lists, split into paragraphs. Deliberately not pulling in a full
 * markdown library (react-markdown, etc.) here to avoid adding another
 * dependency to a deploy pipeline that's already been fragile around
 * package versions on Cloudflare Workers.
 */

import type { ReactNode } from "react";

function parseInline(text: string): ReactNode[] {
    const nodes: ReactNode[] = [];
    const regex = /(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\*([^*]+)\*)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            nodes.push(text.slice(lastIndex, match.index));
        }
        if (match[2] !== undefined) {
            nodes.push(
                <strong key={key++} className="font-semibold">
                    {match[2]}
                </strong>
            );
        } else if (match[4] !== undefined) {
            nodes.push(
                <code key={key++} className="rounded bg-white/10 px-1 py-0.5 text-[0.85em]">
                    {match[4]}
                </code>
            );
        } else if (match[6] !== undefined) {
            nodes.push(<em key={key++}>{match[6]}</em>);
        }
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
    return nodes;
}

const ORDERED_RE = /^\s*\d+\.\s+/;
const BULLET_RE = /^\s*[-*]\s+/;

export default function MarkdownLite({ text, className }: { text: string; className?: string }) {
    const lines = text.split("\n");
    const blocks: ReactNode[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
        const line = lines[i];

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
        while (i < lines.length && lines[i].trim() !== "" && !ORDERED_RE.test(lines[i]) && !BULLET_RE.test(lines[i])) {
            paraLines.push(lines[i]);
            i++;
        }
        blocks.push(<p key={key++}>{parseInline(paraLines.join(" "))}</p>);
    }

    return <div className={className}>{blocks}</div>;
}
