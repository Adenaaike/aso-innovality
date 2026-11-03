"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const WORDS = ["IDEAS.", "IDENTITY.", "INNOVATION."];

export function SignatureWords({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % WORDS.length), 2400);
    return () => clearInterval(t);
  }, [reduce]);

  if (reduce) return <p className={`font-display font-bold aso-text-gradient ${className}`}>{WORDS.join(" ")}</p>;

  return (
    <p className={`font-display font-bold leading-none ${className}`}>
      <span className="sr-only">Ideas. Identity. Innovation.</span>
      <span aria-hidden className="relative block h-[1.1em] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={WORDS[i]} className="block aso-text-gradient"
            initial={{ y: "105%", opacity: 0, filter: "blur(10px)", skewY: 6 }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)", skewY: 0 }}
            exit={{ y: "-105%", opacity: 0, filter: "blur(6px)", skewY: -4 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>
            {WORDS[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}