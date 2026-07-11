/** FAQ content (brief §4 Home) — DRAFT copy, TODO(user): review/edit. */

import type { FAQItem } from "@/components/motion/FAQAccordion";

export const faqItems: FAQItem[] = [
    {
        question: "What does a typical engagement look like?",
        answer:
            "Most projects follow our four-step process: a short discovery phase to map your workflows and goals, a design phase with a concrete build plan, iterative development with working software every week, and a production deployment with documentation and handover. Typical engagements run from 4 weeks for a focused build to several months for a full platform.",
    },
    {
        question: "Do you work with startups or only enterprises?",
        answer:
            "Both. We've shipped for solo founders, small businesses, and larger organizations. What matters is that the problem is real — if software or AI genuinely pays off for your workflow, we're interested.",
    },
    {
        question: "How fast can you ship?",
        answer:
            "A focused MVP typically ships in 4–8 weeks. We work in short iterations with honest demos of real progress, so you see working software from the first weeks — not a big reveal at the end.",
    },
    {
        question: "Can you work with our existing systems and team?",
        answer:
            "Yes. We regularly integrate with existing databases, APIs, and internal tools, and we're comfortable working alongside in-house engineers — including handing over clean, documented code your team can own.",
    },
    {
        question: "How do you handle confidentiality and data security?",
        answer:
            "NDAs are standard practice for us, and we design with data isolation and least-privilege access from the start. For AI systems, your data is never used to train third-party models without your explicit sign-off.",
    },
];
