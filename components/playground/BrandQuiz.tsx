"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Check, Download, MessageCircle, RotateCcw, Sparkles, Wand2 } from "lucide-react";

type Key = "creator" | "sage" | "hero" | "caregiver" | "explorer" | "ruler" | "rebel" | "magician";
type Archetype = {
  name: string; tagline: string; text: string; words: string[]; palette: string[];
  fonts: { display: string; body: string; style: "sans" | "serif" };
};

const ARCHETYPES: Record<Key, Archetype> = {
  creator: { name: "The Creator", tagline: "Imagination made visible.", text: "Your brand lives to make original things. It values expression, craft and ideas that haven’t been done before, and it invites people to create with you.", words: ["Imaginative", "Expressive", "Original", "Playful"], palette: ["#FF5A5F", "#FFB400", "#00A699", "#3D3D3D", "#FFF8F0"], fonts: { display: "Syne", body: "Inter", style: "sans" } },
  sage: { name: "The Sage", tagline: "Clarity through knowledge.", text: "Your brand earns trust by being thoughtful, informed and honest. People come to you for answers, guidance and the truth, explained simply.", words: ["Wise", "Trusted", "Clear", "Calm"], palette: ["#1B365D", "#5B7DB1", "#C9D6E3", "#F4F1EA", "#2E2E2E"], fonts: { display: "Playfair Display", body: "Source Sans 3", style: "serif" } },
  hero: { name: "The Hero", tagline: "Courage that gets results.", text: "Your brand helps people rise to the challenge. It is bold, determined and action-driven, and it proves its worth by what it achieves.", words: ["Bold", "Driven", "Strong", "Inspiring"], palette: ["#C8102E", "#1D1D1F", "#F2A900", "#FFFFFF", "#4A4A4A"], fonts: { display: "Bebas Neue", body: "Inter", style: "sans" } },
  caregiver: { name: "The Caregiver", tagline: "Support people can feel.", text: "Your brand exists to help and protect. It is warm, generous and reassuring, the kind of presence people return to because they feel genuinely looked after.", words: ["Warm", "Caring", "Reassuring", "Generous"], palette: ["#6FA8A0", "#F4C7AB", "#FAF3E7", "#3E5C59", "#E8A87C"], fonts: { display: "Nunito", body: "Lora", style: "sans" } },
  explorer: { name: "The Explorer", tagline: "Freedom to discover.", text: "Your brand is about adventure, independence and new horizons. It speaks to people who want to break routine and find something real.", words: ["Adventurous", "Free", "Authentic", "Curious"], palette: ["#2D5A3D", "#C58940", "#E9DCC9", "#1F3B4D", "#8FB996"], fonts: { display: "Montserrat", body: "Merriweather", style: "sans" } },
  ruler: { name: "The Ruler", tagline: "Leadership with polish.", text: "Your brand stands for quality, control and excellence. It is premium, structured and confident, and it sets the standard others follow.", words: ["Premium", "Confident", "Refined", "Reliable"], palette: ["#0B1F3A", "#C9A227", "#F5F3EE", "#5A5A5A", "#1C1C1C"], fonts: { display: "Cormorant Garamond", body: "Inter", style: "serif" } },
  rebel: { name: "The Rebel", tagline: "Rules are made to be rewritten.", text: "Your brand challenges the status quo. It is daring, disruptive and unapologetic, and it attracts people who want something different.", words: ["Daring", "Disruptive", "Raw", "Unapologetic"], palette: ["#111111", "#FF3B30", "#F5F5F5", "#7A00FF", "#FFD60A"], fonts: { display: "Archivo Black", body: "Space Mono", style: "sans" } },
  magician: { name: "The Magician", tagline: "Transformation, made real.", text: "Your brand turns ideas into experiences that feel almost impossible. It is visionary, mysterious and transformative, and it makes people believe.", words: ["Visionary", "Transformative", "Mysterious", "Inspiring"], palette: ["#2A0E4E", "#7B3FE4", "#00D1FF", "#F2E9FF", "#0E0E1A"], fonts: { display: "Cinzel", body: "Raleway", style: "serif" } },
};

