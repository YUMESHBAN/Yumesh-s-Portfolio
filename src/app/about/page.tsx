import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CircleDot, Clapperboard, Download, MapPin, PanelsTopLeft } from "lucide-react";

import { AboutHeroPortrait } from "@/components/about-hero-portrait";
import { AboutJourney } from "@/components/about-journey";
import { CompactStackMarquee } from "@/components/compact-stack-marquee";
import { JsonLd } from "@/components/json-ld";
import { SocialLinkIcon } from "@/components/social-link-icon";
import {
  getAboutJourney,
  getCertifications,
  getEducation,
  getPersonProfile,
  getSiteSettings,
  getSkillShowcases,
  getSkills,
  getStackCategories,
} from "@/lib/content";
import { breadcrumbJsonLd, profilePageJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Who is Yumesh Ban?",
    description: "Learn who Yumesh Ban is: a full stack developer from Kathmandu, Nepal, BSc.CSIT graduate, and builder of Next.js, Sanity, React, Django, and MERN projects.",
    alternates: { canonical: "/about" },
    openGraph: { title: "Who is Yumesh Ban?", description: settings.description, url: "/about" },
  };
}

export default async function AboutPage() {
  const [profile, settings, journey, education, skills, stackCategories, skillShowcases, certifications] = await Promise.all([
    getPersonProfile(),
    getSiteSettings(),
    getAboutJourney(),
    getEducation(),
    getSkills(),
    getStackCategories(),
    getSkillShowcases(),
    getCertifications(),
  ]);

  const bachelor = education.find((item) => item.level === "Bachelor") ?? education[0];
  const earlierEducation = bachelor ? education.filter((item) => item !== bachelor).slice().reverse() : [];
  const rankAchievement = bachelor?.achievements.find((achievement) => /ranked\s+1st|1st\s+out\s+of/i.test(achievement));
  const rankValue = rankAchievement?.replace(/^ranked\s+/i, "").replace(/\s+students.*$/i, "").replace(/\s+in\s+.*$/i, "");
  const bachelorResults = bachelor?.showResultEntries ? bachelor.resultEntries ?? [] : [];
  const bachelorResultStats = bachelor?.showResultStats ? bachelor.resultStats : null;
  const availability = profile.availability?.trim();
  const principles = profile.aboutManifesto;

  return (
    <>
      <JsonLd data={profilePageJsonLd(profile, settings)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Who is Yumesh Ban?", href: "/about" }], settings)} />

      <section className="about-hero relative z-10 isolate pt-[100px] sm:pt-[116px] lg:pt-[100px] xl:pt-[108px]">
        <div className="about-hero-grid pointer-events-none absolute inset-0 -z-22" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-64 bg-[linear-gradient(to_top,#0b0b0c_0%,rgba(11,11,12,0.72)_36%,transparent_100%)]" aria-hidden="true" />
        <div className="site-container grid items-stretch gap-6 lg:grid-cols-[minmax(0,1.04fr)_minmax(22rem,0.96fr)] lg:gap-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(25rem,0.96fr)]">
          <div className="about-hero-copy relative z-20 max-w-3xl py-2 lg:py-1 xl:py-2">
            <p className="site-eyebrow">{"// The person behind the work"}</p>
            <h1 className="mt-3 max-w-4xl text-balance text-[2.5rem] font-semibold leading-[0.96] tracking-[-0.055em] text-white sm:text-5xl lg:text-[3.5rem] xl:text-[4rem]">
              I didn&apos;t start with code.
              <span className="mt-2.5 block max-w-2xl text-[0.46em] font-medium leading-[1.14] tracking-[-0.035em] text-white/78 sm:mt-3">
                I started by learning how stories, visuals, and details shape an experience.
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/62 sm:text-base sm:leading-7">
              That instinct followed me from video editing and graphic design into full-stack development. Today, I bring both sides together to create products that feel clear, useful, and thoughtfully made.
            </p>

            <div className="mt-5 grid border-y border-white/10 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { icon: MapPin, label: "Based in", value: profile.location },
                { icon: Clapperboard, label: "Started with", value: "Visual storytelling" },
                { icon: PanelsTopLeft, label: "Now focused on", value: "Full-stack products" },
                { icon: CircleDot, label: "Currently", value: availability ?? "Building and learning" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 border-b border-white/10 py-3 last:border-b-0 sm:[&:nth-child(odd)]:border-r sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(odd)]:pr-4 sm:[&:nth-child(even)]:pl-4 xl:border-b-0 xl:border-r xl:px-4 xl:first:pl-0 xl:last:border-r-0 xl:last:pr-0">
                  <Icon className="mt-0.5 shrink-0 text-blue-300" size={16} aria-hidden="true" />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">{label}</p>
                    <p className="mt-0.5 text-xs font-medium leading-4 text-white/75 sm:text-sm sm:leading-5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href="/works" className="site-button-primary">View my works<ArrowRight size={17} aria-hidden="true" /></Link>
              <a
                href={settings.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                download="Yumesh-Ban-CV.pdf"
                className="site-button-secondary"
              >
                <Download size={17} aria-hidden="true" />
                Download resume
              </a>
            </div>

            {profile.socialLinks.length ? (
              <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Social profiles">
                {profile.socialLinks.map((social) => (
                  <a key={social.href} href={social.href} target="_blank" rel="noreferrer" className="site-link inline-flex items-center gap-1.5 text-xs font-medium">
                    <SocialLinkIcon label={social.label} href={social.href} size={13} />
                    {social.label}<ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <AboutHeroPortrait availability={availability} />
        </div>
      </section>

      <AboutJourney journey={journey} />

      <section className="about-manifesto about-section-reveal py-14 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-8">
          <p className="site-eyebrow">{"// How I show up"}</p>
          <h2 className="sr-only">The principles behind how I work</h2>

          <div className="about-manifesto-list mt-10 sm:mt-12">
            {principles.map((principle, index) => (
              <article
                key={`${principle.lineOne}-${principle.accent}`}
                tabIndex={0}
                className={`about-manifesto-item group relative py-5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-blue-300/70 sm:py-6 lg:w-[80%] ${index === 1 ? "about-manifesto-item-reversed lg:ml-auto lg:text-right" : ""}`}
              >
                <div className="flex items-center gap-5">
                  <p className="font-mono text-base text-blue-300">{String(index + 1).padStart(2, "0")}</p>
                  <span className="about-manifesto-rule h-px flex-1 bg-white/16" aria-hidden="true" />
                </div>

                <h3 className="about-manifesto-title mt-4 text-[clamp(2.65rem,6.4vw,5.2rem)] font-semibold uppercase leading-[0.88] tracking-[-0.065em] text-white">
                  <span className="block">{principle.lineOne}</span>
                  <span className="block">
                    {principle.lineTwoLead} <span className="about-manifesto-accent text-blue-500">{principle.accent}</span>{principle.lineTwoTail ? ` ${principle.lineTwoTail}` : ""}
                  </span>
                </h3>

                <div className="about-manifesto-copy relative mt-4 min-h-16">
                  <div className={`about-manifesto-summary flex flex-wrap items-center gap-x-5 gap-y-2 ${index === 1 ? "lg:justify-end" : ""}`}>
                    <p className="text-base text-white/58 sm:text-lg">{principle.summary}</p>
                  </div>
                  <div className={`about-manifesto-detail flex max-w-2xl gap-4 border-l border-blue-300/40 pl-4 ${index === 1 ? "lg:ml-auto lg:border-l-0 lg:border-r lg:pl-0 lg:pr-4" : ""}`}>
                    <p className="text-sm leading-7 text-white/65 sm:text-base">{principle.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {bachelor ? (
        <section className="about-section-reveal site-section">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="site-eyebrow">{"// The foundation behind the work"}</p>
              <h2 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl">An academic path measured by progress, not just completion.</h2>
            </div>
            <div className="mt-12 border-t border-white/10">
              <article className="grid gap-10 border-b border-white/10 py-9 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.78fr)] lg:gap-16 lg:py-12">
                <div>
                  <div className="flex flex-wrap items-center gap-3"><span className="font-mono text-xs font-medium tracking-[0.16em] text-blue-300">01</span><span className="h-px w-10 bg-blue-300/60" aria-hidden="true" /><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">{bachelor.level ?? "Education"}</span></div>
                  <h3 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">{bachelor.degree}</h3>
                  <p className="mt-5 text-sm font-medium text-blue-200/80">{bachelor.institution}</p>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs uppercase tracking-[0.12em] text-white/50"><span>{bachelor.dateRange}</span><span aria-hidden="true">/</span><span>{bachelor.location}</span></div>
                  <p className="mt-6 max-w-2xl text-sm leading-7 text-white/58">{bachelor.summary}</p>
                </div>
                <div className="border-t border-white/10 lg:border-l lg:border-t-0 lg:pl-10">
                  {[
                    { label: "Overall", value: profile.overallPercentage },
                    { label: "Final semester", value: profile.finalSemesterPercentage },
                    ...(rankValue ? [{ label: "Academic rank", value: rankValue }] : []),
                  ].map((metric) => <div key={metric.label} className="flex items-baseline justify-between gap-5 border-b border-white/10 py-5 first:pt-0 last:border-b-0 last:pb-0"><p className="text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">{metric.value}</p><p className="text-right font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">{metric.label}</p></div>)}
                </div>
                {bachelorResultStats ? <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:col-span-2">
                  <div className="bg-[#0b0b0c] px-5 py-4 sm:px-6"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">Highest result</p><p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-blue-200">{bachelorResultStats.highestPercentage}%</p><p className="mt-1 text-xs text-white/52">{bachelorResultStats.highestLabel}</p></div>
                  <div className="bg-[#0b0b0c] px-5 py-4 sm:px-6"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">Average result</p><p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-blue-200">{bachelorResultStats.averagePercentage}%</p></div>
                </div> : null}
                {bachelorResults.length ? <div className="border-t border-white/10 pt-6 lg:col-span-2 lg:pt-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/70">Result breakdown</p><div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">{bachelor.gradeSystem ? <span>Grading: {bachelor.gradeSystem}</span> : null}<span>{bachelorResults.length} visible {bachelorResults.length === 1 ? "result" : "results"}</span></div></div>
                  <div className="mt-4 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
                    {bachelorResults.map((result) => <div key={`${result.label}-${result.percentage}`} className="flex items-center justify-between gap-4 bg-[#0b0b0c] px-5 py-4 sm:px-6"><div><p className="text-base font-semibold tracking-[-0.02em] text-white">{result.label}</p>{result.note ? <p className="mt-1 text-sm text-white/52">{result.note}</p> : null}</div><p className="text-2xl font-semibold tracking-[-0.05em] text-blue-200">{result.percentage}%</p></div>)}
                  </div>
                </div> : null}
                {bachelor.gradeSystem || bachelor.honors?.length || bachelor.achievements.length || bachelor.courses?.length ? <div className="border-t border-white/10 pt-6 lg:col-span-2 lg:pt-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/70">Academic highlights</p>
                  {bachelor.gradeSystem && !bachelorResults.length ? <p className="mt-3 text-sm text-white/55">Grading: {bachelor.gradeSystem}</p> : null}
                  <div className="mt-4 grid gap-5 sm:grid-cols-2">
                    {bachelor.honors?.length ? <div><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">Honors</p><ul className="mt-3 grid gap-2 text-sm leading-6 text-white/72">{bachelor.honors.map((honor) => <li key={honor}>• {honor}</li>)}</ul></div> : null}
                    {bachelor.achievements.length ? <div><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">Achievements</p><div className="mt-3 flex flex-wrap gap-2.5">{bachelor.achievements.map((achievement) => <span key={achievement} className="rounded-full border border-white/12 px-3 py-1.5 text-sm font-medium text-white/72">{achievement}</span>)}</div></div> : null}
                  </div>
                  {bachelor.courses?.length ? <details className="mt-5 border-y border-white/10 py-4"><summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.14em] text-blue-200/75">Relevant coursework ({bachelor.courses.length})</summary><ul className="mt-4 grid gap-x-8 gap-y-2 text-sm text-white/68 sm:grid-cols-2">{bachelor.courses.map((course) => <li key={course}>• {course}</li>)}</ul></details> : null}
                </div> : null}
              </article>

              {earlierEducation.map((item, index) => (
                <article key={`${item.institution}-${item.degree}`} className="grid gap-5 border-b border-white/10 py-8 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[5rem_minmax(0,1fr)_minmax(16rem,0.62fr)] lg:py-10">
                  <p className="font-mono text-xs font-medium tracking-[0.16em] text-blue-300">{String(index + 2).padStart(2, "0")}</p>
                  <div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">{item.level ?? "Education"}</p><span className="text-xs uppercase tracking-[0.12em] text-white/45">{item.dateRange}</span></div>
                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">{item.degree}</h3>
                    <p className="mt-3 text-sm font-medium text-blue-200/70">{item.institution}</p><p className="mt-1 text-xs text-white/50">{item.location}</p>
                  </div>
                  <div className="sm:col-start-2 lg:col-start-3">
                    <div className="border border-white/10 bg-white/[0.02] px-5 py-5 sm:px-6 sm:py-6">
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-blue-200/65">Academic note</p>
                      <p className="mt-3 text-base leading-8 text-white/72 sm:text-lg">{item.summary}</p>
                      {item.achievements.length ? <div className="mt-5 flex flex-wrap gap-2.5">{item.achievements.map((achievement) => <span key={achievement} className="rounded-full border border-white/12 px-3 py-1.5 text-sm font-medium text-white/72">{achievement}</span>)}</div> : null}
                      {item.honors?.length ? <div className="mt-5 border-t border-white/10 pt-4"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">Honors</p><ul className="mt-3 grid gap-2 text-sm leading-6 text-white/68">{item.honors.map((honor) => <li key={honor}>• {honor}</li>)}</ul></div> : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CompactStackMarquee skills={skills} categories={stackCategories} showcases={skillShowcases} />

      {certifications.length ? (
        <section className="about-section-reveal site-section">
          <div className="site-container">
            <div className="max-w-3xl">
              <p className="site-eyebrow">{"// Still learning. Always building."}</p>
              <h2 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl">Learning that keeps finding its way into the work.</h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55">Backend systems, communication, consistency, and visual craft all contribute to how I build today.</p>
            </div>
            <div className="about-proof-shelf mt-12 border-y border-white/10 py-2 sm:py-3">
              {certifications.map((certification, index) => (
                <article key={`${certification.issuer}-${certification.title}`} tabIndex={certification.credentialUrl ? undefined : 0} aria-label={`${certification.title}, ${certification.issuer}`} className={`about-proof-shelf-item group relative border-b border-white/10 py-5 last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-300/70 sm:py-6 ${certification.credentialUrl ? "cursor-pointer" : ""} ${index % 2 ? "lg:ml-10" : ""}`}>
                  <span className="absolute -left-[1.05rem] top-8 h-3 w-3 border border-white/35 bg-[#0b0b0c] transition-colors duration-300 group-hover:border-blue-300 group-hover:bg-blue-300 group-focus-within:border-blue-300 group-focus-within:bg-blue-300" aria-hidden="true" />
                  {certification.credentialUrl ? <a href={certification.credentialUrl} target="_blank" rel="noreferrer" className="absolute inset-0 z-10 focus-visible:outline-none" aria-label={`Open ${certification.title} credential in a new tab`} /> : null}
                  <div className="grid gap-3 pr-1 sm:grid-cols-[minmax(0,1fr)_8rem_4rem_auto] sm:items-center sm:gap-6">
                    <h3 className={`font-semibold leading-tight tracking-[-0.035em] text-white ${index === 0 ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>{certification.title}</h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">{certification.issuer}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">{certification.date}</p>
                    <span className={`inline-flex w-fit items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.13em] ${certification.credentialUrl ? "text-blue-300" : "text-white/35"}`}>{certification.credentialUrl ? "Open proof" : "Learning note"}<ArrowUpRight size={14} aria-hidden="true" /></span>
                  </div>
                  <div className="about-proof-shelf-detail grid grid-cols-1 gap-3 border border-blue-300/45 px-5 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-center sm:gap-8 sm:px-7">
                    <div><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-blue-200/70">Issuer</p><p className="mt-2 text-sm font-medium text-white/75">{certification.issuer}</p></div>
                    <p className="text-sm leading-7 text-white/62">{certification.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="about-section-reveal site-section">
        <div className="site-container">
          <div className="about-closing-invitation py-14 sm:py-20 lg:py-28">
            <p className="site-eyebrow">{"// Now you know the person"}</p>
            <h2 className="mt-7 max-w-6xl text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              The best way to understand how I think is to <span className="text-blue-400">see what I&apos;ve built.</span>
            </h2>

            <div className="mt-12 border-t border-white/20 pt-5 sm:mt-16 sm:pt-7">
              <div className={`grid gap-0 lg:items-center ${availability ? "lg:grid-cols-[minmax(17rem,26rem)_minmax(15rem,1fr)_minmax(13rem,auto)]" : "lg:grid-cols-[minmax(17rem,26rem)_minmax(15rem,1fr)]"}`}>
                <Link href="/works" className="site-button-primary w-full">
                  Explore works <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <Link href="/contact" className="group mt-5 inline-flex min-h-16 items-center gap-2 border-t border-white/15 pt-5 font-mono text-xs uppercase tracking-[0.16em] text-white/72 transition-colors hover:text-blue-300 focus-visible:outline-none focus-visible:text-blue-300 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0 xl:pl-14">
                  Start a conversation <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                {availability ? <p className="mt-5 inline-flex min-h-16 items-center gap-3 border-t border-white/15 pt-5 font-mono text-[10px] uppercase tracking-[0.15em] text-blue-200/75 lg:mt-0 lg:justify-self-end lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0 xl:pl-14"><span className="h-2.5 w-2.5 rounded-full bg-blue-400 shadow-[0_0_14px_rgba(96,165,250,0.8)]" aria-hidden="true" />{availability}</p> : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
