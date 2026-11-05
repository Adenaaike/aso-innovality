"use client";
import { useEffect, useState, type ChangeEvent } from "react";
import { FileText, ImageOff, Loader2, Upload } from "lucide-react";
import { browserClient } from "@/lib/supabase/browser";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/settings";

type FileField = "cvUrl" | "portraitHome" | "portraitAbout";

export default function AdminSettings() {
  const sb = browserClient();
  const [s, setS] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<FileField | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await sb.from("site_settings").select("value").eq("key", "site").maybeSingle();
      if (data?.value) setS({ ...DEFAULT_SETTINGS, ...(data.value as Partial<SiteSettings>) });
      setLoading(false);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setS((p) => ({ ...p, [k]: v }));

  async function save(next: SiteSettings = s) {
    if (!/^\d{8,15}$/.test(next.whatsappNumber)) {
      setMsg({ ok: false, text: "WhatsApp number should be digits only, with the country code (e.g. 2348106458863)." });
      return;
    }
    setSaving(true); setMsg(null);
    const { error } = await sb.from("site_settings").upsert({ key: "site", value: next });
    setSaving(false);
    setMsg(error ? { ok: false, text: "Couldn’t save. Please try again." } : { ok: true, text: "Saved. The live site updates within 5 minutes." });
  }

  async function upload(e: ChangeEvent<HTMLInputElement>, field: FileField, kind: "pdf" | "image") {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (kind === "pdf" && file.type !== "application/pdf") return setMsg({ ok: false, text: "Please choose a PDF file." });
    if (kind === "image" && !file.type.startsWith("image/")) return setMsg({ ok: false, text: "Please choose an image file." });
    if (file.size > 8 * 1024 * 1024) return setMsg({ ok: false, text: "That file is over 8 MB. Please compress it first." });

    setUploading(field); setMsg(null);
    const ext = file.name.split(".").pop()?.toLowerCase() || (kind === "pdf" ? "pdf" : "jpg");
    const path = `site/${field}-${Date.now()}.${ext}`;
    const { error } = await sb.storage.from("portfolio").upload(path, file, { contentType: file.type, cacheControl: "3600" });
    if (error) { setUploading(null); return setMsg({ ok: false, text: error.message }); }
    const url = sb.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
    const next = { ...s, [field]: url };
    setS(next);
    setUploading(null);
    await save(next);
  }

  if (loading) return <p className="text-sm text-muted">Loading…</p>;

  const input = "w-full rounded-sm border border-line bg-bg p-3 text-sm focus:border-royal focus:outline-none";
  const label = "mb-1 block text-sm font-medium";
  const card = "space-y-5 rounded-sm border border-line p-6";
  const fileBtn = "inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-royal hover:text-royal";

  const portrait = (field: "portraitHome" | "portraitAbout", title: string) => (
    <div className="space-y-3">
      <p className="text-sm font-medium">{title}</p>
      <div className="grid aspect-[4/5] w-40 place-items-center overflow-hidden rounded-sm bg-surface">
        {s[field]
          ? <img src={s[field]} alt={title} className="size-full object-cover" /> // eslint-disable-line @next/next/no-img-element
          : <ImageOff size={20} className="text-muted" />}
      </div>
      <label className={fileBtn}>
        {uploading === field ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} Replace photo
        <input type="file" accept="image/*" className="sr-only" disabled={!!uploading} onChange={(e) => upload(e, field, "image")} />
      </label>
    </div>
  );

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="font-display text-3xl font-bold">Site settings</h1>
      {msg && <p role={msg.ok ? "status" : "alert"} className={`text-sm ${msg.ok ? "text-royal dark:text-light-azure" : "text-red-600 dark:text-red-400"}`}>{msg.text}</p>}

      <section className={card}>
        <h2 className="font-display text-lg font-semibold">Availability</h2>
        <label className="flex items-center gap-3 text-sm font-medium">
          <input type="checkbox" checked={s.available} onChange={(e) => set("available", e.target.checked)} className="size-5 accent-royal" />
          Show “Available for projects” on the homepage
        </label>
        <div>
          <label htmlFor="note" className={label}>Message when unavailable (optional)</label>
          <input id="note" value={s.availabilityNote} onChange={(e) => set("availabilityNote", e.target.value)}
            className={input} placeholder="e.g. Booked until January" maxLength={40} />
          <p className="mt-1 text-xs text-muted">Leave empty to show “Currently booked”.</p>
        </div>
      </section>

      <section className={card}>
        <h2 className="font-display text-lg font-semibold">Contact details</h2>
        <div><label htmlFor="email" className={label}>Email</label>
          <input id="email" type="email" value={s.email} onChange={(e) => set("email", e.target.value)} className={input} /></div>
        <div><label htmlFor="phone" className={label}>Phone (as displayed)</label>
          <input id="phone" value={s.phoneDisplay} onChange={(e) => set("phoneDisplay", e.target.value)} className={input} placeholder="+234 810 645 8863" /></div>
        <div><label htmlFor="wa" className={label}>WhatsApp number</label>
          <input id="wa" inputMode="numeric" value={s.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value.replace(/\D/g, ""))} className={input} />
          <p className="mt-1 text-xs text-muted">Digits only, including the country code, e.g. 2348106458863.</p></div>
      </section>

      <section className={card}>
          <h2 className="font-display text-lg font-semibold">Cost estimator</h2>
          <div>
            <label htmlFor="rate" className={label}>Naira exchange rate (₦ per $1)</label>
            <input id="rate" type="number" min={0} step="any" value={s.ngnRate || ""} onChange={(e) => set("ngnRate", Number(e.target.value) || 0)}
              className={input} placeholder="Enter today’s rate" />
            <p className="mt-1 text-xs text-muted">Used to show ₦ prices on the calculators. Leave empty to show USD only. Update it when the rate changes.</p>
          </div>
        </section>
        <section className={card}>
        <h2 className="font-display text-lg font-semibold">Working hours (Lagos time)</h2>
        <div className="flex flex-wrap gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
            <label key={d} className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm">
              <input type="checkbox" className="accent-royal" checked={s.workDays.includes(i)}
                onChange={(e) => set("workDays", e.target.checked ? [...s.workDays, i].sort() : s.workDays.filter((x) => x !== i))} />
              {d}
            </label>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ws" className={label}>Start time</label>
            <input id="ws" type="time" value={s.workStart} onChange={(e) => set("workStart", e.target.value)} className={input} />
          </div>
          <div>
            <label htmlFor="we" className={label}>End time</label>
            <input id="we" type="time" value={s.workEnd} onChange={(e) => set("workEnd", e.target.value)} className={input} />
          </div>
        </div>
        <p className="text-xs text-muted">Powers the live status card on the homepage and contact page (“In the studio now” or “Offline now”).</p>
      </section>
      <button onClick={() => save()} disabled={saving} className="rounded-full bg-royal px-8 py-3 text-sm font-medium text-white hover:bg-bright disabled:opacity-60">
        {saving ? "Saving…" : "Save changes"}
      </button>

      <section className={card}>
        <h2 className="font-display text-lg font-semibold">CV</h2>
        <a href={s.cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-royal hover:underline dark:text-light-azure">
          <FileText size={16} /> View current CV
        </a>
        <div>
          <label className={fileBtn}>
            {uploading === "cvUrl" ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} Upload new CV (PDF)
            <input type="file" accept="application/pdf" className="sr-only" disabled={!!uploading} onChange={(e) => upload(e, "cvUrl", "pdf")} />
          </label>
          <p className="mt-2 text-xs text-muted">Uploads save automatically. The About page’s “Download CV” buttons will use the new file.</p>
        </div>
      </section>

      <section className={card}>
        <h2 className="font-display text-lg font-semibold">Portraits</h2>
        <div className="flex flex-wrap gap-10">
          {portrait("portraitHome", "Homepage portrait")}
          {portrait("portraitAbout", "About page portrait")}
        </div>
        <p className="text-xs text-muted">Portrait shape (4:5) works best, e.g. 1200 × 1500 px. Uploads save automatically.</p>
      </section>
    </div>
  );
}