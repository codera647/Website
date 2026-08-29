"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, ErrorBanner, Field, Input } from "@/components/admin/AdminForm";

export default function AdminLoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = (await res.json().catch(() => ({ ok: false }))) as {
                ok: boolean;
                error?: string;
            };

            if (!res.ok || !data.ok) {
                setError(data.error ?? "Login failed.");
                setSubmitting(false);
                return;
            }

            router.replace("/admin");
        } catch {
            setError("Something went wrong. Please try again.");
            setSubmitting(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-6">
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
                <div>
                    <p className="font-heading text-2xl font-bold tracking-tight text-white">
                        kinet<span className="text-white/40">iq</span>
                    </p>
                    <p className="mt-1 text-sm text-white/50">Admin sign in</p>
                </div>

                {error && <ErrorBanner message={error} />}

                <Field label="Password" required>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                        required
                    />
                </Field>

                <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? "Signing in…" : "Sign in"}
                </Button>
            </form>
        </div>
    );
}
