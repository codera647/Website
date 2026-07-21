"use client";

import React, { useEffect, useRef, useCallback, useMemo, useState } from "react";

/**
 * ProfileCard — clean, light-themed team card with subtle 3D tilt.
 *
 * Uses the site's surface color (#f4f4f5) as a solid background.
 * Images are displayed at their natural aspect ratio (no stretching),
 * cropped from below so the face is always visible. No filters,
 * gradients, glitch effects, or overlays — just a clean card.
 *
 * Click to flip — reveals a back side with the member's bio,
 * rendered character-by-character with a typing effect.
 */

const ANIMATION_CONFIG = {
    INITIAL_DURATION: 1200,
    INITIAL_X_OFFSET: 70,
    INITIAL_Y_OFFSET: 60,
    DEVICE_BETA_OFFSET: 20,
    ENTER_TRANSITION_MS: 180,
} as const;

const clamp = (v: number, min = 0, max = 100): number => Math.min(Math.max(v, min), max);
const round = (v: number, precision = 3): number => parseFloat(v.toFixed(precision));
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number): number =>
    round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

interface ProfileCardProps {
    avatarUrl: string;
    behindGlowEnabled?: boolean;
    className?: string;
    enableTilt?: boolean;
    enableMobileTilt?: boolean;
    mobileTiltSensitivity?: number;
    name: string;
    title: string;
    contactUrl?: string;
    bio?: string;
}

interface TiltEngine {
    setImmediate: (x: number, y: number) => void;
    setTarget: (x: number, y: number) => void;
    toCenter: () => void;
    beginInitial: (durationMs: number) => void;
    getCurrent: () => { x: number; y: number; tx: number; ty: number };
    cancel: () => void;
}

/* ── Typing hook ─────────────────────────────────────────────── */
function useTypingEffect(text: string, active: boolean, speed = 18) {
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!active) {
            setDisplayed("");
            setDone(false);
            return;
        }
        let i = 0;
        setDisplayed("");
        setDone(false);
        const id = setInterval(() => {
            i++;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) {
                clearInterval(id);
                setDone(true);
            }
        }, speed);
        return () => clearInterval(id);
    }, [text, active, speed]);

    return { displayed, done };
}

