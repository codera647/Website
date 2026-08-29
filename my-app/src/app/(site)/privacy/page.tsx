import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { privacySections, LAST_UPDATED } from "@/data/legal";

export const metadata: Metadata = {
    title: "Privacy Policy | Kinetiq",
    description:
        "What personal information Kinetiq collects through thekinetiq.solutions, why we collect it, who we share it with, and the rights you have over it.",
};

export default function PrivacyPage() {
    return (
        <LegalPage
            eyebrow="Legal"
            title="Privacy Policy"
            intro="What we collect, why we collect it, and the rights you have over your own information, written to match what this website actually does rather than a generic template."
            lastUpdated={LAST_UPDATED}
            sections={privacySections}
        />
    );
}
