"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ProjectImage } from "@/lib/projects";

export function ProjectGallery({ images, title }: { images: ProjectImage[]; title: string }) {
    const [open, setOpen] = useState<number | null>(null);
  const swipeX = useRef<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const go = useCallback((d: number) => setOpen((i) => (i === null ? null : (i + d + images.length) % images.length)), [images.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, close, go]);

  if (!images.length) return null;
  const current = open !== null ? images[open] : null;
  const nav = "absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20";

  return (
    <>
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {images.map((img, i) => (
          <figure key={img.id} className="break-inside-avoid">
            <button type="button" onClick={() => setOpen(i)} data-cursor="View" aria-label={`Enlarge: ${img.alt || title}`}
              className="group block w-full overflow-hidden rounded-lg bg-surface">
              <Image src={img.url} alt={img.alt || title} width={1600} height={1600}
                                sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                className="h-auto w-full transition duration-500 group-hover:scale-[1.02]" />
            </button>
            {img.caption && <figcaption className="mt-2 text-xs leading-relaxed text-muted">{img.caption}</figcaption>}
          </figure>
        ))}
      </div>

      {current && open !== null && (
        <div role="dialog" aria-modal="true" aria-label={`Image ${open + 1} of ${images.length}`}
          className="fixed inset-0 z-[80] flex flex-col bg-navy/95 backdrop-blur" onClick={close}>
          <div className="flex items-center justify-between p-4 text-sm text-white/80">
            <span>{open + 1} / {images.length}</span>
            <button type="button" onClick={close} aria-label="Close" autoFocus
              className="grid size-10 place-items-center rounded-full text-white hover:bg-white/10"><X size={20} /></button>
          </div>
          <div className="relative flex-1 touch-pan-y" onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => { swipeX.current = e.clientX; }}
            onPointerUp={(e) => {
              if (swipeX.current === null) return;
              const dx = e.clientX - swipeX.current;
              swipeX.current = null;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            }}>
            <Image src={current.url} alt={current.alt || title} fill sizes="100vw" className="object-contain px-4 sm:px-16" />
            {images.length > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={`${nav} left-3`}><ChevronLeft size={22} /></button>
                <button type="button" onClick={() => go(1)} aria-label="Next image" className={`${nav} right-3`}><ChevronRight size={22} /></button>
              </>
            )}
          </div>
          <p className="mx-auto min-h-12 max-w-3xl px-6 py-4 text-center text-sm leading-relaxed text-white/80" onClick={(e) => e.stopPropagation()}>
            {current.caption}
          </p>
        </div>
      )}
    </>
  );
}