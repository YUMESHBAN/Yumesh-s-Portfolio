import type { Metadata } from "next";

import { ProjectFilter } from "@/components/project-filter";
import { SectionHeading } from "@/components/section-heading";
import { getProjects, getSiteSettings } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Projects by Yumesh Ban",
    description:
      "Explore projects by Yumesh Ban, including Merry Crochets, KTM Cribs, Hamro Futsal, Rupali Beauty Point, Advanced Java Quiz System, and Sea Sky Cargo.",
    alternates: { canonical: "/projects" },
    openGraph: {
      title: "Projects by Yumesh Ban",
      description: settings.description,
      url: "/projects",
    },
  };
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <section className="site-section pt-32">
      <div className="site-container">
        <SectionHeading
          eyebrow="Work"
          title="Projects with product context and technical proof."
          description="A focused index for company work, academic systems, freelance delivery, and learning builds."
        />
        <div className="mt-10">
          <ProjectFilter projects={projects} />
        </div>
      </div>
    </section>
  );
}
