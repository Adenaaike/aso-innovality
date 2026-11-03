"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowUp, ArrowDown, Upload, Trash2, Loader2, ImageOff, Plus, X } from "lucide-react";
import { browserClient } from "@/lib/supabase/browser";

type Category = { id: string; name: string };
type Img = { id: string; url: string; alt: string; caption: string | null; kind: string; sort_order: number };
type Swatch = { name: string; hex: string };
type Exec = { label: string; text: string };
type Form = {
  title: string; slug: string; client: string; year: string; category_id: string;
  role: string; location: string; industry: string; duration: string; summary: string;
  overview: string; challenge: string; concept: string; process: string; outcome: string;
  deliverables: string; services: string; tags: string;
  palette: Swatch[]; execution: Exec[];
  seo_title: string; seo_description: string;
  cover_url: string; featured: boolean; published: boolean; sort_order: string;
};

const EMPTY: Form = {
  title: "", slug: "", client: "", year: "", category_id: "", role: "", location: "", industry: "", duration: "",
  summary: "", overview: "", challenge: "", concept: "", process: "", outcome: "", deliverables: "", services: "",
  tags: "", palette: [], execution: [], seo_title: "", seo_description: "", cover_url: "",
  featured: false, published: false, sort_order: "0",
};
const KINDS = ["full", "mockup", "detail", "before", "after"];
const MAX_MB = 8;
const HEX = /^#[0-9a-fA-F]{6}$/;
const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const storagePath = (url: string) => url.split("/object/public/portfolio/")[1];

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-5 rounded-sm border border-line p-5">
      <legend className="px-2 font-display text-sm font-bold uppercase tracking-wider">{title}</legend>
      {hint && <p className="-mt-2 text-xs text-muted">{hint}</p>}
      {children}
    </fieldset>
  );
}

