"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { services } from "@/lib/site";

export function ServicesHover({ previews }: { previews: Record<string, string[]> }) {
  const [active, setActive] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 30 });
  const sy = useSpring(y, { stiffness: 300, damping: 30 });

  // Only on mouse devices, and not for reduced-motion visitors
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  function onMove(e: PointerEvent) { x.set(e.clientX); y.set(e.clientY); }

  return (
    <div onPointerEnter={() => setHovering(true)} onPointerLeave={() => { setHovering(false); setActive(null); }}
      onPointerMove={enabled ? onMove : undefined}>
      <ul className="divide-y divide-line border-y border-line">
        {services.map((s) => {
          const on = active === s.slug;
          return (
            <li key={s.slug} onPointerEnter={() => setActive(s.slug)}>
              <Link href={`/services#${s.slug}`} onFocus={() => setActive(s.slug)} onBlur={() => setActive(null)}
                className="grid gap-2 py-6 md:grid-cols-12 md:items-center">
                <span className="font-display text-xs text-muted md:col-span-1">{s.no}</span>
                <span className="md:col-span-5">
                  <span className={`inline-block rounded-full font-display text-lg font-semibold transition-all duration-300 md:text-xl ${on ? "bg-royal px-4 py-1 text-white" : "py-1"}`}>
                    {s.title}
                  </span>
                </span>
                <span className="text-sm text-muted md:col-span-6">{s.summary}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {enabled && hovering && (
        <motion.div aria-hidden className="pointer-events-none fixed top-0 left-0 z-30" style={{ x: sx, y: sy }}>
          <AnimatePresence>
            {active && (
              <motion.div key={active} className="relative h-44 w-64" style={{ marginLeft: 28, marginTop: -120 }}
                initial={{ opacity: 0, scale: 0.85, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: -2 }}
                exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
                {(previews[active]?.length ? previews[active].slice(0, 3) : [null]).map((src, i) => (
                  <div key={i} className="absolute inset-0 overflow-hidden rounded-sm border border-white/70 shadow-2xl"
                    style={{ transform: `translate(${i * 14}px, ${i * -10}px) rotate(${i * 4}deg)`, zIndex: 3 - i }}>
                    {src ? (
                      <Image src={src} alt="" fill sizes="256px" className="object-cover" />
                    ) : (
                      <div className="grid size-full place-items-center aso-gradient font-display text-sm font-bold tracking-[0.3em] text-white">
                        {services.find((s) => s.slug === active)?.no} · ASO
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}