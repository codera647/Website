"use client";

import { useState } from "react";
import { Textarea } from "@/components/admin/AdminForm";
import RichText from "@/components/blog/RichText";
import { parseBlogBody } from "@/lib/blog";

/**
 * Blog body editor — a plain textarea (the site's markdown-ish format:
 * "## Heading", "- " bullets, "**bold**") with a toggleable preview that
 * renders through the exact same parser/component the public blog uses,
 * so what you see here is what ships.
 */
export default function MarkdownEditor({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    const [tab, setTab] = useState<"write" | "preview">("write");
    const { blocks } = parseBlogBody(value);

    return (
        <div className="border border-white/10 bg-white/[0.03]">
            <div className="flex border-b border-white/10">
                {(["write", "preview"] as const).map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setTab(t)}
                        className={`px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-colors ${
                            tab === t ? "bg-white/10 text-white" : "text-white/45 hover:text-white/70"
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {tab === "write" ? (
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={20}
                    className="border-0 bg-transparent focus:border-0"
                    placeholder={"## A heading\n\nA paragraph with **bold** text.\n\n- A bullet\n- Another bullet"}
                />
            ) : (
                <div className="max-h-[520px] overflow-y-auto bg-white p-6">
                    {value.trim() ? (
                        <RichText blocks={blocks} />
                    ) : (
                        <p className="text-sm text-muted">Nothing to preview yet.</p>
                    )}
                </div>
            )}
        </div>
    );
}
