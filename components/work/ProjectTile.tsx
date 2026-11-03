import Link from "next/link";
import Image from "next/image";
import type { ProjectCard } from "@/lib/projects";

export function ProjectTile({ p, eager = false }: { p: ProjectCard; eager?: boolean }) {
  return (
    <Link href={`/work/${p.slug}`} data-cursor="View project" className="group block break-inside-avoid">
      <div className="relative overflow-hidden rounded-lg bg-surface">
        {p.cover_url ? (
          <Image src={p.cover_url} alt={p.title} width={1600} height={1600}
            sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw" loading={eager ? "eager" : "lazy"}
            className="h-auto w-full transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="grid aspect-[4/5] place-items-center text-xs text-muted">No cover yet</div>
        )}
        {(p.summary || p.overview) && (
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-navy/85 via-navy/20 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
            <p className="line-clamp-3 text-xs leading-relaxed text-white">{p.summary || p.overview}</p>
          </div>
        )}
      </div>
      <h2 className="mt-2.5 truncate font-display text-sm font-semibold group-hover:text-royal">{p.title}</h2>
      <p className="mt-0.5 text-xs text-muted">{[p.category?.name, p.year].filter(Boolean).join(" · ")}</p>
    </Link>
  );
}