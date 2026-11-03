"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { PenTool } from "lucide-react";

// Shows a custom "designer" cursor over any element with a data-cursor="Label" attribute
export function DesignerCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

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
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(el ? el.dataset.cursor || "View" : null);
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
      <motion.div className="grid size-20 place-items-center rounded-full bg-royal text-white shadow-[0_12px_30px_-8px_#1177FF]"
        style={{ marginLeft: -40, marginTop: -40 }}
        initial={false} animate={{ scale: label ? 1 : 0, opacity: label ? 1 : 0 }} transition={{ duration: 0.2 }}>
        <span className="flex flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-wider">
          <PenTool size={16} /> {label}
        </span>
      </motion.div>
    </motion.div>
  );
}