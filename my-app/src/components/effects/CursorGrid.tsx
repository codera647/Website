"use client";

import { useRef, useEffect, useState } from "react";

/**
 * CursorGrid — adapted from React Bits (https://reactbits.dev) as a
 * site-wide interactive background, recolored to Kinetiq's monochrome
 * palette (ink on the site's near-white page background) instead of the
 * source's magenta default.
 *
 * Two changes from the source, both required for a "whole page" background
 * rather than a single hero panel:
 *
 * 1. Pointer tracking moves from the component's own container to `window`.
 *    The source attaches `pointermove`/`pointerdown` to its own wrapper div,
 *    which works when that div is the interactive surface itself. Here the
 *    grid sits fixed behind all real page content (nav, text, cards, the
 *    footer, everything) — a container-scoped listener would basically
 *    never fire, since the browser delivers the event to whatever's on top,
 *    and it doesn't bubble into an unrelated background layer. Listening on
 *    `window` instead means the grid reacts to the cursor everywhere on the
 *    page, while `pointer-events-none` on the canvas itself guarantees it
 *    never blocks clicks on the real UI sitting above it.
 * 2. Respects `prefers-reduced-motion` by not rendering at all — consistent
 *    with how the rest of the site (e.g. the marquee) handles motion
 *    sensitivity, and this effect is purely decorative.
 */

type Falloff = "linear" | "smooth" | "sharp";

export interface CursorGridProps {
    cellSize?: number;
    color?: string;
    radius?: number;
    falloff?: Falloff;
    holdTime?: number;
    fadeDuration?: number;
    lineWidth?: number;
    maxOpacity?: number;
    fillOpacity?: number;
    gridOpacity?: number;
    cellRadius?: number;
    clickPulse?: boolean;
    pulseSpeed?: number;
    className?: string;
}

interface GridConfig {
    cellSize: number;
    color: string;
    radius: number;
    falloff: Falloff;
    holdTime: number;
    fadeDuration: number;
    lineWidth: number;
    maxOpacity: number;
    fillOpacity: number;
    gridOpacity: number;
    cellRadius: number;
    clickPulse: boolean;
    pulseSpeed: number;
}

interface Pulse {
    x: number;
    y: number;
    t0: number;
}

const FALLOFF_CURVES: Record<Falloff, (t: number) => number> = {
    linear: (t) => t,
    smooth: (t) => t * t * (3 - 2 * t),
    sharp: (t) => t * t * t,
};

