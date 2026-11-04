import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PRACTICES } from "@/lib/practices";

export function PracticeCards({ heading = true }: { heading?: boolean }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20" aria-labelledby={heading ? "practices-title" : undefined}>
      {heading && (
        <>
          <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">THREE PRACTICES, ONE STUDIO</p>
          <h2 id="practices-title" className="mt-4 max-w-3xl font-display text-2xl font-bold md:text-3xl">
            Everything your brand needs to <span className="aso-text-gradient">look, work and grow.</span>
          </h2>
        </>
      )}
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {PRACTICES.map((p) => {
          const Icon = p.Icon;
          return (
            <div key={p.key}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-line bg-bg p-6 transition duration-300 hover:-translate-y-1 hover:border-royal hover:shadow-[0_24px_50px_-24px_#1177FF]">
              <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 aso-gradient transition-transform duration-500 group-hover:scale-x-100" />
              <span className="grid size-12 place-items-center rounded-full bg-royal/10 text-royal transition duration-300 group-hover:bg-royal group-hover:text-white dark:text-light-azure">
                <Icon size={22} />
              </span>
              <p className="mt-5 text-[10px] font-semibold tracking-[0.3em] text-muted">{p.word}</p>
              <h3 className="mt-1 font-display text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
              <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6 text-sm font-medium">
                <Link href={p.href} className="inline-flex items-center gap-1 text-royal after:absolute after:inset-0 dark:text-light-azure">
                  Explore <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link href={`${p.href}#estimate`} className="relative z-10 text-muted hover:text-royal">Get an estimate</Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}