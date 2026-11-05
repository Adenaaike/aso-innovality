"use client";
import { useEffect, useState } from "react";
import { Moon } from "lucide-react";

const TZ = "Africa/Lagos";
const DOW: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return (h || 0) * 60 + (m || 0); };
const fmt12 = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return m ? `${hh}:${String(m).padStart(2, "0")} ${ap}` : `${hh} ${ap}`;
};

type Status = { open: boolean; text: string; lagos: string; local: string | null };

function compute(d: Date, days: number[], start: string, end: string): Status {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const dow = DOW[get("weekday")] ?? 0;
  const mins = Number(get("hour")) * 60 + Number(get("minute"));
  const open = days.includes(dow) && mins >= toMin(start) && mins < toMin(end);

  let text = "In the studio now · replies within a few hours";
  if (!open) {
    let back = "";
    if (days.includes(dow) && mins < toMin(start)) back = `back at ${fmt12(start)}`;
    else {
      for (let i = 1; i <= 7; i++) {
        const nd = (dow + i) % 7;
        if (days.includes(nd)) { back = i === 1 ? `back tomorrow at ${fmt12(start)}` : `back ${DAY_NAMES[nd]} at ${fmt12(start)}`; break; }
      }
    }
    text = `Offline now${back ? ` · ${back}` : ""} · replies within 24 hours`;
  }

  const time = (tz?: string) => new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" }).format(d);
  const lagos = time(TZ);
  const local = time(Intl.DateTimeFormat().resolvedOptions().timeZone);
  return { open, text, lagos, local: local === lagos ? null : local };
}

export function StatusCard({ available = true, note = "", workDays = [1, 2, 3, 4, 5], workStart = "09:00", workEnd = "18:00", className = "" }: {
  available?: boolean; note?: string; workDays?: number[]; workStart?: string; workEnd?: string; className?: string;
}) {
  const [st, setSt] = useState<Status | null>(null);
  const daysKey = workDays.join(",");

  useEffect(() => {
    const tick = () => setSt(compute(new Date(), workDays, workStart, workEnd));
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, [daysKey, workStart, workEnd]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`inline-flex max-w-full flex-col gap-1.5 rounded-2xl border border-line bg-bg/70 px-4 py-3 text-xs backdrop-blur ${className}`} aria-live="polite">
      <div className="flex items-center gap-2 font-medium">
        {st?.open ? (
          <span className="relative flex size-2" aria-hidden>
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
        ) : st ? (
          <Moon aria-hidden size={13} className="text-muted" />
        ) : (
          <span aria-hidden className="size-2 rounded-full bg-line" />
        )}
        <span>{st ? st.text : "Checking studio status…"}</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-muted">
        <span>Lagos {st?.lagos ?? "--:--"}</span>
        {st && <><span aria-hidden>·</span><span>{st.local ? `${st.local} for you` : "same time as you"}</span></>}
        <span aria-hidden>·</span>
        <span className={available ? "text-royal dark:text-light-azure" : ""}>{available ? "Available for projects" : note || "Currently booked"}</span>
      </div>
    </div>
  );
}