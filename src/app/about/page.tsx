import type { Metadata } from "next";
import Image from "next/image";
import { Award, GraduationCap, MapPin } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { TechLogo } from "@/components/tech-logo";
import {
  getCertifications,
  getEducation,
  getPersonProfile,
  getSiteSettings,
  getSkills,
} from "@/lib/content";
import { breadcrumbJsonLd, profilePageJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Who is Yumesh Ban?",
    description:
      "Learn who Yumesh Ban is: a full stack developer from Kathmandu, Nepal, BSc.CSIT graduate, and builder of Next.js, Sanity, React, Django, and MERN projects.",
    alternates: { canonical: "/about" },
    openGraph: {
      title: "Who is Yumesh Ban?",
      description: settings.description,
      url: "/about",
    },
  };
}

export default async function AboutPage() {
  const [profile, settings, education, skills, certifications] = await Promise.all([
    getPersonProfile(),
    getSiteSettings(),
    getEducation(),
    getSkills(),
    getCertifications(),
  ]);

  const groupedSkills = skills.reduce<Record<string, typeof skills>>((groups, skill) => {
    groups[skill.category] = [...(groups[skill.category] ?? []), skill];
    return groups;
  }, {});

  return (
    <>
      <JsonLd data={profilePageJsonLd(profile, settings)} />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: "Home", href: "/" },
            { name: "Who is Yumesh Ban?", href: "/about" },
          ],
          settings,
        )}
      />

      <section className="site-section pt-32">
        <div className="site-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="site-panel p-3">
            <Image
              src={profile.image}
              alt="Yumesh Ban profile"
              width={640}
              height={640}
              className="aspect-square rounded-lg object-cover"
              priority
            />
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white/62">
                <MapPin size={17} />
                {profile.location}
              </div>
              <a href={`mailto:${profile.email}`} className="site-link mt-2 block font-semibold">
                {profile.email}
              </a>
            </div>
          </div>

          <div>
            <p className="site-eyebrow">Profile</p>
            <h1 className="mt-4 text-balance text-5xl font-semibold leading-none text-white sm:text-6xl">
              Who is Yumesh Ban?
            </h1>
            <div className="site-muted mt-7 grid gap-5 text-lg leading-8">
              {profile.longBio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Degree", "BSc.CSIT"],
                ["Overall", profile.overallPercentage],
                ["Final semester", profile.finalSemesterPercentage],
              ].map(([label, value]) => (
                <div key={label} className="site-panel p-5">
                  <p className="text-xs font-semibold uppercase text-white/35">{label}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="site-section border-t border-white/10">
        <div className="site-container">
          <SectionHeading
            eyebrow="Education"
            title="Academic foundation with measured results."
            description="Education is included as proof of fundamentals, discipline, and the completed BSc.CSIT milestone."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {education.map((item) => (
              <article key={item.institution} className="site-panel p-6">
                <GraduationCap className="text-blue-400" size={24} />
                <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{item.institution}</h2>
                    <p className="mt-1 font-medium text-white/62">{item.degree}</p>
                  </div>
                  {item.level ? <span className="site-chip">{item.level}</span> : null}
                </div>
                <p className="mt-2 text-sm text-white/48">{[item.dateRange, item.location].filter(Boolean).join(" / ")}</p>
                <p className="site-muted mt-4 text-sm leading-6">{item.summary}</p>

                {item.showResultStats !== false && item.resultStats ? (
                  <div className="mt-5 grid gap-4 border-y border-white/10 py-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase text-white/35">Highest</p>
                      <p className="mt-1 text-2xl font-semibold text-white">{item.resultStats.highestPercentage}%</p>
                      <p className="mt-1 text-xs font-medium text-white/48">{item.resultStats.highestLabel}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-white/35">Average</p>
                      <p className="mt-1 text-2xl font-semibold text-white">{item.resultStats.averagePercentage}%</p>
                      <p className="mt-1 text-xs font-medium text-white/48">
                        {item.resultStats.visibleResultCount} visible result{item.resultStats.visibleResultCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                ) : null}

                <ul className="mt-5 grid list-disc gap-2 pl-5 text-sm leading-6 text-white/62 marker:text-blue-400">
                  {item.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section border-t border-white/10">
        <div className="site-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Skills"
            title="Technical skills grouped for fast scanning."
            description="Frontend, backend, CMS, database, and tool strengths presented without clutter."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(groupedSkills).map(([category, items]) => (
              <div key={category} className="site-panel p-5">
                <h2 className="font-semibold text-white">{category}</h2>
                <div className="mt-4 grid gap-3">
                  {items.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <TechLogo name={item.name} iconName={item.iconName} />
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-white/45">{item.level}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section border-t border-white/10">
        <div className="site-container">
          <SectionHeading
            eyebrow="Certifications"
            title="Learning proof beyond coursework."
            description="Certificates and recognition support the story of continuous learning."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {certifications.map((certification) => (
              <article key={certification.title} className="site-panel p-6">
                <Award className="text-blue-400" size={24} />
                <h2 className="mt-5 text-xl font-semibold text-white">{certification.title}</h2>
                <p className="mt-1 text-sm font-medium text-white/48">{certification.issuer}</p>
                <p className="site-muted mt-3 text-sm leading-6">{certification.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
