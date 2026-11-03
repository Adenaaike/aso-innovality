"use client";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const WORDS = ["IDEAS.", "IDENTITY.", "INNOVATION."];
const EASE = [0.22, 1, 0.36, 1] as const;

function Gradient({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1177FF" />
        <stop offset="55%" stopColor="#21A9FF" />
        <stop offset="100%" stopColor="#9BD9FE" />
      </linearGradient>
    </defs>
  );
}

// IDEAS: a spark. The core pops in, rays burst out, a ripple pulses.
function IdeasVisual({ g }: { g: string }) {
  return (
    <svg viewBox="0 0 120 120" className="size-full overflow-visible">
      <Gradient id={g} />
      {Array.from({ length: 8 }, (_, i) => i * 45).map((deg, i) => (
        <g key={deg} transform={`rotate(${deg} 60 60)`}>
          <motion.line x1="60" y1="24" x2="60" y2="6" stroke={`url(#${g})`} strokeWidth="5" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.05, ease: EASE }} />
        </g>
      ))}
      <motion.circle cx="60" cy="60" r="22" fill="none" stroke="#48B7FF" strokeWidth="2"
        initial={{ scale: 1, opacity: 0.7 }} animate={{ scale: 1.9, opacity: 0 }}
        transition={{ duration: 1.6, delay: 0.5, repeat: Infinity, ease: "easeOut" }} />
      <motion.circle cx="60" cy="60" r="22" fill={`url(#${g})`}
        initial={{ scale: 0 }} animate={{ scale: [0, 1.15, 1] }} transition={{ duration: 0.6, ease: EASE }} />
    </svg>
  );
}

// IDENTITY: fingerprint-like arcs drawing around an ASO monogram.
function IdentityVisual({ g }: { g: string }) {
  return (
    <svg viewBox="0 0 120 120" className="size-full overflow-visible">
      <Gradient id={g} />
      {[22, 32, 42, 52].map((r, i) => (
        <motion.circle key={r} cx="60" cy="60" r={r} fill="none" stroke={`url(#${g})`} strokeWidth="4" strokeLinecap="round"
          initial={{ pathLength: 0, rotate: -90 + i * 45 }} animate={{ pathLength: 0.76 }}
          transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }} />
      ))}
      <motion.text x="60" y="65" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1177FF" letterSpacing="1"
        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.4 }}>
        ASO
      </motion.text>
    </svg>
  );
}

// INNOVATION: an orbit system with rings, satellites and a glowing core.
function InnovationVisual({ g }: { g: string }) {
  return (
    <svg viewBox="0 0 120 120" className="size-full overflow-visible">
      <Gradient id={g} />
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}>
        {[0, 60, 120].map((deg, i) => (
          <g key={deg} transform={`rotate(${deg} 60 60)`}>
            <motion.ellipse cx="60" cy="60" rx="50" ry="18" fill="none" stroke={`url(#${g})`} strokeWidth="2.5" opacity="0.75"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }} />
            <motion.circle cx="110" cy="60" r="5" fill="#1177FF"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 + i * 0.1 }} />
          </g>
        ))}
      </motion.g>
      <motion.circle cx="60" cy="60" r="12" fill={`url(#${g})`}
        initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.6, ease: EASE }} />
    </svg>
  );
}

const VISUALS = [IdeasVisual, IdentityVisual, InnovationVisual];

export function SignatureWords({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const gid = "sig" + useId().replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % WORDS.length), 2400);
    return () => clearInterval(t);
  }, [reduce]);

  if (reduce) return <p className={`font-display font-bold aso-text-gradient ${className}`}>{WORDS.join(" ")}</p>;

  const Visual = VISUALS[i];

  return (
    <div className={`flex items-center justify-between gap-3 sm:gap-6 font-display font-bold leading-none ${className}`}>
      <p className="min-w-0">
        <span className="sr-only">Ideas. Identity. Innovation.</span>
        <span aria-hidden className="relative block h-[1.1em] overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={WORDS[i]} className="block aso-text-gradient"
              initial={{ y: "105%", opacity: 0, filter: "blur(10px)", skewY: 6 }}
              animate={{ y: "0%", opacity: 1, filter: "blur(0px)", skewY: 0 }}
              exit={{ y: "-105%", opacity: 0, filter: "blur(6px)", skewY: -4 }}
              transition={{ duration: 0.75, ease: EASE }}>
              {WORDS[i]}
            </motion.span>
          </AnimatePresence>
        </span>
      </p>

      <div aria-hidden className="relative block size-[0.9em] shrink-0 sm:size-[1.1em]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={i} className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.6, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 20 }} transition={{ duration: 0.6, ease: EASE }}>
            <Visual g={`${gid}-${i}`} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}