import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { SignatureWords } from "@/components/SignatureWords";
import { Reveal } from "@/components/Reveal";
import { services } from "@/lib/site";
import { publicClient } from "@/lib/supabase/public";

export const revalidate = 300;

type Featured = { slug: string; title: string; year: number | null; cover_url: string | null; category: { name: string } | null };

async function getFeatured(): Promise<Featured[]> {
  const sb = publicClient();
  if (!sb) return [];
  const { data } = await sb.from("projects")
    .select("slug, title, year, cover_url, category:categories(name)")
    .eq("published", true).eq("featured", true).order("sort_order").limit(4);
  return (data ?? []) as unknown as Featured[];
}

const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

export default async function Home() {
  const featured = await getFeatured();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-28 pb-16 lg:min-h-[100svh]">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_50%_at_78%_38%,#21A9FF40,transparent_70%),radial-gradient(40%_40%_at_15%_85%,#1177FF26,transparent_70%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="font-display text-xs font-semibold tracking-[0.35em] text-royal dark:text-light-azure">ASO INNOVALITY</p>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,6.25rem)] font-bold uppercase leading-[0.92] tracking-tight">
              I turn ideas into <span className="aso-text-gradient">visual experiences.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">Designing identities. Building impressions. Creating possibilities.</p>
            <p className="mt-3 max-w-xl text-muted">
              I’m Adenaike Sodiq Olusegun, a multidisciplinary creative designer working across brand identity, graphic design, photography, packaging and creative direction.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/work" className="group inline-flex items-center gap-2 rounded-full bg-royal px-7 py-4 font-medium text-white transition hover:bg-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal">
                Explore My Work <ArrowUpRight size={18} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-4 font-medium transition hover:border-royal hover:text-royal">
                Let’s Work Together
              </Link>
            </div>
          </div>
          <div className="h-[44vh] lg:col-span-5 lg:h-[68vh]"><HeroVisual /></div>
        </div>
      </section>

      {/* SIGNATURE */}
      <section className="border-y border-line bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6">
          <SignatureWords className="text-[clamp(3rem,12vw,10rem)] tracking-tight" />
        </div>
      </section>

      {/* SELECTED WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-24" aria-labelledby="works-title">
        <Reveal className="mb-12 flex items-end justify-between gap-6">
          <h2 id="works-title" className="font-display text-4xl font-bold md:text-6xl">Selected Works</h2>
          <Link href="/work" className="text-sm font-medium text-royal hover:underline dark:text-light-azure">View all projects →</Link>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-12">
          {(featured.length ? featured : Array.from({ length: 4 }, () => null)).map((p, i) => (
            <Reveal key={p?.slug ?? i} delay={i * 0.08} className={spans[i % 4]}>
              {p ? (
                <Link href={`/work/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-surface">
                    {p.cover_url && (
                      <Image src={p.cover_url} alt={p.title} fill sizes="(min-width:1024px) 58vw, 100vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <div className="mt-4 flex justify-between gap-4">
                    <h3 className="font-display text-xl font-semibold group-hover:text-royal">{p.title}</h3>
                    <p className="text-sm text-muted">{[p.category?.name, p.year].filter(Boolean).join(" · ")}</p>
                  </div>
                </Link>
              ) : (
                <div className="grid aspect-[4/3] place-items-center rounded-sm border border-dashed border-neutral-grey/60 bg-surface p-6 text-center">
                  <p className="text-sm text-muted"><strong className="block font-display text-fg">Project placeholder</strong>Publish a featured project from the admin dashboard to replace this.</p>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="bg-navy py-24 text-white" aria-labelledby="about-title">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <div className="grid aspect-[4/5] place-items-center rounded-sm border border-dashed border-white/25 bg-white/5 text-sm text-white/70">
              Portrait placeholder — upload in admin
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <p className="text-xs font-semibold tracking-[0.35em] text-sky">ABOUT ASO</p>
            <h2 id="about-title" className="mt-4 font-display text-4xl font-bold md:text-5xl">Creativity, strategy and attention to detail.</h2>
            <p className="mt-6 text-lg text-ice">
              Adenaike Sodiq Olusegun, professionally known as ASO, is a multidisciplinary creative designer, visual communicator and brand identity enthusiast passionate about transforming ideas into meaningful visual experiences.
            </p>
            <Link href="/about" className="mt-8 inline-flex items-center gap-2 font-medium text-sky hover:text-pale-blue">Read the full story <ArrowUpRight size={18} /></Link>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-6 py-24" aria-labelledby="services-title">
        <Reveal><h2 id="services-title" className="font-display text-4xl font-bold md:text-6xl">Services</h2></Reveal>
        <ul className="mt-12 divide-y divide-line border-y border-line">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.04}>
              <li>
                <Link href={`/services#${s.slug}`} className="group grid gap-2 py-8 md:grid-cols-12 md:items-baseline">
                  <span className="font-display text-sm text-muted md:col-span-1">{s.no}</span>
                  <span className="font-display text-2xl font-semibold transition group-hover:translate-x-2 group-hover:text-royal md:col-span-5 md:text-3xl">{s.title}</span>
                  <span className="text-muted md:col-span-6">{s.summary}</span>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* PLAYGROUND PREVIEW */}
      <section className="px-6 pb-24">
        <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-sm aso-gradient px-8 py-20 text-navy md:px-16">
          <p className="text-xs font-semibold tracking-[0.35em]">THE CREATIVE PLAYGROUND</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold md:text-6xl">A space where creativity meets experimentation.</h2>
          <p className="mt-6 max-w-xl text-lg">Set type, play with colour and test your eye for design.</p>
          <Link href="/playground" className="mt-10 inline-flex rounded-full bg-navy px-7 py-4 font-medium text-white hover:bg-royal">Enter the Playground</Link>
        </Reveal>
      </section>

      {/* PHILOSOPHY */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <Reveal>
          <blockquote className="font-display text-3xl font-medium leading-tight md:text-5xl">
            “Great design should do more than look good. It should <span className="aso-text-gradient">communicate, connect, inspire,</span> and create lasting impressions.”
          </blockquote>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="bg-navy py-28 text-center text-white">
        <Reveal className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-bold uppercase leading-[0.95]">
            Have an idea? <span className="aso-text-gradient">Let’s bring it to life.</span>
          </h2>
          <Link href="/contact" className="mt-12 inline-flex rounded-full bg-royal px-8 py-4 font-medium hover:bg-azure">Start a project</Link>
        </Reveal>
      </section>
    </>
  );
}