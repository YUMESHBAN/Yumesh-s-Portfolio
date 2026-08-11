import type { Metadata } from "next";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { getPersonProfile } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact Yumesh Ban",
    description:
      "Contact Yumesh Ban for full-stack development opportunities, project collaborations, and professional inquiries.",
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage() {
  const profile = await getPersonProfile();
  const github = profile.socialLinks.find((link) => link.label === "GitHub");
  const linkedin = profile.socialLinks.find((link) => link.label === "LinkedIn");

  return (
    <section className="site-section pt-32">
      <div className="site-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Contact Yumesh Ban"
            description="For developer roles, product builds, and technical collaborations. A little context about the opportunity or project helps me reply with something useful."
          />
          <div className="mt-8 grid border-y border-white/10">
            <a href={`mailto:${profile.email}`} className="site-link flex items-center gap-3 border-b border-white/10 py-4 font-medium">
              <Mail className="text-blue-400" size={20} />
              <span>
                <span className="block text-sm text-white/60">Email &mdash; fastest route</span>
                {profile.email}
              </span>
            </a>
            <div className="flex items-center gap-3 border-b border-white/10 py-4 font-medium text-white/70">
              <MapPin className="text-blue-400" size={20} />
              {profile.location}
            </div>
            {github ? (
              <a href={github.href} target="_blank" rel="noreferrer" className="site-link flex items-center gap-3 border-b border-white/10 py-4 font-medium">
                <Github className="text-blue-400" size={20} />
                <span>
                  <span className="block text-sm text-white/60">GitHub &mdash; technical work</span>
                  GitHub
                </span>
              </a>
            ) : null}
            {linkedin ? (
              <a href={linkedin.href} target="_blank" rel="noreferrer" className="site-link flex items-center gap-3 py-4 font-medium">
                <Linkedin className="text-blue-400" size={20} />
                <span>
                  <span className="block text-sm text-white/60">LinkedIn &mdash; professional context</span>
                  LinkedIn
                </span>
              </a>
            ) : null}
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
