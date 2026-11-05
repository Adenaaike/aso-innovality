import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getPost, getPosts, categoryLabel, readingTime } from "@/lib/journal";
import { Markdown } from "@/components/journal/Markdown";
import { PostCard, fmtDate } from "@/components/journal/PostCard";
import { site } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

const HUB_FOR: Record<string, { href: string; label: string }> = {
  design: { href: "/design", label: "Design Studio" },
  web: { href: "/web", label: "Web & SEO" },
  ai: { href: "/ai", label: "AI & Automation" },
  process: { href: "/services", label: "Services" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) return { title: "Article not found" };
  const title = p.seo_title || p.title;
  const description = p.seo_description || p.excerpt || undefined;
  return {
    title, description,
    alternates: { canonical: `/journal/${p.slug}` },
    openGraph: { type: "article", title, description, images: p.cover_url ? [p.cover_url] : undefined, publishedTime: p.published_at ?? undefined },
  };
}

export default async function Article({ params }: Props) {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) notFound();

  const all = await getPosts();
  const sameTopic = all.filter((x) => x.id !== p.id && x.category === p.category);
  const more = (sameTopic.length ? sameTopic : all.filter((x) => x.id !== p.id)).slice(0, 3);
  const hub = HUB_FOR[p.category] ?? HUB_FOR.process;

  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt ?? undefined,
    image: p.cover_url ?? undefined,
    datePublished: p.published_at ?? undefined,
    dateModified: p.updated_at,
    author: { "@type": "Person", name: site.name, url: site.url },
    publisher: { "@type": "Organization", name: "ASO Innovality", url: site.url },
    mainEntityOfPage: `${site.url}/journal/${p.slug}`,
  };

  return (
    <article className="pt-28 pb-24">
      <header className="mx-auto max-w-3xl px-6">
        <Link href="/journal" className="inline-flex items-center gap-1 text-sm text-muted hover:text-royal"><ArrowLeft size={14} /> Journal</Link>
        <Link href={`/journal?category=${p.category}`}
          className="mt-8 block text-xs font-semibold uppercase tracking-[0.3em] text-royal hover:underline dark:text-light-azure">
          {categoryLabel(p.category)}
        </Link>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.08]">{p.title}</h1>
        {p.excerpt && <p className="mt-5 text-lg leading-relaxed text-muted">{p.excerpt}</p>}
        <p className="mt-6 text-sm text-muted">By {site.name} · {fmtDate(p.published_at)} · {readingTime(p.body)} min read</p>
      </header>

      {p.cover_url && (
        <div className="mx-auto mt-10 max-w-5xl px-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <Image src={p.cover_url} alt="" fill priority sizes="(min-width:1024px) 1024px, 100vw" className="object-cover" />
          </div>
        </div>
      )}

      <div className="mx-auto mt-12 max-w-3xl px-6">
        <Markdown>{p.body}</Markdown>
      </div>

      <aside className="mx-auto mt-16 max-w-3xl px-6">
        <div className="rounded-lg bg-navy p-8 text-white md:p-10">
          <p className="text-xs font-semibold tracking-[0.25em] text-sky">WORK WITH ME</p>
          <h2 className="mt-3 font-display text-2xl font-bold">Ready to start your project?</h2>
          <p className="mt-2 text-ice/80">See what I offer in {hub.label}, or get an instant estimate in about 60 seconds.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={hub.href} className="inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 text-sm font-medium hover:bg-azure">
              Explore {hub.label} <ArrowUpRight size={16} />
            </Link>
            <Link href="/estimate" className="inline-flex rounded-full border border-white/25 px-6 py-3 text-sm font-medium hover:border-sky">Get an estimate</Link>
          </div>
        </div>
      </aside>

      {more.length > 0 && (
        <section className="mx-auto mt-20 max-w-6xl px-6" aria-labelledby="more-title">
          <h2 id="more-title" className="font-display text-2xl font-bold">More from the Journal</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((x) => <PostCard key={x.id} p={x} />)}
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </article>
  );
}