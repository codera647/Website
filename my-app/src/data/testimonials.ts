/**
 * Client trust content (brief §4 Home, two-layer social proof).
 * The two full testimonials are REAL. ⚠️ Marquee snippets marked
 * [TODO] are placeholders until more client quotes exist.
 */

export interface Testimonial {
    quote: string;
    name: string;
    role: string;
    company: string;
}

export const testimonials: Testimonial[] = [
    {
        quote:
            "Working with KINETIQ was a smooth and reassuring experience. They clearly understood our vision and translated it into a clean, easy-to-use website for students and teachers. The platform runs reliably, and the team was responsive throughout the development process.",
        name: "Hammad Sarwar",
        role: "Founder",
        company: "Learn Quran Global",
    },
    {
        quote:
            "KINETIQ developed a custom desktop application for our jewelry business to manage khata records efficiently. The system simplified our daily operations and reduced manual errors. The software is practical, stable, and has made record-keeping much easier for our team.",
        name: "Qaisar Abbas",
        role: "Owner",
        company: "Records",
    },
];

/** short snippets for the fast marquee ticker */
export const testimonialSnippets: string[] = [
    "“Smooth and reassuring experience” — Learn Quran Global",
    "“Simplified our daily operations” — Records",
    "“Responsive throughout the process” — Learn Quran Global",
    "“Practical, stable software” — Records",
    "“Attention to detail and quality” — Learn Quran Global",
];

/** grayscale logo wall — TODO(user): real client logos */
export const clientNames: string[] = [
    "Learn Quran Global",
    "Records",
    "Client 3 [TODO]",
    "Client 4 [TODO]",
];
