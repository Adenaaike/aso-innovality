import { publicClient } from "@/lib/supabase/public";
import { site, studio } from "@/lib/site";
import { cvPath } from "@/lib/about";

export type SiteSettings = {
  available: boolean;
  availabilityNote: string;
  email: string;
  phoneDisplay: string;
  whatsappNumber: string; // digits only, with country code, e.g. 2348106458863
  cvUrl: string;
  portraitHome: string;
  portraitAbout: string;
  ngnRate: number; // ₦ per $1 for the calculators; 0 hides the ₦ option
  workDays: number[]; // 0 = Sunday … 6 = Saturday (Lagos time)
  workStart: string;  // "09:00"
  workEnd: string;    // "18:00"
};

// Used until you save something in Admin → Settings
export const DEFAULT_SETTINGS: SiteSettings = {
  available: studio.available,
  availabilityNote: "",
  email: site.email,
  phoneDisplay: site.phoneDisplay,
  whatsappNumber: "2348106458863",
  cvUrl: cvPath,
  portraitHome: "/images/aso-portrait.jpg",
  portraitAbout: "/images/aso-portrait.jpg",
  ngnRate: 0,
  workDays: [1, 2, 3, 4, 5],
  workStart: "09:00",
  workEnd: "18:00",
};

export async function getSettings(): Promise<SiteSettings> {
  const sb = publicClient();
  if (!sb) return DEFAULT_SETTINGS;
  const { data } = await sb.from("site_settings").select("value").eq("key", "site").maybeSingle();
  return { ...DEFAULT_SETTINGS, ...((data?.value as Partial<SiteSettings>) ?? {}) };
}