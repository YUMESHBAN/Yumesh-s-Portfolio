import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { getPersonProfile, getProjectBySlug, getProjects, getSiteSettings } from "@/lib/content";
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
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} by Yumesh Ban`,
      description: project.summary,
      url: `/projects/${project.slug}`,
      images: image?.url ? [{ url: image.url, alt: image.alt || `${project.title} project screenshot` }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, profile, settings] = await Promise.all([
    getProjectBySlug(slug),
    getPersonProfile(),
    getSiteSettings(),
  ]);

  if (!project) {
    notFound();
  }

  const image = getProjectImage(project);
  const gallery = project.gallery?.filter((item) => item.url && item.url !== image?.url) ?? [];

  return (
    <>
      <JsonLd data={projectJsonLd(project, profile, settings)} />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: "Home", href: "/" },
            { name: "Projects", href: "/projects" },
            { name: project.title, href: `/projects/${project.slug}` },
          ],
          settings,
        )}
      />

      <article className="site-section pt-32">
        <div className="site-container max-w-5xl">
          <Link href="/projects" className="site-link inline-flex items-center gap-2 text-sm font-semibold">
            <ArrowLeft size={17} />
            Back to Work
          </Link>

          <header className="mt-8">
            <p className="site-eyebrow">{project.type} project</p>
            <h1 className="mt-4 text-balance text-5xl font-semibold leading-none text-white sm:text-6xl lg:text-7xl">
              {project.title}
            </h1>
            <p className="site-muted mt-6 max-w-3xl text-lg leading-8">{project.summary}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="site-button-primary">
                  Live project
                  <ArrowUpRight size={17} />
                </a>
              ) : null}
              {project.repoUrl ? (
                <a href={project.repoUrl} target="_blank" rel="noreferrer" className="site-button-secondary">
                  <Github size={17} />
                  Repository
                </a>
              ) : null}
            </div>
          </header>

          <div className="site-panel mt-10 overflow-hidden p-3">
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-white/10 bg-[#080808]">
              {image?.url ? (
                <Image
                  src={image.url}
                  alt={image.alt || `${project.title} project screenshot`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 960px, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full flex-col justify-between p-6">
                  <div className="flex items-center justify-between text-xs font-medium uppercase text-white/42">
                    <span>{project.type}</span>
                    <span>{project.dateRange}</span>
                  </div>
                  <div>
                    <p className="text-4xl font-semibold text-white">{project.title}</p>
                    <p className="site-muted mt-3 max-w-lg leading-7">
                      Project media will appear here when a real screenshot is available.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Role", project.role],
              ["Association", project.association],
              ["Timeline", project.dateRange],
            ].map(([label, value]) => (
              <div key={label} className="site-panel p-5">
                <p className="text-xs font-semibold uppercase text-white/35">{label}</p>
                <p className="mt-2 font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <section className="site-panel p-6">
              <h2 className="text-2xl font-semibold text-white">Key features</h2>
              <ul className="mt-5 grid list-disc gap-3 pl-5 text-sm leading-6 text-white/62 marker:text-blue-400">
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>

            <section className="site-panel p-6">
              <h2 className="text-2xl font-semibold text-white">Impact and proof</h2>
              <ul className="mt-5 grid list-disc gap-3 pl-5 text-sm leading-6 text-white/62 marker:text-blue-400">
                {project.impact.map((impact) => (
                  <li key={impact}>{impact}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className="site-panel mt-8 p-6">
            <h2 className="text-2xl font-semibold text-white">Tech stack</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="site-chip">
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {gallery.length ? (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white">More screens</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {gallery.map((item) => (
                  <div key={item.url} className="site-panel overflow-hidden p-3">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-white/10 bg-[#080808]">
                      <Image
                        src={item.url as string}
                        alt={item.alt || `${project.title} gallery screenshot`}
                        fill
                        sizes="(min-width: 768px) 45vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </article>
    </>
  );
}
