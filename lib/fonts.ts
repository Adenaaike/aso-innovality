import { Space_Grotesk, Inter, Sora, Manrope, DM_Sans, Anton, Bebas_Neue } from "next/font/google";

// Site-wide
export const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

// Typography Lab only (not preloaded, so they cost nothing elsewhere)
export const sora = Sora({ subsets: ["latin"], display: "swap", preload: false });
export const manrope = Manrope({ subsets: ["latin"], display: "swap", preload: false });
export const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", preload: false });
export const anton = Anton({ weight: "400", subsets: ["latin"], display: "swap", preload: false });
export const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], display: "swap", preload: false });