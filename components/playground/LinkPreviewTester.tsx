"use client";
import Link from "next/link";
import { useState, type ChangeEvent } from "react";
import { AlertTriangle, ArrowUpRight, Check, CheckCircle2, Copy, ImagePlus } from "lucide-react";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const cut = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

export function LinkPreviewTester() {
  const [title, setTitle] = useState("Brand Identity Design in Lagos | Your Studio");
  const [desc, setDesc] = useState("Distinctive logos and brand identities for growing businesses in Nigeria and worldwide. Get an instant estimate in 60 seconds.");
  const [url, setUrl] = useState("https://yourbrand.com/services");
  const [site, setSite] = useState("Your Brand");
  const [keyword, setKeyword] = useState("brand identity");
  const [img, setImg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  let host = "yourbrand.com";
  let crumbs: string[] = [];
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    host = u.hostname.replace(/^www\./, "");
    crumbs = u.pathname.split("/").filter(Boolean);
  } catch {}

  const kw = keyword.trim().toLowerCase();
  const checks = [
    { ok: title.length >= 30 && title.length <= 60, text: `Title is ${title.length} characters (aim for 30–60)` },
    { ok: desc.length >= 70 && desc.length <= 160, text: `Description is ${desc.length} characters (aim for 70–160)` },
    { ok: !!kw && title.toLowerCase().includes(kw), text: kw ? `Main keyword “${keyword}” appears in the title` : "Add a main keyword to check" },
    { ok: !!kw && desc.toLowerCase().includes(kw), text: "Main keyword appears in the description" },
    { ok: !!img, text: "A share image is set (1200 × 630 px recommended)" },
  ];
  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);

  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:site_name" content="${esc(site)}" />`,
    `<meta property="og:image" content="https://${host}/og-image.jpg" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join("\n");

  function pick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith("image/")) setImg(URL.createObjectURL(f));
    e.target.value = "";
  }
  async function copy() {
    try { await navigator.clipboard.writeText(tags); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  }

  const field = "w-full rounded-sm border border-line bg-bg p-3 text-sm focus:border-[var(--accent)] focus:outline-none";
  const count = (n: number, min: number, max: number) => (n >= min && n <= max ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400");
  const Img = ({ className = "" }: { className?: string }) => (img
    ? <img src={img} alt="" className={`w-full object-cover ${className}`} /> // eslint-disable-line @next/next/no-img-element
    : <div className={`accent-gradient grid w-full place-items-center text-xs font-medium text-white/90 ${className}`}>Your share image</div>);

  return (
    <section aria-labelledby="lp-title">
      <p className="accent-text text-xs font-semibold tracking-[0.3em]">LINK PREVIEW TESTER</p>
      <h2 id="lp-title" className="mt-3 font-display text-2xl font-bold md:text-3xl">See your page the way Google and your customers do.</h2>
      <p className="mt-2 max-w-xl text-muted">Type your page details and watch the previews update. Aim for a green score before you publish.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <div>
            <label htmlFor="lp-t" className="mb-1 flex justify-between text-sm font-medium">Page title <span className={count(title.length, 30, 60)}>{title.length}/60</span></label>
            <input id="lp-t" value={title} onChange={(e) => setTitle(e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="lp-d" className="mb-1 flex justify-between text-sm font-medium">Description <span className={count(desc.length, 70, 160)}>{desc.length}/160</span></label>
            <textarea id="lp-d" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} className={field} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="lp-u" className="mb-1 block text-sm font-medium">Page address</label>
              <input id="lp-u" value={url} onChange={(e) => setUrl(e.target.value)} className={field} /></div>
            <div><label htmlFor="lp-s" className="mb-1 block text-sm font-medium">Brand name</label>
              <input id="lp-s" value={site} onChange={(e) => setSite(e.target.value)} className={field} /></div>
          </div>
          <div><label htmlFor="lp-k" className="mb-1 block text-sm font-medium">Main keyword</label>
            <input id="lp-k" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. website designer Lagos" className={field} /></div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-[var(--accent)]">
            <ImagePlus size={16} /> {img ? "Change share image" : "Add a share image"}
            <input type="file" accept="image/*" className="sr-only" onChange={pick} />
          </label>

          <div className="rounded-lg border border-line p-5">
            <div className="flex items-center justify-between">
              <p className="font-display font-semibold">SEO score</p>
              <p className={`font-display text-2xl font-bold ${score >= 80 ? "text-emerald-600 dark:text-emerald-400" : score >= 50 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>{score}%</p>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {checks.map((c) => (
                <li key={c.text} className="flex gap-2">
                  {c.ok ? <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />}
                  <span className={c.ok ? "" : "text-muted"}>{c.text}</span>
                </li>
              ))}
            </ul>
            <button type="button" onClick={copy} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-on)] hover:brightness-110">
              {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied" : "Copy meta tags"}
            </button>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-7">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Google search result</p>
            <div className="rounded-lg border border-line bg-bg p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-full bg-surface text-xs font-bold">{(site || host).charAt(0).toUpperCase()}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm">{site || host}</span>
                  <span className="block truncate text-xs text-muted">https://{host}{crumbs.length ? ` › ${crumbs.join(" › ")}` : ""}</span>
                </span>
              </div>
              <p className="mt-2 text-xl leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">{cut(title || "Page title", 60)}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{cut(desc || "Your description appears here.", 160)}</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">WhatsApp</p>
              <div className="rounded-lg bg-[#efeae2] p-4 dark:bg-[#0b141a]">
                <div className="ml-auto max-w-[95%] rounded-lg bg-[#d9fdd3] p-1.5 text-[#111b21] shadow-sm dark:bg-[#005c4b] dark:text-[#e9edef]">
                  <div className="overflow-hidden rounded-md bg-black/5 dark:bg-black/20">
                    <Img className="aspect-[1.91/1]" />
                    <div className="p-2.5">
                      <p className="line-clamp-2 text-sm font-semibold">{title || "Page title"}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs opacity-70">{desc}</p>
                      <p className="mt-1 text-xs opacity-60">{host}</p>
                    </div>
                  </div>
                  <p className="break-all px-1.5 pt-1.5 pb-0.5 text-sm text-[#027eb5] dark:text-[#53bdeb]">{url}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Facebook & LinkedIn</p>
              <div className="overflow-hidden rounded-lg border border-line bg-bg">
                <Img className="aspect-[1.91/1]" />
                <div className="bg-surface p-3">
                  <p className="text-[11px] uppercase text-muted">{host}</p>
                  <p className="mt-0.5 line-clamp-2 font-semibold">{title || "Page title"}</p>
                  <p className="mt-0.5 line-clamp-1 text-sm text-muted">{desc}</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted">
            Good previews win clicks. I build every website with these details set up properly.{" "}
            <Link href="/web" className="accent-text inline-flex items-center gap-1 font-medium hover:underline">Explore Web & SEO <ArrowUpRight size={14} /></Link>
          </p>
        </div>
      </div>
    </section>
  );
}