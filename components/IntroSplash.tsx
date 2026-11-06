"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const WORDS = ["IDEAS.", "IDENTITY.", "INNOVATION."];
const EASE = [0.22, 1, 0.36, 1] as const;

// First-page intro: Ideas → Identity → Innovation → wordmark, about 1.5s, once per visit
export function IntroSplash() {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState(0); // 0–2 = words, 3 = wordmark

  useEffect(() => {
    if (document.documentElement.dataset.introSeen === "1") { setShow(false); return; }
    try { sessionStorage.setItem("aso-intro-seen", "1"); } catch {}
    document.body.style.overflow = "hidden";
    const timers = [
      setTimeout(() => setPhase(1), 280),
      setTimeout(() => setPhase(2), 560),
      setTimeout(() => setPhase(3), 840),
      setTimeout(() => setShow(false), 1500),
    ];
    const skip = () => setShow(false);
    window.addEventListener("keydown", skip);
    return () => { timers.forEach(clearTimeout); window.removeEventListener("keydown", skip); };
  }, []);

  useEffect(() => { if (!show) document.body.style.overflow = ""; }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div aria-hidden onClick={() => setShow(false)}
          className="aso-intro fixed inset-0 z-[80] grid cursor-pointer place-items-center bg-navy text-white"
          exit={{ opacity: 0, transition: { duration: 0.4, ease: EASE } }}>
          <div className="relative h-28 w-full">
            <AnimatePresence mode="wait">
              {phase < 3 ? (
                <motion.p key={phase}
                  initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
                  transition={{ duration: 0.16, ease: EASE }}
                  className="absolute inset-0 grid place-items-center font-display text-[clamp(2.5rem,9vw,6rem)] font-bold tracking-tight">
                  <span className="aso-text-gradient">{WORDS[phase]}</span>
                </motion.p>
              ) : (
                <motion.p key="mark"
                  initial={{ opacity: 0, letterSpacing: "0.6em" }}
                  animate={{ opacity: 1, letterSpacing: "0.3em" }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="absolute inset-0 grid place-items-center font-display text-lg font-bold md:text-2xl">
                  <span>ASO<span className="aso-text-gradient">&nbsp;INNOVALITY</span></span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <motion.span aria-hidden className="absolute bottom-[18%] left-1/2 h-0.5 w-40 -translate-x-1/2 origin-left rounded-full aso-gradient"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4, ease: "linear" }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}