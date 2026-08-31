"use client";

import { useEffect, useState } from "react";
import { Button, ErrorBanner, Field, Input } from "@/components/admin/AdminForm";
import AdminTable from "@/components/admin/AdminTable";
import type { SearchAnalyticsResult, SearchQueryMetric } from "@/lib/gsc";

export default function AdminSeoPage() {
    const [loading, setLoading] = useState(true);
    const [clientEmail, setClientEmail] = useState<string | null>(null);
    const [analytics, setAnalytics] = useState<SearchAnalyticsResult | null>(null);
    const [indexUrl, setIndexUrl] = useState("https://thekinetiq.solutions");
    const [indexingStatus, setIndexingStatus] = useState<string | null>(null);
    const [indexingError, setIndexingError] = useState<string | null>(null);
    const [indexingPending, setIndexingPending] = useState(false);

    function load() {
        setLoading(true);
        fetch("/api/admin/seo?days=28")
            .then((res) => res.json() as Promise<{ ok: boolean; clientEmail?: string; analytics?: SearchAnalyticsResult }>)
            .then((data) => {
                setClientEmail(data.clientEmail || null);
                setAnalytics(data.analytics || null);
            })
            .finally(() => setLoading(false));
    }

    useEffect(load, []);

    async function handleRequestIndexing(e: React.FormEvent) {
        e.preventDefault();
        if (!indexUrl.trim() || indexingPending) return;

        setIndexingPending(true);
        setIndexingStatus(null);
        setIndexingError(null);

        try {
            const res = await fetch("/api/admin/seo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: indexUrl.trim() }),
            });
            const data = (await res.json()) as { ok: boolean; message?: string; error?: string };

            if (!res.ok || !data.ok) {
                setIndexingError(data.error ?? "Failed to request indexing.");
            } else {
                setIndexingStatus(data.message ?? "Successfully requested Google indexing.");
            }
        } catch {
            setIndexingError("Could not connect to indexing endpoint.");
        } finally {
            setIndexingPending(false);
        }
    }

    const totals = analytics?.totals;
    const queries = analytics?.queries || [];
    const pages = analytics?.pages || [];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="font-heading text-2xl font-bold text-white">SEO &amp; Google Search Console</h1>
                <p className="mt-1 text-sm text-white/50">
                    Live Google organic search analytics, rankings, and automated Google Indexing API controls.
                </p>
            </div>

            {/* Connection Status Banner */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="relative flex size-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 duration-1000" />
                            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
                        </span>
                        <div>
                            <p className="font-heading text-xs font-bold text-white">
                                Google Search Console API: Configured &amp; Active
                            </p>
                            <p className="text-xs text-white/50">
                                Service Account: <code className="text-white/80 font-mono">{clientEmail || "kinetiq-gsc-bot@..."}</code>
                            </p>
                        </div>
                    </div>
                    <div className="text-xs text-white/60">
                        <span>Property: </span>
                        <code className="text-white/90 font-mono">sc-domain:thekinetiq.solutions</code>
                    </div>
                </div>
            </div>

            {/* Instant Google Indexing Request Tool */}
            <div className="rounded-xl border border-white/15 bg-white/[0.04] p-6 shadow-sm">
                <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                    ⚡ Instant Google URL Indexing Tool
                </h2>
                <p className="mt-1 text-xs text-white/60">
                    Submit any page directly to Google&apos;s Web Search Indexing queue for rapid crawl priority.
                </p>

                <form onSubmit={handleRequestIndexing} className="mt-4 flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <Input
                            value={indexUrl}
                            onChange={(e) => setIndexUrl(e.target.value)}
                            placeholder="https://thekinetiq.solutions/blog/example-post"
                            required
                        />
                    </div>
                    <Button type="submit" disabled={indexingPending}>
                        {indexingPending ? "Pinging Google…" : "Request Google Crawl / Index →"}
                    </Button>
                </form>

                {indexingStatus && (
                    <div className="mt-3 border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                        ✓ {indexingStatus}
                    </div>
                )}
                {indexingError && (
                    <div className="mt-3 border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                        ✕ {indexingError}
                    </div>
                )}
            </div>

            {/* Performance KPIs */}
            <div>
                <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-white/70">
                    28-Day Google Search Performance
                </h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-4">
                    <div className="border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-3xl font-bold text-white">
                            {loading ? "…" : totals?.clicks ?? 0}
                        </p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                            Total Clicks
                        </p>
                    </div>
                    <div className="border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-3xl font-bold text-white">
                            {loading ? "…" : totals?.impressions ?? 0}
                        </p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                            Total Impressions
                        </p>
                    </div>
                    <div className="border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-3xl font-bold text-white">
                            {loading ? "…" : `${(totals?.avgCtr ?? 0).toFixed(1)}%`}
                        </p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                            Average CTR
                        </p>
                    </div>
                    <div className="border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-3xl font-bold text-white">
                            {loading ? "…" : (totals?.avgPosition ?? 0).toFixed(1)}
                        </p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                            Average Position
                        </p>
                    </div>
                </div>
            </div>

            {/* Top Search Queries */}
            <div>
                <div className="flex items-center justify-between">
                    <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-white/70">
                        Top Ranking Search Queries
                    </h2>
                </div>

                <div className="mt-4">
                    <AdminTable
                        rows={queries}
                        rowKey={(q) => q.keys.join("-")}
                        emptyMessage={
                            loading
                                ? "Fetching Search Console queries…"
                                : queries.length === 0
                                ? "No search queries recorded yet in this 28-day window."
                                : "No queries found."
                        }
                        columns={[
                            {
                                header: "Search Keyword / Query",
                                render: (q) => <span className="font-medium text-white">{q.keys[0]}</span>,
                            },
                            {
                                header: "Clicks",
                                render: (q) => <span className="text-white/80">{q.clicks}</span>,
                            },
                            {
                                header: "Impressions",
                                render: (q) => <span className="text-white/80">{q.impressions}</span>,
                            },
                            {
                                header: "CTR",
                                render: (q) => <span className="text-white/60">{(q.ctr * 100).toFixed(1)}%</span>,
                            },
                            {
                                header: "Avg Position",
                                render: (q) => (
                                    <span className="font-mono text-xs text-white/90">
                                        #{q.position.toFixed(1)}
                                    </span>
                                ),
                            },
                        ]}
                    />
                </div>
            </div>

            {/* Top Landing Pages */}
            {pages.length > 0 && (
                <div>
                    <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-white/70">
                        Top Performing Pages
                    </h2>

                    <div className="mt-4">
                        <AdminTable
                            rows={pages}
                            rowKey={(p) => p.keys.join("-")}
                            emptyMessage="No pages recorded."
                            columns={[
                                {
                                    header: "Page URL",
                                    render: (p) => (
                                        <a
                                            href={p.keys[0]}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-mono text-xs text-white/80 hover:text-white hover:underline"
                                        >
                                            {p.keys[0]}
                                        </a>
                                    ),
                                },
                                {
                                    header: "Clicks",
                                    render: (p) => <span className="text-white/80">{p.clicks}</span>,
                                },
                                {
                                    header: "Impressions",
                                    render: (p) => <span className="text-white/80">{p.impressions}</span>,
                                },
                                {
                                    header: "CTR",
                                    render: (p) => <span className="text-white/60">{(p.ctr * 100).toFixed(1)}%</span>,
                                },
                                {
                                    header: "Avg Position",
                                    render: (p) => <span className="font-mono text-xs text-white/90">#{p.position.toFixed(1)}</span>,
                                },
                            ]}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

