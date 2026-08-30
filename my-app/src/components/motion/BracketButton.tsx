"use client";

import Link from "next/link";
import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

/**
 * Rectangular CTA with four corner pointers (CURA "Speak with us"
 * reference). Supports both standard Next.js Link navigation and
 * direct Cal.com scheduling popup modal trigger.
 */

interface Props {
    href?: string;
    calLink?: string;
    children: React.ReactNode;
    className?: string;
    buttonClassName?: string;
    bracketClassName?: string;
    onClick?: () => void;
}

const CORNERS = [
    "-left-1.5 -top-1.5 border-l-2 border-t-2 group-hover:-translate-x-1 group-hover:-translate-y-1",
    "-right-1.5 -top-1.5 border-r-2 border-t-2 group-hover:translate-x-1 group-hover:-translate-y-1",
    "-left-1.5 -bottom-1.5 border-l-2 border-b-2 group-hover:-translate-x-1 group-hover:translate-y-1",
    "-right-1.5 -bottom-1.5 border-r-2 border-b-2 group-hover:translate-x-1 group-hover:translate-y-1",
];

export default function BracketButton({
    href,
    calLink,
    children,
    className,
    buttonClassName,
    bracketClassName,
    onClick,
}: Props) {
    useEffect(() => {
        if (calLink) {
            (async () => {
                const cal = await getCalApi();
                cal("ui", {
                    styles: { branding: { brandColor: "#111113" } },
                    hideEventTypeDetails: false,
                    layout: "month_view",
                });
            })();
        }
    }, [calLink]);

    const innerContent = (
        <>
            {CORNERS.map((corner) => (
                <span
                    key={corner}
                    aria-hidden="true"
                    className={`pointer-events-none absolute size-2.5 transition-transform duration-300 ease-out ${corner} ${
                        bracketClassName ?? "border-white/70"
                    }`}
                />
            ))}
            <span
                className={`flex items-center gap-2.5 rounded-none px-6 py-3 font-heading text-sm font-semibold transition-colors duration-300 ${
                    buttonClassName ?? "bg-white text-ink group-hover:bg-white/85"
                }`}
            >
                <span aria-hidden="true" className="size-1.5 shrink-0 bg-current" />
                {children}
            </span>
        </>
    );

    if (calLink) {
        return (
            <button
                type="button"
                data-cal-link={calLink}
                onClick={onClick}
                className={`group relative inline-block cursor-pointer ${className ?? ""}`}
            >
                {innerContent}
            </button>
        );
    }

    if (href) {
        return (
            <Link
                href={href}
                onClick={onClick}
                className={`group relative inline-block ${className ?? ""}`}
            >
                {innerContent}
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={`group relative inline-block cursor-pointer ${className ?? ""}`}
        >
            {innerContent}
        </button>
    );
}
