import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { SignatureWords } from "@/components/SignatureWords";
import { Reveal } from "@/components/Reveal";
import { StatusCard } from "@/components/home/StatusCard";
import { Marquee } from "@/components/home/Marquee";
import { Stats } from "@/components/home/Stats";
import { services, steps } from "@/lib/site";
import { publicClient } from "@/lib/supabase/public";

export const revalidate = 300;

type Featured = {
  slug: string; title: string; year: number | null; cover_url: string | null;
  overview: string | null; category: { name: string } | null;
};

async function getFeatured(): Promise<Featured[]> {
  const sb = publicClient();
  if (!sb) return [];
  const { data } = await sb.from("projects")
    .select("slug, title, year, cover_url, overview, category:categories(name)")
    .eq("published", true).eq("featured", true).order("sort_order").limit(4);
  return (data ?? []) as unknown as Featured[];
}

const tools = [
  { id: "typography-lab", label: "Typography Lab" },
  { id: "palette", label: "Palette Generator" },
  { id: "colour-match", label: "Colour Match" },
  { id: "memory", label: "Design Memory" },
  { id: "logo-detective", label: "Logo Detective" },
  { id: "prompts", label: "Prompt Generator" },
];

function Eyebrow({ no, label, light = false }: { no: string; label: string; light?: boolean }) {
  return (
    <p className={`text-xs font-semibold tracking-[0.3em] ${light ? "text-navy" : "text-royal dark:text-light-azure"}`}>
      {no} — {label}
    </p>
  );
}

