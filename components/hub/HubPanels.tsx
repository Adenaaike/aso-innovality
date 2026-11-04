"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function HubPanels({ items }: { items: { slug: string; title: string; cover: string }[] }) {
  const [active, setActive] = useState(0);

  if (!items.length) return <div aria-hidden className="hidden h-[440px] rounded-lg aso-gradient opacity-80 lg:block" />;

  // A single project: show it as one wide card, so screenshots aren't cropped
  if (items.length === 1) {
    const p = items[0];
    return (
      <Link href={`/work/${p.slug}`} data-cursor="View project"
        className="group relative block aspect-[16/10] overflow-hidden rounded-lg shadow-[0_30px_60px_-30px_#1177FF]">
        <Image src={p.cover} alt={p.title} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover object-top transition duration-700 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
        <p className="absolute inset-x-0 bottom-0 p-5 font-display text-base font-semibold text-white">{p.title}</p>
      </Link>
    );
  }

  return (
    <>
      <div className="hidden h-[440px] gap-2 lg:flex">
        {items.map((p, i) => {
          const on = i === active;
          return (
            <Link key={p.slug} href={`/work/${p.slug}`} data-cursor="View project" onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}
              className={`relative basis-0 overflow-hidden rounded-lg transition-[flex-grow] duration-500 ease-out ${on ? "grow-[5]" : "grow"}`}>
              <Image src={p.cover} alt={p.title} fill sizes="40vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                {on
                  ? <p className="font-display text-base font-semibold">{p.title}</p>
                  : <p className="max-h-60 rotate-180 font-display text-xs font-semibold whitespace-nowrap [writing-mode:vertical-rl]">{p.title}</p>}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] lg:hidden">
        {items.map((p) => (
          <Link key={p.slug} href={`/work/${p.slug}`} className="relative aspect-[4/5] w-40 shrink-0 overflow-hidden rounded-lg">
            <Image src={p.cover} alt={p.title} fill sizes="160px" className="object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 to-transparent p-3 text-xs font-semibold text-white">{p.title}</span>
          </Link>
        ))}
      </div>
    </>
  );
}