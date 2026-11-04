import { Bot, Database, Gauge, MessageCircle, Search, Send, Smartphone } from "lucide-react";
import type { CalcKey } from "@/lib/calculators";

export function HubVisual({ kind }: { kind: CalcKey }) {
  if (kind === "ai") {
    const nodes = [
      { Icon: MessageCircle, label: "Customer message" },
      { Icon: Bot, label: "AI assistant" },
      { Icon: Database, label: "Your CRM or spreadsheet" },
      { Icon: Send, label: "Instant reply" },
    ];
    return (
      <div aria-hidden className="relative overflow-hidden rounded-lg border border-line bg-surface p-6 sm:p-8">
        <div className="absolute -top-20 -right-20 size-64 rounded-full aso-gradient opacity-20 blur-3xl" />
        <p className="relative text-xs font-semibold tracking-[0.25em] text-muted">AUTOMATION FLOW</p>
        <ol className="relative mt-6">
          {nodes.map(({ Icon, label }, i) => (
            <li key={label}>
              <div className="flex animate-[fadeUp_0.6s_ease_both] items-center gap-4 rounded-lg border border-line bg-bg p-4" style={{ animationDelay: `${i * 0.15}s` }}>
                <span className="grid size-10 place-items-center rounded-full bg-royal/10 text-royal dark:text-light-azure"><Icon size={18} /></span>
                <span className="font-medium">{label}</span>
                <span className="ml-auto size-2 animate-pulse rounded-full bg-sky" style={{ animationDelay: `${i * 0.4}s` }} />
              </div>
              {i < nodes.length - 1 && <div className="ml-9 h-5 w-px bg-gradient-to-b from-royal to-sky" />}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (kind === "web") {
    const badges = [
      { Icon: Smartphone, text: "Mobile-first" },
      { Icon: Gauge, text: "Fast" },
      { Icon: Search, text: "SEO-ready" },
    ];
    return (
      <div aria-hidden className="relative">
        <div className="absolute -top-16 -left-16 size-64 rounded-full aso-gradient opacity-20 blur-3xl" />
        <div className="relative overflow-hidden rounded-lg border border-line bg-bg shadow-[0_30px_60px_-30px_#1177FF]">
          <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3">
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
            <span className="ml-3 flex-1 truncate rounded-full bg-bg px-3 py-1 text-xs text-muted">yourbrand.com</span>
          </div>
          <div className="space-y-4 p-6">
            <div className="h-3 w-24 rounded-full bg-royal/30" />
            <div className="h-7 w-4/5 rounded-md bg-fg/15" />
            <div className="h-7 w-3/5 rounded-md aso-gradient opacity-70" />
            <div className="h-3 w-full rounded-full bg-fg/10" />
            <div className="h-3 w-5/6 rounded-full bg-fg/10" />
            <div className="flex gap-2 pt-2">
              <div className="h-9 w-28 rounded-full bg-royal" />
              <div className="h-9 w-24 rounded-full border border-line" />
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4">
              {[0, 1, 2].map((i) => <div key={i} className="aspect-[4/3] rounded-md bg-surface" />)}
            </div>
          </div>
        </div>
        <div className="absolute top-16 -right-2 flex flex-col items-end gap-2 sm:-right-6">
          {badges.map(({ Icon, text }, i) => (
            <span key={text} className="inline-flex animate-[fadeUp_0.6s_ease_both] items-center gap-2 rounded-full border border-line bg-bg px-3 py-1.5 text-xs font-medium shadow-sm"
              style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
              <Icon size={14} className="text-royal dark:text-light-azure" /> {text}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return <div aria-hidden className="hidden h-[440px] rounded-lg aso-gradient opacity-80 lg:block" />;
}