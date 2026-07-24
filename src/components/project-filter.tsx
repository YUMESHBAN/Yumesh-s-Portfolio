"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/types/content";

const filters = ["All", "Company", "Freelance", "Academic", "Learning"] as const;

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");

  const visibleProjects = useMemo(() => {
    if (activeFilter === "All") {
      return projects;
    }

    return projects.filter((project) => project.type === activeFilter);
  }, [activeFilter, projects]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-medium text-white/64">
          <SlidersHorizontal size={16} />
          Filter
        </span>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Project filters">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
              className={[
                "rounded-md border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60",
                activeFilter === filter
                  ? "border-blue-400 bg-blue-500 text-white"
                  : "border-white/10 bg-white/[0.055] text-white/64 hover:border-white/25 hover:text-white",
              ].join(" ")}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
