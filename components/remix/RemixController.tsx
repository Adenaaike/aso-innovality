"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, MessageCircle, Palette, RotateCcw, Share2, Sparkles, X } from "lucide-react";
import {
  ARCH_KEYS, FONT_PAIRS, PRESETS, STORAGE_KEY, applyRemix, decodeRemix, encodeRemix, remixLabel, resetRemix,
  type ArchKey, type FontKey, type RemixState,
} from "@/lib/remix";

const EASE = [0.22, 1, 0.36, 1] as const;

export function RemixController() {
  const pathname = usePathname();
  const [state, setState] = useState<RemixState | null>(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"brands" | "custom">("brands");
  const [quizKey, setQuizKey] = useState<ArchKey | null>(null);
  const [custom, setCustom] = useState<{ p: string; a: string; font: FontKey }>({ p: "#FF5A5F", a: "#00A699", font: "aso" });
  const [copied, setCopied] = useState(false);

  // Restore from a share link or from this visit, and listen for requests
  useEffect(() => {
    const fromUrl = decodeRemix(new URLSearchParams(window.location.search).get("remix"));
    let saved: RemixState | null = null;
    try { saved = decodeRemix(sessionStorage.getItem(STORAGE_KEY)); } catch {}
    const s = fromUrl ?? saved;
    if (s) { applyRemix(s); setState(s); }

    const onApply = (e: Event) => {
      const next = (e as CustomEvent<RemixState>).detail;
      if (next) { applyRemix(next); setState(next); setOpen(false); }
    };
    const onOpen = () => {
      try {
        const q = sessionStorage.getItem("aso-quiz-result");
        setQuizKey(q && (ARCH_KEYS as string[]).includes(q) ? (q as ArchKey) : null);
      } catch {}
      setOpen(true);
    };
    window.addEventListener("aso:remix-apply", onApply);
    window.addEventListener("aso:remix-open", onOpen);
    return () => { window.removeEventListener("aso:remix-apply", onApply); window.removeEventListener("aso:remix-open", onOpen); };
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);

  const apply = (s: RemixState) => { applyRemix(s); setState(s); setOpen(false); };
  const reset = () => { resetRemix(); setState(null); };

  const shareUrl = state && typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}?remix=${encodeRemix(state)}` : "";
  async function share() {
    if (!state) return;
    const text = `See ASO INNOVALITY remixed in ${remixLabel(state).toLowerCase() === "your custom brand" ? "my brand" : remixLabel(state)}:`;
    try {
      if (navigator.share) { await navigator.share({ title: "ASO INNOVALITY, remixed", text, url: shareUrl }); return; }
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true); setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  const hideBar = pathname.startsWith("/admin");
  const swatch = (p: string, a: string) => ({ backgroundImage: `linear-gradient(135deg, ${p}, ${a})` });

  return (
    <>
      {/* Remix bar */}
      <AnimatePresence>
        {state && !hideBar && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}
            className="fixed bottom-4 left-4 z-[60] flex max-w-[calc(100%-6.5rem)] flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-white/10 bg-navy/95 px-4 py-2.5 text-xs text-white shadow-2xl backdrop-blur sm:left-1/2 sm:max-w-none sm:-translate-x-1/2 sm:rounded-full">
            <span className="flex items-center gap-2">
              <span aria-hidden className="size-4 rounded-full ring-2 ring-white/30"
                style={swatch(state.kind === "preset" ? PRESETS[state.key].p : state.p, state.kind === "preset" ? PRESETS[state.key].a : state.a)} />
              <span>Remixed: <strong>{remixLabel(state)}</strong></span>
            </span>
            <span className="flex flex-wrap items-center gap-1.5">
              <button type="button" onClick={share} className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5 font-medium hover:border-white/50">
                {copied ? <Check size={12} /> : <Share2 size={12} />} {copied ? "Link copied" : "Share"}
              </button>
              <button type="button" onClick={() => window.dispatchEvent(new Event("aso:remix-open"))} className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5 font-medium hover:border-white/50">
                <Palette size={12} /> Change
              </button>
              <button type="button" onClick={reset} className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5 font-medium hover:border-white/50">
                <RotateCcw size={12} /> Reset
              </button>
              <button type="button" onClick={() => window.dispatchEvent(new Event("aso:start-project"))}
                className="inline-flex items-center gap-1 rounded-full bg-royal px-3 py-1.5 font-semibold text-white hover:brightness-110">
                Get this for my brand
              </button>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remix panel */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
            <motion.div aria-hidden className="absolute inset-0 bg-navy/50 backdrop-blur-md" onClick={() => setOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div role="dialog" aria-modal="true" aria-labelledby="remix-title"
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.35, ease: EASE }}
              className="relative max-h-[90svh] w-full overflow-y-auto rounded-t-3xl border border-line bg-bg p-6 shadow-2xl sm:max-w-3xl sm:rounded-2xl sm:p-10">
              <button type="button" onClick={() => setOpen(false)} aria-label="Close"
                className="absolute top-4 right-4 grid size-10 place-items-center rounded-full border border-line hover:border-royal"><X size={18} /></button>

              <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">REMIX THIS SITE</p>
              <h2 id="remix-title" className="mt-2 pr-12 font-display text-2xl font-bold md:text-3xl">See this website in your brand.</h2>
              <p className="mt-2 text-muted">Pick a brand personality or your own colours. The whole site transforms while you browse.</p>

              {quizKey && (
                <button type="button" onClick={() => apply({ kind: "preset", key: quizKey })}
                  className="mt-6 flex w-full items-center gap-3 rounded-xl border border-royal bg-royal/5 p-4 text-left transition hover:bg-royal/10">
                  <span className="size-9 shrink-0 rounded-full" style={swatch(PRESETS[quizKey].p, PRESETS[quizKey].a)} />
                  <span className="flex-1"><span className="block text-sm font-semibold">Use my quiz result</span><span className="block text-xs text-muted">{PRESETS[quizKey].name}</span></span>
                  <Sparkles size={16} className="text-royal dark:text-light-azure" />
                </button>
              )}

              <div role="tablist" className="mt-6 inline-flex rounded-full border border-line p-1 text-xs font-semibold">
                {(["brands", "custom"] as const).map((t) => (
                  <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                    className="rounded-full px-4 py-1.5 transition aria-selected:bg-royal aria-selected:text-white">
                    {t === "brands" ? "Brand personalities" : "My own colours"}
                  </button>
                ))}
              </div>

              {tab === "brands" ? (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {ARCH_KEYS.map((k) => {
                    const on = state?.kind === "preset" && state.key === k;
                    return (
                      <button key={k} type="button" onClick={() => apply({ kind: "preset", key: k })}
                        className={`group rounded-xl border p-3 text-left transition hover:-translate-y-0.5 ${on ? "border-royal" : "border-line hover:border-royal"}`}>
                        <span className="block aspect-[4/3] rounded-lg" style={swatch(PRESETS[k].p, PRESETS[k].a)} />
                        <span className="mt-2 block text-sm font-semibold">{PRESETS[k].name}</span>
                        <span className="block text-[11px] text-muted">{FONT_PAIRS[k].display} + {FONT_PAIRS[k].body}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-5 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex items-center gap-3 rounded-xl border border-line p-3">
                      <input type="color" value={custom.p} onChange={(e) => setCustom({ ...custom, p: e.target.value.toUpperCase() })} className="size-10 cursor-pointer rounded border-0 bg-transparent" />
                      <span><span className="block text-sm font-semibold">Main colour</span><span className="block text-xs text-muted">Buttons and highlights · {custom.p}</span></span>
                    </label>
                    <label className="flex items-center gap-3 rounded-xl border border-line p-3">
                      <input type="color" value={custom.a} onChange={(e) => setCustom({ ...custom, a: e.target.value.toUpperCase() })} className="size-10 cursor-pointer rounded border-0 bg-transparent" />
                      <span><span className="block text-sm font-semibold">Accent colour</span><span className="block text-xs text-muted">Gradients and tints · {custom.a}</span></span>
                    </label>
                  </div>
                  <div>
                    <label htmlFor="remix-font" className="mb-1 block text-sm font-medium">Fonts</label>
                    <select id="remix-font" value={custom.font} onChange={(e) => setCustom({ ...custom, font: e.target.value as FontKey })}
                      className="w-full rounded-sm border border-line bg-bg p-3 text-sm focus:border-royal focus:outline-none">
                      <option value="aso">Keep ASO fonts</option>
                      {ARCH_KEYS.map((k) => <option key={k} value={k}>{FONT_PAIRS[k].display} + {FONT_PAIRS[k].body}</option>)}
                    </select>
                  </div>
                  <p className="text-xs text-muted">Very light main colours are deepened automatically, so buttons stay readable.</p>
                  <button type="button" onClick={() => apply({ kind: "custom", p: custom.p, a: custom.a, font: custom.font })}
                    className="inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 text-sm font-medium text-white hover:bg-bright">
                    <Palette size={16} /> Remix with my colours
                  </button>
                </div>
              )}

              {state && (
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-sm">
                  <span className="text-muted">Currently: <strong className="text-fg">{remixLabel(state)}</strong></span>
                  <span className="flex gap-2">
                    <a href={`https://wa.me/?text=${encodeURIComponent(`See ASO INNOVALITY remixed in my brand: ${shareUrl}`)}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 font-medium hover:border-royal"><MessageCircle size={14} /> Share</a>
                    <button type="button" onClick={() => { reset(); setOpen(false); }} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 font-medium hover:border-royal">
                      <RotateCcw size={14} /> Reset to ASO
                    </button>
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}