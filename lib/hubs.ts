import type { CalcKey } from "@/lib/calculators";

export type Hub = {
  key: CalcKey;
  path: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  intro: string;
  contactService: string; // which service the contact form pre-selects
  calcName: string;       // used in WhatsApp / quote messages
  facts: { label: string; value: string }[];
  benefits: { title: string; text: string }[];
  deliverables: string[];
  categories: string[];   // project categories shown as proof on this hub
  seo: { title: string; description: string };
};

export const designHub: Hub = {
  key: "design",
  path: "/design",
  eyebrow: "DESIGN STUDIO",
  title: "Design that makes brands",
  titleAccent: "impossible to ignore.",
  intro: "Brand identities, social media and carousels, campaign key visuals, packaging and photo manipulation, designed with strategy and finished with craft. Pick what you need below and get an instant estimate.",
  contactService: "brand-identity",
  calcName: "design cost calculator",
  facts: [
    { label: "Starts from", value: "$300" },
    { label: "Pricing", value: "Per project or monthly" },
    { label: "Based in", value: "Lagos, working worldwide" },
  ],
  benefits: [
    { title: "Distinctive identities", text: "Logos and brand systems built around your positioning, so you stand apart instead of blending in." },
    { title: "Scroll-stopping social", text: "Posts and multi-slide carousels designed to stop the scroll, explain the offer and earn the swipe." },
    { title: "Campaign key visuals", text: "Event and campaign series that feel fresh every time, while staying unmistakably yours." },
    { title: "Print & packaging", text: "Production-ready files with correct colour, bleed and finishing, so it looks right off the press." },
    { title: "Photo manipulation", text: "Multi-image compositing, lighting and colour grading that turn ordinary photos into cinematic visuals." },
    { title: "Always on-brand", text: "Everything designed to your guidelines, so your brand looks consistent wherever it appears." },
  ],
  deliverables: [
    "Logo & brand identity systems",
    "Brand guidelines",
    "Social media posts & carousels",
    "Flyers, posters & banners",
    "Event & campaign key visuals",
    "Packaging & labels",
    "Photo manipulation & retouching",
    "Print-ready, web-ready & source files",
  ],
  categories: [
    "Brand Identity", "Logo Design", "Graphic Design", "Campaigns & Posters", "Social Media Design",
    "Photography", "Packaging", "Experimental Design", "Photo Manipulation", "Carousel Design",
  ],
  seo: {
    title: "Graphic Design & Branding in Lagos — Design Studio",
    description: "Brand identity, logo design, social media and carousel design, campaign visuals, packaging and photo manipulation by ASO INNOVALITY in Lagos. Get an instant estimate.",
  },
};