import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { ProjectCaseStudy } from "@/components/project-case-study";
import { getPersonProfile, getProjectBySlug, getProjectRelatedContent, getProjects, getSiteSettings } from "@/lib/content";
import { getProjectImage } from "@/lib/project-media";
import { breadcrumbJsonLd, projectJsonLd } from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  const image = getProjectImage(project);

  return {
    title: `${project.title} Project`,
    description: project.summary,
    alternates: { canonical: `/works/${project.slug}` },
    openGraph: {
      title: `${project.title} by Yumesh Ban`,
      description: project.summary,
      url: `/works/${project.slug}`,
      images: image?.url ? [{ url: image.url, alt: image.alt || `${project.title} project screenshot` }] : undefined,
    },
  };
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, profile, settings, projects] = await Promise.all([
    getProjectBySlug(slug),
    getPersonProfile(),
    getSiteSettings(),
    getProjects(),
  ]);

  if (!project) {
    notFound();
  }

  const relatedContent = await getProjectRelatedContent(project._id);

  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const index = currentIndex >= 0 ? currentIndex : 0;
  const nextProject = projects.length > 1 ? projects[(index + 1) % projects.length] : undefined;

  return (
    <>
      <JsonLd data={projectJsonLd(project, profile, settings)} />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: "Home", href: "/" },
            { name: "Works", href: "/works" },
            { name: project.title, href: `/works/${project.slug}` },
          ],
          settings,
        )}
      />

      <ProjectCaseStudy project={project} index={index} total={projects.length} nextProject={nextProject} relatedContent={relatedContent} />
    </>
  );
}
