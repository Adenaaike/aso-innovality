import { clients } from "@/lib/site";

export function Marquee() {
  if (!clients.length) return null;
  const row = [...clients, ...clients, ...clients, ...clients]; // two identical halves for a seamless loop

  return (
    <section aria-label="Organisations I’ve worked with" className="border-y border-line py-4">
      <p className="mb-2.5 px-6 text-center text-[11px] font-semibold tracking-[0.35em] text-muted">TRUSTED BY ORGANISATIONS IN NIGERIA, BELGIUM AND BEYOND</p>
      <div className="group overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <ul className="flex w-max animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]">
          {row.map((name, i) => (
            <li key={i} aria-hidden={i >= clients.length} className="flex items-center whitespace-nowrap">
              <span className="font-display text-sm font-semibold text-slate-500 transition-colors duration-300 hover:text-royal dark:text-ice/55 dark:hover:text-white md:text-base">
                {name}
              </span>
              <span aria-hidden className="mx-5 size-1 rounded-full bg-royal/40 dark:bg-sky/40" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}