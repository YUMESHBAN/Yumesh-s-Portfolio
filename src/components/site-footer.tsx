import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import type { PersonProfile, SiteSettings } from "@/types/content";

const navigation = [
  { href: "/about", label: "About" },
  { href: "/works", label: "Works" },
  { href: "/articles", label: "Writing" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteFooter({
  profile,
  settings,
}: {
  profile: PersonProfile;
  settings: SiteSettings;
}) {
  const siteHost = settings.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <footer className="border-t border-white/10 bg-[#0b0b0c] text-white">
      <div className="site-container py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div>
            <Link href="/" className="group inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9bb5ee]/70" aria-label={`${profile.name} home`}>
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden">
                <Image src="/images/yb-logo-abstract.png" alt="" width={32} height={32} className="h-full w-full object-cover" />
              </div>
              <span>
                <span className="block text-sm font-semibold tracking-[-0.02em]">{profile.name}</span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">Portfolio</span>
              </span>
            </Link>

            <p className="mt-7 max-w-md text-2xl font-medium leading-tight tracking-[-0.03em] text-white sm:text-3xl">
              Building useful products, thoughtfully.
            </p>
            <p className="site-muted mt-3 max-w-md text-sm leading-6">
              From early ideas to polished web experiences.
            </p>
            <Link href="/contact" className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9bb5ee]/70">
              Let&apos;s work together
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
            <nav aria-label="Footer navigation">
              <p className="site-eyebrow">{"// Navigate"}</p>
              <div className="mt-4 grid gap-2 text-sm">
                {navigation.map((item) => (
                  <Link key={item.href} href={item.href} className="site-link w-fit">
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div>
              <p className="site-eyebrow">{"// Connect"}</p>
              <div className="mt-4 grid gap-2 text-sm">
                {profile.socialLinks.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="site-link inline-flex w-fit items-center gap-1.5">
                    {link.label}
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                ))}
                <a href={`mailto:${profile.email}`} className="mt-2 w-fit text-sm text-blue-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9bb5ee]/70">
                  {profile.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-blue-300 shadow-[0_0_8px_rgba(147,197,253,0.9)]" aria-hidden="true" />
            {profile.location}
            <span className="text-white/20" aria-hidden="true">/</span>
            <a href={settings.siteUrl} className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9bb5ee]/70">{siteHost}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
