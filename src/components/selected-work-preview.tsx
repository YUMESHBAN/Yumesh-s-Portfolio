"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { getProjectImage } from "@/lib/project-media";
import type { Project } from "@/types/content";

function ProjectMedia({ project }: { project: Project }) {
  const image = getProjectImage(project);

  if (image?.url) {
    return (
      <Image
        src={image.url}
        alt={image.alt || `${project.title} project screenshot`}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    );
  }

  return (
    <div className="flex h-full flex-col justify-between bg-[#08090d] p-7" aria-hidden="true">
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-blue-200/60">{project.type}</span>
      <span className="max-w-sm text-4xl font-semibold tracking-[-0.055em] text-white/90 sm:text-5xl">{project.title}</span>
    </div>
  );
}

function ProjectLogo({ project }: { project: Project }) {
  if (project.logo?.src) {
    return (
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-white/[0.04] sm:h-14 sm:w-14">
        <Image src={project.logo.src} alt={project.logo.alt || `${project.title} logo`} fill sizes="56px" className="object-contain p-2" />
      </span>
    );
  }

  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-blue-200/20 bg-blue-300/[0.08] text-sm font-semibold tracking-[-0.04em] text-blue-100 sm:h-14 sm:w-14" aria-hidden="true">
      {project.title.slice(0, 1).toUpperCase()}
    </span>
  );
}

export function SelectedWorkPreview({ projects }: { projects: Project[] }) {
  const [activeSlug, setActiveSlug] = useState(() => projects[0]?.slug ?? "");
  const [imageOnLeft, setImageOnLeft] = useState(true);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const moveFocusAfterSelection = useRef(false);
  const scrollAfterSelection = useRef(false);
  const activeProject = projects.find((project) => project.slug === activeSlug) ?? projects[0];

  useEffect(() => {
    if (!moveFocusAfterSelection.current) {
      return;
    }

    headingRef.current?.focus();
    moveFocusAfterSelection.current = false;
  }, [activeSlug, imageOnLeft]);

  useEffect(() => {
    if (!scrollAfterSelection.current) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = window.requestAnimationFrame(() => {
      const panel = panelRef.current;

      if (panel) {
        const topOffset = Math.max(112, Math.round(window.innerHeight * 0.18));
        const top = Math.max(0, window.scrollY + panel.getBoundingClientRect().top - topOffset);

        window.scrollTo({
          top,
          behavior: reducedMotion ? "auto" : "smooth",
        });
      }

      scrollAfterSelection.current = false;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeSlug, imageOnLeft]);

  if (!activeProject) {
    return null;
  }

  const selectProject = (slug: string, shouldMoveFocus = false) => {
    if (slug === activeProject.slug) {
      return;
    }

    moveFocusAfterSelection.current = shouldMoveFocus;
    scrollAfterSelection.current = true;
    setActiveSlug(slug);
    setImageOnLeft((current) => !current);
  };

  return (
    <div className="mt-10 overflow-hidden rounded-md border border-white/10 bg-white/[0.025]" aria-label="Featured projects">
      {projects.map((project) => {
        const isActive = project.slug === activeProject.slug;
        const featureKey = `${project.slug}-${imageOnLeft ? "left" : "right"}`;

        if (isActive) {
          return (
            <section
              key={featureKey}
              ref={panelRef}
              aria-live="polite"
              aria-labelledby="selected-work-feature-title"
              className="selected-work-feature-panel overflow-hidden border-b border-white/10 bg-[#0a0b0f] last:border-b-0 md:grid md:grid-cols-2"
            >
              <div
                className={`selected-work-feature-media relative min-h-72 overflow-hidden border-b border-white/10 bg-[#08090d] md:border-b-0 ${
                  imageOnLeft ? "is-image-left md:order-1 md:border-r" : "is-image-right md:order-2 md:border-l"
                }`}
              >
                <ProjectMedia project={project} />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-300/28 via-blue-400/[0.06] to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#08090d] to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-6 font-mono text-xs uppercase tracking-[0.14em] text-white/62 sm:p-8">
                  <span>Case study</span>
                  <span>{project.type}</span>
                </div>
              </div>

              <div className={`selected-work-feature-details flex min-h-72 flex-col justify-between p-7 sm:p-8 ${imageOnLeft ? "md:order-2" : "md:order-1"}`}>
                <div className="flex items-center justify-between gap-4 text-xs font-medium uppercase tracking-[0.14em] text-blue-200/75">
                  <span>Featured case study</span>
                  <span className="text-white/42">{project.dateRange}</span>
                </div>
                <div className="mt-12">
                  <p className="text-sm font-medium text-white/58">{project.role} / {project.association}</p>
                  <h2 ref={headingRef} id="selected-work-feature-title" tabIndex={-1} className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-white outline-none sm:text-5xl">
                    {project.title}
                  </h2>
                  <p className="mt-5 max-w-xl text-sm leading-7 text-white/64">{project.summary}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.techStack.slice(0, 5).map((tech) => (
                      <span key={tech} className="site-chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href={`/projects/${project.slug}`} className="site-link mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold">
                  View case study
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </section>
          );
        }

        return (
          <button
            key={project.slug}
            type="button"
            onClick={() => selectProject(project.slug)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectProject(project.slug, true);
              }
            }}
            aria-label={`View ${project.title} project details`}
            aria-expanded="false"
            className="group relative grid min-h-32 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-white/10 px-5 py-5 text-left transition last:border-b-0 hover:bg-blue-300/[0.075] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-300/70 sm:gap-5 sm:px-7"
          >
            <ProjectLogo project={project} />
            <span className="min-w-0 transition duration-300 group-hover:translate-x-1">
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-xl font-semibold tracking-[-0.035em] text-white sm:text-2xl">{project.title}</span>
                <span className="text-xs font-medium text-blue-200/80">{project.type}</span>
              </span>
              <span className="mt-1 block truncate text-sm text-white/48">{project.summary}</span>
            </span>
            <span className="flex items-center gap-2 whitespace-nowrap text-xs font-semibold text-white/48 transition duration-300 group-hover:text-blue-100 sm:text-sm">
              <span className="hidden sm:inline">View project</span>
              <Plus className="transition duration-300 group-hover:rotate-90" size={18} aria-hidden="true" />
            </span>
            <span className="absolute inset-y-0 left-0 w-0.5 bg-blue-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
