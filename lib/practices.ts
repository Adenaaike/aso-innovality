import { Bot, Code2, PenTool, type LucideIcon } from "lucide-react";

export type Practice = {
  key: "design" | "web" | "ai";
  href: string;
  word: string;       // which brand word it belongs to
  title: string;
  text: string;
  estimateLabel: string;
  Icon: LucideIcon;
};

export const PRACTICES: Practice[] = [
  {
    key: "design", href: "/design", word: "IDENTITY", title: "Design Studio",
    text: "Brand identities, social media and carousels, campaigns, packaging and photo manipulation.",
    estimateLabel: "Price a design project", Icon: PenTool,
  },
  {
    key: "web", href: "/web", word: "INNOVATION", title: "Web & SEO",
    text: "Fast, mobile-first websites that I design and build myself, with SEO built in from day one.",
    estimateLabel: "Price a website", Icon: Code2,
  },
  {
    key: "ai", href: "/ai", word: "INNOVATION", title: "AI & Automation",
    text: "Chatbots, WhatsApp follow-ups and workflows that run the repetitive work for you.",
    estimateLabel: "Price an automation", Icon: Bot,
  },
];