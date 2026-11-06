"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Lightweight illustrated version of the 3D shapes (uses brand colour settings, so Remix recolours it)
function StaticShapes() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="hv-crystal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-aqua)" }} />
          <stop offset="0.5" style={{ stopColor: "var(--color-pale-blue)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-azure)" }} />
        </linearGradient>
        <linearGradient id="hv-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-light-azure)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-royal)" }} />
        </linearGradient>
        <radialGradient id="hv-sphere" cx="0.35" cy="0.35" r="0.75">
          <stop offset="0" style={{ stopColor: "#FFFFFF" }} />
          <stop offset="0.45" style={{ stopColor: "var(--color-ice)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-azure)" }} />
        </radialGradient>
      </defs>

      {/* Crystal */}
      <g className="hv-float">
        <polygon points="200,66 266,104 266,180 200,218 134,180 134,104" fill="url(#hv-crystal)" />
        <polygon points="200,66 266,104 200,142 134,104" style={{ fill: "#FFFFFF" }} opacity="0.4" />
        <polygon points="200,142 266,104 266,180 200,218" style={{ fill: "var(--color-royal)" }} opacity="0.28" />
        <polygon points="134,104 200,142 200,218 134,180" style={{ fill: "var(--color-sky)" }} opacity="0.12" />
      </g>

      {/* Ring */}
      <g className="hv-float hv-float-slow">
        <ellipse cx="300" cy="228" rx="34" ry="24" fill="none" stroke="url(#hv-ring)" strokeWidth="14" transform="rotate(-28 300 228)" />
      </g>

      {/* Sphere */}
      <g className="hv-float hv-float-fast">
        <circle cx="100" cy="78" r="17" fill="url(#hv-sphere)" />
      </g>
    </svg>
  );
}

// The live 3D scene, downloaded only when it will actually be shown
const HeroOrb = dynamic(() => import("@/components/hero/HeroOrb"), { ssr: false, loading: () => <StaticShapes /> });

export function HeroVisual() {
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!wide || still || saveData) return; // phones, reduced motion and data saver keep the illustration

    const start = () => setUse3D(true);
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(start, { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(start, 1200);
    return () => clearTimeout(t);
  }, []);

  return <div className="relative h-full w-full">{use3D ? <HeroOrb /> : <StaticShapes />}</div>;
}

export default HeroVisual;