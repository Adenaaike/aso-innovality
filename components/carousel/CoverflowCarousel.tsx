"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Layers, X } from "lucide-react";
import type { Carousel } from "@/lib/projects";

const SLIDE_MS = 2600;
const EASE = [0.22, 1, 0.36, 1] as const;

export function CoverflowCarousel({ carousels }: { carousels: Carousel[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [slide, setSlide] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const count = carousels.length;
  const active = carousels[index];

  const goTo = useCallback((i: number) => { setIndex(((i % count) + count) % count); setSlide(0); }, [count]);

  // Auto-play: step through the active carousel's slides, then rotate to the next carousel
  useEffect(() => {
    if (reduce || lightbox !== null || !active) return;
    const t = setTimeout(() => {
      if (slide + 1 < active.slides.length) setSlide(slide + 1);
      else goTo(index + 1);
    }, SLIDE_MS);
    return () => clearTimeout(t);
  }, [slide, index, lightbox, reduce, active, goTo]);

  // Lightbox keyboard controls
  useEffect(() => {
    if (lightbox === null || !active) return;
    const n = active.slides.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((l) => (l === null ? null : (l + 1) % n));
      if (e.key === "ArrowLeft") setLightbox((l) => (l === null ? null : (l - 1 + n) % n));
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [lightbox, active]);

  if (!count || !active) return null;

  const offsetOf = (i: number) => {
    let d = i - index;
    if (d > count / 2) d -= count;
    if (d < -count / 2) d += count;
    return d;
  };

  const arrow = "grid size-10 place-items-center rounded-full border border-white/20 text-white transition hover:border-sky hover:text-sky";

  return (
    <div>
      <div role="region" aria-roledescription="carousel" aria-label="Carousel designs"
        className="relative h-[340px] touch-pan-y select-none sm:h-[460px]" style={{ perspective: 1600 }}
        onPointerDown={(e) => { drag.current = { x: e.clientX, moved: false }; }}
        onPointerUp={(e) => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 50) { drag.current.moved = true; goTo(index + (dx < 0 ? 1 : -1)); }
        }}>
        <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#1D9BFF55,transparent_65%)] blur-2xl" />

        {carousels.map((c, i) => {
          const d = offsetOf(i);
          const abs = Math.abs(d);
          if (abs > 2) return null;
          const isActive = d === 0;
          const src = isActive ? c.slides[slide % c.slides.length] : c.slides[0];
          return (
            <motion.button key={c.slug} type="button" aria-label={isActive ? `View all slides of ${c.title}` : `Show ${c.title}`}
              onClick={() => {
                if (drag.current?.moved) { drag.current = null; return; }
                drag.current = null;
                if (isActive) setLightbox(slide); else goTo(i);
              }}
              className="absolute top-0 left-1/2 -ml-[110px] w-[220px] overflow-hidden rounded-xl bg-navy shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10 sm:-ml-[160px] sm:w-[320px]"
              style={{ zIndex: 10 - abs }}
              initial={false}
              animate={{ x: `${d * 62}%`, rotateY: d * -38, scale: 1 - abs * 0.14, opacity: abs === 2 ? 0.4 : abs === 1 ? 0.8 : 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 30 }}>
              <div className="relative aspect-[4/5]">
                <AnimatePresence initial={false}>
                  <motion.div key={src.url} className="absolute inset-0"
                    initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.45, ease: EASE }}>
                    <Image src={src.url} alt={src.alt || c.title} fill sizes="320px" draggable={false} className="object-cover" />
                  </motion.div>
                </AnimatePresence>

                {isActive && c.slides.length > 1 && (
                  <div className="absolute inset-x-3 top-3 flex gap-1">
                    {c.slides.map((_, k) => (
                      <span key={k} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/35">
                        {k < slide && <span className="block h-full w-full bg-white" />}
                        {k === slide && (
                          <motion.span key={`${index}-${slide}`} className="block h-full bg-white"
                            initial={{ width: reduce ? "100%" : "0%" }} animate={{ width: "100%" }}
                            transition={{ duration: reduce ? 0 : SLIDE_MS / 1000, ease: "linear" }} />
                        )}
                      </span>
                    ))}
                  </div>
                )}
                {!isActive && <div className="absolute inset-0 bg-navy/30" />}
                <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-navy/70 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
                  <Layers size={11} /> {c.slides.length}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div key={active.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            <p className="font-display text-lg font-semibold text-white">{active.title}</p>
            <p className="text-sm text-ice/80">{[active.client, active.year, `${active.slides.length} slides`].filter(Boolean).join(" · ")}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => goTo(index - 1)} aria-label="Previous carousel" className={arrow}><ChevronLeft size={18} /></button>
          <div className="flex gap-1.5">
            {carousels.map((c, i) => (
              <button key={c.slug} type="button" onClick={() => goTo(i)} aria-label={`Show ${c.title}`} aria-current={i === index}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-sky" : "w-1.5 bg-white/30 hover:bg-white/60"}`} />
            ))}
          </div>
          <button type="button" onClick={() => goTo(index + 1)} aria-label="Next carousel" className={arrow}><ChevronRight size={18} /></button>
        </div>
        <Link href={`/work/${active.slug}`} className="text-sm font-medium text-sky hover:underline">View this project →</Link>
      </div>

      {lightbox !== null && (
        <div role="dialog" aria-modal="true" aria-label={`${active.title}, slide ${lightbox + 1} of ${active.slides.length}`}
          className="fixed inset-0 z-[80] flex flex-col bg-navy/95 backdrop-blur" onClick={() => setLightbox(null)}>
          <div className="flex items-center justify-between p-4 text-sm text-white/80">
            <span>{active.title} · {lightbox + 1} / {active.slides.length}</span>
            <button type="button" onClick={() => setLightbox(null)} aria-label="Close" autoFocus
              className="grid size-10 place-items-center rounded-full text-white hover:bg-white/10"><X size={20} /></button>
          </div>
          <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
            <Image src={active.slides[lightbox].url} alt={active.slides[lightbox].alt || active.title} fill sizes="100vw" className="object-contain px-4 sm:px-16" />
            {active.slides.length > 1 && (
              <>
                <button type="button" aria-label="Previous slide" onClick={() => setLightbox((lightbox - 1 + active.slides.length) % active.slides.length)}
                  className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"><ChevronLeft size={22} /></button>
                <button type="button" aria-label="Next slide" onClick={() => setLightbox((lightbox + 1) % active.slides.length)}
                  className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"><ChevronRight size={22} /></button>
              </>
            )}
          </div>
          <div className="h-12" />
        </div>
      )}
    </div>
  );
}