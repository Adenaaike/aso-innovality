"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, ImageOff } from "lucide-react";
import { browserClient } from "@/lib/supabase/browser";

type Row = {
  id: string; title: string; slug: string; year: number | null; published: boolean; featured: boolean;
  cover_url: string | null; sort_order: number; category: { name: string } | null;
};

export default function AdminProjects() {
  const sb = browserClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    const { data, error } = await sb.from("projects")
      .select("id, title, slug, year, published, featured, cover_url, sort_order, category:categories(name)")
      .order("sort_order").order("created_at", { ascending: false });
    if (error) setError("Couldn’t load projects. Try refreshing.");
    else setRows(data as unknown as Row[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function toggle(row: Row, field: "published" | "featured") {
    const value = !row[field];
    setRows((l) => l.map((r) => (r.id === row.id ? { ...r, [field]: value } : r)));
    const { error } = await sb.from("projects").update({ [field]: value }).eq("id", row.id);
    if (error) {
      setRows((l) => l.map((r) => (r.id === row.id ? { ...r, [field]: !value } : r)));
      setError("Couldn’t update the project. Please try again.");
    }
  }

  async function remove(row: Row) {
    if (!confirm(`Delete “${row.title}” and all its images? This can’t be undone.`)) return;
    const folder = `projects/${row.id}`;
    const { data: files } = await sb.storage.from("portfolio").list(folder, { limit: 1000 });
    if (files?.length) await sb.storage.from("portfolio").remove(files.map((f) => `${folder}/${f.name}`));
    const { error } = await sb.from("projects").delete().eq("id", row.id);
    if (error) setError("Couldn’t delete the project. Please try again.");
    else setRows((l) => l.filter((r) => r.id !== row.id));
  }

  const chip = "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">Projects</h1>
        <Link href="/admin/projects/new" className="inline-flex items-center gap-2 rounded-full bg-royal px-5 py-2.5 text-sm font-medium text-white hover:bg-bright">
          <Plus size={16} /> New project
        </Link>
      </div>

      {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {loading && <p className="text-sm text-muted">Loading…</p>}
      {!loading && rows.length === 0 && (
        <p className="rounded-sm border border-dashed border-line p-8 text-center text-sm text-muted">No projects yet. Click “New project” to add your first one.</p>
      )}

      <ul className="divide-y divide-line rounded-sm border border-line">
        {rows.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center gap-4 p-4">
            <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-sm bg-surface">
              {r.cover_url
                ? <img src={r.cover_url} alt="" className="size-full object-cover" /> // eslint-disable-line @next/next/no-img-element
                : <ImageOff size={18} className="text-muted" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display font-semibold">{r.title}</p>
              <p className="text-xs text-muted">{[r.category?.name, r.year].filter(Boolean).join(" · ") || "No category"} · /work/{r.slug}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => toggle(r, "published")} aria-pressed={r.published}
                className={`${chip} ${r.published ? "border-royal bg-royal text-white" : "border-line text-muted hover:border-royal"}`}>
                {r.published ? <Eye size={14} /> : <EyeOff size={14} />} {r.published ? "Published" : "Draft"}
              </button>
              <button onClick={() => toggle(r, "featured")} aria-pressed={r.featured}
                className={`${chip} ${r.featured ? "border-royal text-royal dark:text-light-azure" : "border-line text-muted hover:border-royal"}`}>
                <Star size={14} fill={r.featured ? "currentColor" : "none"} /> Featured
              </button>
              <Link href={`/admin/projects/${r.id}`} className={`${chip} border-line hover:border-royal hover:text-royal`}><Pencil size={14} /> Edit</Link>
              <button onClick={() => remove(r)} aria-label={`Delete ${r.title}`}
                className={`${chip} border-line text-muted hover:border-red-500 hover:text-red-600`}><Trash2 size={14} /></button>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted">The homepage shows up to 4 projects that are both <strong>Published</strong> and <strong>Featured</strong>, ordered by “Sort order”.</p>
    </div>
  );
}