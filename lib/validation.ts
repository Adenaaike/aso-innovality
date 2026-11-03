import { z } from "zod";

export const projectTypes = [
  "Brand Identity & Logo System",
  "Event / Campaign Series",
  "Commercial & Social Media Design",
  "Photo Manipulation & Compositing",
  "Print & Packaging",
  "Digital Visual Experience",
  "Other Collaboration",
] as const;

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