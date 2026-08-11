"use client";

import { useEffect, useRef, useState } from "react";

import type { AboutJourney as AboutJourneyContent } from "@/types/content";

type AboutJourneyProps = {
  journey: AboutJourneyContent;
};

export function AboutJourney({ journey }: AboutJourneyProps) {
  const [activeChapter, setActiveChapter] = useState(0);
  const journeyRef = useRef<HTMLElement>(null);
  const chapters = journey.chapters;

  useEffect(() => {
    const chapterElements = journeyRef.current?.querySelectorAll<HTMLElement>("[data-journey-chapter]");
    if (!chapterElements?.length || !("IntersectionObserver" in window)) return;

    const ratios = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let nextChapter = 0;
        let highestRatio = 0;

        chapterElements.forEach((element, index) => {
          const ratio = ratios.get(element) ?? 0;
          if (ratio > highestRatio) {
            highestRatio = ratio;
            nextChapter = index;
          }
        });

        if (highestRatio > 0) {
          setActiveChapter((currentChapter) => currentChapter === nextChapter ? currentChapter : nextChapter);
        }
      },
      {
        rootMargin: "-20% 0px -42% 0px",
        threshold: [0, 0.2, 0.45, 0.7],
      },
    );

    chapterElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  function focusChapter(index: number) {
    const chapter = journeyRef.current?.querySelector<HTMLElement>(`#about-journey-chapter-${index + 1}`);
    if (!chapter) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    chapter.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
  }

  return (
    <section ref={journeyRef} className="site-section" aria-labelledby="about-journey-title">
      <div className="site-container">
        <div className="grid gap-8 lg:grid-cols-[minmax(12rem,0.55fr)_minmax(0,1.45fr)] lg:gap-20">
          <div>
            <p className="site-eyebrow">{`// ${journey.eyebrow}`}</p>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">{journey.rangeLabel}</p>
          </div>
          <div className="max-w-4xl">
            <h2 id="about-journey-title" className="text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-6xl">
              {journey.title}
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/58 sm:text-lg">
              {journey.introduction}
            </p>
          </div>
        </div>

        <div className="mt-16 lg:grid lg:grid-cols-[minmax(12rem,0.55fr)_minmax(0,1.45fr)] lg:gap-20">
          <nav className="hidden lg:block" aria-label="Journey chapters">
            <div className="sticky top-32 border-t border-white/10 pt-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Journey index</p>
              <div className="relative mt-7">
                <span className="absolute bottom-[5.5px] left-[5px] top-[11.5px] w-px bg-white/10" aria-hidden="true" />
                <span
                  className="absolute left-[5px] top-[11.5px] w-px bg-blue-300 transition-[height] duration-500 ease-out motion-reduce:transition-none"
                  style={{ height: `calc((100% - 17px) * ${activeChapter / Math.max(chapters.length - 1, 1)})` }}
                  aria-hidden="true"
                />
                <ol className="relative grid gap-9">
                  {chapters.map((chapter, index) => {
                    const isActive = activeChapter === index;

                    return (
                      <li key={chapter.era}>
                        <button
                          type="button"
                          className="group grid w-full grid-cols-[0.75rem_1fr] items-start gap-5 rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b0b0c]"
                          onClick={() => focusChapter(index)}
                          aria-current={isActive ? "step" : undefined}
                          aria-label={`Go to chapter ${index + 1}: ${chapter.title}`}
                        >
                          <span
                            className={`mt-1.5 h-[11px] w-[11px] rounded-full border transition-colors duration-300 motion-reduce:transition-none ${
                              isActive
                                ? "border-blue-300 bg-blue-400 shadow-[0_0_0_5px_rgba(96,165,250,0.12)]"
                                : "border-white/35 bg-[#0b0b0c] group-hover:border-blue-300"
                            }`}
                            aria-hidden="true"
                          />
                          <span className="flex items-baseline gap-3">
                            <span className={`font-mono text-[10px] tracking-[0.14em] ${isActive ? "text-blue-200" : "text-white/35"}`}>
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className={`font-mono text-xs uppercase tracking-[0.16em] transition-colors duration-300 motion-reduce:transition-none ${isActive ? "text-white" : "text-white/48 group-hover:text-white/70"}`}>
                              {chapter.era}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="mt-12 flex items-center gap-4 pl-8">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-blue-200/75">
                  {String(activeChapter + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
                </p>
                <span className="h-px flex-1 bg-gradient-to-r from-blue-300/50 to-transparent" aria-hidden="true" />
              </div>
            </div>
          </nav>

          <ol className="border-l border-white/10 lg:border-l-0">
            {chapters.map((chapter, index) => {
              const isActive = activeChapter === index;

              return (
                <li
                  id={`about-journey-chapter-${index + 1}`}
                  key={chapter.era}
                  data-journey-chapter
                  data-journey-index={index}
                  className="relative pb-16 pl-7 last:pb-0 sm:pl-10 lg:flex lg:min-h-[34rem] lg:items-center lg:border-t lg:border-white/10 lg:py-24 lg:pl-0 lg:first:border-t-0 lg:first:pt-0"
                >
                  <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border border-blue-300/70 bg-[#0b0b0c] lg:hidden" aria-hidden="true" />

                  <article className={`relative w-full transition-opacity duration-500 motion-reduce:transition-none ${isActive ? "lg:opacity-100" : "lg:opacity-45"}`}>
                    <span className="pointer-events-none absolute -right-4 -top-16 hidden font-mono text-[9rem] font-semibold leading-none tracking-[-0.09em] text-white/[0.025] lg:block" aria-hidden="true">
                      {chapter.era.slice(0, 4)}
                    </span>

                    <div className="relative z-10">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">Chapter {String(index + 1).padStart(2, "0")}</p>
                        <span className="h-px w-8 bg-blue-300/55" aria-hidden="true" />
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/48">{chapter.era}</p>
                        <p className="text-xs uppercase tracking-[0.1em] text-white/45">{chapter.dateRange}</p>
                      </div>

                      <h3 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
                        {chapter.title}
                      </h3>

                      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        <p className="font-medium text-white/72">{chapter.context}</p>
                        <span className="h-1 w-1 rounded-full bg-blue-300/60" aria-hidden="true" />
                        <p className="text-white/45">{chapter.location}</p>
                      </div>

                      <p className="mt-8 max-w-3xl text-lg leading-8 text-white/62 sm:text-xl sm:leading-9">{chapter.story}</p>

                      <div className="mt-10 grid max-w-4xl border-y border-white/10 sm:grid-cols-2">
                        <div className="border-b border-white/10 py-6 sm:border-b-0 sm:border-r sm:pr-8">
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-blue-200/65">What this taught me</p>
                          <p className="mt-3 text-sm leading-7 text-white/62">{chapter.lesson}</p>
                        </div>
                        <div className="py-6 sm:pl-8">
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Proof from this chapter</p>
                          <p className="mt-3 text-sm font-medium leading-7 text-blue-100/85">{chapter.outcome}</p>
                        </div>
                      </div>

                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
