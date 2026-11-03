"use client";
import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { stats, countries } from "@/lib/site";
import { Flag } from "@/components/home/Flag";

function Count({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) { setN(to); return; }
    const c = animate(0, to, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, to]);

  return <span ref={ref}>{n}{suffix}</span>;
}

export function Stats() {
  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col-reverse gap-2 border-t border-line pt-5">
          <dt className="text-sm text-muted">
            {s.label}
            {s.flags && (
              <span className="mt-2 flex flex-wrap gap-1.5">
                {countries.map((c) => <Flag key={c.code} code={c.code} name={c.name} />)}
              </span>
            )}
          </dt>
          <dd className="font-display text-4xl font-bold md:text-5xl">
            <span className="sr-only">{s.value}{s.suffix}</span>
            <span aria-hidden><Count to={s.value} suffix={s.suffix} /></span>
          </dd>
        </div>
      ))}
    </dl>
  );
}