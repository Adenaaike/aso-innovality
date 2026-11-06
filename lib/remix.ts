// Remix This Site: presets, colour calculations, fonts and share links

export type ArchKey = "creator" | "sage" | "hero" | "caregiver" | "explorer" | "ruler" | "rebel" | "magician";
export type FontKey = ArchKey | "aso";
export type RemixState =
  | { kind: "preset"; key: ArchKey }
  | { kind: "custom"; p: string; a: string; font: FontKey };

export const STORAGE_KEY = "aso-remix";

// Main colour (p) drives buttons and highlights; accent (a) drives gradients and soft tints
export const PRESETS: Record<ArchKey, { name: string; p: string; a: string }> = {
  creator: { name: "The Creator", p: "#FF5A5F", a: "#00A699" },
  sage: { name: "The Sage", p: "#2F5A8F", a: "#5B7DB1" },
  hero: { name: "The Hero", p: "#C8102E", a: "#F2A900" },
  caregiver: { name: "The Caregiver", p: "#3E7C76", a: "#E8A87C" },
  explorer: { name: "The Explorer", p: "#3B7A52", a: "#C58940" },
  ruler: { name: "The Ruler", p: "#2A4A7A", a: "#C9A227" },
  rebel: { name: "The Rebel", p: "#7A00FF", a: "#FF3B30" },
  magician: { name: "The Magician", p: "#7B3FE4", a: "#00D1FF" },
};
export const ARCH_KEYS = Object.keys(PRESETS) as ArchKey[];

// Google Fonts, loaded only while a remix is active
export const FONT_PAIRS: Record<ArchKey, { display: string; body: string; dq: string; bq: string }> = {
  creator: { display: "Syne", body: "Inter", dq: "Syne:wght@400;600;700;800", bq: "Inter:wght@400;500;600;700" },
  sage: { display: "Playfair Display", body: "Source Sans 3", dq: "Playfair+Display:wght@400;600;700;800", bq: "Source+Sans+3:wght@400;500;600;700" },
  hero: { display: "Bebas Neue", body: "Inter", dq: "Bebas+Neue", bq: "Inter:wght@400;500;600;700" },
  caregiver: { display: "Nunito", body: "Lora", dq: "Nunito:wght@400;600;700;800", bq: "Lora:wght@400;500;600;700" },
  explorer: { display: "Montserrat", body: "Merriweather", dq: "Montserrat:wght@400;500;600;700;800", bq: "Merriweather:wght@400;700" },
  ruler: { display: "Cormorant Garamond", body: "Inter", dq: "Cormorant+Garamond:wght@400;500;600;700", bq: "Inter:wght@400;500;600;700" },
  rebel: { display: "Archivo Black", body: "Space Mono", dq: "Archivo+Black", bq: "Space+Mono:wght@400;700" },
  magician: { display: "Cinzel", body: "Raleway", dq: "Cinzel:wght@400;600;700;800", bq: "Raleway:wght@400;500;600;700" },
};

