import type { Metadata } from "next";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { spaceGrotesk, inter } from "@/lib/fonts";
import { Nav } from "@/components/Nav";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "ASO Innovality — Adenaike Sodiq Olusegun | Brand Identity & Graphic Designer", template: "%s — ASO Innovality" },
  description: "Adenaike Sodiq Olusegun (ASO) is a multidisciplinary creative designer in Nigeria specialising in brand identity, logo design, creative direction, photography and packaging.",
  keywords: ["Adenaike Sodiq Olusegun", "ASO Innovality", "Graphic Designer in Nigeria", "Brand Identity Designer", "Logo Designer", "Creative Director", "Freelance Graphic Designer"],
  openGraph: { type: "website", siteName: "ASO Innovality", locale: "en_NG" },
  twitter: { card: "summary_large_image" },
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: ["ASO", "ASO Innovality"],
  jobTitle: "Creative Designer",
  url: site.url,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressCountry: "NG" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Lagos State University" },
  sameAs: [site.instagram, site.pinterest],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-royal focus:px-4 focus:py-2 focus:text-white">
            Skip to content
          </a>
          <Nav />
          <main id="main">{children}</main>
          <footer className="border-t border-line">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
              <p>© {new Date().getFullYear()} {site.brand}. {site.tagline}</p>
              <div className="flex gap-6">
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-royal">Instagram</a>
                <a href={site.pinterest} target="_blank" rel="noopener noreferrer" className="hover:text-royal">Pinterest</a>
                <Link href="/contact" className="hover:text-royal">Contact</Link>
              </div>
            </div>
          </footer>
        </ThemeProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </body>
    </html>
  );
}