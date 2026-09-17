"use client";

import { useEffect, useState } from "react";

/** Native hash links keep both server-rendered pricing sections available without JavaScript. */
export default function PricingSystemSelector() {
  const [selected, setSelected] = useState("momentum");
  useEffect(() => {
    const sync = () =>
      setSelected(
        window.location.hash.startsWith("#stratum") ? "stratum" : "momentum",
      );
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  return (
    <nav
      aria-label="Choose a pricing system"
      className="mt-8 grid w-full max-w-xl grid-cols-2 border border-line bg-surface p-1"
    >
      {[
        { id: "momentum", label: "Momentum Systems" },
        { id: "stratum", label: "Stratum Systems" },
      ].map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={() => setSelected(id)}
          aria-current={selected === id ? "location" : undefined}
          className={`flex min-h-12 items-center justify-center px-3 py-3 text-center font-heading text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${selected === id ? "bg-ink text-background" : "text-muted hover:bg-background hover:text-ink"}`}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
