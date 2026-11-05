"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, MessageCircle, X } from "lucide-react";
import { PRACTICES } from "@/lib/practices";
import { site } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export function StartProjectPanel() {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const dialog = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  // Phone = bottom sheet, desktop = centred pop-up
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const f = () => setMobile(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);

  // Open from any StartProjectButton, or from a ?start=1 link
  useEffect(() => {
    const onOpen = () => { lastFocus.current = document.activeElement as HTMLElement; setOpen(true); };
    window.addEventListener("aso:start-project", onOpen);
    if (new URLSearchParams(window.location.search).get("start") === "1") onOpen();
    return () => window.removeEventListener("aso:start-project", onOpen);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const close = useCallback(() => { setOpen(false); lastFocus.current?.focus?.(); }, []);
  const leave = () => setOpen(false); // used by links (no focus jump back)

  // Scroll lock, Escape to close, keep keyboard focus inside
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => dialog.current?.querySelector<HTMLElement>("a[href], button")?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && dialog.current) {
        const f = Array.from(dialog.current.querySelectorAll<HTMLElement>("a[href], button"));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; clearTimeout(t); window.removeEventListener("keydown", onKey); };
  }, [open, close]);

  const sheet = mobile
    ? { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } }
    : { initial: { opacity: 0, y: 24, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 16, scale: 0.98 } };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div aria-hidden className="absolute inset-0 bg-navy/50 backdrop-blur-md" onClick={close}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.25 }} />

          <motion.div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="start-title"
            {...sheet} transition={{ duration: reduce ? 0 : 0.38, ease: EASE }}
            drag={mobile ? "y" : false} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => { if (info.offset.y > 120 || info.velocity.y > 600) close(); }}
            className="relative max-h-[90svh] w-full overflow-y-auto rounded-t-3xl border border-line bg-bg p-6 shadow-2xl sm:max-w-4xl sm:rounded-2xl sm:p-10">
            <div aria-hidden className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-line sm:hidden" />
            <button type="button" onClick={close} aria-label="Close"
              className="absolute top-4 right-4 grid size-10 place-items-center rounded-full border border-line transition hover:border-royal">
              <X size={18} />
            </button>

            <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">START YOUR PROJECT</p>
            <h2 id="start-title" className="mt-2 pr-12 font-display text-2xl font-bold md:text-3xl">What can I help you with?</h2>
            <p className="mt-2 text-muted">Pick a practice to explore it, or price your project in about 60 seconds.</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {PRACTICES.map((p, i) => {
                const Icon = p.Icon;
                return (
                  <motion.div key={p.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.1 + i * 0.06, duration: 0.35, ease: EASE }}
                    className={`accent-${p.key} glow-card group relative flex flex-col rounded-xl border border-line bg-bg p-5`}>
                    <span className="accent-icon grid size-11 place-items-center rounded-full"><Icon size={20} /></span>
                    <p className="mt-4 text-[10px] font-semibold tracking-[0.25em] text-muted">{p.word}</p>
                    <h3 className="mt-1 font-display text-lg font-bold">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.text}</p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      <Link href={`${p.href}#estimate`} onClick={leave}
                        className="inline-flex items-center rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-[var(--accent-on)] transition hover:brightness-110">
                        Get an estimate
                      </Link>
                      <Link href={p.href} onClick={leave}
                        className="accent-text inline-flex items-center gap-1 rounded-full border border-line px-4 py-2 text-xs font-semibold transition hover:border-[var(--accent)]">
                        Explore <ArrowUpRight size={13} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-sm">
              <p className="font-medium">Just want to talk?</p>
              <div className="flex flex-wrap gap-2">
                <Link href="/contact" onClick={leave} className="inline-flex rounded-full border border-line px-5 py-2.5 font-medium transition hover:border-royal hover:text-royal">
                  Send a message
                </Link>
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-royal px-5 py-2.5 font-medium text-white transition hover:bg-bright">
                  <MessageCircle size={15} /> WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}