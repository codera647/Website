import Link from "next/link";

/**
 * Rectangular CTA with four corner pointers (CURA "Speak with us"
 * reference). The brackets sit just outside the button's corners and
 * spread further outward on hover (assets/hover_animatio.mp4); the
 * small square marker before the label echoes the reference too.
 * Pure CSS transitions — no client JS needed.
 *
 * Defaults are tuned for dark backgrounds (white button, white
 * brackets); override via buttonClassName / bracketClassName on light.
 */

interface Props {
    href: string;
    children: React.ReactNode;
    /** extra classes on the root (e.g. margins, responsive display) */
    className?: string;
    /** button surface + text; default: white on dark */
    buttonClassName?: string;
    /** bracket color; default: white/70 for dark backgrounds */
    bracketClassName?: string;
}

const CORNERS = [
    "-left-1.5 -top-1.5 border-l-2 border-t-2 group-hover:-translate-x-1 group-hover:-translate-y-1",
    "-right-1.5 -top-1.5 border-r-2 border-t-2 group-hover:translate-x-1 group-hover:-translate-y-1",
    "-left-1.5 -bottom-1.5 border-l-2 border-b-2 group-hover:-translate-x-1 group-hover:translate-y-1",
    "-right-1.5 -bottom-1.5 border-r-2 border-b-2 group-hover:translate-x-1 group-hover:translate-y-1",
];

export default function BracketButton({
    href,
    children,
    className,
    buttonClassName,
    bracketClassName,
}: Props) {
    return (
        <Link href={href} className={`group relative inline-block ${className ?? ""}`}>
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
        </Link>
    );
}
