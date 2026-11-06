"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const WORDS = [
  { word: "brands.", key: "design" },
  { word: "websites.", key: "web" },
  { word: "automations.", key: "ai" },
];
const EASE = [0.22, 1, 0.36, 1] as const;

// Rotating last word of the hero headline, each in its practice colour
export function RotatingWord() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, [reduce]);

  if (reduce) {
    return <span aria-hidden className="accent-design accent-text-gradient">brands, websites and automations.</span>;
  }

  return (
    <span aria-hidden className="relative inline-grid overflow-hidden align-bottom">
      {/* Reserves the width of the longest word so the layout never jumps */}
      <span className="invisible col-start-1 row-start-1">automations.</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={WORDS[i].word}
          initial={{ y: "70%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-70%", opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className={`accent-${WORDS[i].key} accent-text-gradient col-start-1 row-start-1`}>
          {WORDS[i].word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}