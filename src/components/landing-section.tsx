"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, MapPin } from "lucide-react";

import { GreetingRotator } from "@/components/greeting-rotator";
import type { PersonProfile, SiteSettings } from "@/types/content";

export function LandingSection({ profile, settings }: { profile: PersonProfile; settings: SiteSettings }) {
  const heroTitle = profile.heroTitle?.trim() || "Thoughtful web products. Built to work.";
  const availability = profile.availability?.trim();
  const portraitStageRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const stageElement = portraitStageRef.current;
    if (!stageElement || !("IntersectionObserver" in window)) return;

    // Preserve desktop mouse hover effects by only running scroll-reveal on non-fine pointer (touch) devices
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      {
        // Target active zone: between upper viewport (past top header) and mid-screen (upper 60% of viewport)
        rootMargin: "-12% 0px -40% 0px",
        threshold: 0.15,
      }
    );

    observer.observe(stageElement);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="landing-section pt-20 sm:pt-24 lg:pt-20 lg:pb-0">
      <div className="site-container my-auto flex flex-1 flex-col justify-end w-full">
        <div className="landing-section-content grid items-center lg:items-end gap-8 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)] lg:gap-10">
          <div className="relative max-w-2xl text-left my-auto py-6 lg:py-12">
            <GreetingRotator />

            <p className="mt-5 text-xl font-medium text-white/82 sm:text-2xl lg:mt-6 lg:text-3xl">I&apos;m {profile.name}</p>

            <h1 className="mt-3.5 max-w-4xl text-balance text-4xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-6xl lg:leading-[1.04]">
              {heroTitle}
            </h1>
            <p className="site-muted mt-5 max-w-xl text-base leading-7 sm:text-lg sm:leading-8 lg:mt-6 lg:text-xl lg:leading-8">{profile.shortBio}</p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/60 lg:mt-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-1.5 text-sm">
                <MapPin size={15} className="text-blue-300" aria-hidden="true" />
                {profile.location}
              </span>
              {availability ? <span className="site-chip py-1.5 text-sm">{availability}</span> : null}
            </div>

            <div className="relative z-30 mt-7 flex flex-wrap gap-3 lg:mt-9">
              <Link href="/contact" className="site-button-primary">
                Got a project?
                <ArrowRight size={17} />
              </Link>
              <a
                href={settings.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                download="Yumesh-Ban-CV.pdf"
                className="site-button-secondary"
              >
                <Download size={17} />
                My resume
              </a>
            </div>
          </div>

          <div
            ref={portraitStageRef}
            className={`hero-portrait-stage group relative mx-auto flex min-h-[380px] w-full max-w-[560px] items-end justify-center lg:min-h-[580px] lg:h-full lg:max-h-none lg:max-w-none ${
              isActive ? "is-active" : ""
            }`}
          >
            <div
              className="hero-portrait-ring pointer-events-none absolute bottom-12 left-1/2 h-[260px] w-[260px] rounded-full border-[14px] sm:h-[350px] sm:w-[350px] lg:bottom-14 lg:h-[480px] lg:w-[480px] xl:h-[520px] xl:w-[520px]"
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
                width={1086}
                height={1448}
                priority
                sizes="(min-width: 1024px) 50vw, (min-width: 640px) 72vw, 92vw"
                className="hero-portrait-image max-h-[480px] w-full object-contain object-bottom lg:max-h-[640px] xl:max-h-[720px]"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="landing-bottom-shadow pointer-events-none absolute inset-x-0 bottom-0 z-20" aria-hidden="true" />
    </section>
  );
}
