import Link from "next/link";
import { RemixButton } from "@/components/remix/RemixButton";
import { site } from "@/lib/site";

const PRACTICE_LINKS = [
  { href: "/design", label: "Design Studio", dot: "#0B6CEB" },
  { href: "/web", label: "Web & SEO", dot: "#E5484D" },
  { href: "/ai", label: "AI & Automation", dot: "#E0A526" },
];
const PAGE_LINKS = [
  { href: "/work", label: "Work" }, { href: "/about", label: "About" }, { href: "/journal", label: "Journal" },
  { href: "/playground", label: "Playground" }, { href: "/contact", label: "Contact" }, { href: "/privacy", label: "Privacy" },
];

const row = "flex flex-wrap items-center gap-x-8 gap-y-3";
const main = "inline-flex items-center gap-2 font-medium leading-normal transition hover:text-royal dark:hover:text-light-azure";
const pill = "inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium transition hover:border-royal hover:text-royal";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="font-display text-lg font-bold tracking-[0.25em]" aria-label="ASO Innovality home">
              ASO<span className="aso-text-gradient"> INNOVALITY</span>
            </Link>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-muted">The creative-tech studio of Adenaike Sodiq Olusegun.</p>
          </div>

          <nav aria-label="Footer" className="space-y-5 lg:col-span-7">
            <ul className={row}>
              {PRACTICE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={main}>
                    <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: l.dot }} />{l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className={row}>
              <li><RemixButton className={main}>Remix this site</RemixButton></li>
              <li><Link href="/wall" className={main}>Idea Wall</Link></li>
              <li><Link href="/estimate" className={main}>Get an estimate</Link></li>
            </ul>
            <ul className={`${row} pt-2 text-muted`}>
              {PAGE_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href} className="leading-normal transition hover:text-fg">{l.label}</Link></li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <p className="text-sm text-muted">© {new Date().getFullYear()} ASO INNOVALITY · Lagos, Nigeria</p>
          <div className="flex flex-wrap gap-3">
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className={pill}>
              <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              @aso_innovality
            </a>
            <a href={site.pinterest} target="_blank" rel="noopener noreferrer" className={pill}>
              <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 17v5" /><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16h14v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
              </svg>
              Pinterest
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}