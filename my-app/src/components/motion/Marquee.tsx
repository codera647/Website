"use client";

interface Props {
    children: React.ReactNode;
    /** seconds per loop — lower is faster */
    duration?: number;
    reverse?: boolean;
    pauseOnHover?: boolean;
    className?: string;
}

/**
 * Infinite horizontal ticker. CSS-animation driven (zero JS per frame);
 * content is duplicated so the loop is seamless. Under reduced motion
 * the track crawls very slowly instead of scrolling (see globals.css).
 */
export default function Marquee({
    children,
    duration = 30,
    reverse = false,
    pauseOnHover = true,
    className,
}: Props) {
    return (
        <div
            className={`overflow-hidden ${pauseOnHover ? "marquee-hover-pause" : ""} ${className ?? ""}`}
        >
            <div
                className={`marquee-track ${reverse ? "reverse" : ""}`}
                style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
            >
                <div aria-hidden={false} className="flex shrink-0 items-center">
                    {children}
                </div>
                <div aria-hidden="true" className="flex shrink-0 items-center">
                    {children}
                </div>
            </div>
        </div>
    );
}
