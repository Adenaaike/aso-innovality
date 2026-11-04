"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { animate, AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Copy, Download, FileText, MessageCircle, Minus, Plus } from "lucide-react";
import type { CalcOption, CalcStep } from "@/lib/calculators";

type Billing = "one_off" | "monthly";
type Line = { label: string; usd: number | null };
const EASE = [0.22, 1, 0.36, 1] as const;

function Rolling({ value, format }: { value: number; format: (n: number) => string }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  const current = useRef(value);
  useEffect(() => {
    if (reduce) { current.current = value; setShown(value); return; }
    const c = animate(current.current, value, { duration: 0.6, ease: EASE, onUpdate: (v) => { current.current = v; setShown(v); } });
    return () => c.stop();
  }, [value, reduce]);
  return <>{format(Math.round(shown))}</>;
}

function OptionCard({ type, name, selected, onSelect, title, desc, price, features }: {
  type: "radio" | "checkbox"; name: string; selected: boolean; onSelect: () => void;
  title: string; desc?: string | null; price: string; features?: string[];
}) {
  return (
    <label className={`block cursor-pointer rounded-lg border p-5 transition ${selected ? "border-royal bg-royal/5" : "border-line hover:border-royal"}`}>
      <input type={type} name={name} className="sr-only" checked={selected} onChange={onSelect} />
      <span className="flex items-start gap-4">
        <span className={`mt-1 grid size-5 shrink-0 place-items-center border-2 ${type === "radio" ? "rounded-full" : "rounded-md"} ${selected ? "border-royal" : "border-line"}`}>
          {selected && (type === "radio" ? <span className="size-2.5 rounded-full bg-royal" /> : <Check size={12} className="text-royal" />)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-3">
            <span className="font-display font-semibold">{title}</span>
            <span className="shrink-0 font-display text-sm font-bold text-royal dark:text-light-azure">{price}</span>
          </span>
          {desc && <span className="mt-1 block text-sm text-muted">{desc}</span>}
          <AnimatePresence initial={false}>
            {selected && features && features.length > 0 && (
              <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }} className="overflow-hidden">
                <li aria-hidden className="mt-4 border-t border-dashed border-line pt-3" />
                {features.map((f) => (
                  <li key={f} className="flex gap-2.5 py-1 text-sm"><Check size={15} className="mt-0.5 shrink-0 text-royal dark:text-light-azure" />{f}</li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </span>
      </span>
    </label>
  );
}

export function Calculator({ steps, ngnRate, whatsapp, related, calcName, contactService }: {
  steps: CalcStep[]; ngnRate: number; whatsapp: string; related: string[]; calcName: string; contactService: string;
}) {
  const hasMonthly = steps.some((s) => s.options.some((o) => o.billing === "monthly"));
  const hasOneOff = steps.some((s) => s.options.some((o) => o.billing === "one_off"));
  const [billing, setBilling] = useState<Billing>(hasOneOff ? "one_off" : "monthly");
  const [single, setSingle] = useState<Record<string, string>>({});
  const [multi, setMulti] = useState<Record<string, string[]>>({});
  const [qty, setQty] = useState<Record<string, number>>({});
  const [cur, setCur] = useState<"USD" | "NGN">("USD");
  const [copied, setCopied] = useState(false);
  const canNgn = ngnRate > 0;
  const monthly = billing === "monthly";
  const per = monthly ? " / month" : "";

  const usd = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  const ngn = (n: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n * ngnRate);
  const fmt = (n: number) => (cur === "NGN" && canNgn ? ngn(n) : usd(n));
  const alt = (n: number) => (!canNgn ? null : cur === "NGN" ? usd(n) : ngn(n));
  const both = (n: number) => (canNgn ? `${usd(n)} (${ngn(n)})` : usd(n));
  const priceLabel = (o: CalcOption) => (o.price_usd === null ? "On request" : `${fmt(o.price_usd)}${per}`);

  const visible = useMemo(
    () => steps.map((s) => ({ ...s, options: s.options.filter((o) => o.billing === billing) })).filter((s) => s.options.length > 0),
    [steps, billing],
  );

  // Pick-one steps: "None" first if offered, otherwise the first option, so the total is never empty
  const chosenOf = (s: CalcStep, picks: Record<string, string>) => {
    const v = picks[s.id];
    if (v === "none" && s.none_label) return "none";
    if (v && s.options.some((o) => o.id === v)) return v;
    return s.none_label ? "none" : s.options[0].id;
  };

  const lines = useMemo<Line[]>(() => {
    const out: Line[] = [];
    for (const s of visible) {
      if (s.kind === "single") {
        const o = s.options.find((x) => x.id === chosenOf(s, single));
        if (o) out.push({ label: o.name, usd: o.price_usd });
      } else if (s.kind === "multi") {
        for (const o of s.options) if ((multi[s.id] ?? []).includes(o.id)) out.push({ label: o.name, usd: o.price_usd });
      } else {
        for (const o of s.options) {
          const q = qty[o.id] ?? 0;
          if (q > 0) out.push({ label: `${o.name} × ${q}`, usd: o.price_usd === null ? null : o.price_usd * q });
        }
      }
    }
    return out;
}, [visible, single, multi, qty]); // eslint-disable-line react-hooks/exhaustive-deps

// Sticky mobile bar: only while the calculator is on screen and the estimate panel isn't
const rootRef = useRef<HTMLDivElement>(null);
const [inCalc, setInCalc] = useState(false);
const [summaryVisible, setSummaryVisible] = useState(false);
useEffect(() => {
  const root = rootRef.current;
  const panel = document.getElementById("estimate-summary");
  if (!root) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.target === root) setInCalc(e.isIntersecting);
      else setSummaryVisible(e.isIntersecting);
    }
  });
  io.observe(root);
  if (panel) io.observe(panel);
  return () => io.disconnect();
}, []);
  if (!visible.length) {
    return (
      <p className="rounded-lg border border-dashed border-line p-10 text-center text-sm text-muted">
        This calculator is being set up. In the meantime, <Link href={`/contact?service=${contactService}`} className="text-royal hover:underline dark:text-light-azure">tell me about your project</Link>.
      </p>
    );
  }

  const total = lines.reduce((a, l) => a + (l.usd ?? 0), 0);
  const onRequest = lines.some((l) => l.usd === null);
  const ready = lines.length > 0;

  const lineText = (l: Line) => (l.usd === null ? "On request" : `${both(l.usd)}${per}`);
  const summary = [
    ...lines.map((l) => `• ${l.label}: ${lineText(l)}`),
    "",
    `Estimated total: ${both(total)}${per}`,
    ...(onRequest ? ["(Items marked “On request” will be quoted separately.)"] : []),
    ...(canNgn ? [`(Converted at ₦${ngnRate.toLocaleString("en-NG")} to $1)`] : []),
  ];
  const waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent([`Hello ASO, I used your ${calcName}.`, "", ...summary, "", "Please send me a formal quote."].join("\n"))}`;
  const brief = [`From the ${calcName}:`, ...summary, "", "About my project: "].join("\n");
  const quoteHref = `/contact?service=${contactService}&brief=${encodeURIComponent(brief)}`;

  async function copy() {
    try { await navigator.clipboard.writeText(summary.join("\n")); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  }

  async function download() {
    await document.fonts.ready;
    const css = getComputedStyle(document.documentElement);
    const display = css.getPropertyValue("--font-space-grotesk").trim() || "sans-serif";
    const body = css.getPropertyValue("--font-inter").trim() || "sans-serif";
    const W = 1080, pad = 80, lh = 54;
    const H = Math.max(1080, 600 + lines.length * lh + 300);
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const x = c.getContext("2d")!;
    const fit = (t: string, max: number) => {
      if (x.measureText(t).width <= max) return t;
      let s = t;
      while (s.length > 3 && x.measureText(`${s}…`).width > max) s = s.slice(0, -1);
      return `${s}…`;
    };
    const g = x.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0, "#1177FF"); g.addColorStop(0.5, "#21A9FF"); g.addColorStop(1, "#9BD9FE");
    x.fillStyle = "#101B2B"; x.fillRect(0, 0, W, H);
    x.fillStyle = g; x.fillRect(0, 0, W, 12);
    x.fillStyle = "#FFFFFF"; x.font = `700 32px ${display}`; x.fillText("ASO INNOVALITY", pad, 115);
    x.fillStyle = "#21A9FF"; x.font = `600 22px ${body}`; x.fillText(`${calcName.toUpperCase()} · ${monthly ? "MONTHLY" : "PROJECT"} ESTIMATE`, pad, 180);
    x.fillStyle = "#A9BCD2"; x.font = `400 22px ${body}`;
    x.fillText(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), pad, 218);
    let y = 310;
    x.font = `400 28px ${body}`;
    for (const l of lines) {
      x.textAlign = "left"; x.fillStyle = "#C4E8FC"; x.fillText(fit(l.label, W - pad * 2 - 300), pad, y);
      x.textAlign = "right"; x.fillStyle = "#FFFFFF"; x.fillText(l.usd === null ? "On request" : `${fmt(l.usd)}${monthly ? "/mo" : ""}`, W - pad, y);
      y += lh;
    }
    x.textAlign = "left";
    y += 20; x.fillStyle = "rgba(255,255,255,0.15)"; x.fillRect(pad, y, W - pad * 2, 2);
    y += 70; x.fillStyle = "#A9BCD2"; x.font = `400 24px ${body}`; x.fillText(`Estimated total${monthly ? " per month" : ""}`, pad, y);
    y += 86; x.fillStyle = g; x.font = `700 84px ${display}`; x.fillText(fmt(total), pad, y);
    const second = alt(total);
    if (second) { y += 52; x.fillStyle = "#A9BCD2"; x.font = `400 26px ${body}`; x.fillText(`≈ ${second}`, pad, y); }
    x.fillStyle = "#A9BCD2"; x.font = `400 22px ${body}`;
    x.fillText("A starting guide. Your formal quote confirms the scope before any work begins.", pad, H - 150);
    x.fillStyle = "#FFFFFF"; x.font = `600 24px ${body}`;
    x.fillText(`${window.location.host} · WhatsApp +${whatsapp}`, pad, H - 100);
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/png"));
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), { href: url, download: "aso-innovality-estimate.png" }).click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const action = "inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition";
  const toggle = "rounded-full px-4 py-1.5 text-xs font-semibold transition aria-pressed:bg-royal aria-pressed:text-white";

  return (
    <>
      {hasMonthly && hasOneOff && (
        <div role="group" aria-label="Billing" className="mb-8 inline-flex rounded-full border border-line p-1">
          <button onClick={() => setBilling("one_off")} aria-pressed={!monthly} className={toggle}>One-off project</button>
          <button onClick={() => setBilling("monthly")} aria-pressed={monthly} className={toggle}>Monthly retainer</button>
        </div>
      )}

<div ref={rootRef} className="grid gap-10 lg:grid-cols-12">
        <AnimatePresence mode="wait">
                    <motion.div key={billing} className="min-w-0 space-y-12 lg:col-span-8"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>
            {visible.map((s, idx) => (
              <section key={s.id}>
                <h3 className="mb-4 flex items-center gap-3 font-display text-lg font-semibold">
                  <span className="grid size-7 place-items-center rounded-full bg-royal text-xs font-bold text-white">{idx + 1}</span>
                  {s.title}
                </h3>

                {s.kind === "single" && (
                  <div className="space-y-3">
                    {s.none_label && (
                      <OptionCard type="radio" name={`step-${s.id}`} selected={chosenOf(s, single) === "none"}
                        onSelect={() => setSingle((p) => ({ ...p, [s.id]: "none" }))} title={s.none_label} desc={s.none_note} price="Included" />
                    )}
                    {s.options.map((o) => (
                      <OptionCard key={o.id} type="radio" name={`step-${s.id}`} selected={chosenOf(s, single) === o.id}
                        onSelect={() => setSingle((p) => ({ ...p, [s.id]: o.id }))} title={o.name} desc={o.description} price={priceLabel(o)} features={o.features} />
                    ))}
                  </div>
                )}

                {s.kind === "multi" && (
                  <div className="space-y-3">
                    {s.options.map((o) => {
                      const on = (multi[s.id] ?? []).includes(o.id);
                      return (
                        <OptionCard key={o.id} type="checkbox" name={`step-${s.id}`} selected={on}
                          onSelect={() => setMulti((p) => {
                            const list = p[s.id] ?? [];
                            return { ...p, [s.id]: on ? list.filter((x) => x !== o.id) : [...list, o.id] };
                          })}
                          title={o.name} desc={o.description} price={o.price_usd === null ? "On request" : `+${fmt(o.price_usd)}${per}`} features={o.features} />
                      );
                    })}
                  </div>
                )}

                {s.kind === "quantity" && (
                  <div className="space-y-3">
                    {s.options.map((o) => {
                      const q = qty[o.id] ?? 0;
                      const set = (n: number) => setQty((p) => ({ ...p, [o.id]: Math.max(0, Math.min(99, n)) }));
                      return (
                        <div key={o.id} className={`flex items-center gap-4 rounded-lg border p-5 transition ${q > 0 ? "border-royal bg-royal/5" : "border-line"}`}>
                          <span className="min-w-0 flex-1">
                            <span className="font-display font-semibold">{o.name}</span>
                            <span className="block text-sm text-muted">{priceLabel(o)} {o.unit ?? "each"}{o.description ? ` · ${o.description}` : ""}</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => set(q - 1)} disabled={q === 0} aria-label={`Fewer ${o.name}`}
                              className="grid size-9 place-items-center rounded-full border border-line hover:border-royal disabled:opacity-30"><Minus size={14} /></button>
                            <span className="w-7 text-center font-semibold" aria-live="polite">{q}</span>
                            <button onClick={() => set(q + 1)} aria-label={`More ${o.name}`}
                              className="grid size-9 place-items-center rounded-full border border-line hover:border-royal"><Plus size={14} /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            ))}
          </motion.div>
        </AnimatePresence>

        <aside id="estimate-summary" className="scroll-mt-24 lg:col-span-4">
          <div className="space-y-6 rounded-lg bg-navy p-6 text-white lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold tracking-[0.25em] text-sky">YOUR ESTIMATE</p>
              {canNgn && (
                <div role="group" aria-label="Currency" className="flex rounded-full border border-white/20 p-0.5 text-xs font-semibold">
                  {(["USD", "NGN"] as const).map((c) => (
                    <button key={c} onClick={() => setCur(c)} aria-pressed={cur === c} className="rounded-full px-3 py-1 transition aria-pressed:bg-royal">
                      {c === "USD" ? "$ USD" : "₦ NGN"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="font-display text-4xl font-bold" aria-live="polite">
                <Rolling value={total} format={fmt} />
                {monthly && <span className="text-base font-medium text-ice/70"> / month</span>}
              </p>
              {alt(total) && <p className="mt-1 text-sm text-ice/70">≈ {alt(total)}{per}</p>}
            </div>

            <ul className="space-y-2 border-t border-white/15 pt-4 text-sm">
              {lines.map((l) => (
                <li key={l.label} className="flex justify-between gap-4">
                  <span className="text-ice">{l.label}</span>
                  <span className="shrink-0 font-medium">{l.usd === null ? "On request" : fmt(l.usd)}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-2 text-xs leading-relaxed text-ice/60">
              {onRequest && <p>Items marked “On request” are quoted separately and aren’t included in the total.</p>}
              {canNgn && <p>Converted at ₦{ngnRate.toLocaleString("en-NG")} to $1. The invoice currency is agreed with you.</p>}
              <p>These are my published starting rates. Your formal quote confirms the scope and deliverables before any work begins.</p>
            </div>

            <div className="space-y-2">
              <a href={ready ? waHref : undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!ready}
                className={`${action} ${ready ? "bg-royal hover:bg-azure" : "pointer-events-none bg-white/10 text-white/40"}`}>
                <MessageCircle size={16} /> Send estimate on WhatsApp
              </a>
              <Link href={ready ? quoteHref : `/contact?service=${contactService}`} className={`${action} border border-white/20 hover:border-sky`}>
                <FileText size={16} /> Request a formal quote
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={download} disabled={!ready} className={`${action} border border-white/20 hover:border-sky disabled:opacity-40`}><Download size={15} /> Download</button>
                <button onClick={copy} disabled={!ready} className={`${action} border border-white/20 hover:border-sky disabled:opacity-40`}>
                  {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {related.length > 0 && (
              <div className="border-t border-white/15 pt-5">
                <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-sky">SIMILAR WORK</p>
                <Link href="/work" className="grid grid-cols-3 gap-2">
                  {related.slice(0, 3).map((src) => (
                    <span key={src} className="relative aspect-[4/5] overflow-hidden rounded-md">
                      <Image src={src} alt="" fill sizes="100px" className="object-cover transition duration-500 hover:scale-105" />
                    </span>
                  ))}
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>

      <AnimatePresence>
      {ready && inCalc && !summaryVisible && (
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-white/10 bg-navy/95 px-5 py-3 text-white backdrop-blur lg:hidden">
            <span>
              <span className="block text-[10px] uppercase tracking-wider text-ice/70">Estimate{monthly ? " / month" : ""}</span>
              <span className="font-display text-lg font-bold"><Rolling value={total} format={fmt} /></span>
            </span>
            <a href="#estimate-summary" className="rounded-full bg-royal px-5 py-2.5 text-sm font-medium">Review & send</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}