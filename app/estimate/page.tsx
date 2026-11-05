import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PRACTICES } from "@/lib/practices";

export const metadata: Metadata = {
  title: "Instant Cost Estimate — Design, Web & AI Automation",
  description: "Get an instant estimate for a design project, a website or an automation with ASO INNOVALITY. Choose a practice and price it in about 60 seconds.",
  alternates: { canonical: "/estimate" },
};

export default function EstimateChooser() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">INSTANT ESTIMATE</p>
      <h1 className="mt-4 max-w-3xl font-display text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.05]">
        What would you like <span className="aso-text-gradient">to price?</span>
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        Choose a practice to open its calculator. It takes about 60 seconds, and you can send the estimate straight to me on WhatsApp.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {PRACTICES.map((p) => {
          const Icon = p.Icon;
          return (
            <Link key={p.key} href={`${p.href}#estimate`}
              className={`accent-${p.key} glow-card group relative flex min-h-64 flex-col overflow-hidden rounded-lg border border-line bg-bg p-7`}>
              <span aria-hidden className="accent-gradient absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-3xl transition duration-500 group-hover:opacity-30" />
              <span className="accent-icon relative grid size-14 place-items-center rounded-full"><Icon size={26} /></span>
              <p className="relative mt-6 text-[10px] font-semibold tracking-[0.3em] text-muted">{p.title.toUpperCase()}</p>
              <h2 className="relative mt-1 font-display text-2xl font-bold">{p.estimateLabel}</h2>
              <p className="relative mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
              <span className="accent-text relative mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium">
                Open calculator <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}