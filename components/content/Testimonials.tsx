"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/lib/content";

export function Testimonials({ items }: { items: Testimonial[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused || items.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [reduce, paused, items.length]);

  if (!items.length) return null;
  const t = items[i];
  const who = [t.role, t.organisation].filter(Boolean).join(", ");

  return (
    <section aria-label="Client testimonials" className="border-t border-line py-20" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">CLIENT PERSPECTIVES</p>
        <Quote aria-hidden size={28} className="mx-auto mt-6 text-sky" />
        <div className="mt-4 min-h-[9rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.figure key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              <blockquote className="font-display text-xl font-medium leading-snug md:text-2xl">“{t.quote}”</blockquote>
              <figcaption className="mt-5 text-sm text-muted">
                <span className="font-semibold text-fg">{t.name}</span>{who && ` · ${who}`}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        {items.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-1.5">
            {items.map((x, k) => (
              <button key={x.id} onClick={() => setI(k)} aria-label={`Show testimonial ${k + 1}`} aria-current={k === i}
                className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-royal" : "w-1.5 bg-line hover:bg-muted"}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}