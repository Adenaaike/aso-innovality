import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, JOURNAL_CATEGORIES } from "@/lib/journal";
import { PostCard } from "@/components/journal/PostCard";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Journal — Design, Web & Automation Insights",
  description: "Pricing guides, project stories, process breakdowns and practical tips on brand design, websites, SEO and automation from ASO INNOVALITY in Lagos.",
  alternates: { canonical: "/journal" },
};

export default async function Journal({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category = "all" } = await searchParams;
  const posts = await getPosts();

  const tabs = [{ value: "all", label: "All" }, ...JOURNAL_CATEGORIES]
    .map((t) => ({ ...t, count: t.value === "all" ? posts.length : posts.filter((p) => p.category === t.value).length }))
    .filter((t) => t.value === "all" || t.count > 0);
  const active = tabs.find((t) => t.value === category) ?? tabs[0];
  const shown = active.value === "all" ? posts : posts.filter((p) => p.category === active.value);
  const [lead, ...rest] = shown;

  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">JOURNAL</p>
      <h1 className="mt-4 max-w-3xl font-display text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.05]">
        Ideas, process and <span className="aso-text-gradient">practical insight.</span>
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        Pricing guides, project stories and tips on brand design, websites and automation, written from real work.
      </p>

      {tabs.length > 1 && (
        <nav aria-label="Filter by category" className="mt-10 flex flex-wrap gap-2">
          {tabs.map((t) => {
            const on = t.value === active.value;
            return (
              <Link key={t.value} href={t.value === "all" ? "/journal" : `/journal?category=${t.value}`} scroll={false}
                aria-current={on ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${on ? "border-royal bg-royal text-white" : "border-line hover:border-royal hover:text-royal"}`}>
                {t.label}
                <span className={`rounded-full px-1.5 text-xs ${on ? "bg-white/20" : "bg-surface text-muted"}`}>{t.count}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {!lead ? (
        <div className="mt-12 rounded-lg border border-dashed border-line p-12 text-center">
          <p className="font-display text-xl font-semibold">First articles coming soon.</p>
          <p className="mt-2 text-sm text-muted">In the meantime, explore my work or get an instant estimate.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/work" className="rounded-full border border-line px-5 py-2.5 text-sm font-medium hover:border-royal hover:text-royal">See my work</Link>
            <Link href="/estimate" className="rounded-full bg-royal px-5 py-2.5 text-sm font-medium text-white hover:bg-bright">Get an estimate</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-10"><PostCard p={lead} large /></div>
          {rest.length > 0 && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => <PostCard key={p.id} p={p} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}