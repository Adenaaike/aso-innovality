"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";

// Minimal cursor shown over any element with a data-cursor attribute
export function DesignerCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 700, damping: 45, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 700, damping: 45, mass: 0.3 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e: PointerEvent) => {
      setActive(!!(e.target as Element | null)?.closest("[data-cursor]"));
    };
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div aria-hidden className="pointer-events-none fixed top-0 left-0 z-[70]" style={{ x: sx, y: sy }}>
      <motion.span className="grid size-7 place-items-center rounded-full bg-royal text-white shadow-[0_6px_16px_-6px_#1177FF]"
        style={{ marginLeft: -14, marginTop: -14 }}
        initial={false} animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }} transition={{ duration: 0.18 }}>
        <ArrowUpRight size={15} strokeWidth={2.5} />
      </motion.span>
    </motion.div>
  );
}