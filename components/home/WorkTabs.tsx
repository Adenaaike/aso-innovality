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
  { key: "all", label: "All", accent: null },
  { key: "design", label: "Design", accent: "design" },
  { key: "web", label: "Web & SEO", accent: "web" },
  { key: "ai", label: "AI & Automation", accent: "ai" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const LABEL = { design: "Design", web: "Web & SEO", ai: "AI & Automation" } as const;

export function WorkTabs({ items }: { items: WorkItem[] }) {
  const [tab, setTab] = useState<TabKey>("all");
  const count = (k: TabKey) => (k === "all" ? items.length : items.filter((p) => p.practice === k).length);
  const shown = tab === "all" ? items : items.filter((p) => p.practice === tab);

  return (
    <div>
      <div role="tablist" aria-label="Filter projects by practice" className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const on = tab === t.key;
          return (
            <button key={t.key} type="button" role="tab" aria-selected={on} onClick={() => setTab(t.key)}
              className={`${t.accent ? `accent-${t.accent}` : ""} inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                on ? "border-fg bg-fg text-bg" : "border-line hover:border-fg/40"}`}>
              {t.accent && <span aria-hidden className="size-2 rounded-full bg-[var(--accent)]" />}
              {t.label}
              <span className={`grid min-w-6 place-items-center rounded-full px-1.5 text-xs ${on ? "bg-bg/15" : "bg-surface text-muted"}`}>{count(t.key)}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} className="mt-8">
          {shown.length ? (
            <div className="grid grid-flow-dense grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {shown.map((p) => {
                const wide = p.practice !== "design"; // websites & automations are landscape
                return (
                  <Link key={p.slug} href={`/work/${p.slug}`} data-cursor="View project"
                    className={`accent-${p.practice} glow-card group relative block overflow-hidden rounded-xl border border-line bg-surface ${
                      wide ? "col-span-2 aspect-[8/5]" : "aspect-[4/5]"}`}>
                    {p.cover_url ? (
                      <Image src={p.cover_url} alt="" fill
                        sizes={wide ? "(min-width:1024px) 50vw, (min-width:768px) 66vw, 100vw" : "(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"}
                        className="object-cover object-top transition duration-700 group-hover:scale-[1.04]" />
                    ) : <div className="absolute inset-0 aso-gradient opacity-40" />}

                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-4 text-white md:p-5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-navy/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                        <span aria-hidden className="size-1.5 rounded-full bg-[var(--accent-light)]" />
                        {LABEL[p.practice]}
                      </span>
                      <h3 className={`mt-2 font-display font-bold leading-tight ${wide ? "text-lg md:text-2xl" : "text-sm md:text-base"}`}>{p.title}</h3>
                      <p className="mt-0.5 text-xs text-ice/80">{[p.category, p.year].filter(Boolean).join(" · ")}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className={`accent-${tab === "all" ? "design" : tab} rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] p-8 text-center`}>
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