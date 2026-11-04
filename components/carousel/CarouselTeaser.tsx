"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Layers } from "lucide-react";
import type { Carousel } from "@/lib/projects";

export function CarouselTeaser({ carousels }: { carousels: Carousel[] }) {
  const reduce = useReducedMotion();
  const items = carousels.slice(0, 6);
  const [idx, setIdx] = useState<number[]>(() => items.map(() => 0));
  const step = useRef(0);

  // Ripple: one card advances to its next slide at a time
  useEffect(() => {
    if (reduce || !items.length) return;
    const t = setInterval(() => {
      const k = step.current % items.length;
      step.current += 1;
      setIdx((prev) => prev.map((v, i) => (i === k ? (v + 1) % items[i].slides.length : v)));
    }, 900);
    return () => clearInterval(t);
  }, [reduce, items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!items.length) return null;

  return (
    <div className="mt-20 overflow-hidden rounded-lg bg-navy p-6 text-white md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-sky">CAROUSEL DESIGN</p>
          <h3 className="mt-2 font-display text-xl font-bold md:text-2xl">Swipe-worthy stories, slide by slide.</h3>
        </div>
        <Link href="/services#carousels" className="text-sm font-medium text-sky hover:underline">See the carousel showcase →</Link>
      </div>
      <div className="mt-6 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
        {items.map((c, i) => {
          const s = c.slides[(idx[i] ?? 0) % c.slides.length];
          return (
            <Link key={c.slug} href="/services#carousels" aria-label={`${c.title} carousel`}
              className="relative aspect-[4/5] w-36 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10 sm:w-44">
              <AnimatePresence initial={false}>
                <motion.div key={s.url} className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                  <Image src={s.url} alt={s.alt || c.title} fill sizes="176px" className="object-cover" />
                </motion.div>
              </AnimatePresence>
              <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-navy/70 px-2 py-0.5 text-[10px] font-semibold backdrop-blur">
                <Layers size={10} /> {c.slides.length}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}