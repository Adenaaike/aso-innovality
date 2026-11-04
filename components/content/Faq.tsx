import Link from "next/link";
import { Plus } from "lucide-react";
import type { Faq } from "@/lib/content";

export function FaqSection({ items }: { items: Faq[] }) {
  if (!items.length) return null;
  const ld = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-20" aria-labelledby="faq-title">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">FAQ</p>
          <h2 id="faq-title" className="mt-4 font-display text-2xl font-bold md:text-3xl">Questions clients often ask</h2>
          <p className="mt-3 text-sm text-muted">Can’t find your answer? <Link href="/contact" className="text-royal hover:underline dark:text-light-azure">Get in touch</Link>.</p>
        </div>
        <div className="divide-y divide-line border-y border-line lg:col-span-8">
          {items.map((f) => (
            <details key={f.id} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold [&::-webkit-details-marker]:hidden">
                {f.question}
                <Plus size={18} className="shrink-0 text-royal transition group-open:rotate-45 dark:text-light-azure" />
              </summary>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </section>
  );
}