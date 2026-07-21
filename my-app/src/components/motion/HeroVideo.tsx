"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Full-bleed hero background video (/hero_video.mp4) with a seamless
 * loop. The clip's first and last frames don't match, so a native
 * loop alone would visibly jump. Two players run the same clip and
 * crossfade near the end; the incoming copy starts from frame 0 so
 * the restart reads as one continuous shot.
 *
 * Robustness details:
 * - the swap point is watched with requestAnimationFrame (timeupdate
 *   only fires ~4x/second, which triggered the fade late and let the
 *   outgoing copy freeze on its last frame mid-fade)
 * - both players also carry the native `loop` attribute as a safety
 *   net: if the fade outlasts the remaining footage, the outgoing
 *   copy wraps to frame 0 and matches the incoming copy instead of
 *   freezing, so the cut stays invisible
 *
 * A light veil sits on top for text readability. Respects
 * prefers-reduced-motion by not rendering the video at all.
 */

const CROSSFADE_S = 2.0;

export default function HeroVideo() {
    const reduced = useReducedMotion();
    const refA = useRef<HTMLVideoElement>(null);
    const refB = useRef<HTMLVideoElement>(null);
    const [active, setActive] = useState<0 | 1>(0);
    const swapping = useRef(false);

    useEffect(() => {
        if (reduced) return;
        const videos = [refA.current, refB.current];
        const current = videos[active];
        const standby = videos[active === 0 ? 1 : 0];
        if (!current || !standby) return;

        current.play().catch(() => {});

        let raf = 0;
        const watch = () => {
            if (
                !swapping.current &&
                current.duration &&
                current.duration - current.currentTime <= CROSSFADE_S
            ) {
                swapping.current = true;
                standby.currentTime = 0;
                standby.play().catch(() => {});
                setActive((a) => (a === 0 ? 1 : 0));
                // let the CSS crossfade finish, then park the old copy
                window.setTimeout(() => {
                    current.pause();
                    current.currentTime = 0;
                    swapping.current = false;
                }, CROSSFADE_S * 1000 + 200);
                return;
            }
            raf = requestAnimationFrame(watch);
        };
        raf = requestAnimationFrame(watch);

        return () => cancelAnimationFrame(raf);
    }, [active, reduced]);

    if (reduced) return null;

    const videoClass = (isActive: boolean) =>
        `absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
            isActive ? "opacity-100" : "opacity-0"
        }`;

    return (
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <video
                ref={refA}
                src="/hero_video.mp4"
                muted
                loop
                playsInline
                preload="auto"
                className={videoClass(active === 0)}
            />
            <video
                ref={refB}
                src="/hero_video.mp4"
                muted
                loop
                playsInline
                preload="auto"
                className={videoClass(active === 1)}
            />
            {/* readability veil: strongest over the text column, lighter on the right */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/55 to-background/30" />
        </div>
    );
}
