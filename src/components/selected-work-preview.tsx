"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { getProjectImage } from "@/lib/project-media";
import type { Project } from "@/types/content";

function projectTypeLabel(type: string) {
  return /project/i.test(type) ? type : `${type} Project`;
}

function ProjectMedia({ project }: { project: Project }) {
  const image = getProjectImage(project);

  if (image?.url) {
    return (
      <Image
        src={image.url}
        alt={image.alt || `${project.title} project screenshot`}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-contain"
      />
    );
  }

  return (
    <div className="flex h-full flex-col justify-between bg-[#08090d] p-7" aria-hidden="true">
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-blue-200/60">{projectTypeLabel(project.type)}</span>
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
        const metric = project.metrics?.find((item) => item.label && item.value);
        const projectProof = metric ? `${metric.value} ${metric.label}` : project.impact?.[0];
        const featureKey = `${project.slug}-${imageOnLeft ? "left" : "right"}`;

        if (isActive) {
          return (
            <section
              key={featureKey}
              ref={panelRef}
              aria-live="polite"
              aria-labelledby="selected-work-feature-title"
              className={`selected-work-feature-panel overflow-hidden border-b border-white/10 bg-[#0a0b0f] last:border-b-0 md:grid ${
                imageOnLeft ? "md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" : "md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
              }`}
            >
              <div
                className={`selected-work-feature-media relative min-h-72 overflow-hidden border-b border-white/10 bg-[#08090d] md:border-b-0 ${
                  imageOnLeft ? "is-image-left md:order-1 md:border-r" : "is-image-right md:order-2 md:border-l"
                }`}
              >
                <ProjectMedia project={project} />
              </div>

              <div className={`selected-work-feature-details flex min-h-72 flex-col justify-between p-7 sm:p-8 ${imageOnLeft ? "md:order-2" : "md:order-1"}`}>
                <div className="flex items-center justify-between gap-4 text-xs font-medium uppercase tracking-[0.14em] text-blue-200/75">
                  <span>{projectTypeLabel(project.type)}</span>
                  <span className="text-white/42">{project.dateRange}</span>
                </div>
                <div className="mt-12">
                  <p className="text-sm font-medium text-white/48">{project.role} / {project.association}</p>
                  <h2 ref={headingRef} id="selected-work-feature-title" tabIndex={-1} className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-white outline-none sm:text-5xl">
                    {project.title}
                  </h2>
                  <p className="mt-5 max-w-xl text-sm leading-7 text-white/64">{project.summary}</p>
                  {projectProof ? <p className="mt-4 text-sm font-medium text-blue-100/75">{projectProof}</p> : null}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span key={tech} className="site-chip">
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 ? <span className="site-chip">+{project.techStack.length - 3}</span> : null}
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={`/works/${project.slug}`} className="site-button-primary">
                    View project details
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </Link>
                  {project.liveUrl ? (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="site-button-secondary">
                      View live site
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
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
            aria-label={`Expand details for ${project.title}`}
            aria-expanded="false"
            className="group relative isolate grid min-h-32 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 overflow-hidden border-b border-white/10 px-5 py-5 text-left transition last:border-b-0 hover:bg-blue-300/[0.075] before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-[radial-gradient(circle_at_88%_50%,rgba(147,197,253,0.16),transparent_38%)] before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-300/70 sm:gap-5 sm:px-7"
          >
            <ProjectLogo project={project} />
            <span className="relative z-10 min-w-0 transition duration-300 group-hover:translate-x-1">
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-xl font-semibold tracking-[-0.035em] text-white sm:text-2xl">{project.title}</span>
                <span className="text-xs font-medium text-blue-200/80">{projectTypeLabel(project.type)}</span>
              </span>
              <span className="mt-1 block truncate text-sm text-white/48">{project.summary}</span>
            </span>
            <span className="relative z-10 flex items-center gap-3">
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center text-white/52 transition duration-500 group-hover:text-blue-100">
                <ChevronRight className="relative transition duration-500 group-hover:-translate-x-0.5 group-hover:scale-110" size={19} aria-hidden="true" />
              </span>
              <span className="hidden max-w-0 translate-x-2 overflow-hidden whitespace-nowrap text-xs font-medium text-blue-100/85 opacity-0 transition-all duration-500 group-hover:max-w-32 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
                Expand project
              </span>
            </span>
            <span className="absolute inset-y-0 left-0 w-0.5 bg-blue-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
