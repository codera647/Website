import FadeInWhenVisible from "@/components/motion/FadeInWhenVisible";
import StaggerList from "@/components/motion/StaggerList";
import ProfileCard from "@/components/team/ProfileCard";
import { team } from "@/data/team";

/**
 * The team, presented as React Bits–style tilting profile cards
 * (recolored to Kinetiq's monochrome ink/white palette — see
 * ProfileCard.tsx for the color mapping from the original component).
 */
export default function TeamSection() {
    return (
        <section id="team" className="scroll-mt-24 bg-ink">
            <div className="container-wide py-24 md:py-32">
                <FadeInWhenVisible>
                    <p className="font-heading text-xs font-medium uppercase tracking-[0.28em] text-white/45">
                        The people behind it
                    </p>
                    <h2 className="mt-4 max-w-2xl text-4xl font-bold text-white md:text-5xl">
                        Built by founders, not a sales deck.
                    </h2>
                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/60">
                        A small, hands-on team that stays close to every project — from the
                        first architecture sketch to production monitoring.
                    </p>
                </FadeInWhenVisible>

                <StaggerList
                    className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-8"
                    stagger={0.15}
                >
                    {team.map((member) => (
                        <ProfileCard
                            key={member.name}
                            name={member.name}
                            title={member.title}
                            avatarUrl={member.image}
                            contactUrl={member.contactUrl}
                            bio={member.bio}
                            className="mx-auto w-full max-w-[300px]"
                            behindGlowEnabled={false}
                        />
                    ))}
                </StaggerList>
            </div>
        </section>
    );
}
