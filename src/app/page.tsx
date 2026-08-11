import Link from "next/link";
import { ArrowRight, Clock3, Mail, MapPin } from "lucide-react";

import { LandingSection } from "@/components/landing-section";
import { ContactChannelNetwork } from "@/components/contact-channel-network";
import { HowIWorkSection } from "@/components/how-i-work-section";
import { SelectedWorkPreview } from "@/components/selected-work-preview";
import { SectionHeading } from "@/components/section-heading";
import { StackScrollExperience } from "@/components/stack-scroll-experience";
import {
  getFeaturedHomepageArticles,
  getFeaturedHomepageExperiences,
  getFeaturedProjects,
  getPersonProfile,
  getSkillShowcases,
  getSkills,
  getStackCategories,
  getSiteSettings,
} from "@/lib/content";

function shortAchievement(value: string) {
  const words = value.trim().split(/\s+/);

  return words.length > 5 ? `${words.slice(0, 5).join(" ")}…` : value;
}

export default async function HomePage() {
  const [profile, settings, featuredProjects, homepageExperiences, skills, stackCategories, skillShowcases, featuredArticles] = await Promise.all([
    getPersonProfile(),
    getSiteSettings(),
    getFeaturedProjects(),
    getFeaturedHomepageExperiences(),
    getSkills(),
    getStackCategories(),
    getSkillShowcases(),
    getFeaturedHomepageArticles(),
  ]);

  const graphExperienceSpacing = homepageExperiences.length > 1 ? Math.min(260, 500 / (homepageExperiences.length - 1)) : 0;
  const experienceGraphSpine = 210;

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
            <Link href="/works" className="site-button-primary w-fit">
              View project archive
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <HowIWorkSection />

      <section className="site-section">
        <div className="site-container relative isolate">
          <svg
            className="hidden"
            viewBox="0 0 432 850"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <filter id="experience-commit-glow" x="0" y="0" width="736" height="850" filterUnits="userSpaceOnUse">
                <feGaussianBlur stdDeviation="10" />
              </filter>
            </defs>
            <path d={`M${experienceGraphSpine} 832V64`} stroke="white" strokeOpacity="0.24" strokeWidth="2" />
            {homepageExperiences.map((experience, experienceIndex) => {
              const y = 64 + experienceIndex * graphExperienceSpacing;
              const labelOnRight = experienceIndex % 2 === 0;
              const visibleOutcomeCount = Math.min(experience.achievements.length, 2);
              const labelX = labelOnRight ? experienceGraphSpine + 24 : experienceGraphSpine - 154;
              const labelY = y - 18;

              return (
                <g key={`${experience.company}-${experience.role}`}>
                  {visibleOutcomeCount ? (
                    <>
                      {experience.achievements.slice(0, visibleOutcomeCount).map((achievement, achievementIndex) => {
                        const achievementDirection = (labelOnRight ? -1 : 1) * (achievementIndex % 2 === 0 ? 1 : -1);
                        const branchStartY = y + 32 + achievementIndex * 54;
                        const achievementX = experienceGraphSpine + achievementDirection * 100;
                        const achievementY = branchStartY + 99;
                        const achievementLabelX = achievementDirection === -1 ? achievementX - 110 : achievementX - 88;
                        const achievementLabelY = achievementY - 96;
                        const dashedTailY = achievementY + 48;

                        return (
                          <g key={`${experience.company}-${achievementIndex}`}>
                            <path d={`M${experienceGraphSpine} ${branchStartY}C${experienceGraphSpine + achievementDirection * 72} ${branchStartY} ${achievementX} ${achievementY - 69} ${achievementX} ${achievementY}`} stroke="#60A5FA" strokeOpacity="0.72" strokeWidth="1.75" />
                            <path d={`M${achievementX} ${achievementY}V${dashedTailY}`} stroke="#60A5FA" strokeOpacity="0.34" strokeWidth="1.5" strokeDasharray="4 7" />
                            <circle cx={experienceGraphSpine} cy={branchStartY} r="5" fill="#0B1220" stroke="#93C5FD" strokeOpacity="0.85" strokeWidth="2" />
                            <circle cx={experienceGraphSpine} cy={branchStartY} r="1.75" fill="#93C5FD" />
                            <circle cx={achievementX} cy={achievementY} r="5" fill="#0B1220" stroke="#93C5FD" strokeOpacity="0.85" strokeWidth="2" />
                            <circle cx={achievementX} cy={achievementY} r="1.75" fill="#93C5FD" />
                            <foreignObject x={achievementLabelX} y={achievementLabelY} width="180" height="128">
                              <div className="group relative h-full">
                                <p className={`absolute bottom-0 cursor-help text-[12px] leading-3 text-blue-200/65 line-clamp-2 ${achievementDirection === -1 ? "w-[100px] text-left" : "right-0 w-[84px] text-left"}`}>
                                  {shortAchievement(achievement)}
                                </p>
                                <div className="pointer-events-none absolute bottom-8 z-20 w-full rounded-md border border-blue-400/30 bg-[#0B1220]/95 px-2.5 py-2 text-left text-[9px] leading-3 text-blue-100 opacity-0 shadow-[0_10px_26px_rgba(0,0,0,0.45)] transition-opacity duration-150 group-hover:opacity-100">
                                  {achievement}
                                </div>
                              </div>
                            </foreignObject>
                          </g>
                        );
                      })}
                    </>
                  ) : null}
                  {experience.current ? (
                    <>
                      <circle cx={experienceGraphSpine} cy={y} r="34" fill="#60A5FA" fillOpacity="0.15" filter="url(#experience-commit-glow)" />
                      <circle cx={experienceGraphSpine} cy={y} r="17" fill="#60A5FA" />
                      <path d={`M${experienceGraphSpine - 7} ${y}L${experienceGraphSpine - 2} ${y + 5}L${experienceGraphSpine + 9} ${y - 7}`} stroke="#0B1220" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </>
                  ) : (
                    <circle cx={experienceGraphSpine} cy={y} r="10" fill="#0B1220" stroke="#93C5FD" strokeOpacity="0.85" strokeWidth="2" />
                  )}
                  <foreignObject x={labelX} y={labelY} width="138" height="52">
                    <div className={labelOnRight ? "text-left" : "text-right"}>
                      <p className="text-[10px] font-semibold leading-3 text-blue-200/80">{experience.role}</p>
                      <p className="mt-1 text-[9px] leading-3 text-blue-300/50">{experience.company}</p>
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>

          <div className="relative z-10">
            <div className="lg:w-[70%]">
              <SectionHeading
                eyebrow="Professional experience"
                title="Selected roles and real-world delivery."
                description="A concise view of the work, responsibilities, and technologies behind my professional experience."
              />
            </div>

            <div className="mt-10">
              {homepageExperiences.map((experience, experienceIndex) => {
                const visibleAchievementCount = Math.min(experience.achievements.length, 2);
                const isLastExperience = experienceIndex === homepageExperiences.length ;
                const labelOnRight = experienceIndex % 2 === 0;
                const graphHeightCm = visibleAchievementCount === 1 ? 7 : visibleAchievementCount === 2 ? 8.5 : 0;
                const graphRhythmClass = visibleAchievementCount === 1 ? "lg:min-h-[9cm]" : visibleAchievementCount === 2 ? "lg:min-h-[9cm]" : "";
                const desktopArticleSpacingClass = visibleAchievementCount ? "lg:pb-0" : "";
                const graphAchievements = experience.achievements.slice(0, visibleAchievementCount).map((achievement, achievementIndex) => {
                  const achievementStartCm = 2;
                  const achievementGapCm = 2;
                  const originCm = achievementStartCm + achievementIndex * achievementGapCm;
                  const position = (originCm / graphHeightCm) * 100;
                  const endpointPosition = ((originCm + 3) / graphHeightCm) * 100;
                  const direction = (experienceIndex + achievementIndex) % 2 === 0 ? 1 : -1;

                  return {
                    achievement,
                    achievementIndex,
                    position,
                    endpointPosition,
                    bendPosition: position + (endpointPosition - position) / 2,
                    tailPosition: ((originCm + 4) / graphHeightCm) * 100,
                    labelPosition: ((originCm + 2.85) / graphHeightCm) * 100,
                    direction,
                    endpointX: direction === -1 ? 40 : 72,
                  };
                });

                return (
                  <div key={`${experience.company}-${experience.role}`} className={`relative lg:grid lg:grid-cols-[3fr_2fr] ${graphRhythmClass} ${isLastExperience ? "lg:min-h-[18rem]" : ""}`}>
                    <article className={`relative border-l border-white/15 pb-8 pl-7 lg:col-start-1 ${desktopArticleSpacingClass}`}>
                    <span
                      className={`absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full ${experience.current ? "bg-blue-400 shadow-[0_0_0_5px_rgba(96,165,250,0.14)]" : "bg-white/40"}`}
                      aria-hidden="true"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/40">{experience.dateRange}</p>
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${experience.current ? "border-blue-400/30 bg-blue-400/10 text-blue-300" : "border-white/10 bg-white/[0.045] text-white/60"}`}>
                        {experience.current ? "Current" : experience.employmentType}
                      </span>
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{experience.role}</h2>
                    <p className="mt-2 text-sm font-medium text-white/60">
                      {experience.company} <span className="text-white/30">·</span> {experience.workMode}
                    </p>
                    <p className="site-muted mt-4 max-w-2xl leading-7">{experience.summary}</p>
                    {experience.skills.length ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {experience.skills.slice(0, 6).map((skill) => (
                          <span key={skill} className="site-chip">{skill}</span>
                        ))}
                      </div>
                    ) : null}
                    {experience.responsibilities?.[0] ? (
                      <p className="mt-5 flex max-w-2xl gap-3 text-sm font-medium leading-6 text-blue-200">
                        <ArrowRight className="mt-1 shrink-0 text-blue-400" size={16} aria-hidden="true" />
                        {experience.responsibilities[0]}
                      </p>
                    ) : null}
                    </article>

                    <div className="relative hidden overflow-visible lg:col-start-2 lg:block" data-experience-graph>
                      <div className="absolute bottom-0 left-[56%] top-0 w-px bg-white/25" data-experience-spine aria-hidden="true" />
                      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" aria-hidden="true">
                        {graphAchievements.map(({ achievementIndex, position, endpointPosition, bendPosition, tailPosition, direction, endpointX }) => (
                          <g key={`${experience.company}-branch-${achievementIndex}`} data-experience-branch={achievementIndex}>
                            <path d={`M56 ${position}C${56 + direction * 16} ${position} ${endpointX} ${bendPosition} ${endpointX} ${endpointPosition}`} vectorEffect="non-scaling-stroke" stroke="#60A5FA" strokeOpacity="0.14" strokeWidth="1.5" />
                            <path data-experience-arc pathLength="1" d={`M56 ${position}C${56 + direction * 16} ${position} ${endpointX} ${bendPosition} ${endpointX} ${endpointPosition}`} vectorEffect="non-scaling-stroke" stroke="#60A5FA" strokeOpacity="0.72" strokeWidth="1.75" />
                            <path data-experience-tail d={`M${endpointX} ${endpointPosition}V${tailPosition}`} vectorEffect="non-scaling-stroke" stroke="#60A5FA" strokeOpacity="0.34" strokeWidth="1.5" strokeDasharray="4 7" />
                          </g>
                        ))}
                      </svg>

                      <span className={`absolute left-[56%] top-0 grid h-5 w-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 ${experience.current ? "h-9 w-9 border-blue-400 bg-blue-400 text-[#0B1220] shadow-[0_0_24px_rgba(96,165,250,0.32)]" : "border-blue-300/85 bg-[#0B1220]"}`} data-experience-milestone>
                        {experience.current ? "✓" : null}
                      </span>
                      <div className={`absolute top-0 w-[40%] -translate-y-1/2 ${labelOnRight ? "left-[62%] text-left" : "left-[12%] text-right"}`} data-experience-role-label>
                        <p className="text-[12px] font-semibold leading-3 text-blue-200/80">{experience.role}</p>
                        <p className="mt-1 text-[10px] leading-3 text-blue-300/50">{experience.company}</p>
                      </div>

                      {graphAchievements.map(({ achievement, achievementIndex, position, endpointPosition, labelPosition, direction, endpointX }) => (
                          <div key={`${experience.company}-achievement-${achievementIndex}`} className="pointer-events-none absolute inset-0" data-experience-achievement={achievementIndex}>
                            <span className="absolute left-[56%] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-300/85 bg-[#0B1220]" style={{ top: `${position}%` }} data-experience-origin />
                            <span className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-300/85 bg-[#0B1220]" style={{ left: `${endpointX}%`, top: `${endpointPosition}%` }} data-experience-endpoint />
                            <div className={`group pointer-events-auto absolute w-[26%] ${direction === -1 ? "left-12 text-right" : "right-0 text-left"}`} style={{ top: `${labelPosition}%` }} data-experience-label>
                              <p className="cursor-help text-[10px] leading-3 text-blue-200/65 line-clamp-2">{shortAchievement(achievement)}</p>
                              <div className={`pointer-events-none absolute bottom-full mb-2 w-[180px] rounded-md border border-blue-400/30 bg-[#0B1220]/95 px-2.5 py-2 text-left text-[9px] leading-3 text-blue-100 opacity-0 shadow-[0_10px_26px_rgba(0,0,0,0.45)] transition-opacity duration-150 group-hover:opacity-100 ${direction === -1 ? "left-0" : "right-0"}`}>
                                {achievement}
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <StackScrollExperience skills={skills} categories={stackCategories} showcases={skillShowcases} variant="dial" />

      {featuredArticles.length ? (
        <section className="site-section border-t border-white/10">
          <div className="site-container">
            <SectionHeading
              eyebrow="Notes from building"
              title="Practical lessons from projects and growth."
              description="Short notes on the work, decisions, and learning behind the portfolio."
            />

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {featuredArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="site-panel flex min-h-72 flex-col p-6 transition hover:border-white/20 hover:bg-white/[0.085] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-300">{article.category || "Writing"}</p>
                  <p className="mt-3 text-sm text-white/48">{article.publishedAt}</p>
                  <h2 className="mt-4 text-2xl font-semibold leading-tight text-white">{article.title}</h2>
                  <p className="site-muted mt-4 text-sm leading-6">{article.excerpt}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-blue-300">
                    Read article
                    <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="site-section py-[3.6rem] sm:py-[4.5rem] lg:py-[5.4rem]">
        <div className="site-container relative isolate overflow-visible">
          <ContactChannelNetwork targetId="contact-channel-button" actionId="contact-channel-action" />

          <div className="grid gap-10 lg:grid-cols-[8rem_minmax(0,1fr)_18rem] lg:gap-9">
            <aside className="relative border-b border-white/10 pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-blue-300 lg:[writing-mode:vertical-rl]">{"// Open channel"}</p>
              <div className="mt-8 grid gap-6 lg:mt-44">
                <div>
                  <MapPin className="text-blue-400" size={24} aria-hidden="true" />
                  <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-blue-300">Location</p>
                  <p className="mt-2 text-sm leading-6 text-white/75">{profile.location}</p>
                  <p className="text-sm text-white/50">Remote · GMT+5:45</p>
                </div>
                <div>
                  <Clock3 className="text-blue-400" size={24} aria-hidden="true" />
                  <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-blue-300">Availability</p>
                  <p className="mt-2 text-sm leading-6 text-white/75">{profile.availability || "Open to new projects"}</p>
                </div>
              </div>
            </aside>

            <div className="relative z-10 lg:pt-24">
              <p className="site-eyebrow">{"// Let's build something meaningful"}</p>
              <h2 className="mt-7 max-w-3xl text-balance text-[2.7rem] font-medium leading-[0.98] tracking-[-0.04em] text-white sm:text-[4rem] lg:text-[5.4rem]">
                The next good project starts with a clear hello.
              </h2>
              <p className="site-muted mt-9 max-w-md text-base leading-7 sm:text-lg">
                I help founders and teams ship thoughtful digital products — from the first idea to production.
              </p>
              <p className="site-muted mt-1 text-base leading-7 sm:text-lg">Let&apos;s create something that lasts.</p>
            </div>

            <div id="contact-channel-action" className="relative z-10 flex flex-col justify-end lg:min-h-[31.5rem] lg:pb-14">
              <Link id="contact-channel-button" href="/contact" className="site-button-primary contact-channel-button w-full justify-between">
                Contact me
                <ArrowRight size={19} />
              </Link>
              <a href={`mailto:${profile.email}`} className="site-link mt-9 inline-flex items-center gap-3 text-sm font-medium text-blue-300">
                <Mail size={20} aria-hidden="true" />
                <span className="border-b border-blue-300/60 pb-1">{profile.email}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
