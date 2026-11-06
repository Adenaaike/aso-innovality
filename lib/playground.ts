export type ToolPractice = "design" | "web" | "ai";

export const PLAYGROUND_TOOLS: { id: string; label: string; practice: ToolPractice; isNew?: boolean }[] = [
    { id: "brand-quiz", label: "Brand Personality Quiz", practice: "design", isNew: true },
  { id: "remix", label: "Remix This Site", practice: "design", isNew: true },
  { id: "typography-lab", label: "Typography Lab", practice: "design" },
  { id: "palette", label: "Palette Generator", practice: "design" },
  { id: "colour-match", label: "Colour Match", practice: "design" },
  { id: "memory", label: "Design Memory", practice: "design" },
  { id: "logo-detective", label: "Logo Detective", practice: "design" },
  { id: "prompts", label: "Prompt Generator", practice: "design" },
  { id: "monogram", label: "Monogram Maker", practice: "design", isNew: true },
  { id: "carousel-splitter", label: "Carousel Splitter", practice: "design", isNew: true },
  { id: "link-preview", label: "Link Preview Tester", practice: "web", isNew: true },
  { id: "time-saved", label: "Time-Saved Calculator", practice: "ai", isNew: true },
];

export const PLAYGROUND_SECTIONS: { key: ToolPractice; title: string; text: string }[] = [
  { key: "design", title: "Design tools", text: "Type, colour and identity experiments, plus games to sharpen your designer’s eye." },
  { key: "web", title: "Web & SEO tools", text: "See how your pages look to Google and to people sharing your links." },
  { key: "ai", title: "AI & Automation tools", text: "Find out how much time and money automation could give back to your business." },
];