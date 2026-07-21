export interface TeamMember {
    name: string;
    title: string;
    image: string;
    contactUrl?: string;
    bio?: string;
}

export const team: TeamMember[] = [
    {
        name: "Abdul Moiz",
        title: "CEO & CTO",
        image: "/team/abdul-moiz-2.png",
        contactUrl: "#contact",
        bio: "I build what others blueprint. Full-stack engineer and cloud architect who co-founded Kinetiq to turn ambitious ideas into production-grade software. I lead every technical decision because founders who ship their own code build better companies.",
    },
    {
        name: "Hammad Sarwar",
        title: "COO & CMO",
        image: "/team/hammad-sarwar.png",
        contactUrl: "#contact",
        bio: "I turn vision into velocity. Operations, growth, and brand — I keep Kinetiq lean and every deliverable landing on time. I thrive where business meets creativity, building partnerships that move the needle and marketing that earns trust.",
    },
];
