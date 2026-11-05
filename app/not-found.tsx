import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StartProjectButton } from "@/components/StartProjectButton";

export default function NotFound() {
  return (
    <div className="relative mx-auto flex min-h-[80svh] max-w-3xl flex-col items-center justify-center px-6 pt-24 text-center">
      <div aria-hidden className="absolute inset-x-0 top-1/3 -z-10 mx-auto size-72 rounded-full aso-gradient opacity-20 blur-3xl" />
      <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">ERROR 404</p>
      <h1 className="mt-4 font-display text-[clamp(2rem,6vw,4rem)] font-bold leading-[1.05]">
        This page is still <span className="aso-text-gradient">an idea.</span>
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
        The page you’re looking for doesn’t exist, or it hasn’t been designed yet. Let’s get you somewhere useful.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 text-sm font-medium text-white hover:bg-bright">
          Back to home <ArrowUpRight size={16} />
        </Link>
        <Link href="/work" className="inline-flex rounded-full border border-line px-6 py-3 text-sm font-medium hover:border-royal hover:text-royal">Explore my work</Link>
        <StartProjectButton className="inline-flex rounded-full border border-line px-6 py-3 text-sm font-medium hover:border-royal hover:text-royal">Start your project</StartProjectButton>
      </div>
    </div>
  );
}