import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, MapPin } from "lucide-react";

import { GreetingRotator } from "@/components/greeting-rotator";
import type { PersonProfile, SiteSettings } from "@/types/content";

export function LandingSection({ profile, settings }: { profile: PersonProfile; settings: SiteSettings }) {
  const heroTitle = profile.heroTitle?.trim() || "Thoughtful web products. Built to work.";
  const availability = profile.availability?.trim();

  return (
    <section className="landing-section site-container min-h-[calc(100svh-1px)] pt-28 sm:pt-32">
      <div className="grid min-h-[calc(100svh-12rem)] items-center gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)] lg:gap-8">
        <div className="relative z-10 max-w-2xl text-left">
          <GreetingRotator />

          <p className="mt-6 text-xl font-medium text-white/82 sm:text-2xl">I&apos;m {profile.name}</p>

          <h1 className="mt-4 max-w-4xl text-balance text-5xl font-semibold leading-[1.02] text-white sm:text-7xl lg:text-5xl">
            {heroTitle}
          </h1>
          <p className="site-muted mt-7 max-w-xl text-base leading-8 sm:text-lg">{profile.shortBio}</p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/60">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5">
              <MapPin size={15} className="text-blue-300" aria-hidden="true" />
              {profile.location}
            </span>
            {availability ? <span className="site-chip py-1.5">{availability}</span> : null}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/contact" className="site-button-primary">
              Got a project?
              <ArrowRight size={17} />
            </Link>
            <a href={settings.cvUrl} className="site-button-secondary">
              <Download size={17} />
              My resume
            </a>
          </div>
        </div>

        <div className="hero-portrait-stage group relative mx-auto flex min-h-[430px] w-full max-w-[560px] items-end justify-center lg:min-h-[640px] lg:max-w-none">
          <div
            className="hero-portrait-ring pointer-events-none absolute bottom-16 left-1/2 h-[300px] w-[300px] rounded-full border-[14px] sm:h-[390px] sm:w-[390px] lg:bottom-24 lg:h-[460px] lg:w-[460px]"
            aria-hidden="true"
          />
          <span className="hero-portrait-symbol hero-portrait-symbol-left" aria-hidden="true">
            {"<<"}
          </span>
          <span className="hero-portrait-symbol hero-portrait-symbol-right" aria-hidden="true">
            {">>"}
          </span>
          <div className="hero-portrait-clip pointer-events-none absolute inset-0 z-10 flex items-end justify-center">
            <Image
              src="/images/yumesh-hero-cutout.png"
              alt="Yumesh Ban portrait"
              width={1080}
              height={1456}
              priority
              sizes="(min-width: 1024px) 50vw, (min-width: 640px) 72vw, 92vw"
              className="hero-portrait-image max-h-[560px] w-full object-contain object-bottom lg:max-h-[700px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
