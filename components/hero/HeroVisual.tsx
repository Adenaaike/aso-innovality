"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

function StaticOrb() {
  return (
    <div aria-hidden className="grid h-full place-items-center">
      <div className="aspect-square w-3/4 max-w-md rounded-full aso-gradient opacity-90 shadow-[0_40px_120px_-20px_#1177FF88]" />
    </div>
  );
}

const HeroOrb = dynamic(() => import("./HeroOrb"), { ssr: false, loading: StaticOrb });

export function HeroVisual() {
  const reduce = useReducedMotion();
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const lowPower = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4 || nav.connection?.saveData;
    const webgl = !!document.createElement("canvas").getContext("webgl2");
    setUse3D(!reduce && !lowPower && webgl);
  }, [reduce]);

  return use3D ? <HeroOrb /> : <StaticOrb />;
}