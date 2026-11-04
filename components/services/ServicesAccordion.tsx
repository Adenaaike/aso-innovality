"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { services } from "@/lib/site";

export function ServicesAccordion({ previews }: { previews: Record<string, string[]> }) {
  const [active, setActive] = useState(0);

  return (
    <>
      {/* Desktop: expanding panels */}
      <div className="hidden h-[420px] gap-2 lg:flex">
        {services.map((s, i) => {
          const on = active === i;
          const img = previews[s.slug]?.[0];
          return (
            <Link key={s.slug} href={`#${s.slug}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}
              className={`relative overflow-hidden rounded-lg transition-[flex-grow] duration-500 ease-out ${on ? "grow-[4]" : "grow"} basis-0`}>
              {img ? <Image src={img} alt="" fill sizes="50vw" className="object-cover" /> : <div className="absolute inset-0 aso-gradient" />}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/35 to-navy/10" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <span className="font-display text-xs opacity-80">{s.no}</span>
                {on ? (
                  <>
                    <p className="mt-1 font-display text-xl font-semibold">{s.title}</p>
                    <p className="mt-2 line-clamp-2 max-w-md text-sm text-ice">{s.summary}</p>
                  </>
                ) : (
                  <p className="mt-2 max-h-72 rotate-180 font-display text-sm font-semibold whitespace-nowrap [writing-mode:vertical-rl]">{s.title}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Phones and tablets: simple jump links */}
      <div className="flex flex-wrap gap-2 lg:hidden">
        {services.map((s) => (
          <Link key={s.slug} href={`#${s.slug}`} className="rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-royal hover:text-royal">
            {s.no} · {s.title}
          </Link>
        ))}
      </div>
    </>
  );
}