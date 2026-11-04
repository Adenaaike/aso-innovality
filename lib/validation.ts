import { z } from "zod";

export const projectTypes = [
    "Brand Identity & Logo System",
    "Graphic Design & Advertising",
    "Social Media & Carousel Design",
    "Event / Campaign Series",
    "Photo Manipulation & Compositing",
    "Print & Packaging",
    "Digital & UI Visuals",
    "Website Design & Development",
    "SEO & Search Visibility",
    "Chatbots & WhatsApp Automation",
    "Workflow & AI Automation",
    "Other Collaboration",
  ] as const;
  
  // How the project types are grouped in the contact form dropdown
  export const projectTypeGroups: { label: string; types: (typeof projectTypes)[number][] }[] = [
    { label: "Design Studio", types: ["Brand Identity & Logo System", "Graphic Design & Advertising", "Social Media & Carousel Design", "Event / Campaign Series", "Photo Manipulation & Compositing", "Print & Packaging", "Digital & UI Visuals"] },
    { label: "Web & SEO", types: ["Website Design & Development", "SEO & Search Visibility"] },
    { label: "AI & Automation", types: ["Chatbots & WhatsApp Automation", "Workflow & AI Automation"] },
    { label: "Other", types: ["Other Collaboration"] },
  ];

export const budgets = ["Starter — $300+", "Growth — $750+", "Enterprise — $1,800+", "Custom scope"];

export const enquirySchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Enter a valid email address"),
  company: z.string().trim().max(120).optional(),
  projectType: z.enum(projectTypes, { message: "Choose a project type" }),
  budget: z.string().max(40).optional(),
  description: z.string().trim().min(20, "Tell me a little more (at least 20 characters)").max(4000),
  website: z.string().optional(), // honeypot – real visitors never see or fill this
});
export type Enquiry = z.infer<typeof enquirySchema>;