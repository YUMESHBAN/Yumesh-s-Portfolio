import type { Metadata } from "next";

import { WorksEditorial } from "@/components/works-editorial";
import { JsonLd } from "@/components/json-ld";
import { getProjects, getSiteSettings } from "@/lib/content";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Works",
    description: "Explore the complete portfolio of company, freelance, academic, and learning projects by Yumesh Ban.",
    alternates: { canonical: "/works" },
    openGraph: {
      title: "Works by Yumesh Ban",
      description: settings.description,
      url: "/works",
    },
  };
}

export default async function WorksPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Works", href: "/works" }], settings)} />
      <WorksEditorial projects={projects} />
    </>
  );
}
