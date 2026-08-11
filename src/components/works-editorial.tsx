import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Code2, Layers3, PanelsTopLeft } from "lucide-react";

import { getProjectImage } from "@/lib/project-media";
import type { Project } from "@/types/content";

function projectNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function projectProof(project: Project) {
  const metric = project.metrics?.find((item) => item.label?.trim() && item.value?.trim());

  if (metric) {
    return { value: metric.value, label: metric.label, note: metric.note };
  }

  const impact = project.impact?.find((item) => item.trim());
  return impact ? { value: "Proof", label: impact } : null;
}

function ProjectActions({ project }: { project: Project }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link href={`/works/${project.slug}`} className="site-button-primary">
        View case study
        <ArrowRight size={17} aria-hidden="true" />
      </Link>
      {project.liveUrl ? (
        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="site-button-secondary">
          View live site
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      ) : null}
      {project.repoUrl ? (
        <a href={project.repoUrl} target="_blank" rel="noreferrer" className="site-button-secondary">
          View repository
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );
}

function ProjectDetails({ project, index }: { project: Project; index: number }) {
  const proof = projectProof(project);

  return (
    <div className="flex h-full min-w-0 flex-col justify-center">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em]">
        <span className="text-blue-300">{projectNumber(index)}</span>
        <span className="h-px w-10 bg-blue-300/55" aria-hidden="true" />
        <span className="text-white/52">{project.type}</span>
        <span className="text-white/28" aria-hidden="true">/</span>
        <span className="text-white/52">{project.dateRange}</span>
      </div>

      <h2 className="mt-6 max-w-3xl text-balance text-[clamp(2.75rem,5.8vw,5.4rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-white">
        {project.title}
      </h2>
      <p className="mt-5 text-sm font-medium text-blue-200/72">
        {project.role} / {project.association}
      </p>
      <p className="mt-5 max-w-2xl text-base leading-8 text-white/62">{project.summary}</p>

      {proof ? (
        <div className="mt-7 border-l border-blue-300/45 pl-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-blue-200/65">{proof.value}</p>
          <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-white/72">{proof.label}</p>
          {proof.note ? <p className="mt-1 text-xs leading-5 text-white/45">{proof.note}</p> : null}
        </div>
      ) : null}

      <div className="mt-7 flex flex-wrap gap-2">
        {project.techStack.slice(0, 3).map((tech) => <span key={tech} className="site-chip">{tech}</span>)}
        {project.techStack.length > 3 ? <span className="site-chip">+{project.techStack.length - 3}</span> : null}
      </div>

      <ProjectActions project={project} />
    </div>
  );
}

