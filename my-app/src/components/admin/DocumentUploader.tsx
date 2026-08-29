"use client";

import { useRef, useState, type DragEvent } from "react";

/**
 * Generic drag-and-drop file uploader. Used for both project RAG documents
 * and image uploads (thumbnail/screenshots) — the caller supplies the
 * upload logic via `onUpload`, this component only handles the drop zone,
 * drag state, and in-flight/error UI.
 */
export default function DocumentUploader({
    onUpload,
    accept,
    label = "Drop a file here, or click to browse",
}: {
    onUpload: (file: File) => Promise<void>;
    accept?: string;
    label?: string;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleFile(file: File) {
        setBusy(true);
        setError(null);
        try {
            await onUpload(file);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed.");
        } finally {
            setBusy(false);
        }
    }

    function onDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) void handleFile(file);
    }

    return (
        <div>
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-6 py-10 text-center transition-colors ${
                    dragging ? "border-white/50 bg-white/5" : "border-white/15 hover:border-white/30"
                }`}
            >
                <span className="text-sm text-white/60">{busy ? "Uploading…" : label}</span>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void handleFile(file);
                        e.target.value = "";
                    }}
                />
            </div>
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        </div>
    );
}