const ProfileCardComponent: React.FC<ProfileCardProps> = ({
    avatarUrl,
    behindGlowEnabled = true,
    className = "",
    enableTilt = true,
    enableMobileTilt = false,
    mobileTiltSensitivity = 5,
    name,
    title,
    contactUrl,
    bio = "",
}) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const shellRef = useRef<HTMLDivElement>(null);

    const enterTimerRef = useRef<number | null>(null);
    const leaveRafRef = useRef<number | null>(null);

    /* ── Flip state ──────────────────────────────────────────── */
    const [flipped, setFlipped] = useState(false);
    const { displayed: typedBio, done: typingDone } = useTypingEffect(bio, flipped, 18);

    const tiltEngine = useMemo<TiltEngine | null>(() => {
        if (!enableTilt) return null;

        let rafId: number | null = null;
        let running = false;
        let lastTs = 0;

        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;

        const DEFAULT_TAU = 0.14;
        const INITIAL_TAU = 0.6;
        let initialUntil = 0;

        const setVarsFromXY = (x: number, y: number): void => {
            const shell = shellRef.current;
            const wrap = wrapRef.current;
            if (!shell || !wrap) return;

            const width = shell.clientWidth || 1;
            const height = shell.clientHeight || 1;

            const percentX = clamp((100 / width) * x);
            const percentY = clamp((100 / height) * y);

            const centerX = percentX - 50;
            const centerY = percentY - 50;

            const properties: Record<string, string> = {
                "--pointer-x": `${percentX}%`,
                "--pointer-y": `${percentY}%`,
                "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
                "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
                "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
                "--pointer-from-top": `${percentY / 100}`,
                "--pointer-from-left": `${percentX / 100}`,
                "--rotate-x": `${round(-(centerX / 5))}deg`,
                "--rotate-y": `${round(centerY / 4)}deg`,
            };

            for (const [k, v] of Object.entries(properties)) wrap.style.setProperty(k, v);
        };

        const step = (ts: number): void => {
            if (!running) return;
            if (lastTs === 0) lastTs = ts;
            const dt = (ts - lastTs) / 1000;
            lastTs = ts;

            const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
            const k = 1 - Math.exp(-dt / tau);

            currentX += (targetX - currentX) * k;
            currentY += (targetY - currentY) * k;

            setVarsFromXY(currentX, currentY);

            const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

            if (stillFar || document.hasFocus()) {
                rafId = requestAnimationFrame(step);
            } else {
                running = false;
                lastTs = 0;
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            }
        };

        const start = (): void => {
            if (running) return;
            running = true;
            lastTs = 0;
            rafId = requestAnimationFrame(step);
        };

        return {
            setImmediate(x: number, y: number): void {
                currentX = x;
                currentY = y;
                setVarsFromXY(currentX, currentY);
            },
            setTarget(x: number, y: number): void {
                targetX = x;
                targetY = y;
                start();
            },
            toCenter(): void {
                const shell = shellRef.current;
                if (!shell) return;
                this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
            },
            beginInitial(durationMs: number): void {
                initialUntil = performance.now() + durationMs;
                start();
            },
            getCurrent(): { x: number; y: number; tx: number; ty: number } {
                return { x: currentX, y: currentY, tx: targetX, ty: targetY };
            },
            cancel(): void {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = null;
                running = false;
                lastTs = 0;
            },
        };
    }, [enableTilt]);

    const getOffsets = (evt: PointerEvent, el: HTMLElement): { x: number; y: number } => {
        const rect = el.getBoundingClientRect();
        return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
    };

    const handlePointerMove = useCallback(
        (event: PointerEvent): void => {
            const shell = shellRef.current;
            if (!shell || !tiltEngine) return;
            const { x, y } = getOffsets(event, shell);
            tiltEngine.setTarget(x, y);
        },
        [tiltEngine]
    );

    const handlePointerEnter = useCallback(
        (event: PointerEvent): void => {
            const shell = shellRef.current;
            if (!shell || !tiltEngine) return;

            shell.classList.add("active");
            shell.classList.add("entering");
            if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
            enterTimerRef.current = window.setTimeout(() => {
                shell.classList.remove("entering");
            }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

            const { x, y } = getOffsets(event, shell);
            tiltEngine.setTarget(x, y);
        },
        [tiltEngine]
    );

    const handlePointerLeave = useCallback((): void => {
        const shell = shellRef.current;
        if (!shell || !tiltEngine) return;

        tiltEngine.toCenter();

        const checkSettle = (): void => {
            const { x, y, tx, ty } = tiltEngine.getCurrent();
            const settled = Math.hypot(tx - x, ty - y) < 0.6;
            if (settled) {
                shell.classList.remove("active");
                leaveRafRef.current = null;
            } else {
                leaveRafRef.current = requestAnimationFrame(checkSettle);
            }
        };
        if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
        leaveRafRef.current = requestAnimationFrame(checkSettle);
    }, [tiltEngine]);

    const handleDeviceOrientation = useCallback(
        (event: DeviceOrientationEvent): void => {
            const shell = shellRef.current;
            if (!shell || !tiltEngine) return;

            const { beta, gamma } = event;
            if (beta == null || gamma == null) return;

            const centerX = shell.clientWidth / 2;
            const centerY = shell.clientHeight / 2;
            const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, shell.clientWidth);
            const y = clamp(
                centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
                0,
                shell.clientHeight
            );

            tiltEngine.setTarget(x, y);
        },
        [tiltEngine, mobileTiltSensitivity]
    );

    useEffect(() => {
        if (!enableTilt || !tiltEngine) return;

        const shell = shellRef.current;
        if (!shell) return;

        const pointerMoveHandler = handlePointerMove as EventListener;
        const pointerEnterHandler = handlePointerEnter as EventListener;
        const pointerLeaveHandler = handlePointerLeave as EventListener;
        const deviceOrientationHandler = handleDeviceOrientation as EventListener;

        shell.addEventListener("pointerenter", pointerEnterHandler);
        shell.addEventListener("pointermove", pointerMoveHandler);
        shell.addEventListener("pointerleave", pointerLeaveHandler);

        const handleClick = (): void => {
            if (!enableMobileTilt || location.protocol !== "https:") return;
            const anyMotion = window.DeviceMotionEvent as typeof DeviceMotionEvent & {
                requestPermission?: () => Promise<string>;
            };
            if (anyMotion && typeof anyMotion.requestPermission === "function") {
                anyMotion
                    .requestPermission()
                    .then((state: string) => {
                        if (state === "granted") {
                            window.addEventListener("deviceorientation", deviceOrientationHandler);
                        }
                    })
                    .catch(console.error);
            } else {
                window.addEventListener("deviceorientation", deviceOrientationHandler);
            }
        };
        shell.addEventListener("click", handleClick);

        const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
        const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
        tiltEngine.setImmediate(initialX, initialY);
        tiltEngine.toCenter();
        tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

        return () => {
            shell.removeEventListener("pointerenter", pointerEnterHandler);
            shell.removeEventListener("pointermove", pointerMoveHandler);
            shell.removeEventListener("pointerleave", pointerLeaveHandler);
            shell.removeEventListener("click", handleClick);
            window.removeEventListener("deviceorientation", deviceOrientationHandler);
            if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
            if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
            tiltEngine.cancel();
            shell.classList.remove("entering");
        };
    }, [
        enableTilt,
        enableMobileTilt,
        tiltEngine,
        handlePointerMove,
        handlePointerEnter,
        handlePointerLeave,
        handleDeviceOrientation,
    ]);

    const cardRadius = "24px";

    const cardStyle = useMemo(
        () =>
            ({
                "--pointer-x": "50%",
                "--pointer-y": "50%",
                "--pointer-from-center": "0",
                "--pointer-from-top": "0.5",
                "--pointer-from-left": "0.5",
                "--rotate-x": "0deg",
                "--rotate-y": "0deg",
            }) as React.CSSProperties,
        []
    );

    /* shared face style */
    const faceBase: React.CSSProperties = {
        position: "absolute",
        inset: 0,
        borderRadius: cardRadius,
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        background: "#f4f4f5",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
    };

    return (
        <div
            ref={wrapRef}
            className={`relative touch-none ${className}`.trim()}
            style={{ perspective: "800px", transform: "translate3d(0, 0, 0.1px)", ...cardStyle }}
        >
            {behindGlowEnabled && (
                <div
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        background:
                            "radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgba(0,0,0,0.08) 0%, transparent 55%)",
                        filter: "blur(50px)",
                    }}
                />
            )}
            <div ref={shellRef} className="group relative z-[1]">
                {/* Card flipper wrapper */}
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setFlipped((f) => !f)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setFlipped((f) => !f);
                        }
                    }}
                    className="relative w-full cursor-pointer outline-none"
                    style={{
                        aspectRatio: "0.75",
                        transformStyle: "preserve-3d",
                        transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                    onMouseEnter={(e) => {
                        if (!flipped) {
                            e.currentTarget.style.transition = "none";
                            e.currentTarget.style.transform =
                                "rotateX(var(--rotate-y)) rotateY(var(--rotate-x))";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!flipped) {
                            const shell = shellRef.current;
                            if (shell?.classList.contains("entering")) {
                                e.currentTarget.style.transition = "transform 180ms ease-out";
                            } else {
                                e.currentTarget.style.transition =
                                    "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
                            }
                            e.currentTarget.style.transform = "rotateY(0deg)";
                        }
                    }}
                    data-flipper=""
                >
                    {/* ═══════════ FRONT FACE ═══════════ */}
                    <div
                        className="flex w-full flex-col overflow-hidden"
                        style={{
                            ...faceBase,
                            transform: "rotateY(0deg)",
                        }}
                    >
                        {/* Name & title — top of card */}
                        <div className="flex-shrink-0 px-5 pt-6 pb-2 text-center">
                            <h3
                                className="m-0 font-heading text-2xl font-bold"
                                style={{ color: "#111113" }}
                            >
                                {name}
                            </h3>
                            <p
                                className="mt-1 font-heading text-sm font-medium"
                                style={{ color: "#6b6b70" }}
                            >
                                {title}
                            </p>
                        </div>

                        {/* Avatar — fills remaining space, cropped from below */}
                        <div className="relative flex-1 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className="absolute inset-x-0 bottom-0 mx-auto h-full w-auto max-w-none"
                                src={avatarUrl}
                                alt={`${name} — ${title}`}
                                loading="lazy"
                                style={{
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    objectFit: "contain",
                                    objectPosition: "bottom center",
                                    backfaceVisibility: "hidden",
                                }}
                                onError={(e) => {
                                    const t = e.target as HTMLImageElement;
                                    t.style.display = "none";
                                }}
                            />
                        </div>

                        {/* Contact bar — bottom of card */}
                        <div
                            className="relative z-[2] mx-3 mb-3 flex flex-shrink-0 items-center justify-between px-3 py-2.5"
                            style={{
                                borderRadius: "21px",
                                background: "rgba(17, 17, 19, 0.85)",
                                backdropFilter: "blur(12px)",
                            }}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-white/15">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        className="h-full w-full object-cover"
                                        src={avatarUrl}
                                        alt={name}
                                        loading="lazy"
                                        style={{ objectPosition: "center 22%" }}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium leading-tight text-white/90">
                                        {name}
                                    </span>
                                    <span className="text-[11px] leading-tight text-white/50">
                                        Available
                                    </span>
                                </div>
                            </div>
                            <a
                                href={contactUrl || "#contact"}
                                onClick={(e) => e.stopPropagation()}
                                className="rounded-lg border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white/90 transition-colors duration-200 hover:border-white/40 hover:text-white"
                            >
                                Contact Me
                            </a>
                        </div>
                    </div>

                    {/* ═══════════ BACK FACE ═══════════ */}
                    <div
                        className="flex w-full flex-col overflow-hidden"
                        style={{
                            ...faceBase,
                            transform: "rotateY(180deg)",
                        }}
                    >
                        {/* Header */}
                        <div className="flex-shrink-0 px-6 pt-6 pb-1">
                            <h3
                                className="m-0 font-heading text-xl font-bold"
                                style={{ color: "#111113" }}
                            >
                                {name}
                            </h3>
                            <p
                                className="mt-1 font-heading text-xs font-medium"
                                style={{ color: "#6b6b70" }}
                            >
                                {title}
                            </p>
                            <div
                                className="mt-3"
                                style={{ height: "1px", background: "#e4e4e7" }}
                            />
                        </div>

                        {/* Bio with typing effect */}
                        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
                            <p
                                className="m-0 font-heading text-sm leading-relaxed"
                                style={{ color: "#2a2a2e" }}
                            >
                                {typedBio}
                                {!typingDone && flipped && (
                                    <span
                                        className="inline-block"
                                        style={{
                                            width: "2px",
                                            height: "1em",
                                            background: "#111113",
                                            marginLeft: "1px",
                                            verticalAlign: "text-bottom",
                                            animation: "cursorBlink 0.7s step-end infinite",
                                        }}
                                    />
                                )}
                            </p>
                        </div>

                        {/* Tap to flip back hint */}
                        <div className="flex-shrink-0 px-6 pb-5 text-center">
                            <span
                                className="font-heading text-xs font-medium"
                                style={{ color: "#6b6b70" }}
                            >
                                Tap to flip back
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blinking cursor keyframes */}
            <style>{`
                @keyframes cursorBlink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
