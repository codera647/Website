"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
    { href: "/admin", label: "Dashboard", exact: true },
    { href: "/admin/projects", label: "Projects" },
    { href: "/admin/blogs", label: "Blogs" },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    async function logout() {
        await fetch("/api/admin/auth", { method: "DELETE" });
        router.replace("/admin/login");
    }

    return (
        <aside className="flex w-56 shrink-0 flex-col border-r border-white/10 bg-black/40 p-5">
            <Link href="/admin" className="font-heading text-lg font-bold tracking-tight text-white">
                kinet<span className="text-white/40">iq</span>
                <span className="ml-1.5 text-xs font-medium uppercase tracking-[0.14em] text-white/40">
                    admin
                </span>
            </Link>

            <nav className="mt-10 flex flex-1 flex-col gap-1">
                {links.map((link) => {
                    const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-3 py-2 text-sm font-medium transition-colors ${
                                active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <button
                type="button"
                onClick={logout}
                className="px-3 py-2 text-left text-sm font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white"
            >
                Log out
            </button>
        </aside>
    );
}
