import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { termsSections, LAST_UPDATED } from "@/data/legal";

export const metadata: Metadata = {
    title: "Terms & Conditions | Kinetiq",
    description:
        "The terms that govern use of the Kinetiq website and, where a separate contract doesn't already cover it, our software development, AI automation, and generative AI services.",
};

export default function TermsPage() {
    return (
        <LegalPage
            eyebrow="Legal"
            title="Terms & Conditions"
            intro="The ground rules for using this website and, where a Statement of Work doesn't already cover it, for engaging Kinetiq's services. Written in plain language wherever the law lets us, and organized so you can jump straight to the part you need."
            lastUpdated={LAST_UPDATED}
            sections={termsSections}
        />
    );
}
