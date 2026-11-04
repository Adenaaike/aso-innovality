import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedProjects } from "@/lib/projects";
import { WorkGallery } from "@/components/work/WorkGallery";
import { designHub, webHub, aiHub } from "@/lib/hubs";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Work — Brand Identity, Design, Web & Automation Portfolio",
  description: "Brand identity, campaigns, carousels, photo manipulation, websites and automation by Adenaike Sodiq Olusegun (ASO INNOVALITY), a creative designer and studio in Lagos, Nigeria.",
  alternates: { canonical: "/work" },
};

const TABS: { key: string; label: string; cats: string[] | null }[] = [
  { key: "all", label: "All work", cats: null },
  { key: "design", label: "Design", cats: designHub.categories },
  { key: "web", label: "Web & SEO", cats: webHub.categories },
  { key: "ai", label: "AI & Automation", cats: aiHub.categories },
];

export default async function Work({ searchParams }: { searchParams: Promise<{ practice?: string }> }) {
  const { practice = "all" } = await searchParams;
  const projects = await getPublishedProjects();

  const inTab = (cats: string[] | null) =>
    cats ? projects.filter((p) => p.category && cats.includes(p.category.name)) : projects;

  // Only show practice tabs that have projects (plus "All work")
  const tabs = TABS.map((t) => ({ ...t, count: inTab(t.cats).length })).filter((t) => t.key === "all" || t.count > 0);
  const active = tabs.find((t) => t.key === practice) ?? tabs[0];
  const shown = inTab(active.cats);

  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">SELECTED WORK</p>
      <h1 className="mt-4 max-w-3xl font-display text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.05]">
        Brand identities, campaigns and carousels, <span className="aso-text-gradient">and now websites and automations.</span>
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        Real projects for organisations, ministries and businesses in Nigeria, Belgium and beyond, across my three practices.
      </p>

      {tabs.length > 1 && (
        <nav aria-label="Filter by practice" className="mt-10 flex flex-wrap gap-2">
          {tabs.map((t) => {
            const on = t.key === active.key;
            return (
              <Link key={t.key} href={t.key === "all" ? "/work" : `/work?practice=${t.key}`} scroll={false}
                aria-current={on ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${on ? "border-royal bg-royal text-white" : "border-line hover:border-royal hover:text-royal"}`}>
                {t.label}
                <span className={`rounded-full px-1.5 text-xs ${on ? "bg-white/20" : "bg-surface text-muted"}`}>{t.count}</span>
              </Link>
            );
          })}
        </nav>
      )}

      <div className="mt-8"><WorkGallery key={active.key} projects={shown} /></div>
    </div>
  );
}