function ProjectStory({ project, index }: { project: Project; index: number }) {
  const image = getProjectImage(project);
  const hasImage = Boolean(image?.url || image?.src);
  const imageOnRight = index % 2 === 1;

  return (
    <section id={`work-${project.slug}`} className="works-story works-section-reveal scroll-mt-24 border-b border-white/10">
      <div className="site-container py-16 sm:py-20 lg:py-28">
        {hasImage ? (
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className={`works-story-media group relative aspect-[16/10] overflow-hidden border border-white/10 bg-[#08090d] lg:col-span-7 ${imageOnRight ? "lg:order-2" : "lg:order-1"}`}>
              <Image
                src={image?.url ?? image?.src ?? ""}
                alt={image?.alt || `${project.title} project screenshot`}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025] motion-reduce:transition-none"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#08090d]/90 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-blue-300/25 bg-[#0b0b0c]/82 px-5 py-4 backdrop-blur-xl sm:px-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/70">Works / {projectNumber(index)}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">{project.type}</span>
              </div>
            </div>
            <div className={`lg:col-span-5 ${imageOnRight ? "lg:order-1" : "lg:order-2"}`}>
              <ProjectDetails project={project} index={index} />
            </div>
          </div>
        ) : (
          <article className="works-story-text group border-y border-white/10 py-10 transition-colors duration-500 hover:border-blue-300/35 sm:py-14 lg:grid lg:grid-cols-[9rem_minmax(0,1fr)_minmax(15rem,0.42fr)] lg:gap-12 lg:py-20">
            <div className="mb-8 lg:mb-0">
              <p className="font-mono text-5xl font-semibold tracking-[-0.07em] text-blue-300/80 sm:text-6xl">{projectNumber(index)}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">{project.type}</p>
            </div>
            <ProjectDetails project={project} index={index} />
            <div className="mt-10 border-t border-white/10 pt-7 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/65">Built around</p>
              <ul className="mt-4 grid gap-3">
                {project.features.slice(0, 3).map((feature) => (
                  <li key={feature} className="border-b border-white/10 pb-3 text-sm leading-6 text-white/55 last:border-b-0">{feature}</li>
                ))}
              </ul>
              <span className="mt-8 block h-px w-full bg-gradient-to-r from-blue-300/55 to-transparent transition-all duration-500 group-hover:from-blue-200" aria-hidden="true" />
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

export function WorksEditorial({ projects }: { projects: Project[] }) {
  const categories = [...new Set(projects.map((project) => project.type))].join(" / ");

  return (
    <>
      <section className="works-hero relative isolate overflow-hidden border-b border-white/10 pt-20 sm:pt-24">
        <div className="works-hero-glow pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div className="site-container grid min-h-[calc(100svh-6rem-1px)] items-center gap-10 py-6 sm:py-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.72fr)] lg:gap-16">
          <div className="works-hero-copy max-w-4xl">
            <p className="site-eyebrow">{"// Works · 2024—2026"}</p>
            <h1 className="works-hero-title mt-5 max-w-4xl text-balance font-semibold leading-[0.88] tracking-[-0.07em] text-white">
              Product work, shaped for the real world.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
              A complete record of company, freelance, academic, and learning work that shows how I shape interfaces, systems, and the details in between.
            </p>

            <div className="mt-7 grid border-y border-white/10 sm:grid-cols-3">
              {[
                { icon: Layers3, label: "Projects", value: String(projects.length).padStart(2, "0") },
                { icon: PanelsTopLeft, label: "Categories", value: categories || "Project work" },
                { icon: Code2, label: "Disciplines", value: "Product / Frontend / Full-stack" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 border-b border-white/10 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:px-4 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0">
                  <Icon size={16} className="mt-0.5 shrink-0 text-blue-300" aria-hidden="true" />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/48">{label}</p>
                    <p className="mt-1 text-sm font-medium leading-5 text-white/75">{value}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {projects.length ? (
            <nav aria-label="Works index" className="works-index border-y border-white/10">
              <div className="flex items-center justify-between border-b border-white/10 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/42">
                <span>Works index</span>
                <span>{String(projects.length).padStart(2, "0")} entries</span>
              </div>
              {projects.map((project, index) => (
                <a key={project.slug} href={`#work-${project.slug}`} className="group grid min-h-16 grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-white/10 py-3 last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-300/70">
                  <span className="font-mono text-[10px] text-blue-300/75">{projectNumber(index)}</span>
                  <span className="min-w-0 truncate text-sm font-semibold text-white/72 transition group-hover:translate-x-1 group-hover:text-white group-focus-visible:translate-x-1 group-focus-visible:text-white">{project.title}</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/35">{project.type}</span>
                </a>
              ))}
            </nav>
          ) : null}
        </div>
      </section>

      {projects.map((project, index) => <ProjectStory key={project.slug} project={project} index={index} />)}

      <section className="works-section-reveal border-b border-white/10">
        <div className="site-container py-16 sm:py-20 lg:py-28">
          <div className="py-8 sm:py-12">
            <p className="site-eyebrow">{"// What comes next"}</p>
            <h2 className="mt-7 max-w-5xl text-balance text-[clamp(2.9rem,6.5vw,6rem)] font-semibold leading-[0.92] tracking-[-0.065em] text-white">
              Have a project that needs <span className="text-blue-400">thoughtful design</span> and reliable delivery?
            </h2>
            <div className="mt-12 grid gap-4 border-t border-white/15 pt-6 sm:flex sm:items-center">
              <Link href="/contact" className="site-button-primary">
                Start a conversation
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
