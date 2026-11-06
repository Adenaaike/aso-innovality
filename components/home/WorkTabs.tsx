"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export type WorkItem = {
  slug: string; title: string; year: number | null; cover_url: string | null;
  category: string | null; practice: "design" | "web" | "ai";
};

const TABS = [
  { key: "all", label: "All", accent: "design" },
  { key: "design", label: "Design", accent: "design" },
  { key: "web", label: "Web & SEO", accent: "web" },
  { key: "ai", label: "AI & Automation", accent: "ai" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

export function WorkTabs({ items }: { items: WorkItem[] }) {
  const [tab, setTab] = useState<TabKey>("all");
  const count = (k: TabKey) => (k === "all" ? items.length : items.filter((p) => p.practice === k).length);
  const shown = tab === "all" ? items : items.filter((p) => p.practice === tab);

  return (
    <div>
      <div role="tablist" aria-label="Filter projects by practice" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}
            className={`accent-${t.accent} inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
              tab === t.key ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-on)]" : "border-line hover:border-[var(--accent)]"}`}>
            {t.label}
            <span className={`rounded-full px-1.5 text-xs ${tab === t.key ? "bg-black/15" : "bg-surface text-muted"}`}>{count(t.key)}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} className="mt-8">
          {shown.length ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {shown.map((p) => (
                <Link key={p.slug} href={`/work/${p.slug}`} data-cursor="View project" className={`accent-${p.practice} group block`}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface">
                    {p.cover_url ? (
                      <Image src={p.cover_url} alt={p.title} fill sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                        className="object-cover object-top transition duration-500 group-hover:scale-[1.04]" />
                    ) : <div className="absolute inset-0 aso-gradient opacity-40" />}
                    <span className="absolute top-3 left-3 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-on)]">
                      {p.practice === "design" ? "Design" : p.practice === "web" ? "Web" : "AI"}
                    </span>
                  </div>
                  <h3 className="mt-2.5 truncate font-display text-sm font-semibold transition group-hover:text-[var(--accent-text)]">{p.title}</h3>
                  <p className="mt-0.5 text-xs text-muted">{[p.category, p.year].filter(Boolean).join(" · ")}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className={`accent-${tab === "all" ? "design" : tab} rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] p-8 text-center`}>
              <p className="font-display text-lg font-semibold">
                {tab === "ai" ? "First automation case studies are on the way." : "New projects are on the way."}
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                {tab === "ai" ? "Meanwhile, see how much time automation could save your business." : "Meanwhile, explore the rest of my work."}
              </p>
              <Link href={tab === "ai" ? "/playground#time-saved" : "/work"}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-on)] hover:brightness-110">
                {tab === "ai" ? "Try the Time-Saved Calculator" : "View all work"} <ArrowUpRight size={15} />
              </Link>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}