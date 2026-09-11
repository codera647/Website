/** Plain-language summaries of existing case studies, without invented performance metrics. */
const presentations: Record<string, { summary: string; capability: string; image?: string; imageLabel: string }> = {
    synapse: { summary: "Turn document libraries into a research assistant with answers you can trace back to their sources.", capability: "Source-linked answers with inline figures and citations", image: "/thumbnails/synapse.png", imageLabel: "website preview" },
    "learn-quran-global": { summary: "An online learning platform that brings students, teachers, and class scheduling together.", capability: "Student and teacher workflows in one platform", image: "/learn-quran-global/main_mockup.png", imageLabel: "website preview" },
    records: { summary: "A desktop application that makes customer balances and daily khata record-keeping easier to manage.", capability: "Automatic balances and transaction reporting", image: "/records/1.png", imageLabel: "application interface" },
    "product-recommendation-engine": { summary: "Match customers with relevant products using purchase patterns and semantic search.", capability: "Personalized recommendations through a two-stage pipeline", imageLabel: "pipeline diagram" },
    "resume-shortlisting-platform": { summary: "Organize and compare large batches of resumes against a role’s requirements for human review.", capability: "Ranked candidate profiles with spreadsheet exports", imageLabel: "pipeline diagram" },
};

export function getProjectPresentation(project: { slug: string; summary: string; thumbnail: string }) {
    const entry = presentations[project.slug];
    return {
        summary: entry?.summary ?? project.summary,
        capability: entry?.capability,
        image: entry?.image ?? project.thumbnail,
        imageLabel: entry?.imageLabel ?? "project visual",
    };
}
