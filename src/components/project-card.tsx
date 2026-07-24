import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { getProjectImage } from "@/lib/project-media";
import type { Project } from "@/types/content";

export function ProjectCard({ project }: { project: Project }) {
  const image = getProjectImage(project);
  const primaryHref = project.liveUrl ?? project.repoUrl ?? `/projects/${project.slug}`;
  const primaryLabel = project.liveUrl ? "Live project" : project.repoUrl ? "Repository" : "Case study";

  return (
    <article className="site-panel group flex h-full flex-col overflow-hidden p-6 transition hover:border-white/18 hover:bg-white/[0.085]">
      <Link href={`/projects/${project.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60">
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-white/10 bg-[#080808]">
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.alt || `${project.title} project screenshot`}
              fill
              sizes="(min-width: 1280px) 560px, (min-width: 768px) 45vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full flex-col justify-between p-5">
              <div className="flex items-center justify-between text-xs font-medium uppercase text-white/42">
                <span>{project.type}</span>
                <span>{project.dateRange}</span>
              </div>
              <div>
                <p className="text-3xl font-semibold text-white/92">{project.title}</p>
                <p className="mt-2 text-sm leading-6 text-white/52">Project media will appear here when a real screenshot is available.</p>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-blue-400">{project.type}</p>
          <Link href={`/projects/${project.slug}`} className="mt-2 block text-2xl font-semibold text-white hover:text-blue-300">
            {project.title}
          </Link>
        </div>
        <span className="rounded-md border border-white/10 bg-white/[0.055] px-3 py-1 text-xs font-medium text-white/52">{project.dateRange}</span>
      </div>

      <p className="mt-4 flex-1 text-sm leading-6 text-white/60">{project.summary}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.techStack.slice(0, 5).map((tech) => (
          <span key={tech} className="site-chip">
            {tech}
          </span>
        ))}
      </div>

      <a href={primaryHref} target={primaryHref.startsWith("/") ? undefined : "_blank"} rel={primaryHref.startsWith("/") ? undefined : "noreferrer"} className="mt-6 ml-auto grid size-14 place-items-center rounded-lg bg-blue-500 text-white transition hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60" aria-label={`${primaryLabel}: ${project.title}`}>
        <ArrowUpRight size={24} />
      </a>
    </article>
  );
}
