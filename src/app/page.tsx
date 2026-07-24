import Link from "next/link";
import { ArrowRight, BadgeCheck, Mail } from "lucide-react";

import { LandingSection } from "@/components/landing-section";
import { SelectedWorkPreview } from "@/components/selected-work-preview";
import { SectionHeading } from "@/components/section-heading";
import { TechLogo } from "@/components/tech-logo";
import {
  getCertifications,
  getExperiences,
  getFeaturedProjects,
  getPersonProfile,
  getSkills,
  getSiteSettings,
} from "@/lib/content";

export default async function HomePage() {
  const [profile, settings, featuredProjects, experiences, skills, certifications] = await Promise.all([
    getPersonProfile(),
    getSiteSettings(),
    getFeaturedProjects(),
    getExperiences(),
    getSkills(),
    getCertifications(),
  ]);

  const stackLanes = [
    {
      category: "Frontend",
      description: "Interfaces that stay fast, responsive, and maintainable.",
    },
    {
      category: "Backend",
      description: "APIs, auth flows, server logic, and product data.",
    },
    {
      category: "Database",
      description: "Schemas and persistence for real application workflows.",
    },
    {
      category: "CMS",
      description: "Structured content systems that clients can actually use.",
    },
    {
      category: "Tools",
      description: "Shipping, versioning, design handoff, and deployment.",
    },
  ] as const;
  const stackGroups = stackLanes
    .map((lane) => ({
      ...lane,
      items: skills.filter((skill) => skill.category === lane.category).slice(0, 4),
    }))
    .filter((lane) => lane.items.length > 0);
  const primaryStack = stackGroups.flatMap((lane) => lane.items).slice(0, 8);
  const strongSkillCount = skills.filter((skill) => skill.level === "Strong").length;

  return (
    <>
      <LandingSection profile={profile} settings={settings} />

      <section className="site-section">
        <div className="site-container">
          <SectionHeading
            eyebrow="Projects in focus"
            title="Product work, shaped for the real world."
          />

          <SelectedWorkPreview projects={featuredProjects} />

          <div className="mt-7 flex justify-center border-t border-white/10 pt-7 sm:justify-end">
            <Link href="/selected-work" className="site-button-primary w-fit">
              View selected work
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="site-section border-t border-white/10">
        <div className="site-container grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Current stack"
              title="A focused toolkit for shipping useful web products."
              description="I keep the stack deliberate: strong interface foundations, practical backend work, and content/data systems that are easy to maintain after launch."
            />

            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                <p className="text-3xl font-semibold text-white">{stackGroups.length}</p>
                <p className="mt-1 text-sm font-medium text-white/48">core capability lanes</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                <p className="text-3xl font-semibold text-white">{primaryStack.length}</p>
                <p className="mt-1 text-sm font-medium text-white/48">tools in active rotation</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                <p className="text-3xl font-semibold text-white">{strongSkillCount}</p>
                <p className="mt-1 text-sm font-medium text-white/48">strongly rated skills</p>
              </div>
            </div>

            <Link href="/about" className="site-link mt-7 inline-flex items-center gap-2 text-sm font-semibold">
              View full skill map
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/10 bg-black/30">
            <div className="border-b border-white/10 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase text-white/35">Primary tools</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {primaryStack.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2"
                  >
                    <TechLogo name={skill.name} />
                    <div>
                      <p className="text-sm font-semibold text-white">{skill.name}</p>
                      <p className="text-xs text-white/45">{skill.level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="divide-y divide-white/10">
              {stackGroups.map((lane) => (
                <div key={lane.category} className="grid gap-5 p-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:p-6">
                  <div>
                    <h2 className="font-semibold text-white">{lane.category}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/48">{lane.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    {lane.items.map((skill) => (
                      <span key={skill.name} className="site-chip">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="site-section border-t border-white/10">
        <div className="site-container">
          <SectionHeading
            eyebrow="Proof"
            title="Credibility without fake testimonials."
            description="A restrained snapshot of work history, education, and certificates."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <article className="site-panel p-6">
              <BadgeCheck className="text-blue-400" size={24} />
              <p className="mt-5 text-sm font-semibold uppercase text-white/35">Experience</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{experiences.length} roles</h2>
              <p className="site-muted mt-3 text-sm leading-6">
                Current full-stack work plus frontend, design, and video editing roots.
              </p>
            </article>
            <article className="site-panel p-6">
              <BadgeCheck className="text-blue-400" size={24} />
              <p className="mt-5 text-sm font-semibold uppercase text-white/35">Education</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{profile.finalSemesterPercentage}</h2>
              <p className="site-muted mt-3 text-sm leading-6">
                Final semester result for BSc.CSIT at Tribhuvan University.
              </p>
            </article>
            <article className="site-panel p-6">
              <BadgeCheck className="text-blue-400" size={24} />
              <p className="mt-5 text-sm font-semibold uppercase text-white/35">Certifications</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{certifications.length} listed</h2>
              <p className="site-muted mt-3 text-sm leading-6">
                Backend, English, web design, and learning-recognition proof.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="site-section border-t border-white/10">
        <div className="site-container">
          <div className="site-panel grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="site-eyebrow">Contact</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-5xl">
                Have a role, project, or product idea that needs a careful builder?
              </h2>
              <p className="site-muted mt-4 max-w-2xl leading-7">
                Send the context and I will get back with a practical next step.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/contact" className="site-button-primary">
                Contact Me
                <ArrowRight size={17} />
              </Link>
              <a href={`mailto:${profile.email}`} className="site-button-secondary">
                <Mail size={17} />
                Email
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
