import type { Metadata } from "next";
import Link from "next/link";

import { getPersonProfile } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Yumesh Ban's portfolio website.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const profile = await getPersonProfile();

  return (
    <section className="site-section pt-32">
      <div className="site-container">
        <div className="max-w-3xl">
          <p className="site-eyebrow">{"// Website policy"}</p>
          <h1 className="mt-4 text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-7xl">
            Privacy Policy
          </h1>
          <p className="mt-6 text-sm leading-7 text-white/55">Last updated: August 11, 2026</p>

          <div className="mt-12 space-y-10 border-t border-white/10 pt-8 text-sm leading-7 text-white/65">
            <section>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">Overview</h2>
              <p className="mt-3">
                This website is the personal portfolio of Yumesh Ban. I use the personal information you submit, together with limited technical information described below, only to operate the site, prevent abuse, and respond to inquiries.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">Information you send</h2>
              <p className="mt-3">
                If you use the contact form, I collect your name, email address, inquiry type, subject, message, and any company or project details you provide. I use this information to understand your inquiry and respond to you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">Technical information</h2>
              <p className="mt-3">
                The contact endpoint uses your network address for rate limiting and keeps it in application memory for up to approximately ten minutes. The hosting provider may also process standard request information, such as network address, browser details, requested pages, and timestamps, in operational logs. This site does not currently use advertising cookies or visitor analytics services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">How information is shared</h2>
              <p className="mt-3">
                Contact-form messages are sent through the email provider configured for this website and stored in my email account so that I can receive and reply to them. Website hosting and content-management providers may process limited data needed to deliver the site. I do not sell your personal information or use it for unrelated marketing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">Retention and security</h2>
              <p className="mt-3">
                I keep contact messages while an inquiry is active and afterward only when reasonably needed for follow-up, security, or business records. You can ask me to delete a message when it is no longer required for those purposes. I take reasonable steps to protect information, but no online transmission or storage method is completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">Your questions</h2>
              <p className="mt-3">
                Yumesh Ban is responsible for the information described on this page. To ask about your information or request that I update or delete a message you sent, email me at{" "}
                <a href={`mailto:${profile.email}`} className="site-link text-blue-200">{profile.email}</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-white">Changes to this policy</h2>
              <p className="mt-3">
                I may update this policy when the website or its data practices change. The latest version will always be published on this page.
              </p>
            </section>
          </div>

          <p className="mt-12 border-t border-white/10 pt-6 text-sm text-white/55">
            Questions about a project? <Link href="/contact" className="site-link text-blue-200">Get in touch</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
