"use client";
import { useEffect, useState } from "react";
import { studio } from "@/lib/site";

export function StatusCard() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-NG", { hour: "numeric", minute: "2-digit", timeZone: studio.timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full border border-line bg-bg/70 px-4 py-2 text-xs font-medium backdrop-blur">
      <span className="relative flex size-2" aria-hidden>
        {studio.available && <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky opacity-75" />}
        <span className={`relative inline-flex size-2 rounded-full ${studio.available ? "bg-royal" : "bg-neutral-grey"}`} />
      </span>
      <span>{studio.city} · {time ?? "--:--"} WAT</span>
      <span className="text-muted" aria-hidden>·</span>
      <span className={studio.available ? "text-royal dark:text-light-azure" : "text-muted"}>
        {studio.available ? "Available for projects" : "Currently booked"}
      </span>
    </div>
  );
}