export default async function Home() {
  const featured = await getFeatured();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-28 pb-16 lg:min-h-[90svh] lg:pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_50%_at_78%_38%,#21A9FF33,transparent_70%),radial-gradient(40%_40%_at_15%_85%,#1177FF1F,transparent_70%)]" />
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <StatusCard />
            <h1 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.75rem)] font-bold uppercase leading-[1.02] tracking-tight">
              I turn ideas into <span className="aso-text-gradient">visual experiences.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted md:text-lg">Designing identities. Building impressions. Creating possibilities.</p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted md:text-base">
              I’m Adenaike Sodiq Olusegun, a multidisciplinary creative designer in Lagos working across brand identity, graphic design, photography, packaging and creative direction.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/work" className="group inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 text-sm font-medium text-white transition hover:bg-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-royal">
                Explore My Work <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium transition hover:border-royal hover:text-royal">
                Let’s Work Together
              </Link>
            </div>
          </div>
          <div className="h-[36vh] lg:col-span-5 lg:h-[56vh]"><HeroVisual /></div>
        </div>
      </section>

      <Marquee />

      {/* SIGNATURE */}
      <section className="bg-surface py-12">
        <div className="mx-auto max-w-6xl px-6">
          <SignatureWords className="text-[clamp(2.25rem,7vw,5.5rem)] tracking-tight" />
        </div>
      </section>

      {/* 01 — IDEAS */}
      <section className="mx-auto max-w-6xl px-6 py-24" aria-labelledby="ideas-title">
        <Reveal>
          <Eyebrow no="01" label="IDEAS" />
          <h2 id="ideas-title" className="mt-4 max-w-3xl font-display text-2xl font-medium leading-snug md:text-3xl">
            Great design should do more than look good. It should <span className="aso-text-gradient">communicate, connect, inspire,</span> and create lasting impressions.
          </h2>
        </Reveal>
        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.no} delay={i * 0.08}>
              <li className="h-full rounded-sm border border-line p-6 transition hover:border-royal">
                <span className="font-display text-sm text-royal dark:text-light-azure">{s.no}</span>
                <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <div className="mt-20"><Stats /></div>
      </section>

      {/* 02 — IDENTITY: Selected Works */}
      <section className="border-t border-line bg-surface/50 py-24" aria-labelledby="works-title">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow no="02" label="IDENTITY" />
              <h2 id="works-title" className="mt-4 font-display text-3xl font-bold md:text-4xl">Selected Works</h2>
            </div>
            <Link href="/work" className="text-sm font-medium text-royal hover:underline dark:text-light-azure">View all projects →</Link>
          </Reveal>

          <div className="columns-1 gap-6 md:columns-2 [&>*]:mb-6">
            {featured.length
              ? featured.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 0.08} className="break-inside-avoid">
                    <Link href={`/work/${p.slug}`} className="group block">
                      <div className="relative overflow-hidden rounded-sm bg-surface">
                        {p.cover_url ? (
                          <Image src={p.cover_url} alt={p.title} width={1600} height={1600} sizes="(min-width:768px) 50vw, 100vw"
                            className="h-auto w-full transition duration-700 group-hover:scale-[1.03]" />
                        ) : (
                          <div className="grid aspect-[4/3] place-items-center text-sm text-muted">No cover yet</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent opacity-0 transition group-hover:opacity-100" />
                      </div>
                      <div className="mt-3 flex justify-between gap-4">
                        <h3 className="font-display text-lg font-semibold group-hover:text-royal">{p.title}</h3>
                        <p className="shrink-0 text-sm text-muted">{[p.category?.name, p.year].filter(Boolean).join(" · ")}</p>
                      </div>
                      {p.overview && <p className="mt-1 line-clamp-2 text-sm text-muted">{p.overview}</p>}
                    </Link>
                  </Reveal>
                ))
              : ["aspect-square", "aspect-[4/5]", "aspect-[4/3]", "aspect-[3/4]"].map((ratio, i) => (
                  <Reveal key={ratio} delay={i * 0.08} className="break-inside-avoid">
                    <div className={`grid ${ratio} place-items-center rounded-sm border border-dashed border-neutral-grey/60 bg-bg p-6 text-center`}>
                      <p className="text-sm text-muted"><strong className="block font-display text-fg">Project placeholder</strong>Publish a featured project from the admin dashboard to replace this.</p>
                    </div>
                  </Reveal>
                ))}
          </div>

          {/* Services */}
          <Reveal className="mt-20"><h3 className="font-display text-2xl font-bold md:text-3xl">What I design</h3></Reveal>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.04}>
                <li>
                  <Link href={`/services#${s.slug}`} className="group grid gap-2 py-6 md:grid-cols-12 md:items-baseline">
                    <span className="font-display text-xs text-muted md:col-span-1">{s.no}</span>
                    <span className="font-display text-lg font-semibold transition group-hover:translate-x-1 group-hover:text-royal md:col-span-5 md:text-xl">{s.title}</span>
                    <span className="text-sm text-muted md:col-span-6">{s.summary}</span>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="bg-navy py-20 text-white" aria-labelledby="about-title">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <div className="grid aspect-[4/5] place-items-center rounded-sm border border-dashed border-white/25 bg-white/5 text-sm text-white/70">
              Portrait placeholder
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <p className="text-xs font-semibold tracking-[0.3em] text-sky">ABOUT ASO</p>
            <h2 id="about-title" className="mt-4 font-display text-3xl font-bold md:text-4xl">Creativity, strategy and attention to detail.</h2>
            <p className="mt-5 text-base leading-relaxed text-ice">
              Adenaike Sodiq Olusegun, professionally known as ASO, is a multidisciplinary creative designer, visual communicator and brand identity enthusiast passionate about transforming ideas into meaningful visual experiences.
            </p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-sky hover:text-pale-blue">Read the full story <ArrowUpRight size={16} /></Link>
          </Reveal>
        </div>
      </section>

      {/* 03 — INNOVATION */}
      <section className="px-6 py-24" aria-labelledby="innovation-title">
        <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-sm aso-gradient px-8 py-14 text-navy md:px-12">
          <Eyebrow no="03" label="INNOVATION" light />
          <h2 id="innovation-title" className="mt-4 max-w-2xl font-display text-3xl font-bold md:text-4xl">A space where creativity meets experimentation.</h2>
          <p className="mt-4 max-w-xl text-base">Free creative tools and design games, built by ASO. Set type, generate palettes and test your eye.</p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {tools.map((t) => (
              <li key={t.id}>
                <Link href={`/playground#${t.id}`} className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white">
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/playground" className="mt-8 inline-flex rounded-full bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-royal">Enter the Playground</Link>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="bg-navy py-20 text-center text-white">
        <Reveal className="mx-auto max-w-4xl px-6">
          <h2 className="font-display text-[clamp(1.75rem,4.5vw,3.25rem)] font-bold uppercase leading-[1.05]">
            Have an idea? <span className="aso-text-gradient">Let’s bring it to life.</span>
          </h2>
          <Link href="/contact" className="mt-10 inline-flex rounded-full bg-royal px-6 py-3 text-sm font-medium hover:bg-azure">Start a project</Link>
        </Reveal>
      </section>
    </>
  );
}