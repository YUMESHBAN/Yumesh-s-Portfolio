import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { PersonProfile, SiteSettings } from "@/types/content";

export function SiteFooter({
  profile,
  settings,
}: {
  profile: PersonProfile;
  settings: SiteSettings;
}) {
  return (
    <footer className="border-t border-white/10 bg-[#0b0b0c] text-white">
      <div className="site-container grid gap-10 py-12 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
        <div>
          <p className="site-eyebrow">Yumesh Ban</p>
          <p className="mt-4 max-w-xl text-2xl font-semibold leading-tight text-white">
            Full stack developer building useful, polished web products.
          </p>
          <p className="site-muted mt-4 text-sm">
            Official website for Yumesh Ban. Built with Next.js and Sanity.
          </p>
          <Link href="/contact" className="site-button-primary mt-6 w-fit">
            Start a conversation
            <ArrowRight size={17} />
          </Link>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase text-white/35">Explore</p>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href="/about" className="site-link">About</Link>
            <Link href="/selected-work" className="site-link">Work</Link>
            <Link href="/articles" className="site-link">Writing</Link>
            <Link href="/experience" className="site-link">Experience</Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase text-white/35">Connect</p>
          <div className="mt-4 grid gap-2 text-sm">
            {profile.socialLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="site-link">
                {link.label}
              </a>
            ))}
            <a href={`mailto:${profile.email}`} className="site-link">
              {profile.email}
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/35">
        <span>Copyright {new Date().getFullYear()} Yumesh Ban.</span>
        <span className="ml-2">Canonical site: {settings.siteUrl}</span>
      </div>
    </footer>
  );
}
