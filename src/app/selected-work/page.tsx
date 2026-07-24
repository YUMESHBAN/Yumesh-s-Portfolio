import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SelectedWorkList } from "@/components/selected-work-list";
import { getFeaturedProjects, getSiteSettings } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Selected Work",
    description: "A curated selection of full-stack, freelance, company, and academic projects by Yumesh Ban.",
    alternates: { canonical: "/selected-work" },
    openGraph: {
      title: "Selected Work by Yumesh Ban",
      description: settings.description,
      url: "/selected-work",
    },
  };
}

export default async function SelectedWorkPage() {
  const projects = await getFeaturedProjects();

  return (
    <section className="site-section pt-32 sm:pt-36">
      <div className="site-container">
        <header className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:pb-14">
          <div>
            <p className="site-eyebrow">Selected work · 2024—2026</p>
            <h1 className="mt-5 max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-7xl">
              Product work, shaped for the real world.
            </h1>
          </div>
          <p className="site-muted max-w-md text-base leading-7">
            A focused selection of company, freelance, and academic work that shows how I shape interfaces, systems, and the details in between.
          </p>
        </header>

        <SelectedWorkList projects={projects} />

        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="site-muted max-w-xl text-sm leading-6">
            Looking for the full record? Explore every project, including learning builds and supporting work.
          </p>
          <Link href="/projects" className="site-button-secondary w-fit">
            View all work
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
