import Marquee from "@/components/motion/Marquee";

const items = [
    "AI Automation",
    "Web Development",
    "Generative AI",
    "Agentic Systems",
    "RAG Pipelines",
    "Cloud-Native",
];

export default function MarqueeBand() {
    return (
        <section aria-hidden="true" className="border-y border-line bg-surface py-6">
            <Marquee duration={28}>
                {items.map((item) => (
                    <span
                        key={item}
                        className="mx-10 flex items-center font-heading text-3xl font-semibold tracking-tight text-ink-soft md:text-4xl"
                    >
                        {item}
                        <span className="ml-10 text-lg text-muted">✦</span>
                    </span>
                ))}
            </Marquee>
        </section>
    );
}
