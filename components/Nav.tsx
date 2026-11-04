"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { ArrowUpRight, ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { nav } from "@/lib/site";
import { PRACTICES } from "@/lib/practices";

// Pages that count as part of "Services" for the active underline
const SERVICE_PATHS = ["/services", "/design", "/web", "/ai", "/estimate"];

export function Nav() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [svc, setSvc] = useState(false); // desktop Services panel
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => { setOpen(false); setSvc(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setSvc(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/"
      : href === "/services" ? SERVICE_PATHS.some((p) => pathname.startsWith(p))
      : pathname.startsWith(href);
  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const openSvc = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setSvc(true); };
  const closeSvc = () => { closeTimer.current = setTimeout(() => setSvc(false), 150); };

  const linkClass = "relative rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-fg aria-[current=page]:text-fg";
  const underline = <span aria-hidden className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded aso-gradient" />;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="font-display text-sm font-bold tracking-[0.25em]" aria-label="ASO Innovality home">
          ASO<span className="aso-text-gradient"> INNOVALITY</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) =>
            item.href === "/services" ? (
              <div key={item.href} className="relative" onMouseEnter={openSvc} onMouseLeave={closeSvc} onFocus={openSvc}
                onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setSvc(false); }}>
                <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} aria-haspopup="true"
                  className={`${linkClass} inline-flex items-center gap-1`}>
                  {item.label}
                  <ChevronDown aria-hidden size={14} className={`transition duration-200 ${svc ? "rotate-180" : ""}`} />
                  {isActive(item.href) && underline}
                </Link>

                {/* Services panel */}
                <div className={`absolute top-full left-1/2 z-50 w-[680px] -translate-x-1/2 pt-3 transition duration-200 ${svc ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-1 opacity-0"}`}>
                  <div className="overflow-hidden rounded-lg border border-line bg-bg shadow-[0_30px_80px_-30px_rgba(17,119,255,0.45)]">
                    <div className="grid grid-cols-3 gap-2 p-3">
                      {PRACTICES.map((p) => {
                        const Icon = p.Icon;
                        const here = pathname.startsWith(p.href);
                        return (
                          <Link key={p.key} href={p.href} aria-current={here ? "page" : undefined}
                            className={`group/card rounded-md p-4 transition hover:bg-surface ${here ? "bg-surface" : ""}`}>
                            <span className="grid size-10 place-items-center rounded-full bg-royal/10 text-royal transition duration-300 group-hover/card:bg-royal group-hover/card:text-white dark:text-light-azure">
                              <Icon size={18} />
                            </span>
                            <span className="mt-3 block text-[10px] font-semibold tracking-[0.25em] text-muted">{p.word}</span>
                            <span className="mt-0.5 block font-display font-semibold text-fg">{p.title}</span>
                            <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-muted">{p.text}</span>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between border-t border-line bg-surface/60 px-5 py-3 text-sm">
                      <Link href="/services" className="font-medium text-fg hover:text-royal">All services</Link>
                      <Link href="/estimate" className="group/est inline-flex items-center gap-1 font-medium text-royal dark:text-light-azure">
                        Get an instant estimate
                        <ArrowUpRight size={14} className="transition group-hover/est:translate-x-0.5 group-hover/est:-translate-y-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={linkClass}>
                {item.label}
                {isActive(item.href) && underline}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="grid size-10 place-items-center rounded-full border border-line hover:border-royal"
            aria-label={mounted ? `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode` : "Toggle theme"}>
            {mounted && resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setOpen((v) => !v)} className="grid size-10 place-items-center rounded-full border border-line lg:hidden"
            aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="h-[calc(100svh-4rem)] overflow-y-auto bg-bg px-6 py-8 lg:hidden">
          <ul className="space-y-2">
            {nav.map((item, i) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex items-baseline gap-4 py-2 font-display text-xl font-medium aria-[current=page]:text-royal">
                  <span className="text-xs text-muted">0{i + 1}</span>{item.label}
                </Link>

                {item.href === "/services" && (
                  <ul className="mt-1 mb-3 grid gap-2 pl-8">
                    {PRACTICES.map((p) => {
                      const Icon = p.Icon;
                      return (
                        <li key={p.key}>
                          <Link href={p.href} aria-current={pathname.startsWith(p.href) ? "page" : undefined}
                            className="flex items-center gap-3 rounded-lg border border-line p-3 transition hover:border-royal aria-[current=page]:border-royal">
                            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-royal/10 text-royal dark:text-light-azure"><Icon size={16} /></span>
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold">{p.title}</span>
                              <span className="block truncate text-xs text-muted">{p.text}</span>
                            </span>
                            <ArrowUpRight size={16} className="ml-auto shrink-0 text-muted" />
                          </Link>
                        </li>
                      );
                    })}
                    <li>
                      <Link href="/estimate" className="inline-flex items-center gap-1 py-1 text-sm font-medium text-royal dark:text-light-azure">
                        Get an instant estimate <ArrowUpRight size={14} />
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}