export default function EditProject() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const router = useRouter();
  const sb = browserClient();

  const [form, setForm] = useState<Form>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [cats, setCats] = useState<Category[]>([]);
  const [images, setImages] = useState<Img[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { data: c } = await sb.from("categories").select("id, name").order("sort_order");
      setCats(c ?? []);
      if (isNew) return;
      const { data: p } = await sb.from("projects").select("*").eq("id", id).maybeSingle();
      if (!p) { setMsg({ ok: false, text: "Project not found." }); setLoading(false); return; }
      setForm({
        title: p.title ?? "", slug: p.slug ?? "", client: p.client ?? "", year: p.year ? String(p.year) : "",
        category_id: p.category_id ?? "", role: p.role ?? "", location: p.location ?? "", industry: p.industry ?? "",
        duration: p.duration ?? "", summary: p.summary ?? "", overview: p.overview ?? "", challenge: p.challenge ?? "",
        concept: p.concept ?? "", process: p.process ?? "", outcome: p.outcome ?? "",
        deliverables: (p.deliverables ?? []).join("\n"), services: (p.services ?? []).join("\n"), tags: (p.tags ?? []).join(", "),
        palette: Array.isArray(p.palette) ? p.palette : [], execution: Array.isArray(p.execution) ? p.execution : [],
        seo_title: p.seo_title ?? "", seo_description: p.seo_description ?? "",
        cover_url: p.cover_url ?? "", featured: !!p.featured, published: !!p.published, sort_order: String(p.sort_order ?? 0),
      });
      setSlugTouched(true);
      const { data: imgs } = await sb.from("project_images").select("*").eq("project_id", id).order("sort_order");
      setImages((imgs as Img[]) ?? []);
      setLoading(false);
    })();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const fail = (err: unknown) => setMsg({ ok: false, text: err instanceof Error ? err.message : "Something went wrong." });

  async function save(e: FormEvent) {
    e.preventDefault(); setMsg(null);
    const slug = slugify(form.slug || form.title);
    const year = form.year ? Number(form.year) : null;
    if (!form.title.trim()) return setMsg({ ok: false, text: "Please add a title." });
    if (!slug) return setMsg({ ok: false, text: "Please add a URL slug using letters or numbers." });
    if (year !== null && (!Number.isInteger(year) || year < 1990 || year > 2100)) return setMsg({ ok: false, text: "Year should look like 2024." });
    const badHex = form.palette.find((s) => !HEX.test(s.hex));
    if (badHex) return setMsg({ ok: false, text: `“${badHex.hex}” isn’t a valid colour. Use the format #1177FF.` });

    const t = (s: string) => s.trim() || null;
    const row = {
      title: form.title.trim(), slug, client: t(form.client), year, category_id: form.category_id || null,
      role: t(form.role), location: t(form.location), industry: t(form.industry), duration: t(form.duration),
      summary: t(form.summary), overview: t(form.overview), challenge: t(form.challenge), concept: t(form.concept),
      process: t(form.process), outcome: t(form.outcome),
      deliverables: lines(form.deliverables), services: lines(form.services),
      tags: form.tags.split(",").map((x) => x.trim()).filter(Boolean),
      palette: form.palette.map((s) => ({ name: s.name.trim(), hex: s.hex.toUpperCase() })),
      execution: form.execution.map((x) => ({ label: x.label.trim(), text: x.text.trim() })).filter((x) => x.label || x.text),
      seo_title: t(form.seo_title), seo_description: t(form.seo_description),
      featured: form.featured, published: form.published, sort_order: Number(form.sort_order) || 0,
      updated_at: new Date().toISOString(),
    };

    setSaving(true);
    const res = isNew
      ? await sb.from("projects").insert(row).select("id").single()
      : await sb.from("projects").update(row).eq("id", id).select("id").single();
    setSaving(false);
    if (res.error) {
      setMsg({ ok: false, text: res.error.code === "23505" ? "Another project already uses that URL slug. Please change it." : res.error.message });
      return;
    }
    if (isNew) { router.replace(`/admin/projects/${res.data.id}`); return; }
    setForm((f) => ({ ...f, slug }));
    setMsg({ ok: true, text: "Saved." });
  }

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) throw new Error(`“${file.name}” isn’t an image.`);
    if (file.size > MAX_MB * 1024 * 1024) throw new Error(`“${file.name}” is over ${MAX_MB} MB. Please compress it first.`);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `projects/${id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await sb.storage.from("portfolio").upload(path, file, { cacheControl: "31536000", contentType: file.type });
    if (error) throw new Error(error.message);
    return sb.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
  }

  async function onCover(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file) return;
    setUploading(true); setMsg(null);
    try {
      const url = await upload(file);
      const { error } = await sb.from("projects").update({ cover_url: url }).eq("id", id);
      if (error) throw new Error(error.message);
      set("cover_url", url);
      setMsg({ ok: true, text: "Cover image updated." });
    } catch (err) { fail(err); } finally { setUploading(false); }
  }

  async function onGallery(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []); e.target.value = "";
    if (!files.length) return;
    setUploading(true); setMsg(null);
    try {
      let order = images.length ? Math.max(...images.map((i) => i.sort_order)) + 1 : 0;
      for (const file of files) {
        const url = await upload(file);
        const { data, error } = await sb.from("project_images")
          .insert({ project_id: id, url, alt: form.title, caption: null, kind: "full", sort_order: order++ }).select("*").single();
        if (error) throw new Error(error.message);
        setImages((l) => [...l, data as Img]);
      }
      setMsg({ ok: true, text: `${files.length} image${files.length > 1 ? "s" : ""} added.` });
    } catch (err) { fail(err); } finally { setUploading(false); }
  }

  const patchLocal = (imgId: string, patch: Partial<Img>) => setImages((l) => l.map((i) => (i.id === imgId ? { ...i, ...patch } : i)));

  async function saveImage(imgId: string, patch: Partial<Img>) {
    const { error } = await sb.from("project_images").update(patch).eq("id", imgId);
    if (error) fail(new Error("Couldn’t update the image."));
  }

  async function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[index], next[j]] = [next[j], next[index]];
    const renumbered = next.map((img, pos) => ({ ...img, sort_order: pos }));
    const changed = renumbered.filter((img) => images.find((o) => o.id === img.id)?.sort_order !== img.sort_order);
    setImages(renumbered);
    const results = await Promise.all(changed.map((img) => sb.from("project_images").update({ sort_order: img.sort_order }).eq("id", img.id)));
    if (results.some((r) => r.error)) fail(new Error("Couldn’t reorder the images."));
  }

  async function removeImage(img: Img) {
    if (!confirm("Delete this image?")) return;
    const path = storagePath(img.url);
    if (path) await sb.storage.from("portfolio").remove([path]);
    const { error } = await sb.from("project_images").delete().eq("id", img.id);
    if (error) return fail(new Error("Couldn’t delete the image."));
    setImages((l) => l.filter((i) => i.id !== img.id));
  }

  async function makeCover(img: Img) {
    const { error } = await sb.from("projects").update({ cover_url: img.url }).eq("id", id);
    if (error) return fail(new Error("Couldn’t set the cover."));
    set("cover_url", img.url);
    setMsg({ ok: true, text: "Cover image updated." });
  }

  if (loading) return <p className="text-sm text-muted">Loading…</p>;

  const input = "w-full rounded-sm border border-line bg-bg p-3 text-sm focus:border-royal focus:outline-none";
  const label = "mb-1 block text-sm font-medium";
  const small = "inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:border-royal hover:text-royal";
  const fileBtn = "inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-royal hover:text-royal";

  const text = (k: "client" | "role" | "location" | "industry" | "duration", title: string, placeholder = "") => (
    <div><label htmlFor={k} className={label}>{title}</label>
      <input id={k} value={form[k]} onChange={(e) => set(k, e.target.value)} className={input} placeholder={placeholder} /></div>
  );
  const area = (k: "summary" | "overview" | "challenge" | "concept" | "process" | "outcome", title: string, hint: string, rows = 4) => (
    <div><label htmlFor={k} className={label}>{title}</label>
      <textarea id={k} rows={rows} value={form[k]} onChange={(e) => set(k, e.target.value)} className={input} placeholder={hint} /></div>
  );

  return (
    <div className="space-y-8">
      <Link href="/admin/projects" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-royal"><ArrowLeft size={14} /> All projects</Link>
      <h1 className="font-display text-3xl font-bold">{isNew ? "New project" : form.title || "Edit project"}</h1>
      {msg && <p role={msg.ok ? "status" : "alert"} className={`text-sm ${msg.ok ? "text-royal dark:text-light-azure" : "text-red-600 dark:text-red-400"}`}>{msg.text}</p>}

      <form onSubmit={save} className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <Section title="Basics">
            <div><label htmlFor="title" className={label}>Title *</label>
              <input id="title" value={form.title} className={input}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: slugTouched ? f.slug : slugify(e.target.value) }))} /></div>
            <div><label htmlFor="slug" className={label}>URL slug</label>
              <div className="flex items-center rounded-sm border border-line bg-bg focus-within:border-royal">
                <span className="pl-3 text-sm text-muted">/work/</span>
                <input id="slug" value={form.slug} className="w-full bg-transparent p-3 pl-1 text-sm focus:outline-none"
                  onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} />
              </div></div>
            <div className="grid gap-5 sm:grid-cols-2">
              {text("client", "Client / organisation")}
              {text("role", "My role", "e.g. Lead Brand & Identity Designer")}
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div><label htmlFor="year" className={label}>Year</label>
                <input id="year" inputMode="numeric" value={form.year} onChange={(e) => set("year", e.target.value)} className={input} placeholder="2024" /></div>
              {text("duration", "Duration", "e.g. 2025–2026")}
              <div><label htmlFor="cat" className={label}>Category</label>
                <select id="cat" value={form.category_id} onChange={(e) => set("category_id", e.target.value)} className={input}>
                  <option value="">Choose…</option>
                  {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select></div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {text("location", "Location", "e.g. Lagos, Nigeria")}
              {text("industry", "Industry")}
            </div>
            {area("summary", "One-line summary", "Shown under the project on the homepage and Work page.", 2)}
          </Section>

          <Section title="Case study">
            {area("overview", "Background & context", "Who is the client and what was the situation?")}
            {area("challenge", "The challenge", "What problem needed solving?")}
            {area("concept", "Creative strategy", "How did the idea take shape?")}

            <div className="space-y-3">
              <p className={label}>Design execution</p>
              {form.execution.map((x, i) => (
                <div key={i} className="space-y-2 rounded-sm border border-line p-3">
                  <div className="flex gap-2">
                    <input aria-label="Point title" value={x.label} placeholder="e.g. Typography" className={input}
                      onChange={(e) => set("execution", form.execution.map((y, j) => (j === i ? { ...y, label: e.target.value } : y)))} />
                    <button type="button" onClick={() => set("execution", form.execution.filter((_, j) => j !== i))}
                      aria-label="Remove point" className="grid size-11 shrink-0 place-items-center rounded-sm border border-line text-muted hover:text-red-600"><X size={16} /></button>
                  </div>
                  <textarea aria-label="Point description" rows={3} value={x.text} className={input}
                    onChange={(e) => set("execution", form.execution.map((y, j) => (j === i ? { ...y, text: e.target.value } : y)))} />
                </div>
              ))}
              <button type="button" onClick={() => set("execution", [...form.execution, { label: "", text: "" }])} className={small}>
                <Plus size={14} /> Add a point
              </button>
            </div>

            {area("outcome", "Final solution", "What did the client end up with?")}
            {area("process", "Extra process notes (optional)", "Sketches, iterations, decisions…", 3)}
            <div><label htmlFor="deliv" className={label}>Final deliverables</label>
              <textarea id="deliv" rows={4} value={form.deliverables} onChange={(e) => set("deliverables", e.target.value)}
                className={input} placeholder={"One per line, e.g.\nLogo suite\nBrand guidelines"} /></div>
          </Section>

          <Section title="Details">
            <div><label htmlFor="services" className={label}>Services provided</label>
              <textarea id="services" rows={4} value={form.services} onChange={(e) => set("services", e.target.value)} className={input} placeholder="One per line" /></div>
            <div><label htmlFor="tags" className={label}>Tags</label>
              <input id="tags" value={form.tags} onChange={(e) => set("tags", e.target.value)} className={input} placeholder="Comma separated, e.g. Logo Design, Print" /></div>

            <div className="space-y-3">
              <p className={label}>Client colour palette</p>
              {form.palette.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="color" aria-label="Pick colour" value={HEX.test(s.hex) ? s.hex : "#000000"}
                    onChange={(e) => set("palette", form.palette.map((y, j) => (j === i ? { ...y, hex: e.target.value.toUpperCase() } : y)))}
                    className="size-11 shrink-0 cursor-pointer rounded-sm border border-line bg-transparent" />
                  <input aria-label="Colour name" value={s.name} placeholder="Name" className={input}
                    onChange={(e) => set("palette", form.palette.map((y, j) => (j === i ? { ...y, name: e.target.value } : y)))} />
                  <input aria-label="Hex code" value={s.hex} className={`${input} max-w-32 font-mono`}
                    onChange={(e) => set("palette", form.palette.map((y, j) => (j === i ? { ...y, hex: e.target.value } : y)))} />
                  <button type="button" onClick={() => set("palette", form.palette.filter((_, j) => j !== i))}
                    aria-label="Remove colour" className="grid size-11 shrink-0 place-items-center rounded-sm border border-line text-muted hover:text-red-600"><X size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={() => set("palette", [...form.palette, { name: "", hex: "#1177FF" }])} className={small}>
                <Plus size={14} /> Add a colour
              </button>
            </div>
          </Section>

          <Section title="Search (SEO)" hint="How this project appears on Google. Leave empty to use the title and summary.">
            <div><label htmlFor="seot" className={label}>Search title <span className="text-xs text-muted">({form.seo_title.length}/60)</span></label>
              <input id="seot" value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} className={input} /></div>
            <div><label htmlFor="seod" className={label}>Search description <span className="text-xs text-muted">({form.seo_description.length}/155)</span></label>
              <textarea id="seod" rows={3} value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} className={input} /></div>
          </Section>
        </div>

        <aside className="space-y-5 lg:col-span-4">
          <div className="space-y-4 rounded-sm border border-line bg-surface p-5 lg:sticky lg:top-24">
            <label className="flex items-center gap-3 text-sm font-medium">
              <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="size-4 accent-royal" />
              Published (visible on the site)
            </label>
            <label className="flex items-center gap-3 text-sm font-medium">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="size-4 accent-royal" />
              Featured on homepage
            </label>
            <div><label htmlFor="order" className={label}>Sort order</label>
              <input id="order" type="number" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} className={input} />
              <p className="mt-1 text-xs text-muted">Lower numbers appear first.</p></div>
            <button disabled={saving} className="w-full rounded-full bg-royal px-6 py-3 text-sm font-medium text-white hover:bg-bright disabled:opacity-60">
              {saving ? "Saving…" : isNew ? "Create project" : "Save changes"}
            </button>

            {!isNew && (
              <div className="space-y-3 border-t border-line pt-4">
                <p className="text-sm font-medium">Cover image</p>
                <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-sm bg-bg">
                  {form.cover_url
                    ? <img src={form.cover_url} alt="Cover" className="size-full object-contain" /> // eslint-disable-line @next/next/no-img-element
                    : <ImageOff size={22} className="text-muted" />}
                </div>
                <label className={fileBtn}>
                  <Upload size={16} /> {form.cover_url ? "Replace cover" : "Upload cover"}
                  <input type="file" accept="image/*" className="sr-only" onChange={onCover} disabled={uploading} />
                </label>
                <p className="text-xs text-muted">Tip: upload everything to the gallery, then use “Set as cover”.</p>
              </div>
            )}
          </div>
        </aside>
      </form>

      {isNew ? (
        <p className="rounded-sm border border-dashed border-line p-6 text-center text-sm text-muted">
          Create the project first, then you can upload its cover and gallery images.
        </p>
      ) : (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold">Gallery</h2>
            <label className={fileBtn}>
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} Add images
              <input type="file" accept="image/*" multiple className="sr-only" onChange={onGallery} disabled={uploading} />
            </label>
          </div>
          {images.length === 0 && <p className="text-sm text-muted">No gallery images yet. They’ll appear on the case-study page in this order.</p>}
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img, i) => (
              <li key={img.id} className="space-y-3 rounded-sm border border-line bg-surface p-3">
                <div className="relative">
                  <img src={img.url} alt={img.alt} className="aspect-[4/3] w-full rounded-sm bg-bg object-contain" /> {/* eslint-disable-line @next/next/no-img-element */}
                  <span className="absolute top-2 left-2 rounded-full bg-navy/80 px-2 py-0.5 text-xs font-medium text-white">{i + 1}</span>
                </div>
                <div>
                  <label htmlFor={`alt-${img.id}`} className="mb-1 block text-xs font-medium text-muted">Alt text (describe the image)</label>
                  <input id={`alt-${img.id}`} value={img.alt} className={input}
                    onChange={(e) => patchLocal(img.id, { alt: e.target.value })}
                    onBlur={(e) => saveImage(img.id, { alt: e.target.value })} />
                </div>
                <div>
                  <label htmlFor={`cap-${img.id}`} className="mb-1 block text-xs font-medium text-muted">Caption (shown under the image)</label>
                  <textarea id={`cap-${img.id}`} rows={2} value={img.caption ?? ""} className={input}
                    onChange={(e) => patchLocal(img.id, { caption: e.target.value })}
                    onBlur={(e) => saveImage(img.id, { caption: e.target.value.trim() || null })} />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor={`kind-${img.id}`} className="sr-only">Image type</label>
                  <select id={`kind-${img.id}`} value={img.kind} className="rounded-full border border-line bg-bg px-3 py-1.5 text-xs capitalize"
                    onChange={(e) => { patchLocal(img.id, { kind: e.target.value }); saveImage(img.id, { kind: e.target.value }); }}>
                    {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                  <button type="button" onClick={() => makeCover(img)} disabled={form.cover_url === img.url}
                    className="rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:border-royal disabled:opacity-50">
                    {form.cover_url === img.url ? "Cover" : "Set as cover"}
                  </button>
                  <div className="ml-auto flex gap-1">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"
                      className="grid size-8 place-items-center rounded-full text-muted hover:text-royal disabled:opacity-30"><ArrowUp size={14} /></button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} aria-label="Move down"
                      className="grid size-8 place-items-center rounded-full text-muted hover:text-royal disabled:opacity-30"><ArrowDown size={14} /></button>
                    <button type="button" onClick={() => removeImage(img)} aria-label="Delete image"
                      className="grid size-8 place-items-center rounded-full text-muted hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}