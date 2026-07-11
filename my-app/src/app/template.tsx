import PageTransition from "@/components/motion/PageTransition";

/** Re-mounts per navigation → soft fade/slide on every route change. */
export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <PageTransition>
            {/* skip-link target (see Nav) */}
            <div id="main" tabIndex={-1} className="outline-none">
                {children}
            </div>
        </PageTransition>
    );
}
