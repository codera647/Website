"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

/**
 * Opens a Cal.com scheduling popup on click — no navigation away from the
 * site. Any element with `data-cal-link` is wired up automatically once
 * the Cal.com embed script has loaded (getCalApi() below), per Cal's
 * embed docs: https://cal.com/docs/embeds
 */
export default function BookCallButton({
    calLink = "kinetiq-solutions/30min",
    className,
    children,
}: {
    calLink?: string;
    className?: string;
    children: React.ReactNode;
}) {
    useEffect(() => {
        (async () => {
            const cal = await getCalApi();
            cal("ui", {
                styles: { branding: { brandColor: "#111113" } },
                hideEventTypeDetails: false,
                layout: "month_view",
            });
        })();
    }, []);

    return (
        <button type="button" data-cal-link={calLink} className={className}>
            {children}
        </button>
    );
}
