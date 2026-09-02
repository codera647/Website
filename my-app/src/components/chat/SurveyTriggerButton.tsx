"use client";

import type { ReactNode } from "react";

interface Props {
    children?: ReactNode;
    className?: string;
}

export default function SurveyTriggerButton({
    children = "Start 1-Min Assessment →",
    className = "rounded-none bg-ink px-4 py-2 font-heading text-xs font-bold uppercase tracking-wider text-background hover:bg-ink-soft transition-colors cursor-pointer shrink-0",
}: Props) {
    function handleClick() {
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("open-motion-survey"));
        }
    }

    return (
        <button type="button" onClick={handleClick} className={className}>
            {children}
        </button>
    );
}

