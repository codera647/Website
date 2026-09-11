import Link from "next/link";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";
import ProjectImage from "@/components/sections/ProjectImage";
import { getProjectPresentation } from "@/data/projectPresentation";
import type { Project } from "@/lib/data";

export function WorkCard(project: Pick<Project, "slug" | "title" | "category" | "summary" | "tags" | "thumbnail">) {
    const presentation = getProjectPresentation(project);
    return (
        <Link href={`/work/${project.slug}`} className="card-hover group flex h-full flex-col border border-line bg-background">
            <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-surface">
                <ProjectImage src={presentation.image} alt={`${project.title} — ${presentation.imageLabel}`} sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" />
            </div>
            <div className="flex flex-1 flex-col p-6 md:p-7">
                <p className="eyebrow">{project.category}</p>
                <h3 className="mt-3 text-2xl font-semibold">{project.title}</h3>
                <p className="mt-4 flex-1 text-base leading-relaxed text-muted">{presentation.summary}</p>
                {presentation.capability && <p className="mt-5 border-l-2 border-accent pl-3 text-sm font-medium text-ink">{presentation.capability}</p>}
                <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.slice(0, 2).map((tag) => <span key={tag} className="border border-line px-2.5 py-1 text-xs text-muted">{tag}</span>)}
                </div>
                <span className="mt-6 flex items-center justify-between border-t border-line pt-4 font-heading text-base font-semibold">View case study <span aria-hidden="true" className="text-accent">↗</span></span>
            </div>
        </Link>
    );
}

export default function FeaturedWork({ projects }: { projects: Project[] }) {
    return (
        <section className="container-wide py-16 md:py-24">
            <FadeInWhenVisible>
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p className="eyebrow">Selected work</p>
                        <h2 className="mt-4 text-3xl font-bold md:text-5xl">See what we build.</h2>
                        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">Explore the interfaces, workflows, and engineering behind our projects.</p>
                    </div>
                    <Link href="/work" className="inline-flex min-h-11 items-center font-heading text-base font-semibold text-accent underline-offset-4 hover:underline">All work →</Link>
                </div>
            </FadeInWhenVisible>
            <StaggerList className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3" itemClassName="h-full" stagger={0.08}>
                {projects.map((project) => <WorkCard key={project.slug} {...project} />)}
            </StaggerList>
        </section>
    );
}
