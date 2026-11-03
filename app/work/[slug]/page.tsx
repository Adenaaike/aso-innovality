import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getProject, getPublishedProjects } from "@/lib/projects";
import { ProjectGallery } from "@/components/work/ProjectGallery";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return { title: "Project not found" };
  const description = p.seo_description || p.summary || p.overview?.slice(0, 155) || undefined;
  return {
    title: p.seo_title ? { absolute: p.seo_title } : p.title,
    description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: p.seo_title || p.title, description, type: "article", images: p.cover_url ? [{ url: p.cover_url }] : undefined },
  };
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const [p, all] = await Promise.all([getProject(slug), getPublishedProjects()]);
  if (!p) notFound();

  const i = all.findIndex((x) => x.slug === p.slug);
  const prev = all.length > 1 ? all[(i - 1 + all.length) % all.length] : null;
  const next = all.length > 1 ? all[(i + 1) % all.length] : null;
  const coverImg = p.images.find((img) => img.url === p.cover_url);
  const gallery = p.images.filter((img) => img.url !== p.cover_url);

  const meta = ([
    ["Client", p.client], ["Role", p.role], ["Year", p.year ? String(p.year) : null],
    ["Duration", p.duration], ["Location", p.location], ["Industry", p.industry],
  ] as [string, string | null][]).filter(([, v]) => v) as [string, string][];

  const blocks = [
    { label: "Background", text: p.overview },
    { label: "The challenge", text: p.challenge },
    { label: "Creative strategy", text: p.concept },
    { label: "Design execution", points: p.execution },
    { label: "Final solution", text: p.outcome },
    { label: "Process notes", text: p.process },
  ].filter((b) => b.text || b.points?.length);

  const ld = {
    "@context": "https://schema.org", "@type": "CreativeWork", name: p.title,
    description: p.summary ?? undefined, image: p.cover_url ?? undefined,
    dateCreated: p.year ? String(p.year) : undefined, keywords: p.tags.join(", ") || undefined,
    url: `${site.url}/work/${p.slug}`, creator: { "@type": "Person", name: site.name, url: site.url },
  };

  const label = "font-display text-xs font-semibold uppercase tracking-[0.2em] text-muted";

  return (
    <article className="mx-auto max-w-6xl px-6 pt-28 pb-24">
      <Link href="/work" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-royal"><ArrowLeft size={14} /> All work</Link>

      <header className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          {p.category && <p className="text-xs font-semibold uppercase tracking-[0.3em] text-royal dark:text-light-azure">{p.category.name}</p>}
          <h1 className="mt-4 font-display text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.05]">{p.title}</h1>
          {p.summary && <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">{p.summary}</p>}
        </div>
        {meta.length > 0 && (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 lg:col-span-5">
            {meta.map(([k, v]) => (
              <div key={k}><dt className="text-xs uppercase tracking-wider text-muted">{k}</dt><dd className="mt-1 text-sm font-medium">{v}</dd></div>
            ))}
          </dl>
        )}
      </header>

      {p.palette.length > 0 && (
        <div aria-hidden className="mt-10 flex h-1.5 overflow-hidden rounded-full">
          {p.palette.map((s, n) => <span key={n} className="flex-1" style={{ background: s.hex }} />)}
        </div>
      )}

      {p.cover_url && (
        <figure className="mt-10">
          <div className="overflow-hidden rounded-lg bg-surface">
            <Image src={p.cover_url} alt={coverImg?.alt || p.title} width={2000} height={2000} loading="eager"
              sizes="(min-width:1152px) 1104px, 100vw" className="mx-auto h-auto max-h-[65vh] w-auto max-w-full" />
          </div>
          {coverImg?.caption && <figcaption className="mt-3 text-sm text-muted">{coverImg.caption}</figcaption>}
        </figure>
      )}

      <div className="mt-20 space-y-16">
        {blocks.map((b, n) => (
          <Reveal key={b.label}>
            <section className="grid gap-4 md:grid-cols-12">
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-royal md:col-span-3 dark:text-light-azure">
                <span className="text-muted">{String(n + 1).padStart(2, "0")}</span> {b.label}
              </h2>
              {b.points ? (
                <div className="grid gap-4 sm:grid-cols-2 md:col-span-9">
                  {b.points.map((x, k) => (
                    <div key={k} className="rounded-lg border border-line p-5">
                      <h3 className="font-display text-sm font-semibold">{x.label}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{x.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-base leading-relaxed md:col-span-8 md:text-lg">{b.text}</p>
              )}
            </section>
          </Reveal>
        ))}
      </div>

      {(p.deliverables.length > 0 || p.services.length > 0 || p.palette.length > 0) && (
        <div className="mt-20 grid gap-10 border-t border-line pt-12 md:grid-cols-3">
          {p.deliverables.length > 0 && (
            <div>
              <h2 className={label}>Deliverables</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {p.deliverables.map((d) => <li key={d} className="flex gap-2.5"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-royal" />{d}</li>)}
              </ul>
            </div>
          )}
          {p.services.length > 0 && (
            <div>
              <h2 className={label}>Services</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {p.services.map((s) => <li key={s} className="flex gap-2.5"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-sky" />{s}</li>)}
              </ul>
            </div>
          )}
          {p.palette.length > 0 && (
            <div>
              <h2 className={label}>Colour palette</h2>
              <ul className="mt-4 space-y-3">
                {p.palette.map((s, n) => (
                  <li key={n} className="flex items-center gap-3">
                    <span className="size-9 shrink-0 rounded-md ring-1 ring-line" style={{ background: s.hex }} />
                    <span><span className="block text-sm font-medium">{s.name}</span><span className="font-mono text-xs text-muted">{s.hex}</span></span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {p.tags.length > 0 && (
        <ul className="mt-10 flex flex-wrap gap-2">
          {p.tags.map((t) => <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-muted">{t}</li>)}
        </ul>
      )}

      {gallery.length > 0 && (
        <section className="mt-20" aria-labelledby="gallery-title">
          <h2 id="gallery-title" className="mb-8 font-display text-2xl font-bold">Gallery</h2>
          <ProjectGallery images={gallery} title={p.title} />
        </section>
      )}

      {prev && next && (
        <nav aria-label="More projects" className="mt-24 grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
          <Link href={`/work/${prev.slug}`} className="group rounded-lg border border-line p-5 transition hover:border-royal">
            <span className="flex items-center gap-1.5 text-xs text-muted"><ArrowLeft size={14} /> Previous project</span>
            <span className="mt-2 block font-display font-semibold group-hover:text-royal">{prev.title}</span>
          </Link>
          <Link href={`/work/${next.slug}`} className="group rounded-lg border border-line p-5 text-right transition hover:border-royal">
            <span className="flex items-center justify-end gap-1.5 text-xs text-muted">Next project <ArrowRight size={14} /></span>
            <span className="mt-2 block font-display font-semibold group-hover:text-royal">{next.title}</span>
          </Link>
        </nav>
      )}

      <div className="mt-16 rounded-lg aso-gradient px-8 py-12 text-center text-navy">
        <h2 className="font-display text-2xl font-bold md:text-3xl">Have a project like this in mind?</h2>
        <Link href="/contact" className="mt-6 inline-flex rounded-full bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-royal">Start a project</Link>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </article>
  );
}