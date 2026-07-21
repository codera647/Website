import type { ReactNode } from "react";
import type { LegalBlock } from "@/data/legal";

/** Parses "**bold**" spans, same convention as the blog's RichText. */
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

/** Renders a legal section's body: paragraphs, bullet lists, numbered lists. */
export default function LegalRichText({ blocks }: { blocks: LegalBlock[] }) {
    return (
        <div className="space-y-4">
            {blocks.map((block, i) => {
                if (block.type === "list") {
                    return (
                        <ul key={i} className="space-y-2.5">
                            {block.items.map((item, j) => (
                                <li key={j} className="flex gap-3 text-base leading-relaxed text-ink-soft">
                                    <span
                                        aria-hidden="true"
                                        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-muted"
                                    />
                                    <span>{renderInline(item)}</span>
                                </li>
                            ))}
                        </ul>
                    );
                }

                if (block.type === "numbered") {
                    return (
                        <ol key={i} className="space-y-2.5">
                            {block.items.map((item, j) => (
                                <li key={j} className="flex gap-3 text-base leading-relaxed text-ink-soft">
                                    <span className="font-heading text-sm font-semibold text-muted">
                                        {j + 1}.
                                    </span>
                                    <span>{renderInline(item)}</span>
                                </li>
                            ))}
                        </ol>
                    );
                }

                return (
                    <p key={i} className="text-base leading-relaxed text-ink-soft">
                        {renderInline(block.text)}
                    </p>
                );
            })}
        </div>
    );
}
