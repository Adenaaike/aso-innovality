"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { browserClient } from "@/lib/supabase/browser";
import { categoryLabel, readingTime, type Post } from "@/lib/journal";

export default function AdminJournal() {
  const sb = browserClient();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await sb.from("journal_posts").select("*").order("updated_at", { ascending: false });
      if (error) setMsg("Couldn’t load articles. Did you run the SQL?");
      setPosts((data ?? []) as Post[]);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function create() {
    const slug = `untitled-${Date.now().toString(36)}`;
    const { data, error } = await sb.from("journal_posts").insert({ title: "Untitled article", slug }).select("id").single();
    if (error || !data) return setMsg("Couldn’t create the article. Please try again.");
    router.push(`/admin/journal/${data.id}`);
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Journal</h1>
          <p className="mt-2 text-sm text-muted">Write, edit and publish articles. Drafts are only visible here.</p>
        </div>
        <button onClick={create} className="inline-flex items-center gap-2 rounded-full bg-royal px-5 py-2.5 text-sm font-medium text-white hover:bg-bright">
          <Plus size={16} /> New article
        </button>
      </div>

      {msg && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{msg}</p>}
      {posts === null && <p className="text-sm text-muted">Loading…</p>}
      {posts?.length === 0 && (
        <p className="rounded-sm border border-dashed border-line p-10 text-center text-sm text-muted">No articles yet. Click “New article” to write your first one.</p>
      )}

      <ul className="divide-y divide-line rounded-sm border border-line">
        {posts?.map((p) => (
          <li key={p.id} className="flex items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{p.title}</p>
              <p className="mt-0.5 text-xs text-muted">
                {categoryLabel(p.category)} · {readingTime(p.body)} min read · {new Date(p.updated_at).toLocaleDateString("en-GB")}
              </p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${p.published ? "bg-royal/10 text-royal dark:text-light-azure" : "bg-surface text-muted"}`}>
              {p.published ? "Published" : "Draft"}
            </span>
            <Link href={`/admin/journal/${p.id}`} aria-label={`Edit ${p.title}`} className="grid size-9 place-items-center rounded-full text-muted hover:text-royal">
              <Pencil size={16} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}