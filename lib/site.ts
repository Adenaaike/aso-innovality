export const site = {
    name: "Adenaike Sodiq Olusegun",
    short: "ASO",
    brand: "ASO INNOVALITY",
    tagline: "Ideas. Identity. Innovation.",
    secondary: "Transforming Ideas Into Visual Experiences.",
    email: "adenaikeolusegun4@gmail.com",
    phoneDisplay: "+234 810 645 8863",
    whatsapp: "https://wa.me/2348106458863",
    instagram: "https://www.instagram.com/aso_innovality/",
    pinterest: "https://www.pinterest.com/adenaikesodiq/",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  };
  
  export const nav = [
    { href: "/", label: "Home" },
    { href: "/work", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/playground", label: "Playground" },
    { href: "/journal", label: "Journal" },
    { href: "/contact", label: "Contact" },
  ];
  
  export const services = [
    {
      no: "01", slug: "brand-identity", title: "Brand Identity & Strategy",
      summary: "Complete visual identity systems that earn trust, from primary marks and sub-brands to brand guidelines and corporate stationery.",
      deliverables: ["Logo systems", "Sub-brand architecture", "Brand guidelines", "Typography & colour systems", "Stationery & staff ID collateral"],
    },
    {
      no: "02", slug: "graphic-design", title: "Graphic Design & Advertising",
      summary: "Marketing visuals that stop the scroll and make complex offers easy to understand, across social media, print and outdoor.",
      deliverables: ["Property & product listings", "Promotional flyers", "Social media campaign suites", "Pricing & information layouts"],
    },
    {
      no: "03", slug: "campaign-direction", title: "Campaign & Event Art Direction",
      summary: "Cohesive visual storytelling for conferences, seasonal events and ministry gatherings, so every event feels distinct yet clearly yours.",
      deliverables: ["Event key visuals", "Series branding", "Custom 3D & display titles", "Stage & screen graphics"],
    },
    {
      no: "04", slug: "photo-manipulation", title: "Photo Manipulation & Editorial Compositing",
      summary: "Multi-image blending, lighting and colour grading that turn standard photography into cinematic poster art.",
      deliverables: ["Tribute & editorial posters", "Double-exposure composites", "High-end retouching", "Key art"],
    },
    {
      no: "05", slug: "packaging-print", title: "Packaging & Print Design",
      summary: "Production-ready print with accurate colour, bleed and finishing, so it looks right off the press.",
      deliverables: ["ID cards & lanyards", "Brochures & programmes", "Packaging & labels"],
    },
    {
      no: "06", slug: "digital-experiences", title: "Digital Visual Experiences",
      summary: "Bringing brand identities to screens with responsive web visuals and digital brand kits that hold up on every device.",
      deliverables: ["Web UI visual assets", "Digital brand kits", "Interactive design systems"],
    },
  ];
  
  // ── Homepage content (edit freely) ──────────────────────────
  
  export const studio = {
    available: true, // change to false when you're fully booked
    city: "Lagos",
    timeZone: "Africa/Lagos",
  };
  
  // Organisations I've designed for (shown in the "Designed for" strip)
  export const clients = [
    "IBETA Africa",
    "GIE Church Miracle Center",
    "One Million Landlord",
    "Salem Global",
    "Christ Unity Ministries",
    "Samnun Clothing",
    "City Initiative",
    "DDT — Dee Defendant of Truth",
  ];
  
  // Countries served. Add the third once confirmed (needs a matching flag in components/home/Flag.tsx)
  export const countries = [
    { code: "ng", name: "Nigeria" },
    { code: "be", name: "Belgium" },
  ];
  
  export type Stat = { value: number; suffix: string; label: string; flags?: boolean };
  
  // Honest numbers only. Organisation and country counts update automatically.
  export const stats: Stat[] = [
    { value: new Date().getFullYear() - 2017, suffix: "+", label: "Years designing" },
    { value: clients.length, suffix: "", label: "Organisations designed for" },
    { value: countries.length, suffix: "", label: "Countries served", flags: true },
    { value: 5, suffix: "", label: "Exhibitions & design events" },
    { value: 2, suffix: "", label: "Certifications" },
  ];
  
  // How ASO works. Reword these in your own voice anytime.
  export const steps = [
    { no: "01", title: "Discover", text: "Understanding your goals, your audience and what makes your brand different." },
    { no: "02", title: "Concept", text: "Exploring ideas, directions and moodboards before committing to a look." },
    { no: "03", title: "Design", text: "Crafting the identity and every asset in detail, refined through your feedback." },
    { no: "04", title: "Deliver", text: "Final files, guidelines and everything you need to use your brand with confidence." },
  ];