"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { ArrowUpRight, ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { nav } from "@/lib/site";
import { PRACTICES } from "@/lib/practices";
import { PLAYGROUND_SECTIONS, PLAYGROUND_TOOLS } from "@/lib/playground";

// Pages that count as part of each menu item, for the active underline
const SERVICE_PATHS = ["/services", "/design", "/web", "/ai", "/estimate"];
const PLAYGROUND_PATHS = ["/playground", "/wall"];

type Menu = "services" | "playground" | null;

export function Nav() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<Menu>(null); // desktop dropdowns
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => { setOpen(false); setMenu(null); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setMenu(null); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/"
      : href === "/services" ? SERVICE_PATHS.some((p) => pathname.startsWith(p))
      : href === "/playground" ? PLAYGROUND_PATHS.some((p) => pathname.startsWith(p))
      : pathname.startsWith(href);
  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const openMenu = (m: Menu) => { if (closeTimer.current) clearTimeout(closeTimer.current); setMenu(m); };
  const closeMenu = () => { closeTimer.current = setTimeout(() => setMenu(null), 150); };
  const leave = () => { setMenu(null); setOpen(false); }; // for links to the same page (#anchors)

  const linkClass = "relative rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-fg aria-[current=page]:text-fg";
  const underline = <span aria-hidden className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded aso-gradient" />;
  const panelState = (m: Menu) => (menu === m ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-1 opacity-0");

  const toolsFor = (key: string) => PLAYGROUND_TOOLS.filter((t) => t.practice === key);
  const ToolLink = ({ id, label, isNew }: { id: string; label: string; isNew?: boolean }) => (
    <Link href={`/playground#${id}`} onClick={leave}
      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted transition hover:bg-surface hover:text-fg">
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
      <span className="truncate">{label}</span>
      {isNew && <span className="ml-auto shrink-0 rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[var(--accent-on)]">New</span>}
    </Link>
  );

  const dropdownTrigger = (item: { href: string; label: string }, m: Exclude<Menu, null>) => (
    <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} aria-haspopup="true"
      className={`${linkClass} inline-flex items-center gap-1`}>
      {item.label}
      <ChevronDown aria-hidden size={14} className={`transition duration-200 ${menu === m ? "rotate-180" : ""}`} />
      {isActive(item.href) && underline}
    </Link>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="font-display text-sm font-bold tracking-[0.25em]" aria-label="ASO Innovality home">
          ASO<span className="aso-text-gradient"> INNOVALITY</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            if (item.href === "/services") {
              return (
                <div key={item.href} className="relative" onMouseEnter={() => openMenu("services")} onMouseLeave={closeMenu} onFocus={() => openMenu("services")}
                  onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setMenu(null); }}>
                  {dropdownTrigger(item, "services")}
                  <div className={`absolute top-full left-1/2 z-50 w-[680px] -translate-x-1/2 pt-3 transition duration-200 ${panelState("services")}`}>
                    <div className="overflow-hidden rounded-lg border border-line bg-bg shadow-[0_30px_80px_-30px_rgba(17,119,255,0.45)]">
                      <div className="grid grid-cols-3 gap-2 p-3">
                        {PRACTICES.map((p) => {
                          const Icon = p.Icon;
                          const here = pathname.startsWith(p.href);
                          return (
                            <Link key={p.key} href={p.href} aria-current={here ? "page" : undefined}
                              className={`accent-${p.key} group/card rounded-md p-4 transition hover:bg-surface ${here ? "bg-surface" : ""}`}>
                              <span className="accent-icon grid size-10 place-items-center rounded-full"><Icon size={18} /></span>
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
              );
            }

            if (item.href === "/playground") {
              return (
                <div key={item.href} className="relative" onMouseEnter={() => openMenu("playground")} onMouseLeave={closeMenu} onFocus={() => openMenu("playground")}
                  onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setMenu(null); }}>
                  {dropdownTrigger(item, "playground")}
                  <div className={`absolute top-full left-1/2 z-50 w-[760px] -translate-x-1/2 pt-3 transition duration-200 ${panelState("playground")}`}>
                    <div className="overflow-hidden rounded-lg border border-line bg-bg shadow-[0_30px_80px_-30px_rgba(17,119,255,0.45)]">
                      <div className="grid grid-cols-3 gap-6 p-6">
                        {/* Design tools: two columns */}
                        {PLAYGROUND_SECTIONS.filter((s) => s.key === "design").map((s) => (
                          <div key={s.key} className="accent-design col-span-2">
                            <p className="accent-text px-2 text-[10px] font-semibold uppercase tracking-[0.25em]">{s.title}</p>
                            <div className="mt-3 grid grid-cols-2 gap-x-2">
                              {toolsFor(s.key).map((t) => <ToolLink key={t.id} {...t} />)}
                            </div>
                          </div>
                        ))}
                        {/* Web, AI and the Idea Wall */}
                        <div className="space-y-5">
                          {PLAYGROUND_SECTIONS.filter((s) => s.key !== "design" && toolsFor(s.key).length).map((s) => (
                            <div key={s.key} className={`accent-${s.key}`}>
                              <p className="accent-text px-2 text-[10px] font-semibold uppercase tracking-[0.25em]">{s.title}</p>
                              <div className="mt-2">{toolsFor(s.key).map((t) => <ToolLink key={t.id} {...t} />)}</div>
                            </div>
                          ))}
                          <div className="accent-design">
                            <p className="accent-text px-2 text-[10px] font-semibold uppercase tracking-[0.25em]">Community</p>
                            <div className="mt-2">
                              <Link href="/wall" onClick={leave} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted transition hover:bg-surface hover:text-fg">
                                <span aria-hidden className="size-1.5 shrink-0 rounded-full aso-gradient" />
                                Idea Wall
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-line bg-surface/60 px-5 py-3 text-sm">
                        <Link href="/playground" onClick={leave} className="font-medium text-fg hover:text-royal">All playground tools</Link>
                        <Link href="/wall" onClick={leave} className="group/wall inline-flex items-center gap-1 font-medium text-royal dark:text-light-azure">
                          Add your colour to the Idea Wall
                          <ArrowUpRight size={14} className="transition group-hover/wall:translate-x-0.5 group-hover/wall:-translate-y-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={linkClass}>
                {item.label}
                {isActive(item.href) && underline}
              </Link>
            );
          })}
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
                            className={`accent-${p.key} flex items-center gap-3 rounded-lg border border-line p-3 transition hover:border-[var(--accent)] aria-[current=page]:border-[var(--accent)]`}>
                            <span className="accent-icon grid size-9 shrink-0 place-items-center rounded-full"><Icon size={16} /></span>
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

                {item.href === "/playground" && (
                  <div className="mt-1 mb-3 space-y-4 pl-8">
                    {PLAYGROUND_SECTIONS.filter((s) => toolsFor(s.key).length).map((s) => (
                      <div key={s.key} className={`accent-${s.key}`}>
                        <p className="accent-text text-[10px] font-semibold uppercase tracking-[0.25em]">{s.title}</p>
                        <div className="mt-1.5 grid grid-cols-2 gap-x-2">
                          {toolsFor(s.key).map((t) => <ToolLink key={t.id} {...t} />)}
                        </div>
                      </div>
                    ))}
                    <Link href="/wall" onClick={leave} className="inline-flex items-center gap-1 py-1 text-sm font-medium text-royal dark:text-light-azure">
                      Add your colour to the Idea Wall <ArrowUpRight size={14} />
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}