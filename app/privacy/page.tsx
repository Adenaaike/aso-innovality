import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ASO INNOVALITY collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "6 November 2026";

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">PRIVACY POLICY</p>
      <h1 className="mt-4 font-display text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.05]">
        How I handle <span className="aso-text-gradient">your information.</span>
      </h1>
      <p className="mt-4 text-sm text-muted">Last updated: {UPDATED}</p>

      <div className="prose prose-lg mt-10 max-w-none dark:prose-invert prose-headings:font-display prose-a:text-royal dark:prose-a:text-light-azure">
        <p>
          This website is run by Adenaike Sodiq Olusegun, trading as <strong>ASO INNOVALITY</strong>, based in Lagos, Nigeria
          (“I”, “me”). I respect your privacy and only collect what I need to reply to you and run this website. This policy
          explains what I collect, why, and the choices you have. It is written with the Nigeria Data Protection Act 2023 in mind.
        </p>

        <h2>1. Information I collect</h2>
        <h3>When you contact me</h3>
        <p>
          When you send the contact form, I collect your <strong>name, email address, company or brand</strong> (if given),
          <strong> project type, estimated budget</strong> and <strong>project description</strong>, including any estimate you
          send from my cost calculators. I use this only to reply to you, prepare a quote and work on your project.
        </p>
        <h3>When you use the calculators and tools</h3>
        <p>
          The cost calculators, the Brand Personality Quiz, Remix This Site and the other playground tools run in your browser.
          I do <strong>not</strong> store your selections unless you choose to send them to me, for example through the contact
          form or WhatsApp. Images you use in tools such as the Carousel Splitter are processed on your device and are never uploaded.
        </p>
        <h3>When you add to the Idea Wall</h3>
        <p>
          The Idea Wall shows the <strong>colour</strong> you choose and, if you add one, a <strong>first name or single word</strong>,
          together with the time it was added. This is <strong>publicly visible</strong>, so please don’t add anything you want to keep
          private. To allow one colour per visitor per day, the website stores a scrambled code (a one-way “hash”) created from your
          connection details. It cannot be turned back into your address, and it is deleted after two days.
        </p>
        <h3>When you contact me on WhatsApp or by email</h3>
        <p>
          If you message me on WhatsApp or by email, those services handle your messages under their own privacy policies, and
          I keep our conversations to manage your enquiry or project.
        </p>

        <h2>2. Information stored in your browser</h2>
        <p>
          The website stores a few small preferences on your device, such as your light or dark theme, whether you have already
          seen the opening animation, an active Remix, your quiz result and the date you last added to the Idea Wall. These are
          used only to make the site work as you expect. <strong>I do not use advertising or tracking cookies.</strong> You can
          clear this information at any time in your browser settings.
        </p>

        <h2>3. Website analytics</h2>
        <p>
          I use privacy-friendly, cookie-free analytics to understand how many people visit and which pages are useful. It shows
          me totals, such as page views and the country or type of device, and is not used to identify you or follow you across
          other websites.
        </p>

        <h2>4. Who else handles your information</h2>
        <p>I use trusted service providers to run this website. They process information only to provide their service:</p>
        <ul>
          <li><strong>Netlify</strong>: hosts the website and may keep basic technical logs, such as IP addresses, for security.</li>
          <li><strong>Supabase</strong>: securely stores contact enquiries, website content and Idea Wall entries.</li>
          <li><strong>Google Fonts</strong>: provides extra fonts, loaded only while you use Remix This Site.</li>
          <li><strong>Cloudflare Web Analytics</strong>: provides the cookie-free visit statistics described above.</li>
          <li><strong>WhatsApp (Meta)</strong>: only if you choose to message me there.</li>
        </ul>
        <p>
          Some of these providers store information outside Nigeria. I choose established providers that protect data with strong
          security. I never sell your personal information, and I don’t share it for advertising.
        </p>

        <h2>5. How long I keep information</h2>
        <ul>
          <li><strong>Enquiries:</strong> kept for as long as needed to respond and manage any project that follows, and normally deleted within two years of our last contact, unless we are working together.</li>
          <li><strong>Idea Wall entries:</strong> kept while they are on the wall. You can ask me to remove yours at any time.</li>
          <li><strong>Idea Wall daily-limit codes:</strong> deleted after two days.</li>
        </ul>

        <h2>6. Your rights</h2>
        <p>Under the Nigeria Data Protection Act 2023, you can ask me to:</p>
        <ul>
          <li>tell you what personal information I hold about you and give you a copy;</li>
          <li>correct information that is wrong or incomplete;</li>
          <li>delete your information;</li>
          <li>stop or limit how I use it, or withdraw your consent.</li>
        </ul>
        <p>
          To make a request, email me at <a href={`mailto:${site.email}`}>{site.email}</a>. I will reply as soon as possible, and
          within 30 days. If you are unhappy with how I handle your information, you can also contact the
          <strong> Nigeria Data Protection Commission (NDPC)</strong>.
        </p>

        <h2>7. Keeping information safe</h2>
        <p>
          The website uses a secure (HTTPS) connection, enquiries are stored in a protected database that only I can access, and
          the admin area is password-protected. No method of storing information online is completely risk-free, but I take
          reasonable steps to protect it.
        </p>

        <h2>8. Children</h2>
        <p>This website is intended for businesses and adults. I do not knowingly collect information from children under 18.</p>

        <h2>9. Changes to this policy</h2>
        <p>I may update this policy as the website changes. The “last updated” date at the top shows when it was last revised.</p>

        <h2>10. Contact</h2>
        <p>
          Questions about your privacy? Email <a href={`mailto:${site.email}`}>{site.email}</a> or use the{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </div>
    </div>
  );
}