const ORDER: Key[] = ["creator", "sage", "hero", "caregiver", "explorer", "ruler", "rebel", "magician"];

const QUESTIONS: { q: string; a: { text: string; score: Partial<Record<Key, number>> }[] }[] = [
  { q: "If your brand walked into a room, people would say it’s…", a: [
    { text: "Confident and in charge", score: { ruler: 2, hero: 1 } },
    { text: "Warm and welcoming", score: { caregiver: 2, sage: 1 } },
    { text: "Bold and unconventional", score: { rebel: 2, creator: 1 } },
    { text: "Curious and adventurous", score: { explorer: 2, magician: 1 } },
  ] },
  { q: "What should customers feel first?", a: [
    { text: "Trust", score: { sage: 2, ruler: 1 } },
    { text: "Inspired", score: { magician: 2, creator: 1 } },
    { text: "Cared for", score: { caregiver: 2 } },
    { text: "Empowered", score: { hero: 2, explorer: 1 } },
  ] },
  { q: "Pick the word that best describes your work.", a: [
    { text: "Precision", score: { ruler: 2, sage: 1 } },
    { text: "Imagination", score: { creator: 2, magician: 1 } },
    { text: "Courage", score: { hero: 2, rebel: 1 } },
    { text: "Freedom", score: { explorer: 2, rebel: 1 } },
  ] },
  { q: "Your ideal customer is…", a: [
    { text: "An established leader", score: { ruler: 2, sage: 1 } },
    { text: "A dreamer or maker", score: { creator: 2, explorer: 1 } },
    { text: "Someone who needs support", score: { caregiver: 2, hero: 1 } },
    { text: "A challenger who breaks the rules", score: { rebel: 2, hero: 1 } },
  ] },
  { q: "Which visual style draws you in?", a: [
    { text: "Clean, minimal and premium", score: { ruler: 1, sage: 2 } },
    { text: "Vibrant and expressive", score: { creator: 2, rebel: 1 } },
    { text: "Soft, friendly and natural", score: { caregiver: 2, explorer: 1 } },
    { text: "Dramatic and mysterious", score: { magician: 2, rebel: 1 } },
  ] },
  { q: "Your brand’s promise is to…", a: [
    { text: "Make things clearer through knowledge", score: { sage: 2, caregiver: 1 } },
    { text: "Help people achieve more", score: { hero: 2, ruler: 1 } },
    { text: "Transform how people see the world", score: { magician: 2, creator: 1 } },
    { text: "Open up new possibilities", score: { explorer: 2, magician: 1 } },
  ] },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function BrandQuiz() {
  const [step, setStep] = useState(-1); // -1 = start screen
  const [answers, setAnswers] = useState<number[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const done = step >= QUESTIONS.length;
  const result: Key = (() => {
    const totals = Object.fromEntries(ORDER.map((k) => [k, 0])) as Record<Key, number>;
    answers.forEach((ai, qi) => Object.entries(QUESTIONS[qi].a[ai].score).forEach(([k, v]) => { totals[k as Key] += v ?? 0; }));
    return ORDER.reduce((best, k) => (totals[k] > totals[best] ? k : best), ORDER[0]);
  })();
  const A = ARCHETYPES[result];

  // Remember the result so "Remix This Site" can offer it
  useEffect(() => {
    if (done) { try { sessionStorage.setItem("aso-quiz-result", result); } catch {} }
  }, [done, result]);

  const choose = (i: number) => { setAnswers((p) => [...p.slice(0, step), i]); setStep((s) => s + 1); };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const restart = () => { setAnswers([]); setStep(0); };

  async function copyHex(hex: string) {
    try { await navigator.clipboard.writeText(hex); setCopied(hex); setTimeout(() => setCopied(null), 1200); } catch {}
  }

  const shareText = `My brand personality is ${A.name}: ${A.words.join(", ").toLowerCase()}. Find yours with ASO INNOVALITY’s free quiz:`;
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/playground#brand-quiz` : "/playground#brand-quiz";
  const brief = [`From the Brand Personality Quiz: my brand is ${A.name} (${A.words.join(", ").toLowerCase()}).`, `Palette: ${A.palette.join(", ")}`, "", "About my project: "].join("\n");

  async function downloadCard() {
    await document.fonts.ready;
    const css = getComputedStyle(document.documentElement);
    const display = css.getPropertyValue("--font-space-grotesk").trim() || "sans-serif";
    const body = css.getPropertyValue("--font-inter").trim() || "sans-serif";
    const W = 1080, H = 1350, pad = 90;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const x = c.getContext("2d")!;
    const g = x.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#101B2B"); g.addColorStop(1, A.palette[0]);
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = "rgba(255,255,255,0.08)"; x.beginPath(); x.arc(W - 120, 180, 320, 0, Math.PI * 2); x.fill();

    x.fillStyle = "#FFFFFF"; x.font = `700 30px ${display}`; x.fillText("ASO INNOVALITY", pad, 130);
    x.fillStyle = "rgba(255,255,255,0.75)"; x.font = `600 24px ${body}`; x.fillText("MY BRAND PERSONALITY", pad, 300);
    x.fillStyle = "#FFFFFF"; x.font = `700 110px ${display}`; x.fillText(A.name, pad, 430);
    x.font = `400 40px ${body}`; x.fillStyle = "rgba(255,255,255,0.9)"; x.fillText(A.tagline, pad, 500);

    let wx = pad; const wy = 600;
    x.font = `600 30px ${body}`;
    for (const w of A.words) {
      const tw = x.measureText(w).width + 48;
      x.fillStyle = "rgba(255,255,255,0.14)"; x.beginPath(); x.roundRect(wx, wy - 40, tw, 60, 30); x.fill();
      x.fillStyle = "#FFFFFF"; x.fillText(w, wx + 24, wy);
      wx += tw + 16;
    }

    const sw = (W - pad * 2 - 4 * 20) / 5;
    A.palette.forEach((hex, i) => {
      const sx = pad + i * (sw + 20);
      x.fillStyle = hex; x.beginPath(); x.roundRect(sx, 720, sw, 300, 24); x.fill();
      x.strokeStyle = "rgba(255,255,255,0.25)"; x.lineWidth = 2; x.stroke();
      x.fillStyle = "rgba(255,255,255,0.85)"; x.font = `600 24px ${body}`; x.fillText(hex.toUpperCase(), sx, 1060);
    });

    x.fillStyle = "rgba(255,255,255,0.75)"; x.font = `400 26px ${body}`;
    x.fillText(`Fonts: ${A.fonts.display} + ${A.fonts.body}`, pad, 1140);
    x.fillStyle = "#FFFFFF"; x.font = `600 28px ${body}`;
    x.fillText(`Find yours at ${window.location.host}/playground`, pad, H - 100);

    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/png"));
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), { href: url, download: `my-brand-personality-${result}.png` }).click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const option = "w-full rounded-lg border border-line p-4 text-left font-medium transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]";

  return (
    <section aria-labelledby="quiz-title">
      <p className="accent-text text-xs font-semibold tracking-[0.3em]">BRAND PERSONALITY QUIZ</p>
      <h2 id="quiz-title" className="mt-3 font-display text-2xl font-bold md:text-3xl">What’s your brand’s personality?</h2>
      <p className="mt-2 max-w-xl text-muted">Six quick questions reveal your brand archetype, with a colour palette, font pairing and a result card to share.</p>

      <div className="mt-8 overflow-hidden rounded-lg border border-line bg-bg p-6 md:p-10">
        <AnimatePresence mode="wait">
          {step === -1 && (
            <motion.div key="start" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }} className="text-center">
              <span className="accent-icon mx-auto grid size-16 place-items-center rounded-full"><Sparkles size={28} /></span>
              <p className="mx-auto mt-5 max-w-md text-muted">Answer instinctively. There are no wrong answers, and it takes about a minute.</p>
              <button type="button" onClick={() => setStep(0)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-medium text-[var(--accent-on)] hover:brightness-110">
                Start the quiz <ArrowUpRight size={16} />
              </button>
            </motion.div>
          )}

          {step >= 0 && !done && (
            <motion.div key={`q${step}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3, ease: EASE }}>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Question {step + 1} of {QUESTIONS.length}</span>
                {step > 0 && <button type="button" onClick={back} className="inline-flex items-center gap-1 hover:text-fg"><ArrowLeft size={12} /> Back</button>}
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface">
                <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-500" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
              </div>
              <h3 className="mt-8 font-display text-xl font-bold md:text-2xl">{QUESTIONS[step].q}</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {QUESTIONS[step].a.map((a, i) => (
                  <button key={a.text} type="button" onClick={() => choose(i)}
                    className={`${option} ${answers[step] === i ? "border-[var(--accent)] bg-[var(--accent-soft)]" : ""}`}>{a.text}</button>
                ))}
              </div>
            </motion.div>
          )}

          {done && (
            <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
              <p className="text-xs font-semibold tracking-[0.25em] text-muted">YOUR BRAND PERSONALITY</p>
              <h3 className="mt-2 font-display text-4xl font-bold md:text-5xl"
                style={{ backgroundImage: `linear-gradient(90deg, ${A.palette[0]}, ${A.palette[1]})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                {A.name}
              </h3>
              <p className="mt-2 text-lg font-medium">{A.tagline}</p>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted">{A.text}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {A.words.map((w) => <span key={w} className="rounded-full border border-line px-3 py-1 text-sm font-medium">{w}</span>)}
              </div>

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-medium">Colour palette <span className="text-muted">(click to copy)</span></p>
                  <div className="grid grid-cols-5 gap-2">
                    {A.palette.map((hex) => (
                      <button key={hex} type="button" onClick={() => copyHex(hex)} className="group text-left" aria-label={`Copy ${hex}`}>
                        <span className="block aspect-[3/4] rounded-md border border-line transition group-hover:-translate-y-1" style={{ background: hex }} />
                        <span className="mt-1.5 block text-[11px] font-medium text-muted">{copied === hex ? "Copied" : hex}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-sm font-medium">Font pairing</p>
                  <div className="rounded-lg border border-line p-5">
                    <p className="text-3xl font-bold" style={{ fontFamily: A.fonts.style === "serif" ? "Georgia, 'Times New Roman', serif" : "var(--font-space-grotesk)" }}>Aa · {A.fonts.display}</p>
                    <p className="mt-2 text-sm text-muted">Paired with <strong className="text-fg">{A.fonts.body}</strong> for body text. Both are free on Google Fonts.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <button type="button" onClick={downloadCard} className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-on)] hover:brightness-110">
                  <Download size={15} /> Download my result card
                </button>
                <a href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium hover:border-[var(--accent)]">
                  <MessageCircle size={15} /> Share on WhatsApp
                </a>
                <button type="button" onClick={restart} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium hover:border-[var(--accent)]">
                  <RotateCcw size={15} /> Retake
                </button>
                <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("aso:remix-apply", { detail: { kind: "preset", key: result } }))}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium hover:border-[var(--accent)]">
                  <Wand2 size={15} /> Remix the site with my brand
                </button>
              </div>

              <div className="mt-10 rounded-lg bg-navy p-6 text-white md:p-8">
                <p className="text-xs font-semibold tracking-[0.25em] text-[var(--accent)]">NEXT STEP</p>
                <p className="mt-2 font-display text-xl font-bold md:text-2xl">Want this brand designed for real?</p>
                <p className="mt-1 text-ice/80">I turn brand personalities into logos, colour systems and identities that people remember.</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/design#estimate" className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-on)] hover:brightness-110">
                    Get an estimate <ArrowUpRight size={15} />
                  </Link>
                  <Link href={`/contact?service=brand-identity&brief=${encodeURIComponent(brief)}`} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-medium hover:border-[var(--accent)]">
                    <Check size={15} /> Start a project
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}