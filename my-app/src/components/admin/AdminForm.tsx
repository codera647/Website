"use client";

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

/** Shared field wrapper — label + optional hint + the control itself. */
export function Field({
    label,
    hint,
    children,
    required,
}: {
    label: string;
    hint?: string;
    children: ReactNode;
    required?: boolean;
}) {
    return (
        <label className="block">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-white/50">
                {label}
                {required && <span className="ml-1 text-white/30">*</span>}
            </span>
            <div className="mt-1.5">{children}</div>
            {hint && <p className="mt-1.5 text-xs text-white/35">{hint}</p>}
        </label>
    );
}

const baseControlClass =
    "w-full border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-white/30";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
    const { className, ...rest } = props;
    return <input className={`${baseControlClass} ${className ?? ""}`} {...rest} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const { className, ...rest } = props;
    return <textarea className={`${baseControlClass} resize-y ${className ?? ""}`} {...rest} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
    const { className, children, ...rest } = props;
    return (
        <select className={`${baseControlClass} ${className ?? ""}`} {...rest}>
            {children}
        </select>
    );
}

export function Checkbox({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="flex items-center gap-2.5 text-sm text-white/80">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="size-4 border border-white/20 bg-white/[0.03] accent-white"
            />
            {label}
        </label>
    );
}

export function Button({
    variant = "primary",
    className,
    ...rest
}: {
    variant?: "primary" | "secondary" | "danger";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const variants = {
        primary: "bg-white text-black hover:bg-white/85",
        secondary: "border border-white/15 text-white hover:border-white/40",
        danger: "border border-red-500/30 text-red-400 hover:bg-red-500/10",
    };
    return (
        <button
            className={`px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className ?? ""}`}
            {...rest}
        />
    );
}

export function ErrorBanner({ message }: { message: string }) {
    return (
        <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {message}
        </div>
    );
}
