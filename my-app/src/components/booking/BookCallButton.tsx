"use client";

/**
 * Opens the sitewide "which call do you want" modal (CallTypeModal,
 * mounted once in the site layout) rather than jumping straight to one
 * Cal.com event. `calLink` is kept as a prop for backward compatibility
 * with existing call sites but is no longer used directly — the modal
 * itself carries the real event links.
 */
export default function BookCallButton({
    className,
    children,
}: {
    calLink?: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-call-modal"))}
            className={className}
        >
            {children}
        </button>
    );
}
