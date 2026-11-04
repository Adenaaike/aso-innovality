// All About-page content lives here — edit freely.

export const bio = [
    "I’m Adenaike Sodiq Olusegun, professionally known as ASO, a Lagos-based multidisciplinary creative designer and the founder of ASO INNOVALITY. For over nine years, my work has sat where brand strategy, typographic discipline and visual storytelling meet.",
    "I approach every brief as a communication problem to solve, not decoration. Whether I’m building a brand architecture for an African empowerment initiative like IBETA, art-directing an event campaign for GIE Church Miracle Center in Hasselt, Belgium, or structuring property investment visuals for One Million Landlord, I’m guided by clarity, hierarchy and cultural resonance.",
    "Along the way I’ve taken part in five design exhibitions and creative events, earned two professional certifications, and kept expanding my craft across brand systems, photo compositing, print production and interactive digital experiences.",
  ];
  
  export const principles = [
    { no: "01", title: "Ideas", subtitle: "Strategic foundation",
      text: "Every memorable visual begins with inquiry. Before I touch a canvas, I look at the audience, the context and the one message that must be remembered." },
    { no: "02", title: "Identity", subtitle: "Distinctive form",
      text: "I build visual systems, from logos and type hierarchies to colour architecture, that give organisations a distinctive, trustworthy presence in print and on screen." },
    { no: "03", title: "Innovation", subtitle: "Adaptive execution",
      text: "From corporate print collateral to photo compositing and web experiences, I combine classic design principles with contemporary tools." },
  ];
  
  export type Role = { org: string; role: string; years: string; current?: boolean; note?: string };
  
  export const experience: Role[] = [
    { org: "Salem Global", role: "Creative Designer", years: "2025 – Present", current: true,
      note: "Digital key visuals and editorial posters, including a two-part tribute poster series." },
    { org: "Freelance · ASO INNOVALITY", role: "Graphic Design, Logo Design & Branding", years: "2017 – Present", current: true,
      note: "Brand identity, campaign and print work for clients including IBETA, One Million Landlord and GIE Church Miracle Center (Belgium)." },
    { org: "City Initiative", role: "Head, Design Department", years: "2021 – 2023",
      note: "Led the organisation’s design function and visual communication." },
    { org: "Christ Unity Ministries", role: "Creative Designer", years: "2019 – 2022",
      note: "Event, programme and communication graphics for the ministry." },
    { org: "Samnun Clothing", role: "Creative Designer", years: "2020 – 2022",
      note: "Promotional and brand visuals for the fashion label." },
    { org: "DDT — Dee Defendant of Truth", role: "Creative Designer / Director", years: "2018 – 2022",
      note: "Directed and designed the organisation’s visual content." },
  ];
  
  export const education = { degree: "B.Sc. Electronics and Computer Engineering", school: "Lagos State University", years: "2017 – 2023" };
  
  export const certifications = [
    { title: "Certificate of Completion, Graphic Design", issuer: "Side Hustle", year: "2022" },
    { title: "Design for Social Change", issuer: "", year: "2020" },
  ];
  
  export const exhibitions = [
    { year: "2022", items: ["Africa Creative Market", "Techgeeks Hangout"] },
    { year: "2020", items: ["International Design Fest", "Students Creative Summit", "Design Award"] },
  ];
  
  export const competencies = [
    { group: "Brand & Identity", items: ["Logo systems", "Sub-brand architecture", "Visual identity guidelines", "Corporate stationery & ID systems", "Rebranding"] },
    { group: "Campaign & Visual Communication", items: ["Event key visuals", "Real estate & commercial advertising", "Photo manipulation & compositing", "Editorial poster design"] },
    { group: "Typography & Layout", items: ["Custom display lettering", "3D perspective typography", "Multilingual lockups", "Pricing & information layouts", "Print pre-press"] },
  ];
  
  export const tools = ["Adobe Photoshop", "Adobe Illustrator", "CorelDRAW", "Adobe Lightroom", "Filmora", "Canva", "Microsoft Office"];
  
  export const cvPath = "/aso-cv.pdf";