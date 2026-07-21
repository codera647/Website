/**
 * Content for /terms and /privacy, kept as structured data (same pattern
 * as work.ts / services.ts) rather than markdown, so LegalPage.tsx can
 * render a scrollspy table of contents from the same section list it
 * renders as prose — one source of truth for both.
 *
 * Drafted from first principles for Kinetiq's actual situation: a
 * software development studio operating out of Pakistan, taking on
 * clients primarily in the United States and United Kingdom, using
 * Resend for transactional email, Cloudflare for hosting/security and
 * the AI chat widget, and Calendly for call booking (verified against
 * the live code in src/app/api/* and src/components before writing a
 * word of this, so every claim below matches what the site actually
 * does — no boilerplate copied from a generator).
 *
 * NOTE for whoever maintains this: neither document names a specific
 * registered company number or street address, since none was on hand
 * while drafting. If Kinetiq is (or becomes) a formally registered
 * entity in Pakistan, add the registered name, registration number, and
 * business address to the "Who we are" section in both documents below.
 * That's a five-minute edit once you have the paperwork; everything else
 * here is written to stay accurate either way.
 */

export const LEGAL_CONTACT_EMAIL = "info@thekinetiq.solutions";
export const LAST_UPDATED = "2026-07-21";

export type LegalBlock =
    | { type: "p"; text: string }
    | { type: "list"; items: string[] }
    | { type: "numbered"; items: string[] };

export interface LegalSection {
    id: string;
    title: string;
    blocks: LegalBlock[];
}

function p(text: string): LegalBlock {
    return { type: "p", text };
}
function list(items: string[]): LegalBlock {
    return { type: "list", items };
}

/* ============================================================
   TERMS AND CONDITIONS
   ============================================================ */

