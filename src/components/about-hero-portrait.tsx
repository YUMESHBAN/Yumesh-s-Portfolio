"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type AboutHeroPortraitProps = {
  availability?: string;
};

export function AboutHeroPortrait({ availability }: AboutHeroPortraitProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const stageElement = stageRef.current;
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
        rootMargin: "-12% 0px -40% 0px",
        threshold: 0.15,
      }
    );

    observer.observe(stageElement);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={stageRef}
      className={`about-portrait-stage group relative mx-auto flex h-full min-h-[22rem] w-full max-w-[35rem] items-end justify-center self-stretch overflow-hidden lg:min-h-0 lg:max-w-none ${
        isActive ? "is-active" : ""
      }`}
    >
      <div className="pointer-events-none absolute left-0 top-16 z-20 font-mono text-[10px] uppercase tracking-[0.2em] text-blue-200/45" aria-hidden="true">
        ABOUT / 01
      </div>
      <Image
        src="/images/yumesh-office-coding-dot-art.avif"
        alt="Yumesh Ban coding at an office desk, viewed from behind"
        fill
        priority
        unoptimized
        sizes="(min-width: 1024px) 44vw, 92vw"
        className="about-office-image object-cover object-[center_52%]"
      />
      <Image
        src="/images/yumesh-office-coding.avif"
        alt=""
        fill
        loading="lazy"
        sizes="(min-width: 1024px) 44vw, 92vw"
        className="about-office-original-image object-cover object-[center_52%]"
        aria-hidden="true"
      />
      <div className="about-portrait-scrim pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44" aria-hidden="true" />
      <div className="about-portrait-caption absolute inset-x-0 bottom-0 z-20 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-7 w-px shrink-0 bg-blue-300/70 shadow-[0_0_14px_rgba(147,197,253,0.45)]" aria-hidden="true" />
            <p className="font-mono text-[10px] uppercase leading-5 tracking-[0.16em] text-white/58">The person behind the products</p>
          </div>
          {availability ? (
            <span className="inline-flex shrink-0 items-center gap-2 text-xs font-medium text-blue-200">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-300 shadow-[0_0_12px_rgba(147,197,253,0.8)]" aria-hidden="true" />
              {availability}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
