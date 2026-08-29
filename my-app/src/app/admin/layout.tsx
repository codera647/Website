"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

/**
 * Admin shell — client-side auth gate (checks the session cookie against
 * /api/admin/auth) + sidebar. Sits outside the `(site)` route group, so it
 * never picks up the public Nav/Footer/CursorGrid/chat widget.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === "/admin/login";
    const [status, setStatus] = useState<"checking" | "authed" | "unauthed">("checking");

    useEffect(() => {
        if (isLoginPage) return;
        let cancelled = false;

        fetch("/api/admin/auth")
            .then((res) => res.json() as Promise<{ ok: boolean }>)
            .then((data) => {
                if (cancelled) return;
                if (data.ok) {
                    setStatus("authed");
                } else {
                    setStatus("unauthed");
                    router.replace("/admin/login");
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setStatus("unauthed");
                    router.replace("/admin/login");
                }
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, isLoginPage]);

    if (isLoginPage) {
        return <div className="min-h-screen bg-[#0a0a0c] text-white">{children}</div>;
    }

    if (status !== "authed") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0c] text-sm text-white/40">
                Checking session…
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#0a0a0c] text-white">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto px-8 py-10">
                <div className="mx-auto max-w-5xl">{children}</div>
            </main>
        </div>
    );
}
