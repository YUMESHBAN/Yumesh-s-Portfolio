"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
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

export function StackScrollExperience({
  skills,
  categories,
  showcases,
}: {
  skills: Skill[];
  categories: StackCategory[];
  showcases: SkillShowcase[];
}) {
  const rootRef = useRef<HTMLElement>(null);
  const leftRailRef = useRef<HTMLDivElement>(null);
  const [activeProofIndex, setActiveProofIndex] = useState(0);

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

  useLayoutEffect(() => {
    const root = rootRef.current;
    const leftRail = leftRailRef.current;

    if (!root || !leftRail || !proofs.length) {
      return;
    }

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const sections = gsap.utils.toArray<HTMLElement>("[data-stack-proof]", root);
        const pin = ScrollTrigger.create({
          trigger: root,
          start: "top top+=96",
          end: "bottom bottom-=96",
          pin: leftRail,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
        const triggers = sections.map((section, index) =>
          ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onEnter: () => setActiveProofIndex(index),
            onEnterBack: () => setActiveProofIndex(index),
          }),
        );

        ScrollTrigger.refresh();
        return () => {
          pin.kill();
          triggers.forEach((trigger) => trigger.kill());
        };
      });

      return () => media.revert();
    }, root);

    return () => context.revert();
  }, [proofs.length]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!categoryData.length || !proofs.length || !activeCategory) {
    return null;
  }

  return (
    <section ref={rootRef} className="site-section" aria-labelledby="stack-scroll-title">
      <div className="site-container lg:grid lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)] lg:gap-12">
        <div ref={leftRailRef} className="self-start pb-10 lg:pb-0 lg:pt-1">
          <p className="site-eyebrow">Current stack</p>
          <div className="mt-6 flex flex-wrap gap-2" aria-label="Stack categories">
            {categoryData.map((category, index) => {
              const target = proofs.find((proof) => proof.category.title === category.title);
              const selected = normalise(category.title) === normalise(activeCategory.title);

              return (
                <button
                  key={category.title}
                  type="button"
                  onClick={() => target && scrollTo(target.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${selected ? "border-blue-300/50 bg-blue-300/10 text-blue-100" : "border-white/10 text-white/45 hover:border-white/30 hover:text-white/80"}`}
                >
                  {String(index + 1).padStart(2, "0")} {category.title}
                </button>
              );
            })}
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">{activeCategory.label ?? "Current capability"}</p>
          <h2 id="stack-scroll-title" className="mt-3 max-w-md text-5xl font-semibold leading-[0.88] tracking-[-0.07em] text-white sm:text-6xl lg:text-7xl">
            {activeCategory.title.toLocaleUpperCase()}
          </h2>
          <p className="site-muted mt-6 max-w-sm leading-7">{activeCategory.description}</p>

          <div className="mt-9 border-y border-white/10">
            {activeCategory.skills.map((skill) => {
              const target = proofs.find((proof) => sameSkill(skill, proof.showcase.skill));
              const selected = activeSkill ? sameSkill(skill, activeSkill) : false;

              return (
                <button
                  key={`${skill.category}-${skill.name}`}
                  type="button"
                  disabled={!target}
                  onClick={() => target && scrollTo(target.id)}
                  className={`group flex w-full items-center justify-between gap-4 border-b border-white/10 py-3 text-left last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400/70 disabled:cursor-not-allowed disabled:opacity-35 ${selected ? "text-blue-100" : "text-white/60 hover:text-white"}`}
                  aria-label={target ? `View ${skill.name} proof` : `${skill.name} has no proof yet`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <TechLogo name={skill.name} iconName={skill.iconName} />
                    <span className="truncate text-sm font-semibold tracking-[-0.02em]">{skill.name}</span>
                  </span>
                  <span className={`h-px w-8 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${selected ? "scale-x-100 bg-blue-300" : "scale-x-50 bg-white/25 group-hover:scale-x-100 group-hover:bg-blue-300"}`} aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <Link href="/about" className="site-link mt-7 inline-flex items-center gap-2 text-sm font-semibold">
            Explore the full skill map
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="space-y-12 lg:space-y-0">
          {proofs.map((proof, index) => {
            const { showcase } = proof;
            const image: ImageWithMeta | undefined = showcase.image ?? showcase.project?.featuredImage ?? proof.category.image;
            const isActive = index === activeProofIndex;

            return (
              <article
                key={proof.id}
                id={proof.id}
                data-stack-proof
                className={`scroll-mt-24 relative flex min-h-[calc(100svh-6rem)] items-center border-t border-white/10 py-10 first:border-t-0 lg:py-16 ${isActive ? "opacity-100" : "opacity-55"}`}
              >
                <div className="w-full transition-[opacity,transform] duration-500 motion-reduce:transition-none">
                  <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.15em] text-blue-200/75">
                    <span>{proof.category.label ?? proof.category.title} / {proof.skill.name}</span>
                    <span className="text-white/35">{String(index + 1).padStart(2, "0")}</span>
                  </div>
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
                      <p className="text-sm font-medium text-blue-200/70">{showcase.project?.type ?? proof.skill.name}</p>
                      <h3 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">{showcase.title}</h3>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">{showcase.description}</p>
                      {showcase.highlights?.length ? <div className="mt-6 flex flex-wrap gap-2">{showcase.highlights.map((highlight) => <span key={highlight} className="site-chip">{highlight}</span>)}</div> : null}
                      {showcase.project ? <Link href={`/projects/${showcase.project.slug}`} className="site-link mt-7 inline-flex items-center gap-2 text-sm font-semibold">View {showcase.project.title}<ArrowUpRight size={16} aria-hidden="true" /></Link> : null}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
