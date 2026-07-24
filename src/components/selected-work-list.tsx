import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getProjectImage } from "@/lib/project-media";
import type { Project } from "@/types/content";

const accentStyles = [
  "from-blue-300/30 via-blue-400/[0.08] to-transparent",
  "from-violet-300/26 via-violet-400/[0.07] to-transparent",
  "from-cyan-300/24 via-cyan-400/[0.06] to-transparent",
] as const;

function ProjectImage({ project, priority = false }: { project: Project; priority?: boolean }) {
  const image = getProjectImage(project);

  if (!image?.url) {
    return null;
  }

  return (
    <Image
      src={image.url}
      alt={image.alt || `${project.title} project screenshot`}
      fill
      priority={priority}
      sizes="(min-width: 1024px) 780px, (min-width: 768px) 50vw, 100vw"
      className="object-cover transition duration-700 group-hover:scale-[1.04]"
    />
  );
}

function WorkMeta({ project, number }: { project: Project; number: string }) {
  return (
    <div className="flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.14em] text-white/55">
      <span>{number}</span>
      <span>{project.type}</span>
    </div>
  );
}

function SupportingProject({ project, index }: { project: Project; index: number }) {
  const accent = accentStyles[(index + 1) % accentStyles.length];
  const number = String(index + 2).padStart(2, "0");

  return (
    <article className="group min-h-72 overflow-hidden rounded-md border border-white/10 bg-white/[0.035] transition hover:border-white/20 hover:bg-white/[0.065]">
      <Link
        href={`/projects/${project.slug}`}
        className="relative flex h-full min-h-72 flex-col p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-300/70 sm:p-7"
      >
        <ProjectImage project={project} />
        <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} aria-hidden="true" />
        <div className="relative flex h-full flex-col">
          <WorkMeta project={project} number={number} />
          <div className="mt-auto">
            <h2 className="max-w-md text-3xl font-semibold tracking-[-0.045em] text-white">{project.title}</h2>
            <p className="mt-3 line-clamp-2 max-w-md text-sm leading-6 text-white/62">{project.summary}</p>
            <div className="mt-5 flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-blue-100 transition group-hover:text-white">View case study</span>
              <ArrowUpRight className="shrink-0 text-blue-200 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={19} aria-hidden="true" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function SelectedWorkList({ projects }: { projects: Project[] }) {
  const [leadProject, ...supportingProjects] = projects;

  if (!leadProject) {
    return null;
  }

  return (
    <div className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-20 lg:grid-cols-12">
      <article className="group min-h-[32rem] overflow-hidden rounded-md border border-white/10 bg-[#0a0b0f] md:col-span-2 lg:col-span-8 lg:row-span-2 lg:min-h-[41rem]">
        <Link
          href={`/projects/${leadProject.slug}`}
          className="relative flex h-full min-h-[32rem] flex-col p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-300/70 sm:p-10 lg:min-h-[41rem]"
        >
          <ProjectImage project={leadProject} priority />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300/30 via-blue-400/[0.08] to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/30 to-transparent" aria-hidden="true" />
          <div className="relative flex h-full flex-col">
            <WorkMeta project={leadProject} number="01" />
            <div className="mt-auto max-w-2xl">
              <p className="text-sm font-medium text-blue-100/80">{leadProject.role} / {leadProject.association}</p>
              <h2 className="mt-3 text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">{leadProject.title}</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/68">{leadProject.summary}</p>
              <div className="mt-7 flex items-center gap-3 text-sm font-semibold text-white">
                <span>View case study</span>
                <ArrowUpRight className="text-blue-200 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={19} aria-hidden="true" />
              </div>
            </div>
          </div>
        </Link>
      </article>

      {supportingProjects.map((project, index) => (
        <div key={project.slug} className="lg:col-span-4">
          <SupportingProject project={project} index={index} />
        </div>
      ))}
    </div>
  );
}
