import type { Metadata } from "next";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { spaceGrotesk, inter } from "@/lib/fonts";
import { SiteFooter } from "@/components/SiteFooter";
import { Nav } from "@/components/Nav";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { IntroSplash } from "@/components/IntroSplash";
import { RemixButton } from "@/components/remix/RemixButton";
import { LazyExtras } from "@/components/LazyExtras";

// Runs before the page appears: skip the intro if already seen this visit, on admin pages, or with reduced motion
// Cloudflare Web Analytics (cookie-free). Only loads on the live site, when the token is set in Netlify.
const CF_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
const INTRO_SCRIPT = `(function(){try{var d=document.documentElement;var r=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(r||location.pathname.indexOf('/admin')===0||sessionStorage.getItem('aso-intro-seen')){d.dataset.introSeen='1';}}catch(e){document.documentElement.dataset.introSeen='1';}})();`;
import { site } from "@/lib/site";
import { PRACTICES } from "@/lib/practices";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "ASO Innovality — Design, Web & AI Studio in Lagos | Adenaike Sodiq Olusegun",
    template: "%s — ASO Innovality",
  },
  description: "The creative-tech studio of Adenaike Sodiq Olusegun in Lagos: brand identity and graphic design, websites and SEO, and AI automation for organisations in Nigeria and worldwide.",
  keywords: [
    "Adenaike Sodiq Olusegun", "ASO Innovality", "Graphic Designer in Nigeria", "Brand Identity Designer",
    "Logo Designer Lagos", "Carousel Designer", "Website Designer Lagos", "SEO Nigeria",
    "AI Automation Nigeria", "WhatsApp Automation", "Creative Studio Lagos",
  ],
  openGraph: { type: "website", siteName: "ASO Innovality", locale: "en_NG" },
  twitter: { card: "summary_large_image" },
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: ["ASO", "ASO Innovality"],
  jobTitle: "Creative Designer & Founder",
  url: site.url,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Lagos State University" },
  worksFor: { "@type": "Organization", name: "ASO Innovality", url: site.url },
  knowsAbout: [
    "Brand identity design", "Logo design", "Graphic design", "Carousel design", "Photo manipulation",
    "Packaging design", "Website design", "Web development", "Search engine optimisation", "Workflow automation",
  ],
  sameAs: [site.instagram, site.pinterest],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-royal focus:px-4 focus:py-2 focus:text-white">
            Skip to content
          </a>
          <IntroSplash />
          <Nav />
          <main id="main">{children}</main>
          <SiteFooter />
          <WhatsAppButton />
          <LazyExtras />
                                    </ThemeProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
        {CF_TOKEN && process.env.NODE_ENV === "production" && (
          <script type="module" src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: CF_TOKEN })} />
        )}
      </body>
    </html>
  );
}