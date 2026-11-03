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
      summary: "Distinctive visual identities that communicate the personality, positioning and values of businesses.",
      deliverables: ["Logo design", "Logo variations", "Brand colours", "Typography systems", "Brand guidelines", "Stationery", "Brand mockups", "Visual identity systems"],
    },
    {
      no: "02", slug: "graphic-design", title: "Graphic Design & Advertising",
      summary: "Compelling visual communication for marketing, campaigns, promotions and events.",
      deliverables: ["Flyers", "Posters", "Social media graphics", "Brochures", "Banners", "Campaign designs", "Marketing materials"],
    },
    {
      no: "03", slug: "creative-direction", title: "Creative & Art Direction",
      summary: "Turning ideas into cohesive visual narratives through creative planning, visual exploration and design execution.",
      deliverables: [],
    },
    {
      no: "04", slug: "photography", title: "Photography & Image Editing",
      summary: "Developing and refining visual assets for brands, campaigns, promotional materials and storytelling.",
      deliverables: [],
    },
    {
      no: "05", slug: "packaging-print", title: "Packaging & Print Design",
      summary: "Visually compelling packaging and printed communication that elevates brand presentation.",
      deliverables: [],
    },
    {
      no: "06", slug: "digital-experiences", title: "Digital Visual Experiences",
      summary: "Exploring where design, technology, motion and interactive communication meet.",
      deliverables: [],
    },
  ];

// ── Homepage content (edit freely) ──────────────────────────

export const studio = {
    available: true, // change to false when you're fully booked
    city: "Lagos",
    timeZone: "Africa/Lagos",
  };
  
  // Organisations from the CV. Remove any you'd rather not show.
  export const clients = [
    "Christ Unity Ministries",
    "Samnun Clothing",
    "City Initiative",
    "DDT — Dee Defendant of Truth",
  ];
  
  // Honest numbers only, from the CV
  export const stats = [
    { value: new Date().getFullYear() - 2017, suffix: "+", label: "Years designing" },
    { value: 4, suffix: "", label: "Organisations designed for" },
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