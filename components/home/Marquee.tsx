import { clients } from "@/lib/site";

export function Marquee() {
  if (!clients.length) return null;
  const row = [...clients, ...clients, ...clients, ...clients]; // two identical halves for a seamless loop

  return (
    <section aria-label="Organisations I’ve designed for" className="border-y border-line py-8">
      <p className="mx-auto mb-5 max-w-6xl px-6 text-xs font-semibold tracking-[0.3em] text-muted">DESIGNED FOR</p>
      <div className="group overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <ul className="flex w-max animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]">
          {row.map((name, i) => (
            <li key={i} aria-hidden={i >= clients.length} className="whitespace-nowrap pr-14 font-display text-lg font-semibold text-muted md:text-xl">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}