import type { Metadata } from "next";
import { BriefcaseBusiness } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { getExperiences, getSiteSettings } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Experience",
    description:
      "Professional experience of Yumesh Ban, including Full Stack Developer at Niyalo Creatives, Junior Frontend Developer at Sea Sky Cargo, freelance design, and video editing.",
    alternates: { canonical: "/experience" },
    openGraph: {
      title: "Yumesh Ban Experience",
      description: settings.description,
      url: "/experience",
    },
  };
}

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <section className="site-section pt-32">
      <div className="site-container max-w-5xl">
        <SectionHeading
          eyebrow="Experience"
          title="From current company work to creative freelance roots."
          description="The work history behind the portfolio: production web projects, frontend delivery, design, and video editing."
        />
        <div className="mt-12 grid gap-4">
          {experiences.map((experience) => (
            <article key={`${experience.company}-${experience.role}`} className="site-panel p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-blue-400">
                    <BriefcaseBusiness size={24} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase text-blue-400">{experience.employmentType}</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{experience.role}</h2>
                    <p className="mt-1 font-medium text-white/62">{experience.company}</p>
                  </div>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-medium text-white/58">
                  {experience.dateRange}
                </div>
              </div>
              <p className="site-muted mt-5 text-sm leading-6">{experience.summary}</p>
              <ul className="mt-5 grid list-disc gap-2 pl-5 text-sm leading-6 text-white/62 marker:text-blue-400">
                {experience.achievements.map((achievement) => (
                  <li key={achievement}>{achievement}</li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {experience.skills.map((skill) => (
                  <span key={skill} className="site-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
