"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ArrowLeft, Bold, Heading2, Heading3, ImagePlus, Italic, Link2, List, Loader2, Quote, Upload } from "lucide-react";
import { browserClient } from "@/lib/supabase/browser";
import { JOURNAL_CATEGORIES, readingTime, slugify, type Post } from "@/lib/journal";
import { Markdown } from "@/components/journal/Markdown";

type Form = Omit<Post, "id" | "updated_at">;

export default function EditArticle() {
  const { id } = useParams<{ id: string }>();
  const sb = browserClient();
  const router = useRouter();
  const body = useRef<HTMLTextAreaElement>(null);
  const [f, setF] = useState<Form | null>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"cover" | "inline" | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await sb.from("journal_posts").select("*").eq("id", id).maybeSingle();
      if (!data) return setMsg({ ok: false, text: "Article not found." });
      const { id: _i, updated_at: _u, ...rest } = data as Post; // eslint-disable-line @typescript-eslint/no-unused-vars
      setF(rest);
    })();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!f) return <p className="text-sm text-muted">{msg?.text ?? "Loading…"}</p>;

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => (p ? { ...p, [k]: v } : p));

  // Toolbar: wrap the selected text (or insert at the cursor)
  function wrap(before: string, after = "", placeholder = "text") {
    const el = body.current;
    if (!el || !f) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const selected = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + selected + after + value.slice(e);
    set("body", next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + before.length, s + before.length + selected.length); });
  }

  async function upload(e: ChangeEvent<HTMLInputElement>, kind: "cover" | "inline") {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !f) return;
    if (!file.type.startsWith("image/")) return setMsg({ ok: false, text: "Please choose an image file." });
    if (file.size > 8 * 1024 * 1024) return setMsg({ ok: false, text: "That image is over 8 MB. Please compress it first." });
    setUploading(kind);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `journal/${id}/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from("portfolio").upload(path, file, { contentType: file.type, cacheControl: "3600" });
    setUploading(null);
    if (error) return setMsg({ ok: false, text: error.message });
    const url = sb.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
    if (kind === "cover") set("cover_url", url);
    else wrap(`\n\n![`, `](${url})\n\n`, "Describe the image");
  }

  async function save() {
    if (!f) return;
    const slug = slugify(f.slug || f.title);
    if (!f.title.trim()) return setMsg({ ok: false, text: "Please add a title." });
    if (!slug) return setMsg({ ok: false, text: "Please add a web address (slug)." });
    setSaving(true); setMsg(null);
    const now = new Date().toISOString();
    const payload = {
      ...f, slug, title: f.title.trim(),
      published_at: f.published ? f.published_at ?? now : f.published_at,
      updated_at: now,
    };
    const { error } = await sb.from("journal_posts").update(payload).eq("id", id);
    setSaving(false);
    if (error) {
      return setMsg({ ok: false, text: error.message.includes("duplicate") ? "Another article already uses this web address. Please change the slug." : error.message });
    }
    setF({ ...f, slug, published_at: payload.published_at });
    setMsg({ ok: true, text: f.published ? "Saved and published. Live within 5 minutes." : "Draft saved." });
  }

  async function remove() {
    if (!confirm("Delete this article permanently?")) return;
    await sb.from("journal_posts").delete().eq("id", id);
    router.push("/admin/journal");
  }

  const input = "w-full rounded-sm border border-line bg-bg p-3 text-sm focus:border-royal focus:outline-none";
  const label = "mb-1 block text-sm font-medium";
  const tool = "grid size-9 place-items-center rounded-md text-muted hover:bg-surface hover:text-royal";

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/admin/journal" className="inline-flex items-center gap-1 text-sm text-muted hover:text-royal"><ArrowLeft size={14} /> All articles</Link>

      {msg && <p role={msg.ok ? "status" : "alert"} className={`text-sm ${msg.ok ? "text-royal dark:text-light-azure" : "text-red-600 dark:text-red-400"}`}>{msg.text}</p>}

      <input value={f.title} placeholder="Article title"
        onChange={(e) => { const t = e.target.value; set("title", t); if (f.slug.startsWith("untitled-")) set("slug", slugify(t) || f.slug); }}
        className="w-full border-0 bg-transparent font-display text-3xl font-bold focus:outline-none md:text-4xl" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="slug" className={label}>Web address</label>
          <div className="flex items-center rounded-sm border border-line bg-bg pl-3 text-sm focus-within:border-royal">
            <span className="text-muted">/journal/</span>
            <input id="slug" value={f.slug} onChange={(e) => set("slug", e.target.value)} className="w-full bg-transparent p-3 pl-1 focus:outline-none" />
          </div>
        </div>
        <div>
          <label htmlFor="cat" className={label}>Category</label>
          <select id="cat" value={f.category} onChange={(e) => set("category", e.target.value as Form["category"])} className={input}>
            {JOURNAL_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="excerpt" className={label}>Short summary (shown on the Journal page)</label>
        <textarea id="excerpt" rows={2} maxLength={220} value={f.excerpt ?? ""} onChange={(e) => set("excerpt", e.target.value)} className={input}
          placeholder="One or two sentences that make people want to read it." />
      </div>

      <div>
        <p className={label}>Cover image</p>
        <div className="flex flex-wrap items-center gap-4">
          {f.cover_url && <img src={f.cover_url} alt="" className="h-24 w-40 rounded-sm object-cover" />} {/* eslint-disable-line @next/next/no-img-element */}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-royal hover:text-royal">
            {uploading === "cover" ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} {f.cover_url ? "Replace cover" : "Upload cover"}
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => upload(e, "cover")} />
          </label>
          <span className="text-xs text-muted">Landscape works best, e.g. 1600 × 900 px.</span>
        </div>
      </div>

      <div className="rounded-sm border border-line">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line p-2">
          <div className="flex flex-wrap items-center gap-1" aria-label="Formatting">
            <button type="button" onClick={() => wrap("\n## ", "\n", "Heading")} className={tool} aria-label="Heading"><Heading2 size={16} /></button>
            <button type="button" onClick={() => wrap("\n### ", "\n", "Subheading")} className={tool} aria-label="Subheading"><Heading3 size={16} /></button>
            <button type="button" onClick={() => wrap("**", "**")} className={tool} aria-label="Bold"><Bold size={16} /></button>
            <button type="button" onClick={() => wrap("_", "_")} className={tool} aria-label="Italic"><Italic size={16} /></button>
            <button type="button" onClick={() => wrap("[", "](https://)", "link text")} className={tool} aria-label="Link"><Link2 size={16} /></button>
            <button type="button" onClick={() => wrap("\n- ", "", "List item")} className={tool} aria-label="Bullet list"><List size={16} /></button>
            <button type="button" onClick={() => wrap("\n> ", "\n", "Quote")} className={tool} aria-label="Quote"><Quote size={16} /></button>
            <label className={`${tool} cursor-pointer`} aria-label="Insert image">
              {uploading === "inline" ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => upload(e, "inline")} />
            </label>
          </div>
          <div className="flex rounded-full border border-line p-0.5 text-xs font-semibold">
            {(["write", "preview"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTab(t)} aria-pressed={tab === t}
                className="rounded-full px-3 py-1 capitalize transition aria-pressed:bg-royal aria-pressed:text-white">{t}</button>
            ))}
          </div>
        </div>
        {tab === "write" ? (
          <textarea ref={body} value={f.body} onChange={(e) => set("body", e.target.value)} rows={22}
            placeholder="Start writing… Use the toolbar for headings, bold text, links, lists, quotes and images."
            className="w-full resize-y bg-bg p-4 font-mono text-sm leading-relaxed focus:outline-none" />
        ) : (
          <div className="min-h-[24rem] p-6">{f.body.trim() ? <Markdown>{f.body}</Markdown> : <p className="text-sm text-muted">Nothing to preview yet.</p>}</div>
        )}
        <p className="border-t border-line px-4 py-2 text-xs text-muted">{readingTime(f.body)} min read</p>
      </div>

      <details className="rounded-sm border border-line p-4">
        <summary className="cursor-pointer text-sm font-medium">Google settings (optional)</summary>
        <div className="mt-4 space-y-4">
          <div><label htmlFor="seot" className={label}>SEO title</label>
            <input id="seot" value={f.seo_title ?? ""} onChange={(e) => set("seo_title", e.target.value)} className={input} placeholder="Defaults to the article title" /></div>
          <div><label htmlFor="seod" className={label}>SEO description</label>
            <textarea id="seod" rows={2} maxLength={170} value={f.seo_description ?? ""} onChange={(e) => set("seo_description", e.target.value)} className={input} placeholder="Defaults to the short summary" /></div>
        </div>
      </details>

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
        <label className="mr-auto flex items-center gap-3 text-sm font-medium">
          <input type="checkbox" checked={f.published} onChange={(e) => set("published", e.target.checked)} className="size-5 accent-royal" />
          Published
        </label>
        {f.published && <Link href={`/journal/${f.slug}`} target="_blank" className="text-sm text-royal hover:underline dark:text-light-azure">View live ↗</Link>}
        <button onClick={remove} className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-muted hover:border-red-600 hover:text-red-600">Delete</button>
        <button onClick={save} disabled={saving} className="rounded-full bg-royal px-8 py-2.5 text-sm font-medium text-white hover:bg-bright disabled:opacity-60">
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}