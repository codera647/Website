"use client";

import Image from "next/image";
import { useState } from "react";

/** Supports existing local assets and public uploads, with a readable failure state. */
export default function ProjectImage({ src, alt, sizes, priority = false }: { src: string; alt: string; sizes: string; priority?: boolean }) {
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    if (!src || failedSrc === src) {
        return <div className="flex h-full items-center justify-center p-8 text-center font-heading text-lg text-muted">Project preview unavailable</div>;
    }
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} unoptimized={src.startsWith("/api/") || src.startsWith("http")}
        onError={() => setFailedSrc(src)} className="object-contain" />;
}
