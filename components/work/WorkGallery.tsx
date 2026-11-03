"use client";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { ProjectCard } from "@/lib/projects";
import { ProjectTile } from "@/components/work/ProjectTile";

export function WorkGallery({ projects }: { projects: ProjectCard[] }) {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  const cats = useMemo(() => {
    const m = new Map<string, string>();
    projects.forEach((p) => p.category && m.set(p.category.slug, p.category.name));
    return [...m].map(([slug, name]) => ({ slug, name, count: projects.filter((p) => p.category?.slug === slug).length }));
  }, [projects]);

  const term = q.trim().toLowerCase();
  const shown = projects.filter((p) =>
    (cat === "all" || p.category?.slug === cat) &&
    (!term || [p.title, p.summary, p.overview, p.category?.name].join(" ").toLowerCase().includes(term)));

  const chip = "rounded-full border border-line px-4 py-1.5 text-xs font-medium transition hover:border-royal aria-pressed:border-royal aria-pressed:bg-royal aria-pressed:text-white";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          <button onClick={() => setCat("all")} aria-pressed={cat === "all"} className={chip}>
            All <span className="opacity-60">{projects.length}</span>
          </button>
          {cats.map((c) => (
            <button key={c.slug} onClick={() => setCat(c.slug)} aria-pressed={cat === c.slug} className={chip}>
              {c.name} <span className="opacity-60">{c.count}</span>
            </button>
          ))}
        </div>
        <label className="relative w-full sm:w-64">
          <span className="sr-only">Search projects</span>
          <Search size={15} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects"
            className="w-full rounded-full border border-line bg-bg py-2 pr-9 pl-9 text-sm focus:border-royal focus:outline-none" />
          {q && (
            <button type="button" onClick={() => setQ("")} aria-label="Clear search"
              className="absolute top-1/2 right-2.5 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-fg">
              <X size={14} />
            </button>
          )}
        </label>
      </div>

      <p aria-live="polite" className="sr-only">{shown.length} projects shown</p>

      {shown.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line p-10 text-center text-sm text-muted">
          No projects match that. Try another category or search term.
        </p>
      ) : (
        <div key={cat} className="columns-2 gap-4 animate-[fadeUp_.45s_ease] md:columns-3 lg:columns-4 [&>*]:mb-4">
          {shown.map((p, i) => <ProjectTile key={p.slug} p={p} eager={i < 4} />)}
        </div>
      )}
    </div>
  );
}