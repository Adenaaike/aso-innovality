import Link from "next/link";
import type { Package } from "@/lib/content";

export function Packages({ items }: { items: Package[] }) {
  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20" aria-labelledby="packages-title">
      <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">WAYS TO WORK TOGETHER</p>
      <h2 id="packages-title" className="mt-4 font-display text-2xl font-bold md:text-3xl">Flexible engagements for every stage.</h2>
      <div className={`mt-10 grid gap-5 md:grid-cols-2 ${items.length >= 3 ? "lg:grid-cols-3" : ""}`}>
        {items.map((p) => (
          <div key={p.id}
            className={`group relative flex flex-col rounded-lg border p-6 transition duration-300 hover:-translate-y-1 hover:border-royal hover:shadow-[0_24px_50px_-24px_#1177FF] ${p.highlighted ? "border-royal shadow-[0_20px_50px_-25px_#1177FF]" : "border-line"}`}>
            <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 rounded-t-lg aso-gradient transition-transform duration-500 group-hover:scale-x-100" />
            {p.highlighted && (
              <span className="absolute -top-3 left-6 rounded-full bg-royal px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">Most popular</span>
            )}
            <h3 className="font-display text-lg font-bold">{p.name}</h3>
            {p.tagline && <p className="mt-1 text-sm text-muted">{p.tagline}</p>}
            {p.price_from && (
              <p className="mt-5 font-display text-2xl font-bold transition duration-300 group-hover:text-royal dark:group-hover:text-light-azure">{p.price_from}</p>
            )}
            {p.features.length > 0 && (
              <ul className="mt-5 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-royal transition duration-300 group-hover:scale-125" />{f}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-auto pt-6">
              <Link href="/contact" className={`inline-flex rounded-full px-5 py-2.5 text-sm font-medium transition ${p.highlighted ? "bg-royal text-white hover:bg-bright" : "border border-line group-hover:border-royal group-hover:text-royal"}`}>
                Get started
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}