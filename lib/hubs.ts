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
  process?: { no: string; title: string; text: string }[]; // optional hub-specific steps
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

export const webHub: Hub = {
    key: "web",
    path: "/web",
    eyebrow: "WEB & SEO",
    title: "Websites that load fast, rank well and",
    titleAccent: "turn visitors into clients.",
    intro: "Custom, mobile-first websites that I design and build myself, with on-page SEO, speed and analytics set up from day one. Choose your website below and get an instant estimate.",
    contactService: "web-development",
    calcName: "website cost calculator",
    facts: [
      { label: "Pricing", value: "Per project or monthly SEO" },
      { label: "Every build", value: "Mobile-first & SEO-ready" },
      { label: "Based in", value: "Lagos, working worldwide" },
    ],
    benefits: [
      { title: "Designed to convert", text: "Clear structure, strong calls to action and one-tap WhatsApp, so visitors know exactly what to do next." },
      { title: "Mobile-first & fast", text: "Built for the phones most of your customers use, with optimised images and lightweight code." },
      { title: "SEO built in", text: "Clean structure, page titles, descriptions, sitemaps and structured data, so search engines understand your site." },
      { title: "Easy to update", text: "A simple admin where you can change text, images and projects yourself, without calling a developer." },
      { title: "Secure & reliable", text: "HTTPS, modern hosting and protected admin areas, so your site and your visitors stay safe." },
      { title: "Connected", text: "Contact forms, WhatsApp, analytics and Google Search Console set up and working on launch day." },
    ],
    deliverables: [
      "Business, portfolio & ministry websites",
      "Landing pages",
      "Website redesigns",
      "On-page & technical SEO",
      "Google Search Console & analytics setup",
      "Google Business Profile setup",
      "Content admin you can manage",
      "Hosting & domain setup",
    ],
    categories: ["Web Design & Development", "SEO"],
    process: [
      { no: "01", title: "Discover & plan", text: "Your goals, your audience, and the pages and keywords your site needs to win." },
      { no: "02", title: "Design", text: "A custom design built around your brand, approved by you before any code is written." },
      { no: "03", title: "Build & test", text: "A fast, secure, mobile-first build, tested across phones, tablets and browsers." },
      { no: "04", title: "Launch & optimise", text: "Domain, analytics and Search Console connected, then speed and SEO tuned after launch." },
    ],
    seo: {
      title: "Website Design & SEO in Lagos — Web & SEO",
      description: "Custom, mobile-first website design and development with on-page SEO by ASO INNOVALITY in Lagos. Choose your website and get an instant estimate.",
    },
  };
  
export const aiHub: Hub = {
    key: "ai",
    path: "/ai",
    eyebrow: "AI & AUTOMATION",
    title: "Automations that save time and",
    titleAccent: "work while you sleep.",
    intro: "I design and build practical AI and automation for growing businesses, teams and ministries: chatbots, WhatsApp follow-ups and workflows that connect your tools, so the repetitive work runs itself. Choose what you need below and get an instant estimate.",
    contactService: "ai-automation",
    calcName: "automation cost calculator",
    facts: [
      { label: "Pricing", value: "Per project or monthly support" },
      { label: "Built for", value: "Small teams & growing businesses" },
      { label: "Based in", value: "Lagos, working worldwide" },
    ],
    benefits: [
      { title: "Save hours every week", text: "Repetitive tasks like data entry, follow-ups and reports run automatically, so your team can focus on real work." },
      { title: "Reply instantly", text: "Chatbots and auto-replies answer common questions and capture leads at any hour, even when you’re offline." },
      { title: "Fewer manual errors", text: "Information moves between your tools automatically, instead of being copied and pasted by hand." },
      { title: "Your tools, connected", text: "Forms, spreadsheets, email, WhatsApp and your website working together as one system." },
      { title: "You stay in control", text: "Clear rules, human hand-off where it matters, and simple dashboards so you always know what’s happening." },
      { title: "Private by design", text: "Only the data each automation needs, with access kept to the people and tools that should have it." },
    ],
    deliverables: [
      "Website & WhatsApp chatbots",
      "Automated lead capture & follow-up",
      "Workflow automation between your tools",
      "AI-assisted content workflows",
      "Custom AI integrations",
      "Setup, documentation & training",
      "Ongoing support & monitoring",
    ],
    categories: ["AI & Automation"],
    process: [
      { no: "01", title: "Map your workflow", text: "We walk through how the work happens today and find the steps worth automating first." },
      { no: "02", title: "Design the automation", text: "A clear plan of what triggers what, which tools connect and where a person stays in the loop." },
      { no: "03", title: "Build & test", text: "I build it, then test it with real examples until it runs reliably from start to finish." },
      { no: "04", title: "Launch & support", text: "Your team gets a walkthrough and documentation, with optional monthly monitoring and improvements." },
    ],
    seo: {
      title: "AI & Automation Services in Lagos — Chatbots & Workflows",
      description: "Chatbots, WhatsApp automation, workflow automation and AI integrations by ASO INNOVALITY in Lagos. Choose what you need and get an instant estimate.",
    },
  };