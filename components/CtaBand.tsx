import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { StartProjectButton } from "@/components/StartProjectButton";

// Shared final call-to-action: sentence case, gradient second line, navy with a soft rising glow
export function CtaBand({ title, accent, text, primaryLabel = "Start your project", primaryHref, secondaryLabel, secondaryHref }: {
  title: string; accent: string; text?: string;
  primaryLabel?: string; primaryHref?: string; // no href = opens the Start your project panel
  secondaryLabel?: string; secondaryHref?: string;
}) {
  const primary = "inline-flex items-center gap-2 rounded-full bg-royal px-7 py-3.5 text-base font-semibold text-white shadow-[0_12px_40px_-12px_var(--color-royal)] transition hover:bg-bright";
  return (
    <section className="relative overflow-hidden bg-navy py-28 text-center text-white">
      {/* Soft glow rising from the bottom */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-full"
        style={{ background: "radial-gradient(45% 60% at 50% 100%, color-mix(in srgb, var(--color-royal) 38%, transparent), transparent 70%)" }} />
      <Reveal className="relative mx-auto max-w-4xl px-6">
        <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.05] tracking-tight">
          {title} <span className="on-dark-gradient block">{accent}</span>
        </h2>
        {text && <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ice/90">{text}</p>}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {primaryHref ? (
            <Link href={primaryHref} className={primary}>{primaryLabel} <ArrowUpRight size={18} /></Link>
          ) : (
            <StartProjectButton className={primary}>{primaryLabel} <ArrowUpRight size={18} /></StartProjectButton>
          )}
          {secondaryLabel && secondaryHref && (
            <Link href={secondaryHref} className="inline-flex items-center rounded-full border border-white/25 bg-navy/40 px-7 py-3.5 text-base font-semibold backdrop-blur transition hover:border-sky">
              {secondaryLabel}
            </Link>
          )}
        </div>
      </Reveal>
    </section>
  );
}