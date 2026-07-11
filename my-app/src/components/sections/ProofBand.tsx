import Counter from "@/components/motion/Counter";
import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";

/** ⚠️ TODO(user): replace with real figures (brief §10). */
const stats = [
    { to: 12, suffix: "+", label: "projects shipped" },
    { to: 8, suffix: "+", label: "years combined experience" },
    { to: 6, suffix: "", label: "industries served" },
];

export default function ProofBand() {
    return (
        <section className="bg-surface">
            <FadeInWhenVisible>
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 text-center sm:grid-cols-3 md:py-20">
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <Counter
                                to={stat.to}
                                suffix={stat.suffix}
                                className="font-heading text-5xl font-bold md:text-6xl"
                            />
                            <p className="mt-2 text-sm uppercase tracking-[0.14em] text-muted">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </FadeInWhenVisible>
        </section>
    );
}
