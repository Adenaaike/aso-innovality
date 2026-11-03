"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { browserClient } from "@/lib/supabase/browser";

type Stats = { projects: number; published: number; newEnquiries: number; enquiries: number };

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const sb = browserClient();
      const head = { count: "exact" as const, head: true };
      const [p, pub, all, fresh] = await Promise.all([
        sb.from("projects").select("*", head),
        sb.from("projects").select("*", head).eq("published", true),
        sb.from("enquiries").select("*", head),
        sb.from("enquiries").select("*", head).eq("status", "new"),
      ]);
      if (p.error || all.error) { setError("Couldn’t load stats. Try refreshing."); return; }
      setStats({ projects: p.count ?? 0, published: pub.count ?? 0, enquiries: all.count ?? 0, newEnquiries: fresh.count ?? 0 });
    })();
  }, []);

  const card = "rounded-sm border border-line bg-surface p-6";

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold">Overview</h1>
      {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={card}><p className="text-xs uppercase tracking-wider text-muted">Projects</p><p className="mt-2 font-display text-3xl font-bold">{stats?.projects ?? "…"}</p></div>
        <div className={card}><p className="text-xs uppercase tracking-wider text-muted">Published</p><p className="mt-2 font-display text-3xl font-bold">{stats?.published ?? "…"}</p></div>
        <div className={card}><p className="text-xs uppercase tracking-wider text-muted">All enquiries</p><p className="mt-2 font-display text-3xl font-bold">{stats?.enquiries ?? "…"}</p></div>
        <Link href="/admin/enquiries" className={`${card} group transition hover:border-royal`}>
          <p className="flex items-center justify-between text-xs uppercase tracking-wider text-muted">New enquiries <ArrowUpRight size={14} className="group-hover:text-royal" /></p>
          <p className="mt-2 font-display text-3xl font-bold text-royal dark:text-light-azure">{stats?.newEnquiries ?? "…"}</p>
        </Link>
      </div>
    </div>
  );
}