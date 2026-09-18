"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { TechLogo } from "@/components/tech-logo";
import type { ImageWithMeta, Skill, SkillShowcase, StackCategory } from "@/types/content";

gsap.registerPlugin(ScrollTrigger);

type CategoryData = StackCategory & { skills: Skill[] };
type Proof = { category: CategoryData; skill: Skill; showcase: SkillShowcase; id: string };

function normalise(value: string) {
  return value.trim().toLocaleLowerCase();
}

function sameSkill(skill: Skill, reference: SkillShowcase["skill"]) {
  if (skill._id && reference._id) {
    return skill._id === reference._id;
  }

  return normalise(skill.name) === normalise(reference.name) && normalise(skill.category) === normalise(reference.category ?? "");
}

function proofId(index: number) {
  return `stack-proof-${index + 1}`;
}

function ProofContent({
  proof,
  index,
  showcase,
  skillProofs,
  subIndex,
  isDial,
  onChangeProof,
}: {
  proof: Proof;
  index: number;
  showcase: SkillShowcase;
  skillProofs: SkillShowcase[];
  subIndex: number;
  isDial: boolean;
  onChangeProof: (nextIndex: number) => void;
}) {
  const image: ImageWithMeta | undefined = showcase.image ?? showcase.project?.featuredImage ?? proof.category.image;

  return (
    <div data-stack-proof-inner className="w-full transition-[opacity,transform] duration-500 motion-reduce:transition-none">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-blue-200/75">
        <div className="flex flex-wrap items-center gap-3">
          <span>{proof.category.label ?? proof.category.title} / {proof.skill.name}</span>
          {skillProofs.length > 1 ? (
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium tracking-normal text-white/80">
              <span>Proof {subIndex + 1} of {skillProofs.length}</span>
              <div className="flex items-center border-l border-white/10 pl-1.5">
                <button type="button" onClick={() => onChangeProof((subIndex - 1 + skillProofs.length) % skillProofs.length)} className="rounded p-0.5 transition hover:bg-white/10 hover:text-white" aria-label="Previous proof"><ChevronLeft size={13} aria-hidden="true" /></button>
                <button type="button" onClick={() => onChangeProof((subIndex + 1) % skillProofs.length)} className="rounded p-0.5 transition hover:bg-white/10 hover:text-white" aria-label="Next proof"><ChevronRight size={13} aria-hidden="true" /></button>
              </div>
            </div>
          ) : null}
        </div>
        <span className={`text-white/35 ${isDial ? "xl:hidden" : ""}`}>{String(index + 1).padStart(2, "0")}</span>
      </div>
      {isDial ? (
        <div className="rounded-xl border border-white/10 bg-[#08090d] transition-[border-color,box-shadow] duration-300 xl:rounded-none xl:border-transparent xl:hover:border-blue-400/60 xl:hover:shadow-[0_0_24px_rgba(96,165,250,0.2)] motion-reduce:transition-none">
          <div className="xl:grid xl:min-h-[31rem] xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
            <div className="border-b border-white/10 xl:flex xl:flex-col xl:border-b-0 xl:border-r">
              <div className="relative min-h-60 bg-black/25 p-4 sm:min-h-72 sm:p-5 xl:min-h-0 xl:flex-1">
                {showcase.demoVideoUrl ? <video className="h-full w-full object-contain" controls preload="metadata" src={showcase.demoVideoUrl} /> : image?.url || image?.src ? <Image src={image.url ?? image.src ?? ""} alt={image.alt || `${showcase.title} proof`} fill sizes="(min-width: 1280px) 26vw, 100vw" className="object-contain p-4 sm:p-5" onLoad={() => ScrollTrigger.refresh()} /> : <div className="flex h-full flex-col justify-between p-5"><span className="font-mono text-xs uppercase tracking-[0.16em] text-blue-200/70">{proof.skill.name} proof</span><p className="max-w-sm text-2xl font-semibold tracking-[-0.05em] text-white">{showcase.title}</p></div>}
              </div>
              {showcase.highlights?.length ? <ul aria-label="What I delivered" className="space-y-3 border-t border-white/10 px-6 py-7 text-sm leading-6 text-white/65 sm:px-8">{showcase.highlights.slice(0, 3).map((highlight) => <li key={highlight} className="flex gap-3"><span className="text-blue-300">•</span>{highlight}</li>)}</ul> : null}
            </div>
            <div className="flex min-w-0 flex-col p-6 sm:p-8 xl:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-300">{proof.skill.name} / What I built</p>
              <h3 className="mt-3 text-3xl font-semibold leading-[0.98] tracking-[-0.05em] text-white">{showcase.title}</h3>
              {showcase.project ? <div className="mt-6"><p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-white/35">Project context</p><p className="mt-2 text-sm font-semibold text-white">{showcase.project.title}</p><p className="mt-1 text-xs text-white/45">{showcase.project.role ?? showcase.project.type}</p></div> : null}
              <p className="mt-8 text-sm leading-7 text-white/60">{showcase.description}</p>
              {showcase.project ? <Link href={`/works/${showcase.project.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-blue-200">View project details<ArrowUpRight size={16} aria-hidden="true" /></Link> : null}
            </div>
          </div>
          <div className="border-t border-white/10 px-6 py-5 sm:px-8">{showcase.project?.techStack?.length ? <div className="flex flex-wrap gap-2">{showcase.project.techStack.slice(0, 5).map((item) => <span key={item} className="site-chip px-3 py-1.5 text-xs">{item}</span>)}</div> : null}</div>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-[#08090d]">
          <div className="relative min-h-72 border-b border-white/10 bg-black/25 sm:min-h-96">
            {showcase.demoVideoUrl ? <video className="h-full min-h-72 w-full object-contain sm:min-h-96" controls preload="metadata" src={showcase.demoVideoUrl} /> : image?.url || image?.src ? <Image src={image.url ?? image.src ?? ""} alt={image.alt || `${showcase.title} proof`} fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-contain p-5" onLoad={() => ScrollTrigger.refresh()} /> : <div className="flex h-full min-h-72 flex-col justify-between p-7 sm:min-h-96 sm:p-9"><span className="font-mono text-xs uppercase tracking-[0.16em] text-blue-200/70">{proof.skill.name}</span><p className="max-w-lg text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">{showcase.title}</p></div>}
          </div>
          <div className="p-6 sm:p-8"><p className="text-sm font-medium text-blue-200/70">{showcase.project?.role ?? showcase.project?.type ?? proof.skill.name}</p><h3 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">{showcase.title}</h3><p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">{showcase.description}</p>{showcase.highlights?.length ? <div className="mt-6 flex flex-wrap gap-2">{showcase.highlights.map((highlight) => <span key={highlight} className="site-chip">{highlight}</span>)}</div> : null}{showcase.project ? <Link href={`/works/${showcase.project.slug}`} className="site-link mt-7 inline-flex items-center gap-2 text-sm font-semibold">View {showcase.project.title}<ArrowUpRight size={16} aria-hidden="true" /></Link> : null}</div>
        </div>
      )}
    </div>
  );
}

export function StackScrollExperience({
  skills,
  categories,
  showcases,
  variant = "standard",
}: {
  skills: Skill[];
  categories: StackCategory[];
  showcases: SkillShowcase[];
  variant?: "standard" | "dial";
}) {
  const rootRef = useRef<HTMLElement>(null);
  const leftRailRef = useRef<HTMLDivElement>(null);
  const proofPanelRef = useRef<HTMLDivElement>(null);
  const requestedProofIndexRef = useRef<number | null>(null);
  const activeProofIndexRef = useRef(0);
  const proofWheelLockRef = useRef<number | null>(null);
  const [activeProofIndex, setActiveProofIndex] = useState(0);
  const [proofTransition, setProofTransition] = useState<"next" | "previous" | null>(null);
  const [pendingProofIndex, setPendingProofIndex] = useState<number | null>(null);
  const [subProofIndexes, setSubProofIndexes] = useState<Record<string, number>>({});
  const [isZoomed, setIsZoomed] = useState(false);
  const isDial = variant === "dial";

  useEffect(() => {
    activeProofIndexRef.current = activeProofIndex;
  }, [activeProofIndex]);

  useEffect(() => {
    const updateZoom = () => setIsZoomed(window.outerWidth / window.innerWidth > 1.06);

    updateZoom();
    window.addEventListener("resize", updateZoom);
    return () => window.removeEventListener("resize", updateZoom);
  }, []);

  const categoryData = useMemo<CategoryData[]>(() => {
    const authored = categories
      .map((category) => ({ ...category, skills: skills.filter((skill) => normalise(skill.category) === normalise(category.title)) }))
      .filter((category) => category.skills.length);

    if (authored.length) {
      return authored;
    }

    return Array.from(new Set(skills.map((skill) => skill.category))).map((title, index) => ({
      title,
      label: `${String(index + 1).padStart(2, "0")} / Skill category`,
      description: `A selection of ${title} work and capabilities.`,
      order: index + 1,
      skills: skills.filter((skill) => skill.category === title),
    }));
  }, [categories, skills]);

  const proofs = useMemo<Proof[]>(() => {
    return categoryData.flatMap((category) =>
      category.skills.flatMap((skill) =>
        showcases
          .filter((showcase) => sameSkill(skill, showcase.skill))
          .map((showcase) => ({ category, skill, showcase, id: "" })),
      ),
    ).map((proof, index) => ({ ...proof, id: proofId(index) }));
  }, [categoryData, showcases]);

  const activeProof = proofs[activeProofIndex] ?? proofs[0];
  const activeCategory = activeProof?.category ?? categoryData[0];
  const activeSkill = activeProof?.skill;
  const activeSkillProofs = activeProof ? showcases.filter((showcase) => sameSkill(activeProof.skill, showcase.skill)) : [];
  const activeSubIndex = activeProof ? subProofIndexes[activeProof.id] ?? 0 : 0;
  const activeShowcase = activeSkillProofs[activeSubIndex] ?? activeProof?.showcase;
  const activeCategoryIndex = Math.max(0, categoryData.findIndex((category) => category.title === activeCategory?.title));
  const dialStep = 120 / Math.max(1, categoryData.length - 1);
  const dialSweep = `${38 + activeCategoryIndex * dialStep}deg`;
  const dialAngle = `${-52 + activeCategoryIndex * dialStep}deg`;

  function activateProof(index: number) {
    if (requestedProofIndexRef.current !== null && requestedProofIndexRef.current !== index) {
      return;
    }

    requestedProofIndexRef.current = null;
    setActiveProofIndex(index);
  }

  const scrollTo = useCallback((id: string, behavior: ScrollBehavior = "smooth") => {
    const target = document.getElementById(id);

    if (!target) return;

    const stackNavigation = document.querySelector<HTMLElement>("[data-stack-dial-section] > .site-container > .sticky");
    const navigationOffset = window.innerWidth < 1280 ? (stackNavigation?.getBoundingClientRect().height ?? 0) + 16 : 0;
    const headerOffset = 112 + navigationOffset;
    const top = window.scrollY + target.getBoundingClientRect().top - headerOffset;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo({ top, behavior: "auto" });
      requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = previousScrollBehavior;
      });
      return;
    }

    window.scrollTo({ top, behavior });
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const leftRail = leftRailRef.current;

    if (!root || !leftRail || !proofs.length) {
      return;
    }

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      if (!isDial) {
        media.add("(prefers-reduced-motion: no-preference)", () => {
          const sections = gsap.utils.toArray<HTMLElement>("[data-stack-proof]", root);
          const triggers = sections.map((section, index) =>
            ScrollTrigger.create({
              trigger: section,
              start: "top 60%",
              end: "bottom 40%",
              onToggle: (self) => {
                if (self.isActive) {
                  activateProof(index);
                }
              },
            }),
          );

          return () => {
            triggers.forEach((trigger) => trigger.kill());
          };
        });
      }

      if (!isDial) media.add("(min-width: 1280px) and (prefers-reduced-motion: no-preference)", () => {
        const sections = gsap.utils.toArray<HTMLElement>("[data-stack-proof]", root);
        const finalProof = sections[sections.length - 1] ?? root;
        const pin = ScrollTrigger.create({
          trigger: root,
          endTrigger: isDial ? root : finalProof,
          start: "top top+=96",
          end: isDial ? "bottom bottom-=96" : "bottom bottom+=256",
          pin: leftRail,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });

        const entrance = isDial
          ? gsap.fromTo(
              "[data-stack-dial-shell]",
              { xPercent: -58, autoAlpha: 0 },
              {
                xPercent: 0,
                autoAlpha: 1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: sections[0] ?? root,
                  start: "top 30%",
                  end: "top 14%",
                  scrub: 0.6,
                },
              },
            )
          : null;

        const proofTransitions = isDial
          ? sections.map((section) => {
              const proof = section.querySelector("[data-stack-proof-inner]");

              return gsap.timeline({
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom-=88",
                  end: "bottom top+=112",
                  scrub: 0.5,
                },
              })
                .fromTo(proof, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.12, ease: "none" })
                .to(proof, { y: -18, autoAlpha: 0, duration: 0.1, ease: "none" }, 0.9);
            })
          : [];

        ScrollTrigger.refresh();
        return () => {
          entrance?.kill();
          proofTransitions.forEach((animation) => animation.kill());
          pin.kill();
        };
      });

      return () => media.revert();
    }, root);

    return () => context.revert();
  }, [isDial, proofs.length]);

  useLayoutEffect(() => {
    if (pendingProofIndex === null) {
      return;
    }

    const requestedProof = proofs[pendingProofIndex];

    if (requestedProof) {
      scrollTo(requestedProof.id);
    }

    requestAnimationFrame(() => {
      setPendingProofIndex((current) => (current === pendingProofIndex ? null : current));
    });
  }, [pendingProofIndex, proofs, scrollTo]);

  useEffect(() => {
    const panel = proofPanelRef.current;

    if (!panel || !isDial) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      if (window.innerWidth < 1280 || Math.abs(event.deltaY) < 2) {
        return;
      }

      const bounds = panel.getBoundingClientRect();
      const isOverPanel =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (!isOverPanel) {
        return;
      }

      const currentIndex = activeProofIndexRef.current;
      const currentProof = proofs[currentIndex];
      const direction = event.deltaY > 0 ? 1 : -1;
      let nextIndex = -1;

      if (currentProof && direction > 0) {
        nextIndex = proofs.findIndex((proof, index) => index > currentIndex && !sameSkill(proof.skill, currentProof.skill));
      }

      if (currentProof && direction < 0) {
        for (let index = currentIndex - 1; index >= 0; index -= 1) {
          if (!sameSkill(proofs[index].skill, currentProof.skill)) {
            nextIndex = index;
            while (nextIndex > 0 && sameSkill(proofs[nextIndex - 1].skill, proofs[nextIndex].skill)) {
              nextIndex -= 1;
            }
            break;
          }
        }
      }

      if (nextIndex < 0 || nextIndex >= proofs.length) {
        return;
      }

      event.preventDefault();

      if (proofWheelLockRef.current !== null) {
        return;
      }

      setProofTransition(direction > 0 ? "next" : "previous");
      setActiveProofIndex(nextIndex);
      proofWheelLockRef.current = window.setTimeout(() => {
        proofWheelLockRef.current = null;
      }, 360);
    };

    window.addEventListener("wheel", handleWheel, { capture: true, passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
      if (proofWheelLockRef.current !== null) {
        window.clearTimeout(proofWheelLockRef.current);
      }
    };
  }, [isDial, proofs.length]);

  function showProof(proof: Proof) {
    const proofIndex = Math.max(0, proofs.indexOf(proof));

    if (isDial && window.innerWidth >= 1280) {
      requestedProofIndexRef.current = null;
      setActiveProofIndex(proofIndex);
      return;
    }

    requestedProofIndexRef.current = proofIndex;
    setPendingProofIndex(proofIndex);
    setActiveProofIndex(proofIndex);
  }

  function selectCategory(category: CategoryData) {
    const target = proofs.find((proof) => proof.category.title === category.title);

    if (target) {
      const proofIndex = Math.max(0, proofs.indexOf(target));

      if (isDial && window.innerWidth >= 1280) {
        requestedProofIndexRef.current = null;
        setActiveProofIndex(proofIndex);
        return;
      }

      requestedProofIndexRef.current = proofIndex;
      setPendingProofIndex(proofIndex);
      setActiveProofIndex(proofIndex);
      return;
    }

    scrollTo("stack-category-header");
  }

  if (!categoryData.length || !proofs.length || !activeCategory) {
    return null;
  }

  return (
    <section ref={rootRef} className={`site-section ${isDial ? "overflow-x-clip xl:py-0" : ""}`} aria-labelledby="stack-scroll-title" data-stack-dial-section={isDial ? "" : undefined}>
      <div className="site-container">
        {/* Persistent Sticky Category Pill Nav Bar across entire section - positioned at top-[108px] for generous spacing below header */}
        <div className={`sticky top-[108px] z-30 mb-6 rounded-xl border border-white/12 bg-[#090a0f]/92 p-3 backdrop-blur-xl shadow-[0_12px_28px_rgba(0,0,0,0.45)] ${isDial ? "xl:hidden" : ""}`} aria-label="Stack categories">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categoryData.map((category) => {
              const selected = normalise(category.title) === normalise(activeCategory.title);

              return (
                <button
                  key={category.title}
                  type="button"
                  onClick={() => selectCategory(category)}
                  className={`rounded-full border px-3 py-1.5 text-center text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    selected
                      ? "border-blue-400/60 bg-blue-500/20 text-blue-100 shadow-[0_0_12px_rgba(96,165,250,0.3)]"
                      : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/90"
                  }`}
                >
                  {String(categoryData.indexOf(category) + 1).padStart(2, "0")} {category.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className={isDial ? "xl:grid xl:grid-cols-[minmax(0,0.58fr)_minmax(0,1.42fr)] xl:gap-8" : "lg:grid lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)] lg:gap-12"}>
          <div ref={leftRailRef} className={`relative min-w-0 self-start pb-10 ${isDial ? "xl:sticky xl:top-24 xl:min-h-[calc(100vh-6rem)] xl:pl-12 xl:pt-3" : "lg:pb-0 lg:pt-1"}`}>
            {isDial ? (
              <div data-stack-dial-shell className={`stack-dial-shell hidden transition-opacity duration-300 ease-out xl:block ${isZoomed ? "pointer-events-none !opacity-0" : "!opacity-100"}`} aria-hidden={isZoomed}>
                <div className="stack-dial-visual" aria-hidden="true">
                  <div className="stack-dial-indicator" style={{ "--stack-dial-sweep": dialSweep, "--stack-dial-angle": dialAngle } as CSSProperties}>
                    <span className="stack-dial-active-arc" />
                    <span className="stack-dial-active-dot" />
                  </div>
                  <div className="stack-dial-wheel">
                    <span className="stack-dial-ring stack-dial-ring-outer" />
                    <span className="stack-dial-ring stack-dial-ring-inner" />
                    <span className="stack-dial-ring stack-dial-ring-ticks" />
                  </div>
                </div>
                <div className="stack-dial-labels">
                  {categoryData.map((category, index) => {
                    const selected = index === activeCategoryIndex;
                    const angle = -52 + index * dialStep;

                    return (
                      <button
                        key={category.title}
                        type="button"
                        onClick={() => selectCategory(category)}
                        className={`stack-dial-item ${selected ? "is-active" : ""}`}
                        style={{ "--stack-dial-angle": `${angle}deg` } as CSSProperties}
                        aria-current={selected ? "true" : undefined}
                        aria-label={`Show ${category.title} stack`}
                      >
                        <span>{category.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
            <div id="stack-category-header" className={`scroll-mt-56 ${isDial ? "xl:relative xl:-left-6 xl:max-w-[22rem]" : ""}`}>
              <p className="site-eyebrow">Current stack</p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">{activeCategory.label ?? "Current capability"}</p>
              <h2 id="stack-scroll-title" className={`max-w-md text-5xl font-semibold leading-[0.88] tracking-[-0.07em] text-white sm:text-6xl ${isDial ? "mt-6 xl:text-[3.75rem]" : "mt-3 lg:text-7xl"}`}>
                {activeCategory.title.toLocaleUpperCase()}
              </h2>
              <p className="site-muted mt-6 max-w-sm leading-7">{activeCategory.description}</p>

              <div className={`${isDial ? "mt-7 xl:max-w-[19rem]" : "mt-9"} border-y border-white/10`}>
                {activeCategory.skills.map((skill) => {
                  const target = proofs.find((proof) => sameSkill(skill, proof.showcase.skill));
                  const selected = activeSkill ? sameSkill(skill, activeSkill) : false;

                  return (
                    <button
                      key={`${skill.category}-${skill.name}`}
                      type="button"
                      disabled={!target}
                      onClick={() => target && showProof(target)}
                      className={`group -mx-2 flex w-[calc(100%+1rem)] items-center justify-between gap-4 rounded-lg border-b border-white/10 px-2 ${isDial ? "py-2.5" : "py-3"} text-left last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400/70 disabled:cursor-not-allowed disabled:opacity-35 ${selected ? "bg-blue-300/[0.06] text-blue-100" : "text-white/60 hover:bg-white/[0.035] hover:text-white"}`}
                      aria-label={target ? `View ${skill.name} proof` : `${skill.name} has no proof yet`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <TechLogo name={skill.name} iconName={skill.iconName} semanticIconName={skill.semanticIconName} />
                        <span className="truncate text-sm font-semibold tracking-[-0.02em]">{skill.name}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <ArrowUpRight className={`size-4 transition-transform duration-300 motion-reduce:transition-none ${selected ? "text-blue-300" : "text-white/30 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-300"}`} aria-hidden="true" />
                      </span>
                    </button>
                  );
                })}
              </div>

              {!isDial ? (
                <Link href="/about" className="site-link mt-7 inline-flex items-center gap-2 text-sm font-semibold">
                  Explore the full skill map
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              ) : null}
            </div>
          </div>

          <div className={`min-w-0 space-y-12 lg:space-y-0 ${isDial ? "xl:w-full xl:pl-5" : ""}`}>
            {isDial && activeProof && activeShowcase ? (
              <div ref={proofPanelRef} className="hidden xl:sticky xl:top-24 xl:z-10 xl:block">
                <div key={activeProof.id} className={proofTransition === "previous" ? "stack-proof-swipe-up" : proofTransition === "next" ? "stack-proof-swipe-down" : undefined}>
                  <ProofContent
                    proof={activeProof}
                    index={activeProofIndex}
                    showcase={activeShowcase}
                    skillProofs={activeSkillProofs}
                    subIndex={activeSubIndex}
                    isDial
                    onChangeProof={(nextIndex) => setSubProofIndexes((current) => ({ ...current, [activeProof.id]: nextIndex }))}
                  />
                </div>
              </div>
            ) : null}

            {isDial && activeProof && activeShowcase ? (
              <article id={activeProof.id} data-stack-proof className="scroll-mt-56 border-t border-white/10 py-6 first:border-t-0 sm:py-10 xl:hidden">
                <ProofContent
                  proof={activeProof}
                  index={activeProofIndex}
                  showcase={activeShowcase}
                  skillProofs={activeSkillProofs}
                  subIndex={activeSubIndex}
                  isDial
                  onChangeProof={(nextIndex) => setSubProofIndexes((current) => ({ ...current, [activeProof.id]: nextIndex }))}
                />
              </article>
            ) : null}

            <div className={isDial ? "hidden" : ""}>
              {proofs.map((proof, index) => {
              const skillProofs = showcases.filter((s) => sameSkill(proof.skill, s.skill));
              const subIndex = subProofIndexes[proof.id] ?? 0;
              const showcase = skillProofs[subIndex] ?? proof.showcase;
              const image: ImageWithMeta | undefined = showcase.image ?? showcase.project?.featuredImage ?? proof.category.image;
              const isActive = index === activeProofIndex;

              return (
                <article
                  key={proof.id}
                  id={proof.id}
                  data-stack-proof
                  className={`scroll-mt-56 relative flex ${
                    isDial
                      ? "min-h-0 items-start border-t border-white/10 py-6 first:border-t-0 sm:py-10 xl:min-h-[37rem] xl:border-b xl:border-t-0 xl:pb-0 xl:pt-[27px]"
                      : "items-center border-t border-white/10 py-10 first:border-t-0 lg:py-16"
                  } ${
                    isDial
                      ? isActive
                        ? "opacity-100 transition-opacity duration-200"
                        : "opacity-85 transition-opacity duration-200 xl:pointer-events-none xl:opacity-0"
                      : isActive
                        ? "opacity-100"
                        : "opacity-55"
                  }`}
                >
                  <div data-stack-proof-inner className={`w-full transition-[opacity,transform] duration-500 motion-reduce:transition-none ${isDial ? "xl:hidden" : ""}`}>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-blue-200/75">
                      <div className="flex flex-wrap items-center gap-3">
                        <span>{proof.category.label ?? proof.category.title} / {proof.skill.name}</span>
                        {skillProofs.length > 1 ? (
                          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium tracking-normal text-white/80">
                            <span>Proof {subIndex + 1} of {skillProofs.length}</span>
                            <div className="flex items-center border-l border-white/10 pl-1.5">
                              <button
                                type="button"
                                onClick={() => setSubProofIndexes((prev) => ({ ...prev, [proof.id]: (subIndex - 1 + skillProofs.length) % skillProofs.length }))}
                                className="rounded p-0.5 transition hover:bg-white/10 hover:text-white"
                                aria-label="Previous proof"
                              >
                                <ChevronLeft size={13} aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setSubProofIndexes((prev) => ({ ...prev, [proof.id]: (subIndex + 1) % skillProofs.length }))}
                                className="rounded p-0.5 transition hover:bg-white/10 hover:text-white"
                                aria-label="Next proof"
                              >
                                <ChevronRight size={13} aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <span className={`text-white/35 ${isDial ? "xl:hidden" : ""}`}>{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    {isDial ? (
                      <div className="rounded-xl border border-white/10 bg-[#08090d] xl:rounded-none xl:border-0">
                        <div className="xl:grid xl:min-h-[31rem] xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
                          <div className="border-b border-white/10 xl:flex xl:flex-col xl:border-b-0 xl:border-r">
                            <div className="relative min-h-60 bg-black/25 p-4 sm:min-h-72 sm:p-5 xl:min-h-0 xl:flex-1">
                              {showcase.demoVideoUrl ? (
                                <video className="h-full w-full object-contain" controls preload="metadata" src={showcase.demoVideoUrl} />
                              ) : image?.url || image?.src ? (
                                <Image src={image.url ?? image.src ?? ""} alt={image.alt || `${showcase.title} proof`} fill sizes="(min-width: 1280px) 26vw, 100vw" className="object-contain p-4 sm:p-5" onLoad={() => ScrollTrigger.refresh()} />
                              ) : (
                                <div className="flex h-full flex-col justify-between p-5">
                                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-blue-200/70">{proof.skill.name} proof</span>
                                  <p className="max-w-sm text-2xl font-semibold tracking-[-0.05em] text-white">{showcase.title}</p>
                                </div>
                              )}
                            </div>
                            {showcase.highlights?.length ? <ul aria-label="What I delivered" className="space-y-3 border-t border-white/10 px-6 py-7 text-sm leading-6 text-white/65 sm:px-8">{showcase.highlights.slice(0, 3).map((highlight) => <li key={highlight} className="flex gap-3"><span className="text-blue-300">•</span>{highlight}</li>)}</ul> : null}
                          </div>
                          <div className="flex min-w-0 flex-col p-6 sm:p-8 xl:p-7">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-300">{proof.skill.name} / What I built</p>
                            <h3 className="mt-3 text-3xl font-semibold leading-[0.98] tracking-[-0.05em] text-white">{showcase.title}</h3>
                            {showcase.project ? <div className="mt-6"><p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-white/35">Project context</p><p className="mt-2 text-sm font-semibold text-white">{showcase.project.title}</p><p className="mt-1 text-xs text-white/45">{showcase.project.role ?? showcase.project.type}</p></div> : null}
                            <p className="mt-8 text-sm leading-7 text-white/60">{showcase.description}</p>
                            {showcase.project ? <Link href={`/works/${showcase.project.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-blue-200">View project details<ArrowUpRight size={16} aria-hidden="true" /></Link> : null}
                          </div>
                        </div>
                        <div className="border-t border-white/10 px-6 py-5 sm:px-8">
                          {showcase.project?.techStack?.length ? <div className="flex flex-wrap gap-2">{showcase.project.techStack.slice(0, 5).map((item) => <span key={item} className="site-chip px-3 py-1.5 text-xs">{item}</span>)}</div> : null}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-[#08090d]">
                        <div className="relative min-h-72 border-b border-white/10 bg-black/25 sm:min-h-96">
                          {showcase.demoVideoUrl ? (
                            <video className="h-full min-h-72 w-full object-contain sm:min-h-96" controls preload="metadata" src={showcase.demoVideoUrl} />
                          ) : image?.url || image?.src ? (
                            <Image src={image.url ?? image.src ?? ""} alt={image.alt || `${showcase.title} proof`} fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-contain p-5" onLoad={() => ScrollTrigger.refresh()} />
                          ) : (
                            <div className="flex h-full min-h-72 flex-col justify-between p-7 sm:min-h-96 sm:p-9">
                              <span className="font-mono text-xs uppercase tracking-[0.16em] text-blue-200/70">{proof.skill.name}</span>
                              <p className="max-w-lg text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">{showcase.title}</p>
                            </div>
                          )}
                        </div>
                        <div className="p-6 sm:p-8">
                          <p className="text-sm font-medium text-blue-200/70">{showcase.project?.role ?? showcase.project?.type ?? proof.skill.name}</p>
                          <h3 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">{showcase.title}</h3>
                          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">{showcase.description}</p>
                          {showcase.highlights?.length ? <div className="mt-6 flex flex-wrap gap-2">{showcase.highlights.map((highlight) => <span key={highlight} className="site-chip">{highlight}</span>)}</div> : null}
                          {showcase.project ? <Link href={`/works/${showcase.project.slug}`} className="site-link mt-7 inline-flex items-center gap-2 text-sm font-semibold">View {showcase.project.title}<ArrowUpRight size={16} aria-hidden="true" /></Link> : null}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
