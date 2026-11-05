import Image from "next/image";
import Link from "next/link";
import { categoryLabel, readingTime, type Post } from "@/lib/journal";

export const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

export function PostCard({ p, large = false }: { p: Post; large?: boolean }) {
  return (
    <Link href={`/journal/${p.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-bg transition duration-300 hover:-translate-y-1 hover:border-royal hover:shadow-[0_24px_50px_-24px_#1177FF] ${large ? "md:flex-row" : ""}`}>
      <div className={`relative shrink-0 overflow-hidden bg-surface ${large ? "aspect-[16/9] md:aspect-auto md:w-3/5" : "aspect-[16/9]"}`}>
        {p.cover_url
          ? <Image src={p.cover_url} alt="" fill sizes={large ? "(min-width:768px) 60vw, 100vw" : "(min-width:768px) 33vw, 100vw"} className="object-cover transition duration-700 group-hover:scale-105" />
          : <div className="absolute inset-0 aso-gradient opacity-70" />}
      </div>
      <div className={`flex flex-1 flex-col p-6 ${large ? "md:p-8" : ""}`}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-royal dark:text-light-azure">{categoryLabel(p.category)}</p>
        <h3 className={`mt-2 font-display font-bold leading-snug ${large ? "text-2xl md:text-3xl" : "text-lg"}`}>{p.title}</h3>
        {p.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{p.excerpt}</p>}
        <p className="mt-auto pt-5 text-xs text-muted">{fmtDate(p.published_at)} · {readingTime(p.body)} min read</p>
      </div>
    </Link>
  );
}