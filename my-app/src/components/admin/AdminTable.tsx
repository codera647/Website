"use client";

import type { ReactNode } from "react";

export interface AdminTableColumn<T> {
    header: string;
    render: (row: T) => ReactNode;
    className?: string;
}

/** Generic dark-themed data table used across the admin's list pages. */
export default function AdminTable<T>({
    columns,
    rows,
    rowKey,
    emptyMessage = "Nothing here yet.",
}: {
    columns: AdminTableColumn<T>[];
    rows: T[];
    rowKey: (row: T) => string | number;
    emptyMessage?: string;
}) {
    if (rows.length === 0) {
        return (
            <div className="border border-white/10 bg-white/[0.02] px-6 py-16 text-center text-sm text-white/40">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border border-white/10">
            <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                    <tr className="border-b border-white/10 bg-white/[0.03]">
                        {columns.map((col) => (
                            <th
                                key={col.header}
                                className="px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-white/45"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={rowKey(row)} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                            {columns.map((col) => (
                                <td key={col.header} className={`px-4 py-3.5 text-white/85 ${col.className ?? ""}`}>
                                    {col.render(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
