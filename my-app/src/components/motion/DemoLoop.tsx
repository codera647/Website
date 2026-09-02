"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface Props {
    /** muted looping screen-capture; when omitted, children render as an animated UI mockup */
    videoSrc?: string;
    poster?: string;
    children?: React.ReactNode;
    /** small window-chrome title, e.g. "pipeline.run" */
    label?: string;
    className?: string;
}

/**
 * The invoko.ai-style "show it working" block: a short muted looping
 * demo framed in minimal window chrome. Lazy — the video only plays
 * while scrolled into view and pauses when it leaves.
 *
 * TODO(user): swap animated mockups for real screen-capture footage
 * when available (just pass videoSrc).
 */
export default function DemoLoop({
    videoSrc,
    poster,
    children,
    label,
    className,
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const inView = useInView(ref, { margin: "-15%" });

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (inView) {
            video.play().catch(() => {
                /* autoplay can be blocked — poster remains */
            });
        } else {
            video.pause();
        }
    }, [inView]);

    return (
        <div
            ref={ref}
            className={`overflow-hidden rounded-xl border border-line bg-white shadow-[0_24px_64px_-32px_rgba(17,17,19,0.25)] ${className ?? ""}`}
        >
            {/* window chrome */}
            <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-line" />
                <span className="size-2.5 rounded-full bg-line" />
                <span className="size-2.5 rounded-full bg-line" />
                {label && (
                    <span className="ml-2 font-heading text-xs text-muted">{label}</span>
                )}
            </div>
            {videoSrc ? (
                <video
                    ref={videoRef}
                    src={videoSrc}
                    poster={poster}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="block w-full"
                />
            ) : (
                <div className="relative">{children}</div>
            )}
        </div>
    );
}
