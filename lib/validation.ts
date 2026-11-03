import { z } from "zod";

export const projectTypes = ["Brand Identity", "Logo Design", "Graphic Design & Advertising", "Creative / Art Direction",
  "Photography & Image Editing", "Packaging & Print", "Digital Visual Experience", "Other"] as const;
export const budgets = ["Under ₦250k", "₦250k – ₦750k", "₦750k – ₦2m", "Over ₦2m", "Not sure yet"]; // edit freely

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