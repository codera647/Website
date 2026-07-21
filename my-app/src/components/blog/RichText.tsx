import type { ReactNode } from "react";
import type { BlogBlock } from "@/lib/blog";

/** Parses "**bold**" spans within a line of text into JSX. Pure function —
 *  no client JS needed, safe to call from a server component. */
function renderInline(text: string): ReactNode[] {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return (
                <strong key={i} className="font-semibold text-ink">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        return part;
    });
}

/** Renders parsed article body blocks — headings, paragraphs, and bullet
 *  lists — with inline bold emphasis. */
export default function RichText({ blocks }: { blocks: BlogBlock[] }) {
    return (
        <div className="space-y-6">
            {blocks.map((block, i) => {
                if (block.type === "heading") {
                    return (
                        <h2
                            key={i}
                            className="pt-2 font-heading text-2xl font-bold leading-snug text-ink md:text-3xl"
                        >
                            {renderInline(block.text)}
                        </h2>
                    );
                }

                if (block.type === "list") {
                    return (
                        <ul key={i} className="space-y-3">
                            {block.items.map((item, j) => (
                                <li key={j} className="flex gap-3 text-lg leading-relaxed text-ink-soft">
                                    <span
                                        aria-hidden="true"
                                        className="mt-3 size-1.5 shrink-0 rounded-full bg-muted"
                                    />
                                    <span>{renderInline(item)}</span>
                                </li>
                            ))}
                        </ul>
                    );
                }

                return (
                    <p key={i} className="text-lg leading-relaxed text-ink-soft">
                        {renderInline(block.text)}
                    </p>
                );
            })}
        </div>
    );
}