export const termsSections: LegalSection[] = [
    {
        id: "acceptance",
        title: "1. Acceptance of these terms",
        blocks: [
            p(
                "These Terms and Conditions (the \"Terms\") govern your access to and use of thekinetiq.solutions (the \"Website\") and, where a separate written agreement does not already cover it, your engagement of Kinetiq for software development, AI automation, or generative AI services (the \"Services\"). By browsing the Website, submitting a form, booking a call, or engaging us for work, you agree to be bound by these Terms."
            ),
            p(
                "If you are entering into these Terms on behalf of a company or other legal entity, you confirm that you have the authority to bind that entity, in which case \"you\" refers to that entity."
            ),
            p(
                "If you do not agree with any part of these Terms, please do not use the Website or engage our Services."
            ),
        ],
    },
    {
        id: "who-we-are",
        title: "2. Who we are",
        blocks: [
            p(
                "Kinetiq (\"Kinetiq,\" \"we,\" \"us,\" or \"our\") is a software development studio operating out of Pakistan, building AI automation, custom web applications, and generative AI systems for clients located primarily in the United States and the United Kingdom, alongside clients elsewhere. You can reach us at info@thekinetiq.solutions."
            ),
            p(
                "Kinetiq is not a public company, a financial institution, or a law firm, and nothing on the Website should be read to suggest otherwise."
            ),
        ],
    },
    {
        id: "definitions",
        title: "3. Definitions",
        blocks: [
            list([
                "\"Client\" means an individual or organization that has engaged Kinetiq to provide Services, whether under a signed contract, an accepted proposal, or an ongoing course of dealing.",
                "\"Deliverables\" means the source code, designs, documentation, and other work product Kinetiq creates specifically for a Client under an engagement.",
                "\"Statement of Work\" or \"SOW\" means the proposal, quote, scope document, or contract that sets out the specific services, timeline, and fees for a given engagement.",
                "\"Content\" means text, graphics, logos, case studies, blog posts, and other material published on the Website.",
                "\"You\" means the person or entity using the Website, submitting an inquiry, or receiving Services, depending on context.",
            ]),
        ],
    },
    {
        id: "services",
        title: "4. Our services and how engagements work",
        blocks: [
            p(
                "Kinetiq provides bespoke software engineering services across three broad areas: AI automation (workflow and process automation, internal tooling, agentic systems), web development (marketing sites, web applications, e-commerce), and generative AI (retrieval-augmented assistants, content and media generation pipelines, model integration work). The Website describes these Services and showcases past work, but descriptions are illustrative rather than a binding offer to contract on those exact terms."
            ),
            p(
                "A specific engagement only becomes binding once both parties agree to a Statement of Work, proposal, or signed contract that sets out scope, timeline, fees, and any project-specific terms. Where an SOW conflicts with these general Terms, the SOW controls for that engagement, and these Terms fill any gaps it leaves open."
            ),
            p(
                "We reserve the right to decline any project inquiry at our discretion, including where a request falls outside our technical scope, raises legal or ethical concerns, or does not fit our current capacity."
            ),
        ],
    },
    {
        id: "acceptable-use",
        title: "5. Acceptable use of the website",
        blocks: [
            p("When using the Website, including the AI chat assistant, contact form, and careers application, you agree not to:"),
            list([
                "Use the Website for any unlawful purpose or in violation of any applicable local, national, or international law or regulation.",
                "Attempt to gain unauthorized access to our systems, probe for vulnerabilities, or interfere with the Website's normal operation, including through scraping, denial-of-service activity, or automated bulk requests.",
                "Submit false, misleading, or fraudulent information through any form, including the contact form or the careers application.",
                "Upload or transmit malicious code, or use the chat assistant to attempt prompt injection, extraction of internal system instructions, or generation of unlawful, deceptive, or harmful content.",
                "Reproduce, resell, or republish substantial portions of the Website's Content without our prior written consent.",
                "Use any information obtained from the Website to build a directly competing automated assistant or dataset without our consent.",
            ]),
            p(
                "We may suspend or restrict access to the Website, or to the chat assistant specifically, for anyone we reasonably believe is violating this section."
            ),
        ],
    },
    {
        id: "intellectual-property",
        title: "6. Intellectual property",
        blocks: [
            p(
                "Unless otherwise stated, the Website itself, including its design, layout, copy, graphics, and the Kinetiq name and marks, is owned by Kinetiq or used under license, and is protected by copyright and trademark law. You may view and share pages of the Website for personal, non-commercial reference, but you may not otherwise copy, modify, or distribute Content without our written permission."
            ),
            p(
                "For client engagements, ownership of Deliverables works as follows unless a Statement of Work states otherwise:"
            ),
            list([
                "Ownership of Deliverables created specifically for the Client transfers to the Client upon full and final payment for the engagement, or the relevant milestone, whichever the SOW specifies.",
                "Kinetiq retains ownership of any pre-existing tools, frameworks, internal libraries, methodologies, and general know-how used to build the Deliverables, and grants the Client a perpetual, royalty-free license to use them solely as embedded in the delivered work.",
                "Where a Deliverable incorporates open-source or third-party components, those components remain governed by their own licenses, which we will disclose to the Client on request.",
                "Until full payment is received, Kinetiq retains all rights in the Deliverables and may withhold source code, credentials, or hosting access.",
            ]),
        ],
    },
    {
        id: "payment",
        title: "7. Payment terms",
        blocks: [
            p(
                "Fees, currency, payment schedule, and invoicing details for a given engagement are set out in the applicable Statement of Work. In the absence of other terms, the following apply:"
            ),
            list([
                "New engagements typically require an upfront deposit before work begins, with the remaining balance billed against agreed milestones or on a recurring basis for retainer work.",
                "Invoices are due within fourteen (14) days of the invoice date unless the SOW states a different period.",
                "Late payments may accrue interest at 1.5% per month (or the maximum rate permitted by applicable law, if lower) and may result in suspension of ongoing work until the account is brought current.",
                "The Client is responsible for any bank transfer fees, currency conversion costs, and applicable taxes (including withholding tax, where applicable) associated with payment, unless the SOW says otherwise.",
                "Fees already paid for completed milestones are non-refundable, except where required by law or expressly agreed in writing.",
            ]),
        ],
    },
    {
        id: "confidentiality",
        title: "8. Confidentiality",
        blocks: [
            p(
                "In the course of an engagement, both Kinetiq and the Client may share confidential or proprietary information (business plans, credentials, source code, financial information, and similar material). Each party agrees to use the other's confidential information solely to perform its obligations under the engagement, to protect it with the same degree of care it uses for its own confidential information (and no less than a reasonable degree of care), and not to disclose it to third parties without consent, except to subcontractors or advisors bound by equivalent confidentiality obligations, or where disclosure is required by law."
            ),
            p(
                "This obligation survives the end of an engagement for a period of three (3) years, or indefinitely for information that qualifies as a trade secret under applicable law."
            ),
        ],
    },
    {
        id: "warranties",
        title: "9. Warranties and disclaimers",
        blocks: [
            p(
                "We perform Services using reasonable skill, care, and industry-standard practices, and we stand behind our work. That said, software is complex, and we cannot promise that any Deliverable, or the Website itself, will be completely free of defects, uninterrupted, or compatible with every environment. Any specific performance guarantees, uptime commitments, or acceptance criteria for a given engagement will be set out in that engagement's Statement of Work."
            ),
            p(
                "The Website, its Content, and the AI chat assistant are provided on an \"as is\" and \"as available\" basis. To the fullest extent permitted by law, we disclaim all implied warranties, including merchantability, fitness for a particular purpose, and non-infringement, except where such disclaimers are restricted by applicable consumer protection law."
            ),
            p(
                "Nothing on the Website, including anything generated by the AI chat assistant, constitutes legal, financial, medical, or professional advice. It is provided for general informational purposes only, and you should seek independent professional advice before acting on it."
            ),
        ],
    },
    {
        id: "liability",
        title: "10. Limitation of liability",
        blocks: [
            p(
                "To the fullest extent permitted by applicable law, Kinetiq's total aggregate liability arising out of or relating to a client engagement, whether in contract, tort, or otherwise, will not exceed the total fees actually paid by the Client to Kinetiq under that engagement in the twelve (12) months preceding the event giving rise to the claim."
            ),
            p(
                "Neither party will be liable to the other for indirect, incidental, special, consequential, or punitive damages, or for lost profits, lost revenue, or lost data, even if advised of the possibility of such damages."
            ),
            p(
                "These limitations do not apply to liability that cannot lawfully be limited or excluded, including liability for fraud, gross negligence, willful misconduct, or death or personal injury caused by negligence, and do not affect any statutory rights you may have as a consumer under the law of your home jurisdiction that cannot be waived by contract."
            ),
        ],
    },
    {
        id: "indemnification",
        title: "11. Indemnification",
        blocks: [
            p(
                "You agree to indemnify and hold Kinetiq harmless from claims, damages, and reasonable legal costs arising from your misuse of the Website, your violation of these Terms, or content or instructions you provide to us that infringe a third party's rights (for example, brand assets, copy, or data you ask us to incorporate into a Deliverable)."
            ),
            p(
                "Kinetiq will indemnify the Client against third-party claims that a Deliverable, as delivered by us and used within the scope agreed in the SOW, infringes that third party's intellectual property rights, subject to the liability cap in section 10 and provided the Client promptly notifies us of the claim and allows us to control its defense."
            ),
        ],
    },
    {
        id: "third-party-services",
        title: "12. Third-party services",
        blocks: [
            p(
                "The Website relies on a small number of third-party services to function: Cloudflare for hosting, security, and the infrastructure behind the AI chat assistant, Resend for delivering emails from our contact and careers forms, and Calendly for scheduling calls. Links to LinkedIn, Instagram, and other platforms are provided for convenience."
            ),
            p(
                "These third parties operate under their own terms and privacy practices, which we do not control. Your use of a third-party service linked from or embedded in the Website is governed by that provider's own terms, and we are not responsible for their acts, omissions, or availability."
            ),
        ],
    },
    {
        id: "ai-assistant",
        title: "13. The AI chat assistant",
        blocks: [
            p(
                "The Website includes an AI-powered chat assistant built on Cloudflare's AI infrastructure and grounded in our own published content. It is intended to help visitors quickly find information about Kinetiq, our services, and our past work."
            ),
            p(
                "The assistant can make mistakes, may occasionally answer based on incomplete context, and should not be treated as a binding quote, contractual commitment, or professional advice. Any project scope, pricing, or timeline discussed through the assistant is non-binding until confirmed in writing by a member of our team. Please avoid entering sensitive personal information (such as payment details, passwords, or government identification numbers) into the chat assistant."
            ),
        ],
    },
    {
        id: "termination",
        title: "14. Termination",
        blocks: [
            p(
                "We may suspend or terminate your access to the Website, without notice, if we reasonably believe you have violated these Terms."
            ),
            p(
                "Either party may terminate a client engagement in accordance with the termination provisions of the applicable Statement of Work. In the absence of specific termination terms, either party may terminate an ongoing engagement with thirty (30) days' written notice, in which case the Client will pay for all work performed and expenses reasonably incurred up to the effective date of termination, and Kinetiq will deliver work in progress in its current state."
            ),
        ],
    },
    {
        id: "force-majeure",
        title: "15. Force majeure",
        blocks: [
            p(
                "Neither party will be liable for any delay or failure to perform resulting from causes outside its reasonable control, including natural disasters, war, civil unrest, government action, internet or power outages, or failures of third-party infrastructure providers. The affected party will notify the other as soon as reasonably possible and resume performance once the underlying cause is resolved."
            ),
        ],
    },
    {
        id: "export-compliance",
        title: "16. Export and sanctions compliance",
        blocks: [
            p(
                "Because we work with clients across borders, both parties agree to comply with applicable export control and economic sanctions laws, including those of Pakistan, the United States, and the United Kingdom, and each party confirms it is not located in, or ordinarily resident in, a country or region subject to comprehensive sanctions, and is not on any restricted party list maintained by those jurisdictions."
            ),
        ],
    },
    {
        id: "governing-law",
        title: "17. Governing law and dispute resolution",
        blocks: [
            p(
                "These Terms, insofar as they govern use of the Website itself, are governed by the laws of the Islamic Republic of Pakistan, without regard to conflict-of-law principles, and the courts of Pakistan will have jurisdiction over disputes arising solely from Website use."
            ),
            p(
                "For client engagements, the governing law and dispute resolution mechanism (including any agreement to negotiate in good faith before pursuing arbitration or litigation) will be set out in the applicable Statement of Work, and the parties are free to agree on a neutral jurisdiction or an arbitration body such as the ICC where that better suits an international engagement. Where an SOW is silent on this point, the parties agree to first attempt to resolve any dispute through good-faith negotiation between senior representatives before pursuing formal proceedings."
            ),
        ],
    },
    {
        id: "changes",
        title: "18. Changes to these terms",
        blocks: [
            p(
                "We may update these Terms from time to time to reflect changes in our services, our practices, or applicable law. We will update the \"last updated\" date at the top of this page when we do, and for material changes we will make reasonable efforts to flag the update on the Website. Continued use of the Website after an update constitutes acceptance of the revised Terms; changes will not be applied retroactively to an already-signed Statement of Work without the Client's agreement."
            ),
        ],
    },
    {
        id: "general",
        title: "19. Severability and entire agreement",
        blocks: [
            p(
                "If any provision of these Terms is found unenforceable, that provision will be limited or removed to the minimum extent necessary, and the remaining provisions will stay in full force. These Terms, together with any applicable Statement of Work, constitute the entire agreement between you and Kinetiq regarding the subject matter here, and supersede any prior discussions on the same subject, except where a signed contract between the parties expressly states otherwise."
            ),
        ],
    },
    {
        id: "contact",
        title: "20. Contact us",
        blocks: [
            p(
                "Questions about these Terms are welcome. Reach us at info@thekinetiq.solutions and we will get back to you within one business day."
            ),
        ],
    },
];