/* ---------- colour maths ---------- */
const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
const hexToRgb = (h: string) => {
  const s = h.replace("#", "");
  const full = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
export const mix = (a: string, b: string, w: number) => {
  const A = hexToRgb(a), B = hexToRgb(b);
  return toHex(A[0] * w + B[0] * (1 - w), A[1] * w + B[1] * (1 - w), A[2] * w + B[2] * (1 - w));
};
const lum = (h: string) => {
  const [r, g, b] = hexToRgb(h).map((v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
// Keep the main colour readable: dark enough for white text, light enough to see on dark pages
const balance = (h: string) => {
  let c = h;
  for (let i = 0; i < 10 && lum(c) > 0.18; i++) c = mix(c, "#000000", 0.88);
  for (let i = 0; i < 10 && lum(c) < 0.04; i++) c = mix(c, "#FFFFFF", 0.85);
  return c;
};

export const VAR_KEYS = [
  "--color-royal", "--color-bright", "--color-azure", "--color-sky", "--color-light-azure",
  "--color-soft-blue", "--color-pale-blue", "--color-ice", "--color-aqua", "--color-navy",
  "--font-display", "--font-sans",
];

export function resolve(s: RemixState) {
  if (s.kind === "preset") return { p: PRESETS[s.key].p, a: PRESETS[s.key].a, font: s.key as FontKey };
  return { p: balance(s.p), a: s.a, font: s.font };
}

export function buildRemix(s: RemixState) {
  const { p, a, font } = resolve(s);
  const vars: Record<string, string> = {
    "--color-royal": p,
    "--color-bright": mix(p, a, 0.85),
    "--color-azure": mix(p, a, 0.65),
    "--color-sky": mix(p, a, 0.45),
    "--color-light-azure": mix(mix(p, a, 0.3), "#FFFFFF", 0.8),
    "--color-soft-blue": mix(a, "#FFFFFF", 0.8),
    "--color-pale-blue": mix(a, "#FFFFFF", 0.6),
    "--color-ice": mix(a, "#FFFFFF", 0.35),
    "--color-aqua": mix(a, "#FFFFFF", 0.15),
    "--color-navy": mix(p, "#0B0F17", 0.22),
  };
  let fontsHref: string | null = null;
  if (font !== "aso") {
    const f = FONT_PAIRS[font];
    vars["--font-display"] = `"${f.display}", system-ui, sans-serif`;
    vars["--font-sans"] = `"${f.body}", system-ui, sans-serif`;
    fontsHref = `https://fonts.googleapis.com/css2?family=${f.dq}&family=${f.bq}&display=swap`;
  }
  return { vars, fontsHref };
}

export function remixLabel(s: RemixState) {
  return s.kind === "preset" ? PRESETS[s.key].name : "Your custom brand";
}

/* ---------- share links ---------- */
export function encodeRemix(s: RemixState) {
  return s.kind === "preset" ? s.key : `c-${s.p.slice(1)}-${s.a.slice(1)}-${s.font}`;
}
export function decodeRemix(v: string | null): RemixState | null {
  if (!v) return null;
  if ((ARCH_KEYS as string[]).includes(v)) return { kind: "preset", key: v as ArchKey };
  const m = v.match(/^c-([0-9a-fA-F]{6})-([0-9a-fA-F]{6})-([a-z]+)$/);
  if (m && (m[3] === "aso" || (ARCH_KEYS as string[]).includes(m[3]))) {
    return { kind: "custom", p: `#${m[1].toUpperCase()}`, a: `#${m[2].toUpperCase()}`, font: m[3] as FontKey };
  }
  return null;
}

/* ---------- apply / reset (browser only) ---------- */
function animate() {
  const root = document.documentElement;
  root.dataset.remixAnim = "1";
  setTimeout(() => { delete root.dataset.remixAnim; }, 600);
}

export function applyRemix(s: RemixState) {
  const root = document.documentElement;
  const { vars, fontsHref } = buildRemix(s);
  animate();
  VAR_KEYS.forEach((k) => root.style.removeProperty(k));
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  root.dataset.remix = "1";
  let link = document.getElementById("remix-fonts") as HTMLLinkElement | null;
  if (fontsHref) {
    if (!link) { link = document.createElement("link"); link.id = "remix-fonts"; link.rel = "stylesheet"; document.head.appendChild(link); }
    link.href = fontsHref;
  } else link?.remove();
  try { sessionStorage.setItem(STORAGE_KEY, encodeRemix(s)); } catch {}
  window.dispatchEvent(new CustomEvent("aso:remix-change", { detail: vars }));
}

export function resetRemix() {
  const root = document.documentElement;
  animate();
  VAR_KEYS.forEach((k) => root.style.removeProperty(k));
  delete root.dataset.remix;
  document.getElementById("remix-fonts")?.remove();
  try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
  window.dispatchEvent(new CustomEvent("aso:remix-change", { detail: null }));
}