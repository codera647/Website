/**
 * Reads + parses the blog articles in public/blogs/*.txt.
 *
 * Import this ONLY from server components (it uses `node:fs`). File format:
 *   line 1                          -> title (kept for validation; display
 *                                      title comes from src/data/blog.ts)
 *   blank-line-separated blocks, each one of:
 *     "## Heading text"             -> heading block
 *     several lines starting "- "   -> bullet list block
 *     anything else                 -> paragraph block
 *   inline "**bold**"               -> emphasis, parsed by RichText at render time
 *   "Resources & further reading:"  -> marks the start of the source list
 *   - Label: https://...              (one link per line, "- " prefixed)
 *
 * Reading happens inside generateStaticParams-backed pages, so it runs at
 * build time (Node), not on the Cloudflare Workers runtime.
 */

import fs from "node:fs";
import path from "node:path";

const RESOURCES_HEADING = "Resources & further reading:";

export interface BlogResourceLink {
    label: string;
    url: string;
}

export type BlogBlock =
    | { type: "heading"; text: string }
    | { type: "paragraph"; text: string }
    | { type: "list"; items: string[] };

export interface BlogContent {
    title: string;
    blocks: BlogBlock[];
    resources: BlogResourceLink[];
}

function parseResourceLine(line: string): BlogResourceLink {
    const stripped = line.replace(/^-\s*/, "").trim();
    // split on the LAST ": http" so labels containing their own colons
    // (e.g. "Title (subtitle): https://...") still parse correctly
    const match = stripped.match(/^(.*):\s*(https?:\/\/\S+)$/);
    if (match) {
        return { label: match[1].trim(), url: match[2].trim() };
    }
    return { label: stripped, url: "" };
}

function parseBodyBlocks(body: string): BlogBlock[] {
    const chunks = body
        .split(/\n\s*\n/)
        .map((c) => c.trim())
        .filter(Boolean);

    return chunks.map((chunk): BlogBlock => {
        if (chunk.startsWith("## ")) {
            return { type: "heading", text: chunk.slice(3).trim() };
        }

        const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.length > 0 && lines.every((l) => l.startsWith("- "))) {
            return { type: "list", items: lines.map((l) => l.replace(/^-\s*/, "").trim()) };
        }

        return { type: "paragraph", text: chunk.replace(/\s+/g, " ").trim() };
    });
}

export function getBlogContent(file: string): BlogContent {
    const filePath = path.join(process.cwd(), "public", "blogs", file);
    const raw = fs.readFileSync(filePath, "utf-8").replace(/\r\n/g, "\n");

    const resourcesIndex = raw.indexOf(RESOURCES_HEADING);
    const bodyRaw = resourcesIndex === -1 ? raw : raw.slice(0, resourcesIndex);
    const resourcesRaw = resourcesIndex === -1 ? "" : raw.slice(resourcesIndex + RESOURCES_HEADING.length);

    const bodyLines = bodyRaw.split("\n");
    const title = (bodyLines[0] ?? "").trim();
    const blocks = parseBodyBlocks(bodyLines.slice(1).join("\n"));

    const resources = resourcesRaw
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.startsWith("-"))
        .map(parseResourceLine);

    return { title, blocks, resources };
}