/* ============================================================
   PRIVACY POLICY
   ============================================================ */

export const privacySections: LegalSection[] = [
    {
        id: "introduction",
        title: "1. Introduction and scope",
        blocks: [
            p(
                "This Privacy Policy explains what personal information Kinetiq collects through thekinetiq.solutions (the \"Website\"), why we collect it, how we use and share it, and the choices and rights you have. It applies to visitors, prospective clients, job applicants, and clients who interact with the Website, and it was written to reflect what the Website actually does, not a generic template."
            ),
            p(
                "We are a small studio, we do not sell personal information, and we try to collect only what we genuinely need to respond to you, evaluate an application, or deliver a project."
            ),
        ],
    },
    {
        id: "who-we-are",
        title: "2. Who we are",
        blocks: [
            p(
                "Kinetiq, operating out of Pakistan, is the entity responsible for deciding how and why your personal information is processed through the Website (in data protection terms, the \"controller\"). You can contact us about privacy matters at info@thekinetiq.solutions."
            ),
        ],
    },
    {
        id: "information-we-collect",
        title: "3. Information we collect",
        blocks: [
            p("We collect three broad categories of information."),
            p("Information you give us directly:"),
            list([
                "Contact form: your name, email address, project type, and message, submitted when you tell us about a project.",
                "Careers application: your name, email address, the role you are applying for, your cover letter, any additional information you choose to share, and your CV or resume file.",
                "Chat assistant: the messages you type into the AI chat widget, sent to generate a response.",
                "Call booking: when you book a call through our Calendly link, Calendly collects your name, email, and the details needed to schedule the meeting, on its own systems and under its own privacy policy.",
                "Any correspondence: information you include when you email us directly or message us on LinkedIn or Instagram.",
            ]),
            p("Information collected automatically:"),
            list([
                "Standard technical information such as your IP address, approximate location derived from it, browser and device type, operating system, referring page, and the pages you visit, collected through Cloudflare's hosting and security infrastructure as part of ordinary web server logging.",
            ]),
            p(
                "We do not currently run advertising trackers or third-party analytics scripts on the Website. If that changes, we will update this Policy and, where required, ask for your consent before doing so."
            ),
        ],
    },
    {
        id: "cookies",
        title: "4. Cookies",
        blocks: [
            p(
                "The Website currently uses only essential, functional mechanisms needed for it to work correctly (for example, remembering your preferences within a single browsing session). It does not set advertising or cross-site tracking cookies. If we introduce analytics or marketing cookies in the future, we will update this section and present a cookie choice where required by law, such as under the UK's e-privacy rules or the EU ePrivacy Directive."
            ),
            p(
                "Most browsers let you block or delete cookies through their settings. Blocking essential cookies may affect how parts of the Website function."
            ),
        ],
    },
    {
        id: "how-we-use",
        title: "5. How we use your information",
        blocks: [
            list([
                "To respond to inquiries submitted through the contact form and to scope, propose, and deliver client work.",
                "To review and respond to job applications submitted through the careers page.",
                "To operate, secure, and improve the Website, including diagnosing technical issues and preventing abuse.",
                "To generate responses through the AI chat assistant based on the message you send it.",
                "To meet legal, tax, accounting, and regulatory obligations, including keeping business records.",
                "To communicate with you about a project or application you have engaged with us on; we do not send marketing emails unless you have separately opted in.",
            ]),
        ],
    },
    {
        id: "legal-bases",
        title: "6. Legal bases for processing (UK/EU visitors)",
        blocks: [
            p(
                "For visitors in the United Kingdom or European Union, UK GDPR and EU GDPR require us to identify a legal basis for processing personal information. We rely on:"
            ),
            list([
                "Contract: to take steps you request before entering into a services engagement, and to perform that engagement once agreed.",
                "Legitimate interests: to respond to general inquiries, operate and secure the Website, and evaluate job applications, in each case in a way that does not override your own rights and interests.",
                "Consent: for the chat assistant (by choosing to type a message to it) and for any optional marketing communications, which you can withdraw at any time.",
                "Legal obligation: where we must retain or disclose information to comply with applicable law.",
            ]),
        ],
    },
    {
        id: "how-we-share",
        title: "7. How we share your information",
        blocks: [
            p(
                "We do not sell or rent your personal information. We share it only with the service providers that help us run the Website and deliver our Services, each acting on our instructions:"
            ),
            list([
                "Resend, which delivers the emails generated by our contact and careers forms to our inbox.",
                "Cloudflare, which hosts the Website, protects it from abuse, and powers the AI chat assistant.",
                "Calendly, if you choose to book a call, which then processes your booking details directly under its own privacy policy.",
            ]),
            p(
                "We may also disclose information where required by law, to protect our rights or the safety of others, or as part of a merger, acquisition, or sale of business assets, in which case we would notify you before your information becomes subject to a different privacy policy."
            ),
        ],
    },
    {
        id: "ai-assistant",
        title: "8. The AI chat assistant, specifically",
        blocks: [
            p(
                "When you send a message to the chat assistant, that message is passed to Cloudflare's AI infrastructure (Workers AI and AI Search) to retrieve relevant context from our own published material and generate a reply. We do not maintain a separate database of your chat transcripts beyond what Cloudflare's infrastructure itself logs as part of processing the request, and we do not use chat content to build advertising profiles."
            ),
            p(
                "Please do not share sensitive personal information, passwords, or payment details in the chat assistant. If you want to discuss something confidential, use the contact form or email us directly instead."
            ),
        ],
    },
    {
        id: "international-transfers",
        title: "9. International data transfers",
        blocks: [
            p(
                "Kinetiq operates out of Pakistan, and the service providers listed in section 7 operate global infrastructure, which means your information may be processed in countries other than the one you are visiting from, including the United States. Where we transfer personal information out of the United Kingdom or European Economic Area, we rely on the safeguards those providers make available, such as standard contractual clauses, and we choose providers with credible, published security and privacy commitments."
            ),
        ],
    },
    {
        id: "retention",
        title: "10. How long we keep your information",
        blocks: [
            list([
                "Contact form inquiries are retained for as long as reasonably necessary to respond to you and maintain a record of the business relationship, generally no more than 24 months from your last contact with us, unless a longer period is needed for legal or accounting reasons.",
                "Job applications, including CVs, are retained for up to 12 months after a hiring decision so we can consider you for future roles, unless you ask us to delete your application sooner, or unless you are hired, in which case your information moves into our employment records under different terms.",
                "Chat assistant conversations are not retained by us beyond what is needed to generate the response, aside from standard infrastructure logging by our hosting provider.",
            ]),
        ],
    },
    {
        id: "security",
        title: "11. How we protect your information",
        blocks: [
            p(
                "The Website is served entirely over HTTPS, and we rely on Cloudflare's security infrastructure to help protect against common web threats. Access to the email inbox and systems that receive form submissions is limited to the people at Kinetiq who need it to do their jobs. No method of transmission or storage is completely secure, and we cannot guarantee absolute security, but we take reasonable, industry-standard steps to protect your information."
            ),
        ],
    },
    {
        id: "your-rights",
        title: "12. Your privacy rights",
        blocks: [
            p("If you are in the United Kingdom or European Union, UK GDPR and EU GDPR give you the right to:"),
            list([
                "Ask us to confirm what personal information we hold about you and provide a copy of it.",
                "Ask us to correct inaccurate or incomplete information.",
                "Ask us to delete your information, subject to legal or legitimate business reasons for keeping it.",
                "Ask us to restrict or object to certain processing, including processing based on legitimate interests.",
                "Receive certain information in a portable format.",
                "Withdraw consent at any time where we rely on consent, without affecting processing that already took place.",
                "Lodge a complaint with the Information Commissioner's Office (ICO) or your local supervisory authority.",
            ]),
            p(
                "If you are in the United States, including California, we extend comparable rights to you as a matter of policy, whether or not our size brings us within the strict scope of state privacy laws such as the CCPA. You can ask us to tell you what we hold about you, correct it, or delete it, and we do not sell or share personal information for cross-context behavioral advertising, so there is no sale to opt out of."
            ),
            p(
                "Wherever you are located, you can exercise any of these rights, or ask a question about how your information is handled, by emailing info@thekinetiq.solutions. We will respond within a reasonable time, and in any event within the period required by applicable law."
            ),
        ],
    },
    {
        id: "children",
        title: "13. Children's privacy",
        blocks: [
            p(
                "The Website is intended for businesses and professional visitors, not children. We do not knowingly collect personal information from anyone under 16. If you believe a child has provided us with personal information, please contact us and we will delete it."
            ),
        ],
    },
    {
        id: "third-party-links",
        title: "14. Third-party links",
        blocks: [
            p(
                "The Website links to third-party platforms, including LinkedIn, Instagram, Calendly, and Gmail's compose interface. Once you leave our Website, that platform's own privacy policy applies, and we encourage you to review it."
            ),
        ],
    },
    {
        id: "changes",
        title: "15. Changes to this policy",
        blocks: [
            p(
                "We may update this Privacy Policy as our practices, our tools, or applicable law change. We will update the \"last updated\" date at the top of this page whenever we do, and for material changes, such as introducing analytics or a new category of data collection, we will make reasonable efforts to highlight the update on the Website."
            ),
        ],
    },
    {
        id: "contact",
        title: "16. Contact us",
        blocks: [
            p(
                "For anything relating to this Privacy Policy, including exercising your rights, email info@thekinetiq.solutions and we will get back to you within one business day."
            ),
        ],
    },
];