const hexToRgb = (hex: string): [number, number, number] => {
    const h = hex.replace("#", "");
    const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const num = parseInt(v.slice(0, 6), 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

function usePrefersReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(mq.matches);
        const onChange = () => setReduced(mq.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);
    return reduced;
}

const CursorGridInner = ({
    cellSize = 70,
    color = "#D946EF",
    radius = 140,
    falloff = "smooth",
    holdTime = 400,
    fadeDuration = 800,
    lineWidth = 1.2,
    maxOpacity = 1,
    fillOpacity = 0,
    gridOpacity = 0,
    cellRadius = 0,
    clickPulse = true,
    pulseSpeed = 600,
    className = "",
}: CursorGridProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const propsRef = useRef<GridConfig>({} as GridConfig);
    const wakeRef = useRef<(() => void) | null>(null);

    propsRef.current = {
        cellSize,
        color,
        radius,
        falloff,
        holdTime,
        fadeDuration,
        lineWidth,
        maxOpacity,
        fillOpacity,
        gridOpacity,
        cellRadius,
        clickPulse,
        pulseSpeed,
    };

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        let cols = 0;
        let rows = 0;
        let offX = 0;
        let offY = 0;
        let alphas = new Float32Array(0);
        let touched = new Float64Array(0);
        let w = 0;
        let h = 0;
        const pulses: Pulse[] = [];
        let raf = 0;
        let running = false;
        let lastFrame = 0;

        const rebuild = () => {
            const p = propsRef.current;
            w = container.offsetWidth;
            h = container.offsetHeight;
            canvas.width = Math.max(1, Math.round(w * dpr));
            canvas.height = Math.max(1, Math.round(h * dpr));
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            cols = Math.ceil(w / p.cellSize) + 1;
            rows = Math.ceil(h / p.cellSize) + 1;
            offX = (w - cols * p.cellSize) / 2;
            offY = (h - rows * p.cellSize) / 2;
            alphas = new Float32Array(cols * rows);
            touched = new Float64Array(cols * rows);
        };

        const cellCenter = (i: number): [number, number] => {
            const p = propsRef.current;
            const cx = offX + (i % cols) * p.cellSize + p.cellSize / 2;
            const cy = offY + Math.floor(i / cols) * p.cellSize + p.cellSize / 2;
            return [cx, cy];
        };

        const energize = (x: number, y: number, boost?: number) => {
            const p = propsRef.current;
            const r = Math.max(p.radius, 1);
            const ease = FALLOFF_CURVES[p.falloff] ?? FALLOFF_CURVES.linear;
            const now = performance.now();
            const minCol = Math.max(0, Math.floor((x - r - offX) / p.cellSize));
            const maxCol = Math.min(cols - 1, Math.floor((x + r - offX) / p.cellSize));
            const minRow = Math.max(0, Math.floor((y - r - offY) / p.cellSize));
            const maxRow = Math.min(rows - 1, Math.floor((y + r - offY) / p.cellSize));
            for (let cRow = minRow; cRow <= maxRow; cRow++) {
                for (let cCol = minCol; cCol <= maxCol; cCol++) {
                    const i = cRow * cols + cCol;
                    const [cx, cy] = cellCenter(i);
                    const dist = Math.hypot(cx - x, cy - y);
                    if (dist > r) continue;
                    const level = ease(1 - dist / r) * p.maxOpacity * (boost ?? 1);
                    if (level > alphas[i]) {
                        alphas[i] = level;
                        touched[i] = now;
                    } else if (level > 0) {
                        touched[i] = now;
                    }
                }
            }
        };

        const draw = (now: number) => {
            const p = propsRef.current;
            const dt = Math.min(now - lastFrame, 50);
            lastFrame = now;
            ctx.clearRect(0, 0, w, h);
            const [cr, cg, cb] = hexToRgb(p.color);

            if (p.gridOpacity > 0) {
                ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${p.gridOpacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                for (let cCol = 0; cCol <= cols; cCol++) {
                    const x = Math.round(offX + cCol * p.cellSize) + 0.5;
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, h);
                }
                for (let cRow = 0; cRow <= rows; cRow++) {
                    const y = Math.round(offY + cRow * p.cellSize) + 0.5;
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                }
                ctx.stroke();
            }

            for (let pi = pulses.length - 1; pi >= 0; pi--) {
                const pulse = pulses[pi];
                const age = (now - pulse.t0) / 1000;
                const ringR = age * p.pulseSpeed;
                if (ringR > Math.hypot(w, h)) {
                    pulses.splice(pi, 1);
                    continue;
                }
                const band = p.cellSize;
                const minCol = Math.max(0, Math.floor((pulse.x - ringR - band - offX) / p.cellSize));
                const maxCol = Math.min(cols - 1, Math.floor((pulse.x + ringR + band - offX) / p.cellSize));
                const minRow = Math.max(0, Math.floor((pulse.y - ringR - band - offY) / p.cellSize));
                const maxRow = Math.min(rows - 1, Math.floor((pulse.y + ringR + band - offY) / p.cellSize));
                for (let cRow = minRow; cRow <= maxRow; cRow++) {
                    for (let cCol = minCol; cCol <= maxCol; cCol++) {
                        const i = cRow * cols + cCol;
                        const [cx, cy] = cellCenter(i);
                        const dist = Math.hypot(cx - pulse.x, cy - pulse.y);
                        if (Math.abs(dist - ringR) < band / 2 && p.maxOpacity > alphas[i]) {
                            alphas[i] = p.maxOpacity;
                            touched[i] = now;
                        }
                    }
                }
            }

            let anyVisible = pulses.length > 0;
            const fadeStep = dt / Math.max(p.fadeDuration, 16);
            const half = p.cellSize / 2;
            for (let i = 0; i < alphas.length; i++) {
                let a = alphas[i];
                if (a <= 0) continue;
                if (now - touched[i] > p.holdTime) {
                    a = Math.max(0, a - fadeStep);
                    alphas[i] = a;
                    if (a <= 0) continue;
                }
                anyVisible = true;
                const [cx, cy] = cellCenter(i);
                const gradient = ctx.createRadialGradient(cx, cy, half * 0.1, cx, cy, p.cellSize);
                gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${a})`);
                gradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
                const x = cx - half + 0.5;
                const y = cy - half + 0.5;
                const s = p.cellSize - 1;
                ctx.beginPath();
                if (p.cellRadius > 0) {
                    ctx.roundRect(x, y, s, s, p.cellRadius);
                } else {
                    ctx.rect(x, y, s, s);
                }
                if (p.fillOpacity > 0) {
                    ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${a * p.fillOpacity})`;
                    ctx.fill();
                }
                ctx.strokeStyle = gradient;
                ctx.lineWidth = p.lineWidth;
                ctx.stroke();
            }

            if (anyVisible) {
                raf = requestAnimationFrame(draw);
            } else {
                running = false;
                if (propsRef.current.gridOpacity <= 0) ctx.clearRect(0, 0, w, h);
            }
        };

        const wake = () => {
            if (running) return;
            running = true;
            lastFrame = performance.now();
            raf = requestAnimationFrame(draw);
        };
        wakeRef.current = wake;

        const toLocal = (e: PointerEvent): [number, number] => {
            const rect = canvas.getBoundingClientRect();
            return [e.clientX - rect.left, e.clientY - rect.top];
        };

        const onPointerMove = (e: PointerEvent) => {
            const [x, y] = toLocal(e);
            energize(x, y);
            wake();
        };
        const onPointerDown = (e: PointerEvent) => {
            if (!propsRef.current.clickPulse) return;
            const [x, y] = toLocal(e);
            pulses.push({ x, y, t0: performance.now() });
            wake();
        };

        const ro = new ResizeObserver(() => {
            rebuild();
            wake();
        });
        ro.observe(container);
        rebuild();
        wake();

        // Listen on window, not the container — see file header. Passive
        // since we never call preventDefault, letting the browser optimize
        // scroll/touch handling around these high-frequency listeners.
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("pointerdown", onPointerDown, { passive: true });

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerdown", onPointerDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cellSize]);

    useEffect(() => {
        wakeRef.current?.();
    }, [gridOpacity, color, lineWidth, maxOpacity, fillOpacity, cellRadius]);

    return (
        <div ref={containerRef} className={`relative h-full w-full overflow-hidden${className ? ` ${className}` : ""}`}>
            <canvas ref={canvasRef} className="block h-full w-full" />
        </div>
    );
};

/** Public export — bails out entirely under prefers-reduced-motion. */
export default function CursorGrid(props: CursorGridProps) {
    const reducedMotion = usePrefersReducedMotion();
    if (reducedMotion) return null;
    return <CursorGridInner {...props} />;
}
