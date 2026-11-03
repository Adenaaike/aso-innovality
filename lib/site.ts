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