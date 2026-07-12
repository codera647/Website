/**
 * Careers content. No roles are open right now — `roles` is
 * intentionally empty. The careers page renders a "not hiring right
 * now" state for an empty array rather than a blank page, so this is
 * safe to ship as-is. TODO(user): add real Role entries here whenever
 * a position opens.
 */

export interface Role {
    slug: string;
    title: string;
    department: string;
    location: string;
    type: "Full-time" | "Part-time" | "Contract" | "Internship";
    summary: string;
    responsibilities: string[];
    requirements: string[];
    niceToHave?: string[];
    /** e.g. "2026-07" */
    postedDate: string;
}

export const roles: Role[] = [];
